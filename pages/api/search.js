import dbConnect from "../../lib/mongodb";
import Coin from "../../models/Coin";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { query } = req.query; // Get the search query from the request

    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        // Search for coins in the database by name or symbol
        const coins = await Coin.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { symbol: { $regex: query, $options: "i" } },
                { contractAddress: { $regex: query, $options: "i" } },
            ],
        }).limit(10); // Limit the results to 10 items

        // If no coins are found, return an empty array
        if (!coins || coins.length === 0) {
            return res.status(200).json([]);
        }
        
        // Map the data to return only relevant information
        const results = coins.map((coin) => ({
            id: coin.name.toLowerCase().split(" ").join("-"),
            name: coin.name,
            symbol: coin.symbol,
            price: coin.price,
            percentChange24h: coin.percentChange24h,
        }));

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error querying database:", error);
        return res.status(500).json({ message: "Error querying database" });
    }
}
