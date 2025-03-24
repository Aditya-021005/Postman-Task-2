import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CoinDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartDays, setChartDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchCoinData() {
        setLoading(true);
        try {

          const res = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}`
          );
          setCoinData(res.data);

          const chartRes = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
            {
              params: {
                vs_currency: 'usd',
                days: chartDays
              }
            }
          );


          setChartData({
            labels: chartRes.data.prices.map(price =>
              new Date(price[0]).toLocaleDateString()
            ),
            datasets: [
              {
                label: 'Price (USD)',
                data: chartRes.data.prices.map(price => price[1]),
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2
              }
            ]
          });
        } catch (error) {
          console.error('Error fetching coin data:', error);
          setCoinData(null);
          setChartData(null);
        } finally {
          setLoading(false);
        }
      }

      fetchCoinData();
    }
  }, [id, chartDays]);

  if (loading) {
    return <div className="text-center mt-10">Loading data...</div>;
  }

  if (!coinData) {
    return <div className="text-center mt-10 text-red-500">Failed to load data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {}
      <button
        onClick={() => router.push('/')}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back
      </button>

      {}
      <h1 className="text-2xl font-bold mb-4">
        {coinData.name} ({coinData.symbol.toUpperCase()})
      </h1>
      <p>{coinData.description?.en?.slice(0, 200)}...</p>
      <p>Market Rank: {coinData.market_cap_rank}</p>
      <p>24h High: ${coinData.market_data?.high_24h?.usd}</p>
      <p>24h Low: ${coinData.market_data?.low_24h?.usd}</p>

      {}
      <div className="flex space-x-4 my-4">
        <button
          onClick={() => setChartDays(7)}
          className={`px-4 py-2 ${
            chartDays === 7 ? 'bg-blue-500 text-white' : 'bg-gray-200'
          } rounded`}
        >
          7 Days
        </button>
        <button
          onClick={() => setChartDays(30)}
          className={`px-4 py-2 ${
            chartDays === 30 ? 'bg-blue-500 text-white' : 'bg-gray-200'
          } rounded`}
        >
          30 Days
        </button>
        <button
          onClick={() => setChartDays(90)}
          className={`px-4 py-2 ${
            chartDays === 90 ? 'bg-blue-500 text-white' : 'bg-gray-200'
          } rounded`}
        >
          90 Days
        </button>
      </div>

      {}
      {chartData ? (
 <div className="mb-6 bg-[#1e1e1e] p-4 rounded-lg shadow-md">
 <h2 className="text-lg font-bold mb-2">Price Trend</h2>
 <Line data={chartData} />
</div>

      ) : (
        <div className="text-center text-gray-500">No chart data available.</div>
      )}

      {}
      <div className="mt-6">
        <p><strong>Total Supply:</strong> {coinData.market_data?.total_supply?.toLocaleString() || 'N/A'}</p>
        <p><strong>Circulating Supply:</strong> {coinData.market_data?.circulating_supply?.toLocaleString() || 'N/A'}</p>
        <p><strong>Market Cap:</strong> ${coinData.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}</p>
      </div>
    </div>
  );
}
