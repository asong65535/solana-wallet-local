import express from "express";
import cors from "cors";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const app = express();
app.use(cors()); // Allow frontend requests

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const publicKey = new PublicKey("GnmB9DGN28r38xQVBjDoJ8N5xaznAEL5dmZ9RVRjysCD");

app.get("/balance", async (req, res) => {
  try {
    const balance = await connection.getBalance(publicKey);
    res.json({ balance: balance / 1e9 }); // Convert lamports to SOL
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
