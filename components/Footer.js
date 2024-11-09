import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 sm:py-14">
            <div className="container mx-auto px-4 sm:px-14">
                {/* Main Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {/* Coin lists */}
                    <div className="col-span-1">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                            Coin lists
                        </h3>
                        <ul className="space-y-2 text-sm sm:text-base">
                            <li>
                                <Link
                                    href="/trending"
                                    className="hover:text-blue-500"
                                >
                                    Hot
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/new"
                                    className="hover:text-blue-500"
                                >
                                    New
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/trade"
                                    className="hover:text-blue-500"
                                >
                                    Most Traded
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* By EVM */}
                    <div className="col-span-1">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                            By EVM
                        </h3>
                        <ul className="space-y-2 text-sm sm:text-base">
                            <li>
                                <Link
                                    href="/new/binance"
                                    className="hover:text-blue-500"
                                >
                                    Binance Coins
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/new/ethereum"
                                    className="hover:text-blue-500"
                                >
                                    Ethereum Coins
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/new/arbitrum"
                                    className="hover:text-blue-500"
                                >
                                    Arbitrum Coins
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/new/solana"
                                    className="hover:text-blue-500"
                                >
                                    Solana Coins
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/new/polygon"
                                    className="hover:text-blue-500"
                                >
                                    Polygon Coins
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/new/tron"
                                    className="hover:text-blue-500"
                                >
                                    Tron Coins
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="col-span-1">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                            Services
                        </h3>
                        <ul className="space-y-2 text-sm sm:text-base">
                            <li>
                                <Link
                                    href="/promote"
                                    className="hover:text-blue-500"
                                >
                                    Promote
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/submit"
                                    className="hover:text-blue-500"
                                >
                                    Submit Coin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                            Contact
                        </h3>
                        <ul className="space-y-2 text-sm sm:text-base">
                            <li>
                                <Link
                                    href="mailto:admin@bobantoken.com"
                                    className="hover:text-blue-500"
                                >
                                    Email
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://t.me/BobanBBToken"
                                    className="hover:text-blue-500"
                                >
                                    Telegram
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer Section */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Disclaimer
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                        All content provided herein our website, hyperlinked
                        sites, associated applications, forums, blogs, social
                        media accounts and other platforms ("Site") is for your
                        general information only, procured primarily from third
                        party sources. We make no warranties of any kind in
                        relation to our content and services, including but not
                        limited to accuracy, security and updatedness. No part
                        of the content and services that we provide constitutes
                        financial advice, legal advice or any other form of
                        advice meant for your specific reliance for any purpose,
                        nor any dealing in (or promotion of) securities for
                        which a licence is required from the Monetary Authority
                        of Singapore. Any use or reliance on our content and
                        services is solely at your own risk and discretion. You
                        should conduct your own research, review, analyse and
                        verify our content and services before relying on or
                        using them. Trading is a highly risky activity that can
                        lead to major losses, please therefore consult your
                        financial advisor before making any decision. No content
                        on our Site is meant to be a solicitation or offer.
                    </p>
                </div>

                {/* Bottom Section */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-xs sm:text-sm text-gray-400">
                        2021-2024© Boban
                    </p>

                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
                        <p className="text-base sm:text-lg font-semibold sm:mr-4 text-center sm:text-left">
                            Join the community
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="https://x.com/Boban_token"
                                target="_blank"
                                className="text-blue-500 hover:text-blue-400"
                            >
                                <TwitterIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Link>
                            <Link
                                href="https://t.me/BobanBBToken"
                                target="_blank"
                                className="text-blue-500 hover:text-blue-400"
                            >
                                <TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
