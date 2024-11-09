import { RocketLaunch, LocalFireDepartment, Flag } from '@mui/icons-material';

const CatsonCard = () => {
  return (
    <div className="mt-5">
      {/* Top Icons Section */}
      <div className="flex justify-between mb-4 gap-3">
        <div className="text-center border w-1/3 flex justify-center items-center py-8 rounded-lg">
          <RocketLaunch className="text-white" />
          <p className="text-sm mt-1 font-semibold">7</p>
        </div>
        <div className="text-center border w-1/3 flex justify-center items-center py-8 rounded-lg">
          <LocalFireDepartment className="text-white" />
          <p className="text-sm mt-1 font-semibold">0</p>
        </div>
        <div className="text-center border w-1/3 flex justify-center items-center py-8 rounded-lg">
          <Flag className="text-white" />
          <p className="text-sm mt-1 font-semibold">0</p>
        </div>
      </div>

      {/* Price Section */}
      <div className="text-center mb-4 border rounded py-3">
        <h2 className="text-lg font-semibold [line-height:1]">Catson Price USD</h2>
        <p className="text-xl font-bold">$0.0003883</p>
      </div>

      {/* Time Periods Section */}
      <div className="grid grid-cols-4 gap-2 text-center mb-4">
        <div>
          <p className="text-sm font-medium">5m</p>
          <p>--</p>
        </div>
        <div className="bg-green-500 p-2 rounded-lg border border-green-700">
          <p className="text-sm font-medium">1h</p>
          <p>3.4%</p>
        </div>
        <div className="bg-red-600 p-2 rounded-lg border border-red-700">
          <p className="text-sm font-medium">6h</p>
          <p>-1.2%</p>
        </div>
        <div className="bg-red-600 p-2 rounded-lg border border-red-700">
          <p className="text-sm font-medium">24h</p>
          <p>-3.6%</p>
        </div>
      </div>

      {/* Transaction Info Section */}
      <div className="grid grid-cols-3 text-center mb-4">
        <div>
          <p className="text-sm font-medium">TXN</p>
          <p>3</p>
        </div>
        <div>
          <p className="text-sm font-medium">Buy</p>
          <p>2</p>
        </div>
        <div>
          <p className="text-sm font-medium">Sell</p>
          <p>1</p>
        </div>
      </div>

      {/* Volume Section */}
      <div className="flex text-center justify-between items-center text-sm font-medium mb-4 border-t border-g-tbg-transparentt-2">
        <p>Volume</p>
        <p>$1298.5</p>
      </div>

      {/* Buy/Sell Fee and Liquidity */}
      <div className='flex flex-wrap justify-between gap-1'>
      <div className="text-center justify-between items-center text-sm font-medium mb-4 p-2 rounded-lg bg-transparent border border-gray-600 w-[49%]">
        <p>Buy/Sell Fee</p>
        <p>0% / 0%</p>
      </div>
      <div className="text-center justify-between items-center text-sm font-medium mb-4 p-2 rounded-lg bg-transparent border border-gray-600 w-[49%]">
        <p>Liquidity</p>
        <p>$31,723</p>
      </div>

      {/* Total Supply and Market Cap */}
      <div className="text-center justify-between items-center text-sm font-medium mb-4 p-2 rounded-lg bg-transparent border border-gray-600 w-[49%]">
        <p>Total Supply</p>
        <p>1.0B</p>
      </div>
      <div className=" text-center justify-between items-center text-sm font-medium mb-4 p-2 rounded-lg bg-transparent border border-gray-600 w-[49%]">
        <p>Market Cap</p>
        <p>$388.3k</p>
      </div>

      </div>
    </div>
  );
};

export default CatsonCard;
