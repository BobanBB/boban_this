import Coin from '../../models/Coin';
import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
    await dbConnect();

    const { coinId, voteType, userIp } = req.body;

    if (!['rocket', 'fire', 'flag'].includes(voteType)) {
        return res.status(400).json({ message: 'Invalid vote type' });
    }

    try {
        // Fetch the coin
        const coin = await Coin.findById(coinId);
        if (!coin) {
            return res.status(404).json({ message: 'Coin not found' });
        }

        // Check if the user has already voted
        const hasVoted = coin.voters.some(voter => voter.ip === userIp);
        if (hasVoted) {
            return res.status(403).json({ message: 'User has already voted' });
        }

        // Update the vote count
        coin[voteType] += 1;
        coin.voters.push({ ip: userIp, voteType });

        // Save the changes
        await coin.save();

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording vote', error });
    }
}
