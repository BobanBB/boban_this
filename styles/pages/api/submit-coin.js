import dbConnect from '../../lib/mongodb';
import Coin from '../../models/Coin';
import { storage } from '../../firebaseConfig';
import multer from 'multer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Utility to handle multer in async function
const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    await dbConnect();

    // Run multer middleware before handling the request
    await runMiddleware(req, res, upload.single('image'));

    if (req.method === 'POST') {
        try {
            console.log('File:', req.file);  // Should show the file object
            console.log('Body:', req.body);   // Should show the rest of the form data

            const { blockchain, contractAddress, name, symbol, description, isPresale, launchDate, presaleUrl } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Upload the image to Firebase Storage
            const storageRef = ref(storage, `images/${file.originalname}`);
            await uploadBytes(storageRef, file.buffer);
            const imageUrl = await getDownloadURL(storageRef);

            // Generate slug from the name
            const slug = name.toLowerCase().replace(/\s+/g, '-');

            // Save data in MongoDB
            const newCoin = new Coin({
                blockchain,
                contractAddress,
                name,
                symbol,
                description,
                isPresale,
                launchDate,
                presaleUrl,
                imageUrl,
                slug:slug,  // Adding slug
            });
            await newCoin.save();

            res.status(200).json({ message: 'Coin submitted successfully!' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error submitting data' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
