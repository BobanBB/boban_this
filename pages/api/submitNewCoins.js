import dbConnect from "../../lib/mongodb";
import Coin from "../../models/Coin";
import axios from "axios";

// Function to get newer coins from CoinGecko
async function fetchNewCoins() {
    const { data } = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?sort=date_added&sort_dir=desc&limit=10",
        {
            headers: {
                "X-CMC_PRO_API_KEY": "fad3c46a-34f5-408e-b9cb-720519b3cfad",
                Accept: "application/json",
            },
        }
    );
    return data.data;
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const newCoins = await fetchNewCoins();
        if (newCoins.length === 0) {
            return res.status(200).json({ message: "No new coins found" });
        }

        for (const coin of newCoins) {
            // Check if the coin is already in the database
            const existingCoin = await Coin.findOne({ slug: coin.slug });
            if (existingCoin) continue;

            if (!coin.platform?.token_address) continue;

            // Save coin data to MongoDB
            const newCoin = new Coin({
                name: coin.name,
                symbol: coin.symbol,
                blockchain:
                    coin.platform.symbol == "BNB"
                        ? "BSC"
                        : coin.platform.symbol,
                slug: coin.slug,
                description: coin.description || "No description available.",
                isPresale: "No",
                launchDate: coin.date_added,
                imageUrl: null,
                marketCap: coin.quote.USD.market_cap,
                price: coin.quote.USD.price,
                contractAddress: coin.platform && coin.platform.token_address,
            });

            await newCoin.save();
        }

        res.status(200).json({ message: "New coins submitted successfully!" });
    } catch (error) {
        console.error("Error submitting new coins:", error);
        res.status(500).json({ error: "Error submitting new coins" });
    }
}
