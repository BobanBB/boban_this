import { FaTrophy, FaNetworkWired, FaBullhorn } from "react-icons/fa";
import Image from "next/image";
import binanceIcon from "../images/binance.png";
import ethereumIcon from "../images/ethereum.png";
import arbitrumIcon from "../images/arbitrum.png";
import solanaIcon from "../images/solana.png";
import polygonIcon from "../images/polygon.png";
import tronIcon from "../images/tron.png";
import telegramIcon from "../images/telegram.png";
import twitterIcon from "../images/twitter.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ isSidebarOpen }) => {
    const pathname = usePathname();

    return (
        <div
            className={`fixed left-0 top-11 md:top-16 h-full bg-black w-[280px] sm:w-64 z-40 transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 border-r-slate-500 border-r-[1px] overflow-y-auto`}
        >
            <div className="text-white py-2 sm:py-4 space-y-3 sm:space-y-4">
                <Link href={"/"} className="flex px-3 sm:px-4 items-center space-x-2">
                    <FaTrophy className="text-blue-500" size={20} />
                    <span className="text-sm sm:text-base">Coin Lists</span>
                </Link>
                
                <div className="flex flex-col space-y-1 text-gray-300 text-sm sm:text-base">
                    <Link
                        href={"/trade"}
                        className={`py-1 ${
                            pathname.includes("trade")
                                ? "bg-blue-800 px-6 sm:px-8"
                                : "px-6 sm:px-8"
                        }`}
                    >
                        Most traded
                    </Link>
                    <Link
                        href={"/new"}
                        className={`py-1 ${
                            pathname.includes("new") && pathname.length == 2
                                ? "bg-blue-800 px-6 sm:px-8"
                                : "px-6 sm:px-8"
                        }`}
                    >
                        New Coins
                    </Link>
                    <Link
                        href={"/trending"}
                        className={`py-1 ${
                            pathname.includes("trending")
                                ? "bg-blue-800 px-6 sm:px-8"
                                : "px-6 sm:px-8"
                        }`}
                    >
                        Trending Coins
                    </Link>
                    <Link
                        href={"/gainers"}
                        className={`py-1 ${
                            pathname.includes("gainers")
                                ? "bg-blue-800 px-6 sm:px-8"
                                : "px-6 sm:px-8"
                        }`}
                    >
                        Daily Gainers
                    </Link>
                </div>

                <Link
                    href={"/"}
                    className={`flex items-center space-x-2 mt-3 sm:mt-4 px-3 sm:px-4 ${
                        pathname[1] == "" && "bg-blue-800"
                    }`}
                >
                    <FaNetworkWired className="text-blue-500" size={20} />
                    <span className="text-sm sm:text-base">EVM Networks</span>
                </Link>

                <div className="ml-3 sm:ml-4 space-y-1 text-gray-300 text-sm sm:text-base">
                    <Link
                        href={"/new/binance"}
                        className={`flex items-center space-x-1 px-6 sm:px-8 py-1 ${
                            pathname.includes("binance") && "bg-blue-800"
                        }`}
                    >
                        <Image
                            src={binanceIcon}
                            height={16}
                            width={16}
                            alt="binance"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                        />
                        <p>Binance</p>
                    </Link>
                    <Link
                        href={"/new/ethereum"}
                        className={`flex items-center space-x-1 px-6 sm:px-8 py-1 ${
                            pathname.includes("ethereum") && "bg-blue-800"
                        }`}
                    >
                        <Image
                            src={ethereumIcon}
                            height={16}
                            width={16}
                            alt="ethereum"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                        />
                        <p>Ethereum</p>
                    </Link>
                    <Link
                        href={"/new/arbitrum"}
                        className={`flex items-center space-x-1 px-6 sm:px-8 py-1 ${
                            pathname.includes("arbitrum") && "bg-blue-800"
                        }`}
                    >
                        <Image
                            src={arbitrumIcon}
                            height={16}
                            width={16}
                            alt="arbitrum"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                        />
                        <p>Arbitrum</p>
                    </Link>
                    <Link
                        href={"/new/solana"}
                        className={`flex items-center space-x-1 px-6 sm:px-8 py-1 ${
                            pathname.includes("solana") && "bg-blue-800"
                        }`}
                    >
                        <Image
                            src={solanaIcon}
                            height={16}
                            width={16}
                            alt="solana"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                        />
                        <p>Solana</p>
                    </Link>
                    <Link
                        href={"/new/polygon"}
                        className={`flex items-center space-x-1 px-6 sm:px-8 py-1 ${
                            pathname.includes("polygon") && "bg-blue-800"
                        }`}
                    >
                        <Image
                            src={polygonIcon}
                            height={16}
                            width={16}
                            alt="polygon"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                        />
                        <p>Polygon</p>
                    </Link>
                    <Link
                        href={"/new/tron"}
                        className={`flex items-center space-x-1 px-6 sm:px-8 py-1 ${
                            pathname.includes("tron") && "bg-blue-800"
                        }`}
                    >
                        <Image
                            src={tronIcon}
                            height={16}
                            width={16}
                            alt="tron"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                        />
                        <p>Tron</p>
                    </Link>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2 mt-3 sm:mt-4 px-3 sm:px-4 mb-2">
                        <FaBullhorn className="text-blue-500" size={20} />
                        <span className="text-sm sm:text-base">Advertise</span>
                    </div>

                    <Link 
                        href="/promote" 
                        className="ml-3 sm:ml-4 text-gray-300 px-4 sm:px-6 text-sm sm:text-base"
                    >
                        Promote Coin
                    </Link>
                </div>

                <div className="px-3 sm:px-4 flex justify-center">
                    <Link
                        href="/submit"
                        className="w-full bg-[rgba(58,131,245,0.8)] border border-solid text-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-bold rounded flex justify-center items-center"
                    >
                        Submit Coin
                    </Link>
                </div>
            </div>

            <div className="flex justify-center space-x-4 text-gray-400 mt-4 pb-4">
                <Link href={"https://x.com/Boban_token"} target="_blank">
                    <Image
                        src={twitterIcon}
                        height={22}
                        width={22}
                        alt="twitter"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                </Link>
                <Link href={"https://t.me/BobanBBToken"} target="_blank">
                    <Image
                        src={telegramIcon}
                        height={22}
                        width={22}
                        alt="telegram"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
