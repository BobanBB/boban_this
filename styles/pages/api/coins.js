import dbConnect from "../../lib/mongodb";
import Coin from "../../models/Coin";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const coins = await Coin.find({});

            return res.status(200).json(coins); // Return all coins
        } catch (error) {
            console.error("Error querying database:", error);
            return res.status(500).json({ error: "Error querying database" });
        }
    } else if (req.method === "PUT") {
        try {
            const { id } = req.query; // Get the coin ID from the query parameters
            const updateData = req.body; // The data to update

            // Find the coin by ID and update it with the new data
            const updatedCoin = await Coin.findByIdAndUpdate(id, updateData, {
                new: true, // Return the updated document
            });

            if (!updatedCoin) {
                return res.status(404).json({ message: "Coin not found" });
            }

            return res.status(200).json(updatedCoin); // Return the updated coin
        } catch (error) {
            console.error("Error updating coin:", error);
            return res.status(500).json({ error: "Error updating coin" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
