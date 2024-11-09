import React, { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useRouter } from "next/navigation";
import { RocketLaunch, Whatshot, Flag } from "@mui/icons-material";
import axios from "axios";

const ActionsCard = ({ coinId, initialRocket, initialFire, initialFlag }) => {
    const router = useRouter();
    const [voted, setVoted] = useState(false);
    const [rocket, setRocket] = useState(initialRocket);
    const [fire, setFire] = useState(initialFire);
    const [flag, setFlag] = useState(initialFlag);

    const handleOpenPromote = () => {
        router.push("/promote");
    };

    const handleVote = async (voteType) => {
        try {
            const userIp = await fetch("https://api64.ipify.org?format=json")
                .then((res) => res.json())
                .then((data) => data.ip);

            const response = await axios.post("/api/vote", {
                coinId: coinId,
                voteType,
                userIp,
            });

            if (response.status === 200) {
                setVoted(true);
                alert("Vote recorded successfully");

                // Update the vote count in real time
                if (voteType === "rocket") {
                    setRocket((prev) => prev + 1);
                } else if (voteType === "fire") {
                    setFire((prev) => prev + 1);
                } else if (voteType === "flag") {
                    setFlag((prev) => prev + 1);
                }
            }
        } catch (error) {
            console.error(error);
            // alert("Error recording vote");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                padding: {
                    xs: "10px", // padding for extra small screens
                    sm: "0px", // padding for small screens and up
                },
            }}
        >
            <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<FlashOnIcon />}
                onClick={handleOpenPromote}
                sx={{
                    transition: "all 0.3s ease",
                    borderColor: "primary.main",
                    maxWidth: {
                        xs: "90%", // width on mobile
                        sm: "400px", // width on larger screens
                    },
                    marginRight: {
                        xs: "0", // no margin on mobile
                        sm: "30px", // margin on larger screens
                    },
                    fontSize: {
                        xs: "14px", // smaller font on mobile
                        sm: "16px", // larger font on desktop
                    },
                    "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                        borderColor: "primary.main",
                    },
                }}
            >
                Promote
            </Button>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: {
                        xs: "10px", // smaller gap on mobile
                        sm: "16px", // larger gap on desktop
                    },
                    flexWrap: "wrap", // allows wrapping on very small screens
                    width: "100%",
                    marginTop: "10px"
                }}
            >
                {[
                    { icon: <RocketLaunch />, label: "rocket", count: rocket },
                    { icon: <Whatshot />, label: "fire", count: fire },
                    { icon: <Flag />, label: "flag", count: flag },
                ].map((item) => (
                    <IconButton
                        key={item.label}
                        aria-label={item.label}
                        disabled={voted}
                        onClick={() => handleVote(item.label)}
                        sx={{
                            border: "1px solid blue",
                            borderRadius: "10px",
                            padding: {
                                xs: "8px 15px", // smaller padding on mobile
                                sm: "10px 20px", // larger padding on desktop
                            },
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            "&:hover": {
                                backgroundColor: "darkblue",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "blue !important",
                                fontSize: {
                                    xs: "20px", // smaller icon on mobile
                                    sm: "24px", // larger icon on desktop
                                },
                            },
                            "& p": {
                                color: "blue",
                                fontSize: {
                                    xs: "16px", // smaller text on mobile
                                    sm: "20px", // larger text on desktop
                                },
                                margin: 0,
                            },
                        }}
                    >
                        {item.icon}
                        <p>{item.count}</p> {/* Display dynamic vote counts */}
                    </IconButton>
                ))}
            </Box>
        </Box>
    );
};

export default ActionsCard;
