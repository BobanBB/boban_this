import { Card, CardContent, Typography } from '@mui/material';

const TokenInfoCard = () => {
  return (
    <Card className="bg-gray-700">
      <CardContent>
        <Typography variant="h5">Catson Price USD</Typography>
        <Typography variant="h4" color="success.main">
          $0.0003883
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          Buy/Sell Fee: <strong>0%</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Liquidity: <strong>$31,723</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Market Cap: <strong>$388.3k</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Supply: <strong>1.0B</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TokenInfoCard;
