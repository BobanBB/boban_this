import dbConnect from "../../lib/mongodb";
import Coin from "../../models/Coin";
import { twitterConfig, telegramConfig } from "../../twitterConfig";
import { TwitterApi } from "twitter-api-v2";
import fetch from "node-fetch";

// Connect to the database
dbConnect();

// Initialize the Twitter client
// const twitterClient = new TwitterApi({
//     appKey: twitterConfig.apiKey,
//     appSecret: twitterConfig.apiSecretKey,
//     accessToken: twitterConfig.accessToken,
//     accessSecret: twitterConfig.accessSecret,
// });

// Function to post a message on X
// async function postToTwitter(message) {
//     try {
//         await twitterClient.v2.tweet(message);
//         console.log("Successfully posted to X");
//     } catch (error) {
//         console.error("Error posting to X:", error);
//     }
// }

// Function to post a message on Telegram
async function postToTelegram(message) {
    try {
        const url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: telegramConfig.chatId,
                text: message,
            }),
        });

        console.log(response)

        if (!response.ok) {
            throw new Error("Failed to post to Telegram", response);
        }

        console.log("Successfully posted to Telegram");
    } catch (error) {
        console.error("Error posting to Telegram:", error);
    }
}

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

            const message = `🚀 The ${updatedCoin.name} coin is now promoted! Check it out on bobantoken.com!`;

            // Post to X and Telegram
            // await postToTwitter(message);
            await postToTelegram(message);

            return res.status(200).json({}); // Return the updated coin
        } catch (error) {
            console.error("Error updating coin:", error);
            return res.status(500).json({ error: "Error updating coin" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
