import express from "express";
import { WebSocketServer, WebSocket as ws } from "ws"; // Import ws for Node.js WebSockets
import cors from "cors";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const app = express();
app.use(cors()); // Allow frontend requests

const server = app.listen(3001, () => console.log("Server running on port 3001"));

// WebSocket server setup
const wss = new WebSocketServer({ server });

let latestPrice = null;
let latestBalance = null;

// Solana API Key
const solanaKey = "";

// Solana wallet connection
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const publicKey = new PublicKey(solanaKey);

// Function to fetch wallet balance
async function fetchBalance() {
  try {
    const balance = await connection.getBalance(publicKey);
    latestBalance = balance / 1e9; // Convert lamports to SOL
    console.log("Updated Balance:", latestBalance);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

// WebSocket client connection to Binance (using `ws` package)
const binanceWS = new ws("wss://data-stream.binance.vision/ws/solusdt@kline_1s");

binanceWS.on("message", (event) => {
  try {
    const data = JSON.parse(event);
    const open = parseFloat(data.k.o);
    const close = parseFloat(data.k.c);

    // Calculate average price (no rounding)
    latestPrice = Math.trunc(((open + close) / 2) * 100) / 100;
    console.log("Updated Price:", latestPrice);
  } catch (error) {
    console.error("Error parsing WebSocket data:", error);
  }
});

// Broadcast balance and price updates to all WebSocket clients
setInterval(async () => {
  await fetchBalance(); // Refresh balance every minute
  const data = JSON.stringify({ balance: latestBalance, price: latestPrice });
  wss.clients.forEach(client => client.readyState === 1 && client.send(data));
}, 1000); // Update every second

// Handle WebSocket connections from frontend
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send the latest data immediately upon connection
  ws.send(JSON.stringify({ balance: latestBalance, price: latestPrice }));

  ws.on("close", () => console.log("Client disconnected"));
});
