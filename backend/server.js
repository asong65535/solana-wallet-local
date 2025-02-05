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

// Solana wallet connection
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const publicKey = new PublicKey("GnmB9DGN28r38xQVBjDoJ8N5xaznAEL5dmZ9RVRjysCD");

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
const binanceWS = new ws("wss://stream.binance.com:9443/ws/solusdt@kline_1m");

binanceWS.on("message", (event) => {
  try {
    const data = JSON.parse(event);
    const open = parseFloat(data.k.o);
    const close = parseFloat(data.k.c);
    const high = parseFloat(data.k.h);
    const low = parseFloat(data.k.l);

    // Calculate average price (no rounding)
    latestPrice = Math.trunc(((open + close + high + low) / 4) * 100) / 100;
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
}, 5000); // Update every 60 seconds

// Handle WebSocket connections from frontend
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send the latest data immediately upon connection
  ws.send(JSON.stringify({ balance: latestBalance, price: latestPrice }));

  ws.on("close", () => console.log("Client disconnected"));
});
