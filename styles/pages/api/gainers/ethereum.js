import dbConnect from "../../../lib/mongodb";
import Coin from "../../../models/Coin";
import axios from "axios";
import dayjs from "dayjs"; // Use dayjs for date manipulation

// Function to get data from Dexscreener
async function getCryptoStatsByAddresses(coinAddresses) {
    try {
        const promises = coinAddresses.map(async (address) => {
            const url = `https://api.dexscreener.com/latest/dex/search?q=${address}`;
            const response = await axios.get(url);
            return response.data.pairs.length > 0
                ? response.data.pairs[0]
                : null;
        });

        const statsArray = await Promise.all(promises);
        return statsArray.filter((stat) => stat !== null); // Filter out any null results
    } catch (error) {
        console.error("Error fetching crypto data from Dexscreener:", error);
        return null;
    }
}

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

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const coins = await Coin.find({ blockchain: "ETH" });
            const coinAddresses = coins.map((coin) => coin.contractAddress);

            if (coinAddresses.length === 0) {
                return res
                    .status(200)
                    .json(coinAddresses);
            }

            const stats = await getCryptoStatsByAddresses(coinAddresses);

            // Create a dictionary for quick lookup
            const dexData = stats
                ? Object.fromEntries(
                      stats.map((stat) => [
                          stat.baseToken.address.toLowerCase(),
                          stat,
                      ])
                  )
                : {};

            // Map through the coins from the database and check if data is available from Dexscreener
            const coinsData = coins.map((coin) => {
                const coinDataFromDex =
                    dexData[coin.contractAddress.toLowerCase()];

                if (coin.isPresale && coin.isPresale.toLowerCase() != 'no') {
                    return {
                        symbol: coin.symbol,
                        name: coin.name,
                        slug: coin.slug,
                        volume_24h: coinDataFromDex?.volume?.h24 || 0,
                        price: "Presale",
                        percent_change_1h: "Presale",
                        percent_change_6h: "Presale",
                        percent_change_24h: "Presale",
                        market_cap: coinDataFromDex?.marketCap,
                        age: calculateCoinAge(coinDataFromDex.pairCreatedAt),
                        lp: coinDataFromDex.liquidity.usd,
                        isPromote: coin.isPromote,
                        txn:
                            coinDataFromDex.txns.h24.buys +
                            coinDataFromDex.txns.h24.sells,
                        image:
                            coinDataFromDex?.info?.imageUrl || coin?.imageUrl,
                    };
                }

                // If data is found from Dexscreener, use it; otherwise, use the data from the database
                return {
                    symbol: coin.symbol,
                    name: coin.name,
                    slug: coin.slug,
                    volume_24h: coinDataFromDex?.volume?.h24 || 0,
                    price: coinDataFromDex?.priceUsd,
                    percent_change_1h: coinDataFromDex?.priceChange?.h1,
                    percent_change_6h: coinDataFromDex?.priceChange?.h6,
                    percent_change_24h: coinDataFromDex?.priceChange?.h24,
                    market_cap: coinDataFromDex?.marketCap,
                    age: calculateCoinAge(coinDataFromDex.pairCreatedAt),
                    lp: coinDataFromDex.liquidity.usd,
                    isPromote: coin.isPromote,
                    txn:
                        coinDataFromDex.txns.h24.buys +
                        coinDataFromDex.txns.h24.sells,
                    image: coinDataFromDex?.info?.imageUrl || coin?.imageUrl,
                };
            });

            const dailyGainers = coinsData.sort(
                (a, b) => b.percent_change_24h - a.percent_change_24h
            );

            return res.status(200).json(dailyGainers);
        } catch (error) {
            console.error("Error querying database:", error);
            return res.status(500).json({ error: "Error querying database" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
