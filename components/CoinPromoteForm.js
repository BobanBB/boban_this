import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    Autocomplete,
    TextField,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { ethers } from "ethers";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Move constants outside component
const PACKAGE_OPTIONS = {
    BB: [
        { value: "200000", label: "1 day promoted", day: 1, rocket: 500 },
        { value: "350000", label: "3 days promoted", day: 3, rocket: 1500 },
        { value: "500000", label: "7 days promoted", day: 7, rocket: 3500 },
    ],
};

// Create reusable InfoCard component
const InfoCard = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 space-y-3 sm:space-y-0 border-white py-4 px-6 text-center rounded-lg border-2 w-full sm:w-[48%] lg:w-[32%]">
        <Icon className="text-4xl font-semibold" />
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-lg sm:text-xl font-semibold">{title}</span>
            <span className="text-sm sm:text-base opacity-70">
                {description}
            </span>
        </div>
    </div>
);

const PromoteCoinForm = () => {
    const [selectedToken, setSelectedToken] = useState();
    const [selectedPackage, setSelectedPackage] = useState(
        PACKAGE_OPTIONS.BB[0]
    );
    function generateDateNDaysAfter(n) {
        const today = new Date(); // Get today's date
        today.setDate(today.getDate() + n); // Add n days to today's date
        return today.toISOString().split("T")[0]; // Return in YYYY-MM-DD format
    }
    const [paymentCurrency] = useState("BB");
    const [isPaymentVisible, setIsPaymentVisible] = useState(false);
    const [qrLoaded, setQrLoaded] = useState(false);
    const [isPaymentVerified, setIsPaymentVerified] = useState(false);
    const [availableTokens, setAvailableTokens] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await axios.get("/api/coins");
            setAvailableTokens(res.data);
        })();
    }, []);

    const walletAddress = "0x19fF7458B9cF2A576a6f42cD40f59c1Ad3A24354";

    const handlePackageChange = (event) => {
        try {
            const newPackage = JSON.parse(event.target.value);
            setSelectedPackage(newPackage);
        } catch (error) {
            console.error("Error parsing package value:", error);
        }
    };

    const handlePayment = () => {
        setIsPaymentVisible(true);
        console.log("Processing payment for:", selectedPackage);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            toast.success("Wallet address copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy the wallet address.");
        }
    };

    const verifyPayment = async (txHash) => {
        try {
            const provider = new ethers.JsonRpcProvider(
                "https://bsc-dataseed.binance.org/"
            );

            const tx = await provider.getTransaction(txHash);

            // Check if the transaction was sent to the correct address and matches the amount
            if (tx && tx.to.toLowerCase() === walletAddress.toLowerCase()) {
                const expectedAmountInWei = selectedPackage.value;

                // Check if the amount matches
                if (ethers.formatEther(tx.value) == expectedAmountInWei) {
                    // Verify that the transaction is confirmed
                    const receipt = await provider.getTransactionReceipt(
                        txHash
                    );
                    if (receipt && receipt.status === 1) {
                        console.log("Payment verified successfully!");
                        setIsPaymentVerified(true);
                        await promoteCoin();
                        return true; // Payment was successful
                    } else {
                        toast.error("Transaction is not confirmed yet.");
                        console.log("Transaction is not confirmed yet.");
                    }
                } else {
                    toast.error(
                        "Transaction amount does not match the expected amount."
                    );
                    console.log(
                        "Transaction amount does not match the expected amount."
                    );
                }
            } else {
                console.log("Transaction details do not match.");
            }
        } catch (error) {
            toast.error("Error verifying payment", error);
            console.error("Error verifying payment:", error);
        }
        return false;
    };

    const promoteCoin = async () => {
        try {
            const updatedToken = {
                ...selectedToken,
                isPromote: true,
                promoteTime: generateDateNDaysAfter(selectedPackage.day),
                rocket: selectedToken.rocket + selectedPackage.rocket,
            };
            await axios.put(
                `https://y-henna-beta.vercel.app/api/coins?id=${selectedToken._id}`,
                updatedToken
            );
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
        toast.success("Coin has been successfully promoted!");
    };

    const handleVerifyPayment = async () => {
        const txHash = prompt("Please enter your transaction hash");
        if (txHash) {
            await verifyPayment(txHash);
        }
    };

    const packages = PACKAGE_OPTIONS[paymentCurrency];

    return (
        <div className="max-w-full sm:max-w-3xl mx-auto p-4 sm:p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <ToastContainer />
            {/* Info Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <InfoCard
                    icon={SearchIcon}
                    title="Get Visitors"
                    description="More than 75,000 views daily"
                />
                <div className="min-h-28 flex flex-wrap items-center justify-center space-x-2 border-white py-3 px-4 text-center rounded-lg w-full sm:w-[32%] border-2">
                    <span className="text-lg sm:text-xl font-semibold">
                        Buy Boban
                    </span>
                    <a
                        href="https://pancakeswap.finance/swap?outputCurrency=0x183d66384b0f2C099E622403b9CCe4B52B524334"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 underline break-all"
                    >
                        Buy on PancakeSwap
                    </a>
                </div>
                <div className="min-h-28 flex flex-wrap items-center justify-center space-x-2 border-white py-3 px-4 text-center rounded-lg w-full sm:w-[32%] border-2">
                    <span className="text-lg sm:text-xl font-semibold">
                        Contact BB on Telegram
                    </span>
                    <a
                        href="https://t.me/BobanBBToken"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 underline"
                    >
                        Join Telegram Group
                    </a>
                </div>
            </div>

            {/* Contract Address */}
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Contract Address (BNB Chain)
                </label>
                <div className="bg-gray-700 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between">
                    <code className="text-sm break-all">
                        0x183d66384b0f2c099e622403b9cce4b52b524334
                    </code>
                    <button
                        onClick={copyToClipboard}
                        className="mt-2 sm:mt-0 ml-0 sm:ml-2 px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {/* Select Token (Searchable Dropdown) */}
            <div className="mb-4">
                <label className="block text-sm mb-2">
                    1. Select Your Token
                </label>
                <Autocomplete
                    options={availableTokens}
                    getOptionLabel={(option) =>
                        `${option.name} (${option.symbol})`
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search coin by name"
                            variant="outlined"
                            fullWidth
                            sx={{
                                bgcolor: "gray.700",
                                color: "white",
                                "& .MuiOutlinedInput-root": {
                                    "& input": {
                                        color: "white",
                                    },
                                    "& fieldset": {
                                        borderColor: "#555",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#777",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#FFD700",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "white",
                                },
                                "& .MuiAutocomplete-endAdornment svg": {
                                    color: "white",
                                },
                            }}
                        />
                    )}
                    value={selectedToken}
                    onChange={(e, value) => setSelectedToken(value)}
                />
            </div>

            {/* Package Selection */}
            <div className="mb-4">
                <label className="block text-sm mb-2">3. Select Package</label>
                <RadioGroup
                    value={JSON.stringify(selectedPackage)}
                    onChange={handlePackageChange}
                >
                    {packages.map((pkg) => (
                        <FormControlLabel
                            key={pkg.value}
                            value={JSON.stringify(pkg)}
                            control={
                                <Radio
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "#3B82F6",
                                        },
                                    }}
                                />
                            }
                            label={`${pkg.value} BB - ${pkg.label} + ${pkg.rocket} votes`}
                            sx={{
                                "& .MuiFormControlLabel-label": {
                                    fontWeight: "bold",
                                    color: "white",
                                },
                            }}
                        />
                    ))}
                </RadioGroup>
            </div>

            {/* Summary */}
            <div className="mb-4">
                <label className="block text-sm mb-2">4. Summary</label>
                <div className="p-4 bg-gray-700 rounded-lg">
                    <p>
                        Service: <strong>{selectedPackage.label}</strong>
                    </p>
                    <p>
                        Days: <strong>{selectedPackage.day} + {selectedPackage.rocket} votes</strong>
                    </p>
                    <p>
                        Price: <strong>{selectedPackage.value} BB</strong>
                    </p>
                </div>
            </div>

            {/* Pay Button */}
            <div className="text-center">
                <button
                    onClick={handlePayment}
                    className="w-full bg-blue-500 py-3 rounded-lg hover:bg-blue-600 focus:outline-none transition-colors"
                >
                    Pay Now
                </button>
            </div>

            {/* Payment Instructions */}
            {isPaymentVisible && (
                <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                        Payment Instructions
                    </h3>
                    <p>
                        Please send <strong>{selectedPackage.value} BB</strong>{" "}
                        to the following BEP-20 wallet address:
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-600 p-2 rounded mt-2">
                        <span className="text-sm">{walletAddress}</span>
                        <button
                            onClick={copyToClipboard}
                            className="mt-2 sm:mt-0 ml-0 sm:ml-2 px-3 py-1 bg-gray-500 rounded hover:bg-gray-400 transition-colors"
                        >
                            Copy
                        </button>
                    </div>

                    {/* QR Code */}
                    <div className="mt-4 text-center">
                        <QRCodeCanvas
                            value={walletAddress}
                            className="mx-auto"
                            size={150}
                            onClick={() => setQrLoaded(true)}
                        />
                    </div>

                    {/* Payment Verification */}
                    <div className="mt-4">
                        <button
                            onClick={handleVerifyPayment}
                            className="w-full bg-green-500 py-2 rounded-lg hover:bg-green-600 focus:outline-none transition-colors"
                        >
                            Verify Payment
                        </button>
                    </div>
                </div>
            )}

            {isPaymentVerified && (
                <div className="mt-6 text-center text-green-400 font-semibold">
                    Payment Verified! Your coin is now promoted.
                </div>
            )}
        </div>
    );
};

export default PromoteCoinForm;
