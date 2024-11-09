import dbConnect from '../../lib/mongodb';
import Coin from '../../models/Coin';

export default async function handler(req, res) {
    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ error: 'Missing address' });
    }

    try {
        // Connect to the database
        await dbConnect();

        // Check if the coin exists
        const coin = await Coin.findOne({
            contractAddress: address
        });

        if (coin) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking coin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
