"use client";

import { useState, useEffect } from "react";

export default function Balance() {
  const [balance, setBalance] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.160:44271");
    //const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setBalance(data.balance);
        setPrice(data.price);
      } catch (err) {
        setError("Error receiving data");
      }
    };

    ws.onerror = () => setError("WebSocket connection error");
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  return (
      <div className="p-4 border rounded shadow">
        <h2 className="text-slate-300 text-3xl font-bold">
          Solana Wallet Balance
        </h2>
        {error ? (
            <p className="text-red-500 text-2xl text-center">{error}</p>
        ) : (
            <>
              <p className="text-green-500 text-2xl text-center">
                {balance !== null ? `${balance} SOL` : "Fetching balance..."}
              </p>
              <p className="text-green-500 text-2xl text-center">
                {price !== null && balance !== null
                    ? `${Math.trunc(price * balance * 100) / 100} USD`
                    : "Fetching price..."}
              </p>
            </>
        )}
      </div>
  );
}
