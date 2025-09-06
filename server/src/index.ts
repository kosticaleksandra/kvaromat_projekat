import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

// Health-check (test ruta)
app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true, service: "api", time: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

app.get("/api/v1/faults", (_req, res) => {
  res.json([
    { id: 1, title: "Pokvaren lift", status: "open" },
    { id: 2, title: "Prokišnjava krov", status: "in_progress" }
  ]);
});

