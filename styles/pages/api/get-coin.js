import dbConnect from '../../lib/mongodb'; // Your MongoDB connection utility
import Coin from '../../models/Coin'; // Your Coin model

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const { name } = req.query; // Extract the coin name from the query parameter

        if (!name) {
            return res.status(400).json({ error: 'Coin name query parameter is required' });
        }

        try {
            // Query the database for the coin by name
            const coin = await Coin.findOne({ slug: { $regex: new RegExp(name, 'i') } }); // Case-insensitive search

            if (!coin) {
                return res.status(404).json({ message: 'Coin not found' });
            }

            return res.status(200).json(coin); // Return the found coin
        } catch (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Error querying database' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
