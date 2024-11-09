import dbConnect from '../../lib/mongodb'; // Database connection utility
import Coin from '../../models/Coin'; // Mongoose Coin model

// Connect to the database
dbConnect();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { contractAddress } = req.body;

        // Check if contractAddress is provided
        if (!contractAddress) {
            return res.status(400).json({ success: false, message: 'Contract address is required' });
        }

        try {
            // Find the coin by contract address and update isPromote to true
            const updatedCoin = await Coin.findOneAndUpdate(
                { contractAddress }, // Filter by contract address
                { $set: { isPromote: true } }, // Set isPromote to true
                { new: true } // Return the updated document
            );

            // If no coin is found, return a 404 error
            if (!updatedCoin) {
                return res.status(404).json({ success: false, message: 'Coin not found' });
            }

            // Success response
            return res.status(200).json({ success: true, data: updatedCoin });
        } catch (error) {
            // Error handling
            console.error('Error updating promote status:', error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    } else {
        // Return error if method is not POST
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
