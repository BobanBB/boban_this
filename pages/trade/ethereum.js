import Head from "next/head";
import Navbar from "../../components/Navbar";
import { useEffect, useState, useCallback } from "react";
import CoinsTable from "../../components/Table";
import TrendingNavigation from "../../components/TrendingNavigation";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import PromoteTable from "../../components/PromoteTable";
import { Button, CircularProgress } from "@mui/material";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cryptoStats, setCryptoStats] = useState([]); // All coins
    const [promotedCoins, setPromotedCoins] = useState([]); // Promoted coins
    const [pageAll, setPageAll] = useState(1);
    const [pagePromoted, setPagePromoted] = useState(1);
    const [isFetchingAll, setIsFetchingAll] = useState(false);
    const [isFetchingPromoted, setIsFetchingPromoted] = useState(false);
    const [hasMoreAll, setHasMoreAll] = useState(true);
    const [hasMorePromoted, setHasMorePromoted] = useState(true);

    // Fetch all coins
    const fetchAllCoins = useCallback(async () => {
        setIsFetchingAll(true);
        try {
            const response = await fetch(`/api/trade/ethereum?page=${pageAll}&limit=10`);
            const data = await response.json();

            if (response.ok) {
                const newCoins = data.data;
                const { totalPages } = data.pagination;
                
                // Check if there's more data to fetch
                setHasMoreAll(pageAll < totalPages);
                
                setCryptoStats((prevStats) => [...prevStats, ...newCoins]);
            } else {
                console.error("Error fetching all coins:", data.error);
                setHasMoreAll(false);
            }
        } catch (error) {
            console.error("Network error:", error);
            setHasMoreAll(false);
        }
        setIsFetchingAll(false);
    }, [pageAll]);

    // Fetch promoted coins
    const fetchPromotedCoins = useCallback(async () => {
        setIsFetchingPromoted(true);
        try {
            const response = await fetch(`/api/trade/ethereum?page=${pagePromoted}&limit=10&promoted=true`);
            const data = await response.json();

            if (response.ok) {
                const newPromotedCoins = data.data;
                const { totalPages } = data.pagination;

                // Check if there's more data to fetch
                setHasMorePromoted(pagePromoted < totalPages);

                setPromotedCoins((prevCoins) => [...prevCoins, ...newPromotedCoins]);
            } else {
                console.error("Error fetching promoted coins:", data.error);
                setHasMorePromoted(false);
            }
        } catch (error) {
            console.error("Network error:", error);
            setHasMorePromoted(false);
        }
        setIsFetchingPromoted(false);
    }, [pagePromoted]);

    // Sidebar toggle
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Fetch all coins data on page change
    useEffect(() => {
        fetchAllCoins();
    }, [fetchAllCoins, pageAll]);

    // Fetch promoted coins data on page change
    useEffect(() => {
        fetchPromotedCoins();
    }, [fetchPromotedCoins, pagePromoted]);

    const loadMoreAll = () => {
        setPageAll((prevPage) => prevPage + 1); // Increment page for all coins
    };

    const loadMorePromoted = () => {
        setPagePromoted((prevPage) => prevPage + 1); // Increment page for promoted coins
    };

    return (
        <>
            <Head>
                <title>Ethereum</title>
                <meta name="description" content="Ethereum - Top trending Crypto Coins today | bobantoken.com" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`min-h-screen bg-black text-white p-4 sm:p-6 pt-16 sm:pt-20 transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-64" : "ml-0"
                    }`}
                >
                    <Banner />
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                        Promoted Coins
                    </h2>
                    {/* Check if there are promoted coins or display a message */}
                    {promotedCoins.length > 0 ? (
                        <PromoteTable coinsData={promotedCoins} />
                    ) : !isFetchingPromoted && (
                        <div className="text-center text-gray-500">No data available</div>
                    )}

                    {/* Load More Button for PromoteTable */}
                    <div className="flex justify-center my-4">
                        {isFetchingPromoted ? (
                            <CircularProgress color="secondary" />
                        ) : (
                            hasMorePromoted && (
                                <Button
                                    variant="contained"
                                    onClick={loadMorePromoted}
                                    style={{
                                        backgroundColor: "rgb(58, 131, 245, 0.8)",
                                        border: "1px solid gold",
                                        color: "white",
                                        padding: "8px 16px",
                                        fontSize: "0.875rem",
                                        fontWeight: "bold",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Load More Promoted
                                </Button>
                            )
                        )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold my-3 sm:my-4">
                        Trending Coins
                    </h2>
                    <TrendingNavigation />
                    {cryptoStats.length > 0 ? (
                        <CoinsTable coinsData={cryptoStats} />
                    ) : !isFetchingAll && (
                        <div className="text-center text-gray-500">No data available</div>
                    )}

                    {/* Load More Button for CoinsTable */}
                    <div className="flex justify-center my-4">
                        {isFetchingAll ? (
                            <CircularProgress color="secondary" />
                        ) : (
                            hasMoreAll && (
                                <Button
                                    variant="contained"
                                    onClick={loadMoreAll}
                                    style={{
                                        backgroundColor: "rgb(58, 131, 245, 0.8)",
                                        border: "1px solid gold",
                                        color: "white",
                                        padding: "8px 16px",
                                        fontSize: "0.875rem",
                                        fontWeight: "bold",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Load More
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </main>  
            <div
                className={`transition-all duration-300 ${
                    isSidebarOpen ? "md:ml-64" : "ml-0"
                }`}
            >
                <Footer />
            </div>
        </>
    );
}
