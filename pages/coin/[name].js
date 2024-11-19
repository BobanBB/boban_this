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
import Chip from "../../components/chip";
import { SvgIcon } from "@mui/material";

const WebsiteIcon = () => (
   <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" focusable="false" class="chakra-icon custom-13otjrl" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>
);
  
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
    </svg>
);

const TwitterIcon = () => (
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" focusable="false" class="chakra-icon custom-13otjrl" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
);

const TelegramIcon = () => (
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" focusable="false" class="chakra-icon custom-13otjrl" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path></svg>
);

const DiscordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
    </svg>
);

const FanvueIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fan" viewBox="0 0 16 16">
        <path d="M10 3c0 1.313-.304 2.508-.8 3.4a2 2 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8 8 0 0 0-.491-.454A6 6 0 0 1 8 2c.691 0 1.355.117 1.973.332Q10 2.661 10 3m0 5q0 .11-.012.217c1.018-.019 2.2-.353 3.331-1.006a8 8 0 0 0 .57-.361 6 6 0 0 0-2.53-3.823 9 9 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254m-.137.728a2 2 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377q.3.174.605.317a6 6 0 0 0 2.053-4.111q-.311.11-.641.199c-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391q0 .346.027.678A6 6 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8 8 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96Q8.149 10 8 10M6 8q0-.12.014-.239c-1.02.017-2.205.351-3.34 1.007a8 8 0 0 0-.568.359 6 6 0 0 0 2.525 3.839 8 8 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A2 2 0 0 1 6 8m-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8 8 0 0 0-.594-.312 6 6 0 0 0-2.06 4.106q.309-.11.637-.199M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    </svg>
);

const RedditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reddit" viewBox="0 0 16 16">
        <path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z"/>
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165"/>
    </svg>
);

const LinktreeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m13.736 5.853l4.005-4.117l2.325 2.38l-4.2 4.005h5.908v3.305h-5.937l4.229 4.108l-2.325 2.334l-5.74-5.769l-5.741 5.769l-2.325-2.325l4.229-4.108H2.226V8.121h5.909l-4.2-4.004l2.324-2.381l4.005 4.117V0h3.472zm-3.472 10.306h3.472V24h-3.472z"/></svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
    </svg>
);

export default function Home() {
    const [coinData, setCoinData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { name } = router.query; 
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
        redditLink: "",
        linktreeLink: "",
        facebookLink: "",
        instagramLink: "", 
        fanvueLink: ""        
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [logoPreview, setLogoPreview] = useState(""); // For image preview

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("==========",name, value);
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
                instagramLink: formData.instagramLink,
                fanvueLink: formData.fanvueLink,
                linkTreeLink: formData.linktreeLink,
                facebookLink: formData.facebookLink,
                redditLink: formData.redditLink,
            };

            // Make API call
            const response = await fetch(`/api/coins?id=${coinData._id}&update=true`, {
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
            {console.log("Coin data====",coinData)}
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
                                                sx={{fontSize: {
                                                    xs: '25px',
                                                    sm: '35px'
                                                }}}
                                                className="text-xl sm:text-2xl"
                                            >
                                                {coinData.name} (
                                                {coinData.symbol})
                                            </Typography>
                                            <Box className="flex flex-col sm:flex-row items-start sm:items-center">
                                                <Typography
                                                    variant="body1"
                                                    className="text-[0.7rem] sm:text-base mr-2"
                                                    sx={{fontSize: {
                                                        xs: '10px',
                                                        sm: '22px'
                                                    }}}
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
                                            <Box
                                                sx={{
                                                display: 'grid',
                                                gridTemplateColumns: {
                                                    xs: 'repeat(3, 1fr)', // 3 chips per row for mobile
                                                    sm: 'repeat(auto-fit, minmax(120px, 1fr))', // Auto-fit for larger screens
                                                },
                                                gap: 2,
                                                mt: 2,
                                                }}
                                                
                                            >
                                                {coinData.websiteLink && (
                                                    <Chip
                                                    label="Website"
                                                    icon={<WebsiteIcon />}
                                                    onClick={() => window.open(coinData.websiteLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.telegramLink && (
                                                    <Chip
                                                    label="Telegram"
                                                    icon={<TelegramIcon />}
                                                    onClick={() => window.open(coinData.telegramLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.twitterLink && (
                                                    <Chip
                                                    label="Twitter"
                                                    icon={<TwitterIcon />}
                                                    onClick={() => window.open(coinData.twitterLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.instagramLink && (
                                                    <Chip
                                                    label="Instagram"
                                                    icon={<InstagramIcon />}
                                                    onClick={() => window.open(coinData.instagramLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.fanvueLink && (
                                                    <Chip
                                                    label="Fanvue"
                                                    icon={<FanvueIcon />}
                                                    onClick={() => window.open(coinData.fanvueLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.discordLink && (
                                                    <Chip
                                                    label="Discord"
                                                    icon={<DiscordIcon />}
                                                    onClick={() => window.open(coinData.discordLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.facebookLink && (
                                                    <Chip
                                                    label="Facebook"
                                                    icon={<FacebookIcon />}
                                                    onClick={() => window.open(coinData.facebookLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.redditLink && (
                                                    <Chip
                                                    label="Reddit"
                                                    icon={<RedditIcon />}
                                                    onClick={() => window.open(coinData.redditLink, '_blank')}
                                                    />
                                                )}
                                                {coinData.linkTreeLink && (
                                                    <Chip
                                                    label="LinkTree"
                                                    icon={<LinktreeIcon />}
                                                    onClick={() => window.open(coinData.linkTreeLink, '_blank')}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            {/* Right Sidebar */}
                            <Grid item xs={12} md={4}>
                                <ActionsCard coinId={coinData._id} initialRocket={coinData.rocket} initialFire={coinData.fire} initialFlag={coinData.flag}/>
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
                                    name="websiteLink"
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
                                    name="telegramLink"
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
                                    name="twitterLink"
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
                                    name="discordLink"
                                    className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                    placeholder="Discord"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Instagram Link */}
                            <div>
                            <label className="block mb-2">Instagram Link</label>
                            <input
                                type="url"
                                name="instagramLink"
                                className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                placeholder="https://instagram.com/yourprofile"
                                onChange={handleInputChange}
                            />
                            </div>

                            {/* Fanvue Link */}
                            <div>
                            <label className="block mb-2">Fanvue Link</label>
                            <input
                                type="url"
                                name="fanvueLink"
                                className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                placeholder="https://fanvue.com/yourprofile"
                                onChange={handleInputChange}
                            />
                            </div>

                            {/* Facebook Link */}
                            <div>
                            <label className="block mb-2">Facebook Link</label>
                            <input
                                type="url"
                                name="facebookLink"
                                className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                placeholder="https://facebook.com/yourpage"
                                onChange={handleInputChange}
                            />
                            </div>

                            {/* Reddit Link */}
                            <div>
                            <label className="block mb-2">Reddit Link</label>
                            <input
                                type="url"
                                name="redditLink"
                                className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                placeholder="https://reddit.com/r/yourcommunity"
                                onChange={handleInputChange}
                            />
                            </div>

                            {/* LinkTree Link */}
                            <div>
                            <label className="block mb-2">LinkTree Link</label>
                            <input
                                type="url"
                                name="linkTreeLink"
                                className="w-full bg-[#2a2a2a] text-white rounded p-3"
                                placeholder="https://linktr.ee/yourprofile"
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
