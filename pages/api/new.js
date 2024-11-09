import dbConnect from "../../lib/mongodb";
import Coin from "../../models/Coin";
import axios from "axios";
import dayjs from "dayjs";
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
    const data =
        response.data.pairs?.length > 0 ? response.data.pairs[0] : null;

    // Cache result with a 10-minute expiration (adjust as needed)
    if (data) {
        await redisClient.setex(address, 600, JSON.stringify(data));
    }
    return data;
}

async function getCryptoStatsByAddresses(coinAddresses) {
    const statsArray = [];
    const fetchPromises = [];

    for (const address of coinAddresses) {
        if (!address) continue; // Skip invalid addresses

        try {
            const cachedData = await redisClient.get(address);
            if (cachedData) {
                statsArray.push(cachedData);
            } else {
                // Background fetch for missing addresses
                fetchPromises.push(
                    fetchDataForAddress(address).then((data) => {
                        if (data) statsArray.push(data);
                    })
                );
            }
        } catch (error) {
            console.error(`Error processing address ${address}:`, error);
        }
    }

    // Start background fetching without blocking
    Promise.all(fetchPromises).catch((err) =>
        console.error("Error fetching missing data:", err)
    );

    return statsArray; // Return immediately with cached data
}

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const coins = (await Coin.find({})) || [];
            const coinAddresses = coins.map((coin) => coin.contractAddress);

            if (coinAddresses.length === 0) {
                return res.status(200).json([]);
            }

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
                    rocket: coin.rocket || 0, // Assuming 'rocket' is a number
                    fire: coin.fire || 0, // Assuming 'fire' is a number
                    flag: coin.flag || 0, // Assuming 'flag' is a number
                    createdAt: coin.createdAt || new Date(), // Assuming createdAt is a Date object
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

            // Sort the coins based on 'rocket', 'fire', 'flag', and 'createdAt' (latest first)
            const sortedCoinsData = coinsData.sort((a, b) => {
                if (b.rocket !== a.rocket) {
                    return b.rocket - a.rocket;
                }
                if (b.fire !== a.fire) {
                    return b.fire - a.fire;
                }
                if (b.flag !== a.flag) {
                    return b.flag - a.flag;
                }
                // Sort by latest date (createdAt) if 'rocket', 'fire', and 'flag' are equal
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            return res.status(200).json(sortedCoinsData);
        } catch (error) {
            console.error("Error querying database:", error);
            return res.status(500).json({ error: "Error querying database" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

