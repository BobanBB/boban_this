import Head from "next/head";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import {
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Modal,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // For copy icon
import Image from "next/image"; // For handling images/icons
import ActionsCard from "../../components/ActionCard";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [coinData, setCoinData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { name } = router.query; // Get the coin name from the URL
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        logoFile: null,
        logoUrl: "",
        description: "",
        websiteLink: "",
        telegramLink: "",
        twitterLink: "",
        discordLink: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [logoPreview, setLogoPreview] = useState(""); // For image preview

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (1MB = 1048576 bytes)
            if (file.size > 1048576) {
                setError("File size should not exceed 1MB");
                return;
            }

            // Validate file type
            if (!file.type.startsWith("image/")) {
                setError("Please upload an image file");
                return;
            }

            // Generate preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl); // Set image preview

            setFormData((prev) => ({
                ...prev,
                logoFile: file,
            }));
            setError("");
        }
    };

    const uploadImageToFirebase = async (file) => {
        try {
            // Create a unique file name
            const fileName = `token-logos/${Date.now()}-${file.name}`;
            const storageRef = ref(storage, fileName);

            // Upload the file
            await uploadBytes(storageRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            let logoUrl = formData.logoUrl;

            // Upload image to Firebase if a new file is selected
            if (formData.logoFile) {
                logoUrl = await uploadImageToFirebase(formData.logoFile);
            }

            // Prepare data for API
            const submitData = {
                imageUrl: logoUrl,
                description: formData.description,
                websiteLink: formData.websiteLink,
                telegramLink: formData.telegramLink,
                twitterLink: formData.twitterLink,
                discordLink: formData.discordLink,
            };

            // Make API call
            const response = await fetch(`/api/coins?id=${coinData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                throw new Error("Failed to update token information");
            }

            // Reset form and close modal on success
            setFormData({
                logoFile: null,
                logoUrl: "",
                description: "",
                websiteLink: "",
                telegramLink: "",
                twitterLink: "",
                discordLink: "",
            });
            setIsUpdateModalOpen(false);
            setLogoPreview(""); // Clear image preview
            // You might want to add a success toast/notification here
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(coinData.contractAddress);
        toast.success("Token address copied!");
    };

    useEffect(() => {
        const fetchCoinData = async () => {
            if (!name) return; // Exit if name is not yet defined

            try {
                const response = await fetch(
                    `/api/get-coin?name=${encodeURIComponent(name)}`
                );
                const data = await response.json();

                if (response.ok) {
                    setCoinData(data);
                } else {
                    setError(data.error || "Error fetching coin data");
                }
            } catch (err) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchCoinData();
    }, [name]);

    if (loading)
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-gray-900 z-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                        Loading...
                    </p>
                </div>
            </div>
        );
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Head>
                <title>{coinData.name} | Boban</title>
                <meta
                    name="description"
                    content={`Details for ${coinData.name}`}
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <ToastContainer />
                {/* Navbar */}
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                <div
                    className={`min-h-screen bg-gray-800 py-16 text-white transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-64" : "ml-0"
                    }`}
                >
                    <div className="container mx-auto pt-16 pb-8 px-4">
                        <Grid container spacing={4}>
                            {/* Left Sidebar / Main Chart Section */}
                            <Grid item xs={12} md={8}>
                                <Box className="p-4 rounded-lg bg-gray-900">
                                    {/* Coin Header Section */}
                                    <Box className="flex flex-col md:flex-row items-start md:items-center mb-4">
                                        {/* Coin Icon */}
                                        <Box className="mr-0 md:mr-2 mb-4 md:mb-0">
                                            {coinData.imageUrl && <Image
                                                src={coinData.imageUrl}
                                                alt="Coin Icon"
                                                width={70}
                                                height={70}
                                                className="rounded-full"
                                            />}
                                        </Box>
                                        {/* Coin Name and Contract */}
                                        <Box>
                                            <Typography
                                                variant="h4"
                                                gutterBottom
                                                className="text-xl sm:text-2xl"
                                            >
                                                {coinData.name} (
                                                {coinData.symbol})
                                            </Typography>
                                            <Box className="flex flex-col sm:flex-row items-start sm:items-center">
                                                <Typography
                                                    variant="body1"
                                                    className="text-[0.7rem] sm:text-base mr-2"
                                                >
                                                    {coinData.contractAddress}
                                                </Typography>
                                                <Tooltip title="Copy Address">
                                                    <IconButton
                                                        onClick={
                                                            handleCopyAddress
                                                        }
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            {/* Right Sidebar */}
                            <Grid item xs={12} md={4}>
                                <ActionsCard />
                            </Grid>
                        </Grid>
                    </div>

                    <Box className="bg-gray-900 p-4 rounded-lg w-full">
                        {coinData.isPresale &&
                        coinData.isPresale.toLowerCase() !== "no" ? (
                            <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                                    Presale Live
                                </h2>
                                <p className="text-gray-300">
                                    Started at{" "}
                                    {coinData.launchDate || "Oct 10, 2024"}
                                </p>

                                <a
                                    href={coinData.presaleLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 sm:px-6 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                                >
                                    <span>Presale Link</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>

                                <div className="mt-8 w-full max-w-2xl">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-4">
                                        About {coinData.name}
                                    </h3>
                                    <p className="text-gray-300 text-left">
                                        {coinData.description ||
                                            `${coinData.name} is the ultimate sports memeverse for all you degens!`}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <iframe
                                src={`https://dexscreener.com/${
                                    coinData.blockchain.toLowerCase() == "eth"
                                        ? "ethereum"
                                        : coinData.blockchain.toLowerCase() ==
                                          "sol"
                                        ? "solana"
                                        : coinData.blockchain.toLowerCase()
                                }/${
                                    coinData.contractAddress
                                }?embed=1&theme=dark`}
                                width="100%"
                                style={{
                                    border: "none",
                                    borderRadius: "8px",
                                    minHeight: "150vh",
                                }}
                                allow="clipboard-write"
                                allowFullScreen
                            ></iframe>
                        )}
                    </Box>

                    <div className="flex justify-center mt-8 mb-4">
                        <button
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="bg-blue-500 w-full max-w-sm mx-4 hover:bg-blue-600 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Submit Token Information Update
                        </button>
                    </div>
                </div>

                <Modal
                    open={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    className="flex items-center justify-center"
                >
                    <div className="bg-[#1a1a1a] text-white rounded-lg p-6 max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Update Token</h2>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Important! ONLY fill the data you want to change.
                        </p>

                        <form
                            onSubmit={handleUpdateSubmit}
                            className="space-y-6"
                        >
                            {/* Logo Upload Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Change logo
                                </h3>
                                <p className="text-sm text-gray-400 mb-2">
                                    Optimal dimensions 512×512px, size up to 1MB
                                </p>
                                <label
                                    htmlFor="logo-upload"
                                    type="button"
                                    className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-black transition-colors duration-200"
                                >
                                    Upload
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    id="logo-upload"
                                />
                            </div>

                            {/* Image preview */}
                            {logoPreview && (
                                <div className="mb-4">
                                    <Image
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        width={100}
                                        height={100}
                                        className="rounded"
                                    />
                                </div>
                            )}

                            {/* Other form fields */}
                            <div>
                                <label className="block mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="w-full bg-[#2a2a2a] text-white rounded p-3 min-h-[100px]"
                                    placeholder="Describe your Token/NFT here. What is the goal, plans, why is this project unique?"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Add other fields (Website Link, Telegram Link, etc.) */}

                            {/* Website Link */}
                            <div>
                                <label className="block mb-2">
                                    Website link
                                </label>
                                <input
                                    type="url"
                                    className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                    placeholder="https://yourwebsite.com/"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Telegram Link */}
                            <div>
                                <label className="block mb-2">
                                    Telegram link
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                    placeholder="Telegram"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Twitter Link */}
                            <div>
                                <label className="block mb-2">
                                    Twitter link
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                    placeholder="Twitter"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Discord Link */}
                            <div>
                                <label className="block mb-2">
                                    Discord link
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                    placeholder="Discord"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Submit Button with loading state */}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                                disabled={isSubmitting} // Disable button while submitting
                            >
                                {isSubmitting ? "Loading..." : "Submit Update"}
                            </button>
                        </form>
                    </div>
                </Modal>
                <Footer />
            </main>
        </>
    );
}
