import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(savedWatchlist);
  }, []);

  const removeFromWatchlist = (coinId) => {
    const updatedWatchlist = watchlist.filter((coin) => coin.id !== coinId);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    setWatchlist(updatedWatchlist);
    alert("Coin removed from watchlist!");
  };

  return (
    <div className="container mx-auto p-4">
      {/* ✅ Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back to Main Page
      </button>

      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Symbol</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Market Cap</th>
                <th className="border px-4 py-2">24h % Change</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((coin) => (
                <tr
                  key={coin.id}
                  onClick={() => router.push(`/coin/${coin.id}`)} // ✅ Restored Click Handler!
                  className="cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <td className="border px-4 py-2">{coin.name}</td>
                  <td className="border px-4 py-2">{coin.symbol.toUpperCase()}</td>
                  <td className="border px-4 py-2">${coin.current_price}</td>
                  <td className="border px-4 py-2">${coin.market_cap.toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Prevent row click when removing
                        removeFromWatchlist(coin.id);
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
