import { Box, Button } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import { CurrencyBitcoin, AttachMoney } from '@mui/icons-material';

const LinksCard = () => {
  return (
    <Box mt={4}>
      <Button 
        variant="outlined" 
        color="primary" 
        fullWidth 
        startIcon={<CurrencyBitcoin />} 
      >
        <span> Visit CoinMarketCap </span>
      </Button>

      <Button 
        variant="outlined" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }} 
        startIcon={<AttachMoney />} 
      >
        Visit CoinGecko
      </Button>

      <Button 
        variant="outlined" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }} 
        startIcon={<LinkIcon />} 
      >
        Uniswap
      </Button>
    </Box>
  );
};

export default LinksCard;
