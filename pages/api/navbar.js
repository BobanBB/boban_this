import axios from "axios";
import dbConnect from "../../lib/mongodb";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const response = await axios.get(
                "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BNB,ETH,SOL",
                {
                    headers: {
                        "X-CMC_PRO_API_KEY":
                            "fad3c46a-34f5-408e-b9cb-720519b3cfad",
                    },
                }
            );

            return res.status(200).json(response.data); 
        } catch (error) {
            console.error("Error querying database:", error);
            return res.status(500).json({ error: "Error querying database" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
