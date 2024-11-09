import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

// Function to format the volume
const formatVolume = (volume) => {
    if (volume == 0) {
        const num = Number(volume);
        return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
    }
    if (!volume || volume === "--") {
        return "--";
    }
    const num = Number(volume);
    return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
};

export default function CoinsTable({ coinsData }) {
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100; // Number of items per page

    // Calculate the range of items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCoins = coinsData.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const isLoading = !currentCoins;

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    {/* Using MUI Spinner */}
                    <CircularProgress color="secondary" />
                    {/* Or a simple loading text */}
                    {/* <p className="text-white text-xl ml-4">Loading...</p> */}
                </div>
            ) : (
                <>
                    <div className="hidden md:block">
                        <TableContainer
                            component={Paper}
                            className="bg-black"
                            sx={{ color: "white" }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow
                                        className="bg-[#404040]"
                                        sx={{ color: "white !important" }}
                                    >
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-[0.6rem]"
                                        >
                                            Coin
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            Price
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            Age
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            TXN 24h
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            Volume
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            1h
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            24h
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            7d
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            LP
                                        </TableCell>
                                        <TableCell
                                            sx={{ color: "white !important" }}
                                            className=" font-bold text-[0.95rem] py-1"
                                        >
                                            MCap
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentCoins.map((coin, index) => (
                                        <TableRow
                                            key={index}
                                            className={`hover:bg-blue-900 transition-all ${
                                                index % 2 === 0
                                                    ? "bg-[#262626]"
                                                    : "bg-[#2a2a2a]"
                                            }`}
                                        >
                                            <TableCell
                                                sx={{
                                                    color: "white !important",
                                                }}
                                                className="font-semibold py-1"
                                            >
                                                <Link
                                                    href={`/coin/${coin.slug}`}
                                                >
                                                    <div className="flex space-x-2 items-center">
                                                        {coin.image && (
                                                            <Image
                                                                src={coin.image}
                                                                height={25}
                                                                width={25}
                                                                alt={coin.name}
                                                            />
                                                        )}
                                                        <div className="flex flex-col space-y-1">
                                                            <span>
                                                                {coin.name}
                                                            </span>
                                                            <div className="flex space-x-1">
                                                                {coin.networks?.map(
                                                                    (
                                                                        icon,
                                                                        idx
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                icon
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "white !important",
                                                }}
                                            >
                                                {coin?.price
                                                    ? coin.price
                                                          .toString()
                                                          .toLowerCase() ==
                                                      "presale"
                                                        ? coin.price
                                                        : "$" +
                                                          parseFloat(coin.price)
                                                              .toFixed(5)
                                                              .replace(
                                                                  /\.?0+$/,
                                                                  ""
                                                              )
                                                    : "--"}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "white !important",
                                                }}
                                            >
                                                {coin.age || "--"}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "white !important",
                                                }}
                                            >
                                                {coin.txn || "--"}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "white !important",
                                                }}
                                            >
                                                {coin?.volume_24h == 0
                                                    ? "$0"
                                                    : "$" +
                                                      formatVolume(
                                                          coin?.volume_24h
                                                      )}
                                            </TableCell>
                                            <TableCell
                                                className={clsx({
                                                    "MuiTypography-root": true,
                                                })}
                                                sx={{
                                                    color:
                                                        typeof coin?.percent_change_1h ===
                                                            "number" &&
                                                        coin?.percent_change_1h >=
                                                            0
                                                            ? "green"
                                                            : "red",
                                                    "!important": true,
                                                }}
                                            >
                                                {coin?.percent_change_1h
                                                    ? coin?.percent_change_1h
                                                          .toString()
                                                          .toLowerCase() ==
                                                      "presale"
                                                        ? coin?.percent_change_1h
                                                        : coin?.percent_change_1h.toFixed(
                                                              2
                                                          ) + "%"
                                                    : "--"}
                                            </TableCell>

                                            <TableCell
                                                className={clsx({
                                                    "MuiTypography-root": true,
                                                })}
                                                sx={{
                                                    color:
                                                        typeof coin?.percent_change_6h ===
                                                            "number" &&
                                                        coin?.percent_change_6h >=
                                                            0
                                                            ? "green"
                                                            : "red",
                                                    "!important": true,
                                                }}
                                            >
                                                {coin?.percent_change_6h
                                                    ? coin?.percent_change_6h
                                                          .toString()
                                                          .toLowerCase() ==
                                                      "presale"
                                                        ? coin?.percent_change_6h
                                                        : coin?.percent_change_6h.toFixed(
                                                              2
                                                          ) + "%"
                                                    : "--"}
                                            </TableCell>

                                            <TableCell
                                                className={clsx({
                                                    "MuiTypography-root": true,
                                                })}
                                                sx={{
                                                    color:
                                                        typeof coin?.percent_change_24h ===
                                                            "number" &&
                                                        coin?.percent_change_24h >=
                                                            0
                                                            ? "green"
                                                            : "red",
                                                    "!important": true,
                                                }}
                                            >
                                                {coin?.percent_change_24h
                                                    ? coin?.percent_change_24h
                                                          .toString()
                                                          .toLowerCase() ==
                                                      "presale"
                                                        ? coin?.percent_change_24h
                                                        : coin?.percent_change_24h +
                                                          "%"
                                                    : "--"}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "white !important",
                                                }}
                                            >
                                                {coin?.lp || coin?.lp == 0
                                                    ? "$" +
                                                      formatVolume(coin?.lp)
                                                    : "--"}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "white !important",
                                                }}
                                            >
                                                {coin?.market_cap ||
                                                coin?.market_cap == 0
                                                    ? "$" +
                                                      formatVolume(
                                                          coin?.market_cap
                                                      )
                                                    : "--"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 px-2">
                        {currentCoins.map((coin, index) => (
                            <Link
                                href={`/coin/${coin.slug}`}
                                key={index}
                                className={`block rounded-lg p-3 ${
                                    index % 2 === 0
                                        ? "bg-[#262626]"
                                        : "bg-[#2a2a2a]"
                                } hover:bg-blue-900 transition-all`}
                            >
                                {/* Coin Header */}
                                <div className="flex items-center space-x-3 mb-2">
                                    {coin.image && (
                                        <Image
                                            src={coin.image}
                                            height={32}
                                            width={32}
                                            alt={coin.name}
                                            className="rounded-full"
                                        />
                                    )}
                                    <div>
                                        <div className="font-semibold text-white">
                                            {coin.name}
                                        </div>
                                        <div className="flex space-x-1 mt-1">
                                            {coin.networks?.map((icon, idx) => (
                                                <span key={idx}>{icon}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Changes */}
                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <div className="space-y-1">
                                        <div className="text-gray-400">
                                            Price
                                        </div>
                                        <div className="text-white">
                                            {coin?.price
                                                ? coin.price
                                                      .toString()
                                                      .toLowerCase() ==
                                                  "presale"
                                                    ? coin.price
                                                    : "$" +
                                                      parseFloat(coin.price)
                                                          .toFixed(5)
                                                          .replace(/\.?0+$/, "")
                                                : "--"}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-gray-400">
                                            24h Change
                                        </div>
                                        <div
                                            className={clsx(
                                                typeof coin?.percent_change_24h ==
                                                    "number" &&
                                                    coin?.percent_change_24h >=
                                                        0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            )}
                                        >
                                            {coin?.percent_change_24h
                                                ? coin?.percent_change_24h
                                                      .toString()
                                                      .toLowerCase() ==
                                                  "presale"
                                                    ? coin?.percent_change_24h
                                                    : coin?.percent_change_24h +
                                                      "%"
                                                : "--"}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-gray-400">
                                            Volume 24h
                                        </div>
                                        <div className="text-white">
                                            {coin?.volume_24h == 0
                                                ? "$0"
                                                : "$" +
                                                  formatVolume(
                                                      coin?.volume_24h
                                                  )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-gray-400">
                                            Market Cap
                                        </div>
                                        <div className="text-white">
                                            {coin?.market_cap ||
                                            coin?.market_cap == 0
                                                ? "$" +
                                                  formatVolume(coin?.market_cap)
                                                : "--"}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {coinsData.length > itemsPerPage && (
                        <div className="flex justify-center py-4 px-2">
                            <Button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                className="w-full sm:w-auto"
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
                                <span className="hidden sm:inline">
                                    Coins {indexOfFirstItem + 1} to{" "}
                                    {indexOfLastItem} &gt;
                                </span>
                                <span className="sm:hidden">
                                    Next Page &gt;
                                </span>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
