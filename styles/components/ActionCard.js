import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn"; // Lightning icon for boost
import CloseIcon from "@mui/icons-material/Close"; // Close icon for modal
import Image from "next/image";
import catsonImage from "../images/catson.png"; // Image for the icon
import { useRouter } from "next/navigation";

const ActionsCard = () => {
    const [openPromote, setOpenPromote] = useState(false);
    const [openBoost, setOpenBoost] = useState(false);
    const router = useRouter();

    // Function to open/close the Promote modal
    const handleOpenPromote = () => {
        // setOpenPromote(true);
        router.push("/promote");
    };
    const handleClosePromote = () => {
        setOpenPromote(false);
    };

    // Function to open/close the Boost modal
    const handleOpenBoost = () => {
        setOpenBoost(true);
    };
    const handleCloseBoost = () => {
        setOpenBoost(false);
    };

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {/* Boost Button */}
            {/* <Button
        className="!mb-2"
        variant="outlined"
        color="primary"
        fullWidth
        startIcon={<FlashOnIcon />}
        onClick={handleOpenBoost} // Open the Boost modal when clicked
        sx={{
          transition: 'all 0.3s ease',
          borderColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
            borderColor: 'primary.main',
          },
        }}
      >
        Boost
      </Button> */}

            {/* Promote Button */}

            <Button
                className="mt-6"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<FlashOnIcon />}
                onClick={handleOpenPromote} // Open the Promote modal when clicked
                sx={{
                    transition: "all 0.3s ease",
                    borderColor: "primary.main",
                    "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                        borderColor: "primary.main",
                    },
                    marginTop: '40px',
                    marginRight: '30px'
                }}
            >
                Promote
            </Button>

            {/* Boost Modal */}
            {/* <Dialog open={openBoost} onClose={handleCloseBoost} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: '#222',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Boost Your Coin!
          <IconButton
            aria-label="close"
            onClick={handleCloseBoost}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#FFD700',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: '#333',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <Typography gutterBottom textAlign="center" className='font-bold'>
            Get <span className='text-[#FFD700]'>Boost</span> points!
          </Typography>
          <div className='flex'>
            <div className='border-b-2 w-1/4 border-[#FFD700]'></div>
            <Typography variant="body1" className='text-sm w-1/2' gutterBottom textAlign="center">
              Choose a boost package:
            </Typography>
            <div className='border-b-2 w-1/4 items-center border-[#FFD700]'></div>
          </div>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Box
              textAlign="center"
              sx={{
                backgroundColor: '#444',
                padding: 2,
                borderRadius: '8px',
                width: '30%',
              }}
            >
              <FlashOnIcon sx={{ color: '#FFD700', fontSize: '40px' }} />
              <Typography variant="h6" color="#FFD700">1 day</Typography>
              <Typography color="#FFD700">100x Boost</Typography>
              <Typography color="#FFD700">0.05 BNB</Typography>
            </Box>

            <Box
              textAlign="center"
              sx={{
                backgroundColor: '#444',
                padding: 2,
                borderRadius: '8px',
                width: '30%',
              }}
            >
              <FlashOnIcon sx={{ color: '#FFD700', fontSize: '40px' }} />
              <Typography variant="h6" color="#FFD700">3 days</Typography>
              <Typography color="#FFD700">200x Boost</Typography>
              <Typography color="#FFD700">0.1 BNB</Typography>
            </Box>

            <Box
              textAlign="center"
              sx={{
                backgroundColor: '#444',
                padding: 2,
                borderRadius: '8px',
                width: '30%',
              }}
            >
              <FlashOnIcon sx={{ color: '#FFD700', fontSize: '40px' }} />
              <Typography variant="h6" color="#FFD700">7 days</Typography>
              <Typography color="#FFD700">400x Boost</Typography>
              <Typography color="#FFD700">0.18 BNB</Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: '#222',
          }}
        >
          <Button onClick={handleCloseBoost} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}

            {/* Promote Modal */}
            {/* <Dialog open={openPromote} onClose={handleClosePromote} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: '#222',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Promote CAT Now!
          <IconButton
            aria-label="close"
            onClick={handleClosePromote}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#FFD700',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: '#333',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <Typography gutterBottom textAlign="center" className='font-bold'>
            Get a spot in the <span className='text-[#FFD700]'>Promoted</span> list!
          </Typography>
          <div className='flex'>
            <div className='border-b-2 w-1/4 border-[#FFD700]'></div>
            <Typography variant="body1" className='text-sm w-1/2' gutterBottom textAlign="center">
              Choose a promotion package:
            </Typography>
            <div className='border-b-2 w-1/4 items-center border-[#FFD700]'></div>
          </div>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Box textAlign="center" sx={{ backgroundColor: '#444', padding: 2, borderRadius: '8px', width: '30%' }}>
              <FlashOnIcon sx={{ color: '#FFD700', fontSize: '40px' }} />
              <Typography variant="h6" color="#FFD700">1 day</Typography>
              <Typography color="#FFD700">100x Boost</Typography>
              <Typography color="#FFD700">0.05 BNB</Typography>
            </Box>
            <Box textAlign="center" sx={{ backgroundColor: '#444', padding: 2, borderRadius: '8px', width: '30%' }}>
              <FlashOnIcon sx={{ color: '#FFD700', fontSize: '40px' }} />
              <Typography variant="h6" color="#FFD700">3 days</Typography>
              <Typography color="#FFD700">200x Boost</Typography>
              <Typography color="#FFD700">0.1 BNB</Typography>
            </Box>
            <Box textAlign="center" sx={{ backgroundColor: '#444', padding: 2, borderRadius: '8px', width: '30%' }}>
              <FlashOnIcon sx={{ color: '#FFD700', fontSize: '40px' }} />
              <Typography variant="h6" color="#FFD700">7 days</Typography>
              <Typography color="#FFD700">400x Boost</Typography>
              <Typography color="#FFD700">0.18 BNB</Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ backgroundColor: '#222' }}>
          <Button onClick={handleClosePromote} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
        </Box>
    );
};

export default ActionsCard;
