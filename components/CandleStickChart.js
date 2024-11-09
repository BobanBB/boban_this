import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactApexChart without SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CandlestickChart = () => {
  const [theme, setTheme] = useState('dark'); // Default theme is dark

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Sample data for the candlestick chart
  const series = [
    {
      data: [
        { x: new Date('2023-10-01'), y: [0.00037, 0.00040, 0.00035, 0.00038] },
        { x: new Date('2023-10-02'), y: [0.00038, 0.00042, 0.00037, 0.00040] },
        { x: new Date('2023-10-03'), y: [0.00040, 0.00043, 0.00039, 0.00041] },
        { x: new Date('2023-10-04'), y: [0.00041, 0.00044, 0.00038, 0.00042] },
        { x: new Date('2023-10-05'), y: [0.00042, 0.00045, 0.00040, 0.00043] },
        { x: new Date('2023-10-06'), y: [0.00043, 0.00046, 0.00041, 0.00044] },
        { x: new Date('2023-10-07'), y: [0.00044, 0.00047, 0.00042, 0.00046] },
        { x: new Date('2023-10-08'), y: [0.00046, 0.00050, 0.00045, 0.00048] },
        { x: new Date('2023-10-09'), y: [0.00048, 0.00051, 0.00046, 0.00049] },
        { x: new Date('2023-10-10'), y: [0.00049, 0.00052, 0.00047, 0.00050] },
        { x: new Date('2023-10-11'), y: [0.00050, 0.00053, 0.00048, 0.00051] },
        { x: new Date('2023-10-12'), y: [0.00051, 0.00054, 0.00049, 0.00052] },
        { x: new Date('2023-10-13'), y: [0.00052, 0.00055, 0.00050, 0.00053] },
      ],
    },
  ];

  // ApexCharts configuration for the candlestick chart
  const options = {
    chart: {
      type: 'candlestick',
      background: theme === 'dark' ? '#131722' : '#FFFFFF',
      foreColor: theme === 'dark' ? '#d1d4dc' : '#000000',
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    theme: {
      mode: theme,
    },
    grid: {
      borderColor: theme === 'dark' ? '#2A2E39' : '#e0e0e0',
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: theme === 'dark' ? '#4CAF50' : '#00ff00',
          downward: theme === 'dark' ? '#FF5252' : '#ff0000',
        },
        wick: {
          useFillColor: true,
        },
      },
    },
  };

  return (
    <div className="overflow-hidden">
      <h1>Candlestick Chart with Theme Toggle</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
      <div className="bg-transparent" style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
        <ReactApexChart options={options} series={series} type="candlestick" height={400} />
      </div>
    </div>
  );
};

export default CandlestickChart;
