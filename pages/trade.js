import Head from "next/head";
import Navbar from "../components/Navbar";
import { useEffect, useState, useCallback } from "react";
import CoinsTable from "../components/Table";
import TrendingNavigation from "../components/TrendingNavigation";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import PromoteTable from "../components/PromoteTable";
import { Button, CircularProgress } from "@mui/material";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cryptoStats, setCryptoStats] = useState([]); // All most-traded coins
    const [promotedCoins, setPromotedCoins] = useState([]); // Promoted coins
    const [pageAll, setPageAll] = useState(1);
    const [pagePromoted, setPagePromoted] = useState(1);
    const [isFetchingAll, setIsFetchingAll] = useState(false);
    const [isFetchingPromoted, setIsFetchingPromoted] = useState(false);
    const [hasMoreAll, setHasMoreAll] = useState(true);
    const [hasMorePromoted, setHasMorePromoted] = useState(true);

    // Fetch all most-traded coins
    const fetchAllCoins = useCallback(async () => {
        setIsFetchingAll(true);
        try {
            const response = await fetch(`/api/most-traded?page=${pageAll}&limit=10`);
            const data = await response.json();

            if (response.ok) {
                const newCoins = data.data;
                const { totalPages } = data.pagination;
                
                setHasMoreAll(pageAll < totalPages);
                setCryptoStats((prevStats) => [...prevStats, ...newCoins]);
            } else {
                console.error("Error fetching most-traded coins:", data.error);
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
            const response = await fetch(`/api/most-traded?page=${pagePromoted}&limit=10&promoted=true`);
            const data = await response.json();

            if (response.ok) {
                const newPromotedCoins = data.data;
                const { totalPages } = data.pagination;

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
        setPageAll((prevPage) => prevPage + 1);
    };

    const loadMorePromoted = () => {
        setPagePromoted((prevPage) => prevPage + 1);
    };

    return (
        <>
            <Head>
                <title>Most Traded Cryptocurrency Coins Today | BobanToken</title>
                <meta name="description" content="Explore top-traded crypto coins with the highest trading volume. Analyze real-time stats to find the best opportunities for your investment strategy." />
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
                    <PromoteTable coinsData={promotedCoins} />

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
                        Most Traded Coins
                    </h2>
                    <TrendingNavigation />
                    <CoinsTable coinsData={cryptoStats} />

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
