import { useState } from "react";
import { Modal } from "@mui/material";
import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaTimes } from "react-icons/fa";

const UpdateTokenModal = () => {
    // States
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
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    // Handlers
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

            setFormData((prev) => ({
                ...prev,
                logoFile: file,
            }));
            setPreviewUrl(URL.createObjectURL(file));
            setError("");
        }
    };

    const uploadImageToFirebase = async (file) => {
        try {
            const fileName = `token-logos/${Date.now()}-${file.name}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, file);
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

            if (formData.logoFile) {
                logoUrl = await uploadImageToFirebase(formData.logoFile);
            }

            const submitData = {
                ...(logoUrl && { logoUrl }),
                ...(formData.description && {
                    description: formData.description,
                }),
                ...(formData.websiteLink && {
                    websiteLink: formData.websiteLink,
                }),
                ...(formData.telegramLink && {
                    telegramLink: formData.telegramLink,
                }),
                ...(formData.twitterLink && {
                    twitterLink: formData.twitterLink,
                }),
                ...(formData.discordLink && {
                    discordLink: formData.discordLink,
                }),
            };

            const response = await fetch("/api/update-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                throw new Error("Failed to update token information");
            }

            // Reset form and close modal
            setFormData({
                logoFile: null,
                logoUrl: "",
                description: "",
                websiteLink: "",
                telegramLink: "",
                twitterLink: "",
                discordLink: "",
            });
            setPreviewUrl(null);
            setIsUpdateModalOpen(false);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        if (!isSubmitting) {
            setIsUpdateModalOpen(false);
            setError("");
            setPreviewUrl(null);
            setFormData({
                logoFile: null,
                logoUrl: "",
                description: "",
                websiteLink: "",
                telegramLink: "",
                twitterLink: "",
                discordLink: "",
            });
        }
    };

    return (
        <>
            {/* Update Token Button */}
            <div className="flex justify-center mt-8 mb-4">
                <button
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    Submit Token Information Update
                </button>
            </div>

            {/* Update Token Modal */}
            <Modal
                open={isUpdateModalOpen}
                onClose={closeModal}
                className="flex items-center justify-center"
            >
                <div className="bg-[#1a1a1a] text-white rounded-lg p-6 max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto relative">
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                        disabled={isSubmitting}
                    >
                        <FaTimes size={24} />
                    </button>

                    {/* Modal Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Update Token</h2>
                        <p className="text-gray-300 mt-2">
                            Important! ONLY fill the data you want to change.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                        {/* Logo Upload */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">
                                Change logo
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                                Optimal dimensions 512×512px, size up to 1MB
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                                id="logo-upload"
                            />
                            <label
                                htmlFor="logo-upload"
                                className="block w-full py-2 px-4 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-black transition-colors duration-200 cursor-pointer text-center"
                            >
                                {formData.logoFile ? "Change Image" : "Upload"}
                            </label>

                            {/* Image Preview */}
                            {previewUrl && (
                                <div className="mt-4 flex items-center space-x-4">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <p className="text-sm text-gray-400">
                                        {formData.logoFile?.name}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full bg-[#2a2a2a] text-white rounded p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Describe your Token/NFT here. What is the goal, plans, why is this project unique?"
                            />
                        </div>

                        {/* Website Link */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Website link
                            </label>
                            <input
                                type="url"
                                name="websiteLink"
                                value={formData.websiteLink}
                                onChange={handleInputChange}
                                className="w-full bg-[#2a2a2a] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="https://yourwebsite.com/"
                            />
                        </div>

                        {/* Telegram Link */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Telegram link
                            </label>
                            <input
                                type="text"
                                name="telegramLink"
                                value={formData.telegramLink}
                                onChange={handleInputChange}
                                className="w-full bg-[#2a2a2a] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Telegram"
                            />
                        </div>

                        {/* Twitter Link */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Twitter link
                            </label>
                            <input
                                type="text"
                                name="twitterLink"
                                value={formData.twitterLink}
                                onChange={handleInputChange}
                                className="w-full bg-[#2a2a2a] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Twitter"
                            />
                        </div>

                        {/* Discord Link */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Discord link
                            </label>
                            <input
                                type="text"
                                name="discordLink"
                                value={formData.discordLink}
                                onChange={handleInputChange}
                                className="w-full bg-[#2a2a2a] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Discord"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200 ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                "Submit Update"
                            )}
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default UpdateTokenModal;
