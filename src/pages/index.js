import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [marketCapRange, setMarketCapRange] = useState([0, Infinity]);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const router = useRouter();


  useEffect(() => {
    const darkMode = JSON.parse(localStorage.getItem("darkMode")) ?? false;
    setIsDarkMode(darkMode);
  }, []);


  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };


  const addToWatchlist = (coin) => {
    const existingWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!existingWatchlist.some(item => item.id === coin.id)) {
      const updatedWatchlist = [...existingWatchlist, coin];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      alert(`${coin.name} added to your watchlist!`);
    } else {
      alert(`${coin.name} is already in your watchlist.`);
    }
  };


  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: page,
            sparkline: false,
          },
        });
        setCoins(res.data);
        setFilteredCoins(res.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setCoins([]);
        setFilteredCoins([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);


  useEffect(() => {
    let result = [...coins];


    
    if (search) {
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }


    result = result.filter(
      (coin) =>
        coin.market_cap >= marketCapRange[0] &&
        coin.market_cap <= marketCapRange[1]
    );


    if (sortBy === "gainers") {
      result.sort(
        (a, b) =>
          (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
      );
    } else if (sortBy === "losers") {
      result.sort(
        (a, b) =>
          (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)
      );
    }

    setFilteredCoins(result);
  }, [search, marketCapRange, sortBy, coins]);


  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <Head>
        <title>Crypto Dashboard | Modern Tracker</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Crypto Dashboard
          </h1>
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button
  onClick={() => router.push('/watchlist')}
  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
>
  My Watchlist
</button>

        </header>

        {}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded border"
          />
          <input
            type="number"
            placeholder="Min Market Cap"
            onChange={(e) =>
              setMarketCapRange([Number(e.target.value), marketCapRange[1]])
            }
            className="p-3 rounded border w-1/3"
          />
          <input
            type="number"
            placeholder="Max Market Cap"
            onChange={(e) =>
              setMarketCapRange([marketCapRange[0], Number(e.target.value)])
            }
            className="p-3 rounded border w-1/3"
          />
        </div>

        {}
        <div className="flex gap-4 mb-4">
          {["default", "gainers", "losers"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              className={`px-4 py-2 rounded transition ${
                sortBy === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {type === "default" ? "Default" : type === "gainers" ? "Top Gainers" : "Top Losers"}
            </button>
          ))}
        </div>

        {}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th>Coin</th>
                <th>Price</th>
                <th>Market Cap</th>
                <th>24h Change</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
             <tr
             key={coin.id}
             className={`cursor-pointer transition ${
               isDarkMode
                 ? "hover:bg-gray-700" 
                 : "hover:bg-gray-100"
             }`}
             onClick={() => router.push(`/coin/${coin.id}`)}
           >
           
                  <td>
                    <img src={coin.image} alt={coin.name} className="h-6 w-6 inline mr-2" />
                    {coin.name}
                  </td>
                  <td>${coin.current_price.toFixed(2)}</td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td
                    className={`${
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWatchlist(coin);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      + Watchlist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {}
        <div className="flex justify-center mt-4 gap-4">
  <button
    onClick={() => handlePageChange(page - 1)}
    disabled={page === 1}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    Previous
  </button>
  <button
    onClick={() => handlePageChange(page + 1)}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
  >
    Next
  </button>
</div>

      </div>
    </div>
  );
}
