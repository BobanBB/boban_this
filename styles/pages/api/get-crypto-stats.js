import dbConnect from '../../lib/mongodb'; // Your MongoDB connection utility
import Coin from '../../models/Coin'; // Your Coin model
import axios from 'axios';

async function getCryptoStatsByNames(coinNames) {
    try {
        // Join the coin names into a single comma-separated string
        const coins = coinNames.join(',');

        // CoinGecko API for fetching multiple coins' market data
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins}`;

        // Fetch the data
        const response = await axios.get(url);
        const data = response.data;

        // Process the response to extract key stats for each coin
        const statsArray = data.map(coin => ({
           ...coin
        }));

        return statsArray;
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        return null;
    }
}

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const { blockchain } = req.query;

        if (!blockchain) {
            return res.status(400).json({ error: 'Blockchain query parameter is required' });
        }

        try {
            // Query the database for coins related to the specified blockchain
            const coins = await Coin.find({ blockchain }).select('name'); // Adjust the fields as needed
            const coinNames = coins.map(coin => coin.name.toLowerCase().replace(/\s+/g, '-')); // Extract the coin names

           
            if (coinNames.length === 0) {
                return res.status(200).json({ message: 'No coins found for the specified blockchain' });
            }

            // Call the function to get crypto stats
            const stats = await getCryptoStatsByNames(coinNames);

            if (stats) {
                return res.status(200).json(stats);
            } else {
                return res.status(500).json({ error: 'Error fetching stats from CoinGecko' });
            }
        } catch (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Error querying database' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
