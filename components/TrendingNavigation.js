import { useState, useEffect } from "react";
import binanceIcon from "../images/binance.png";
import ethereumIcon from "../images/ethereum.png";
import solanaIcon from "../images/solana.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const TrendingNavigation = () => {
    const router = useRouter();
    const currentPath = router.pathname;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const NetworkIcons = () => (
        <div className="flex items-center space-x-1 sm:space-x-2">
            {["binance", "ethereum", "solana"].map((network) => {
                const basePath = currentPath.replace(
                    /\/(binance|ethereum|solana)/,
                    ""
                );
                const href = `${basePath}/${network}`;

                return (
                    <Link
                        key={network}
                        href={href}
                        className="bg-gray-700 p-0.5 sm:p-1 rounded"
                    >
                        <Image
                            src={
                                network === "binance"
                                    ? binanceIcon
                                    : network === "ethereum"
                                    ? ethereumIcon
                                    : solanaIcon
                            }
                            height={16}
                            width={16}
                            alt={network}
                            className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                    </Link>
                );
            })}
        </div>
    );

    if (!isMounted) return null;

    const navigationTabs = [
        { key: "trending", icon: "💎", label: "Trending" },
        { key: "hot", icon: "🔥", label: "Hot" },
        { key: "new", icon: "🏷️", label: "New" },
        { key: "gainers", icon: "🚀", label: "Gainers" },
    ];

    return (
        <div className="bg-gray-900 text-white p-1 rounded-md mb-2 sm:mb-4 overflow-x-auto">
            {/* Desktop View */}
            <div className="hidden sm:flex space-x-4">
                {navigationTabs.map(({ key, icon, label }) => (
                    <Link key={key} href={`/${key === "hot" ? "trade" : key}`}>
                        <div
                            className={`flex items-center space-x-2 px-2 py-1 rounded-md whitespace-nowrap ${
                                currentPath.includes(
                                    `/${key === "hot" ? "trade" : key}`
                                )
                                    ? "bg-blue-500 text-black"
                                    : ""
                            }`}
                        >
                            <span>{icon}</span>
                            <span className="font-bold capitalize">
                                {label}
                            </span>
                            {currentPath.includes(
                                `/${key === "hot" ? "trade" : key}`
                            ) && <NetworkIcons />}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile View */}
            <div className="flex sm:hidden space-x-2 min-w-max">
                {navigationTabs.map(({ key, icon, label }) => (
                    <Link key={key} href={`/${key === "hot" ? "trade" : key}`}>
                        <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                                currentPath.includes(
                                    `/${key === "hot" ? "trade" : key}`
                                )
                                    ? "bg-blue-500 text-black"
                                    : ""
                            }`}
                        >
                            <span className="text-sm">{icon}</span>
                            <span className="font-bold capitalize text-xs">
                                {key}
                            </span>
                            {currentPath.includes(
                                `/${key === "hot" ? "trade" : key}`
                            ) && <NetworkIcons />}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TrendingNavigation;
