import dbConnect from "../../../lib/mongodb";
import Coin from "../../../models/Coin";
import axios from "axios";
import dayjs from "dayjs"; // For date manipulation
import { Redis } from "@upstash/redis";

const redisClient = new Redis({
    url: "https://selected-cod-45220.upstash.io",
    token: process.env.REDIS_PASSWORD,
});

// Function to calculate the coin's age
function calculateCoinAge(createdAt) {
    const now = dayjs();
    const creationDate = dayjs(createdAt);
    const ageInDays = now.diff(creationDate, "day");

    if (ageInDays < 30) {
        return `${ageInDays}d`;
    } else if (ageInDays < 365) {
        const months = Math.floor(ageInDays / 30);
        return `${months}mo`;
    } else {
        const years = Math.floor(ageInDays / 365);
        return `${years}y`;
    }
}

// Function to fetch data for one address and update the cache
async function fetchDataForAddress(address) {
    const url = `https://api.dexscreener.com/latest/dex/search?q=${address}`;
    const response = await axios.get(url);
    const data = response.data.pairs?.length > 0 ? response.data.pairs[0] : null;

    if (data) {
        await redisClient.setex(address, 600, JSON.stringify(data));
    }
    return data;
}

async function getCryptoStatsByAddresses(coinAddresses) {
    const statsArray = [];
    const fetchPromises = coinAddresses.map(async (address) => {
        if (!address) return;

        try {
            let cachedData = await redisClient.get(address);

            // Parse only if cachedData is a string
            if (typeof cachedData === "string") {
                cachedData = JSON.parse(cachedData);
            }

            // If no cached data, fetch it and cache the result
            const data = cachedData || await fetchDataForAddress(address);
            if (data) statsArray.push(data);
        } catch (error) {
            console.error(`Error processing address ${address}: ${error.message}`);
        }
    });

    await Promise.all(fetchPromises);
    return statsArray;
}


export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const isPromoted = req.query.promoted === "true";
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;

            const query = {};
            if (isPromoted) query.isPromote = true;
            else if (!isPromoted) query.blockchain = "arbitrum";

            const totalItems = await Coin.countDocuments(query);
            const totalPages = Math.ceil(totalItems / limit);

            const coins = await Coin.find(query)
                .sort({ createdAt: -1, rocket: -1, fire: -1, flag: -1 })
                .skip(startIndex)
                .limit(limit);

            if (coins.length === 0) {
                return res.status(200).json({
                    data: [],
                    pagination: { totalItems, totalPages, page, limit },
                });
            }

            const coinAddresses = coins.map((coin) => coin.contractAddress);
            const stats = await getCryptoStatsByAddresses(coinAddresses);

            const dexData = Object.fromEntries(
                stats.map((stat) => [
                    stat.baseToken?.address?.toLowerCase(),
                    stat,
                ])
            );

            const coinsData = coins.map((coin) => {
                const coinAddress = coin.contractAddress?.toLowerCase();
                const coinDataFromDex = dexData[coinAddress] || null;

                const baseCoinData = {
                    symbol: coin.symbol,
                    name: coin.name,
                    slug: coin.slug,
                    rocket: coin.rocket || 0,
                    fire: coin.fire || 0,
                    flag: coin.flag || 0,
                    createdAt: coin.createdAt || new Date(),
                    volume_24h: coinDataFromDex?.volume?.h24 || 0,
                    market_cap: coinDataFromDex?.marketCap || null,
                    age: coinDataFromDex?.pairCreatedAt
                        ? calculateCoinAge(coinDataFromDex.pairCreatedAt)
                        : "N/A",
                    lp: coinDataFromDex?.liquidity?.usd || null,
                    isPromote: coin.isPromote,
                    txn: coinDataFromDex?.txns?.h24
                        ? coinDataFromDex.txns.h24.buys +
                          coinDataFromDex.txns.h24.sells
                        : 0,
                    image: coinDataFromDex?.info?.imageUrl || coin?.imageUrl,
                };

                if (coin.isPresale && coin.isPresale.toLowerCase() !== "no") {
                    return {
                        ...baseCoinData,
                        price: "Presale",
                        percent_change_1h: "Presale",
                        percent_change_6h: "Presale",
                        percent_change_24h: "Presale",
                    };
                }

                return {
                    ...baseCoinData,
                    price: coinDataFromDex?.priceUsd || null,
                    percent_change_1h: coinDataFromDex?.priceChange?.h1 || 0,
                    percent_change_6h: coinDataFromDex?.priceChange?.h6 || 0,
                    percent_change_24h: coinDataFromDex?.priceChange?.h24 || 0,
                };
            });

            // // Filter coins with age less than 30 days
            // const newCoins = coinsData.filter((coin) =>
            //     coin.age.endsWith("d") && parseInt(coin.age) < 30
            // );

            return res.status(200).json({
                data: coinsData,
                pagination: {
                    totalItems,
                    totalPages,
                    page,
                    limit,
                },
            });
        } catch (error) {
            console.error("Error querying database:", error);
            return res.status(500).json({ error: "Error querying database" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
