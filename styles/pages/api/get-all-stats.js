import dbConnect from "../../lib/mongodb"; 
import Coin from "../../models/Coin"; 
import axios from "axios";
import dayjs from "dayjs"; // Use dayjs for date manipulation

async function getCryptoStatsByNames(coinNames) {
    try {
        // Join the coin names into a single comma-separated string
        const coins = coinNames.join(",");

        // CoinGecko API for fetching multiple coins' market data
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins}`;

        // Fetch the data
        const response = await axios.get(url);
        const data = response.data;
      
        // Process the response to extract key stats for each coin
        const statsArray = data.map((coin) => ({
            ...coin,
        }));

        return statsArray;
    } catch (error) {
        console.error("Error fetching crypto data:", error);
        return null;
    }
}

function calculateCoinAge(createdAt) {
    const now = dayjs();
    const creationDate = dayjs(createdAt);
    const ageInDays = now.diff(creationDate, "day");

    // Convert age to a more readable format
    if (ageInDays < 30) {
        return `${ageInDays}d`; // Days
    } else if (ageInDays < 365) {
        const months = Math.floor(ageInDays / 30);
        return `${months}mo`; // Months
    } else {
        const years = Math.floor(ageInDays / 365);
        return `${years}y`; // Years
    }
}

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            // Query the database for coins and select the required fields
            const coins = await Coin.find({});

            const coinNames = coins.map((coin) =>
                coin.name.toLowerCase().replace(/\s+/g, "-")
            ); 

            if (coinNames.length === 0) {
                return res
                    .status(200)
                    .json({
                        message: "No coins found for the specified blockchain",
                    });
            }

            // Call the function to get crypto stats
            const stats = await getCryptoStatsByNames(coinNames);

            if (stats) {
                // Map through the stats to add the age of each coin
                const statsWithAge = stats.map((stat) => {
                    const coin = coins.find(
                        (c) =>
                            c.name.toLowerCase().replace(/\s+/g, "-") ===
                            stat.id
                    );

                    return {
                        ...stat,
                        isPromote: coin.isPromote,
                        age: coin ? calculateCoinAge(coin.createdAt) : "--",
                    };
                });

                return res.status(200).json(statsWithAge);
            } else {
                return res
                    .status(500)
                    .json({ error: "Error fetching stats from CoinGecko" });
            }
        } catch (error) {
            console.error("Error querying database:", error);
            return res.status(500).json({ error: "Error querying database" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
