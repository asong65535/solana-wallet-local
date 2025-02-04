"use client";

import { useState, useEffect } from "react";

export default function Balance() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await fetch("http://192.168.0.160:49271/balance");
        const data = await response.json();
        setBalance(data.balance);
      } catch (err) {
        setError("Error fetching balance");
      }
    }

    fetchBalance();
  }, []);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-slate-600 text-xl font-bold">
        Solana Wallet Balance
      </h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-500">
          {balance !== null ? `${balance} SOL` : "Fetching balance..."}
        </p>
      )}
    </div>
  );
}
