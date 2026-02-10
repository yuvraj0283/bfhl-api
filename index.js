import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const EMAIL = "anshdeep1779.be23@chitkara.edu.in";

/* ======================
   HEALTH API
====================== */
app.get("/health", (req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: EMAIL,
  });
});

/* ======================
   HELPER FUNCTIONS
====================== */
function fibonacciSeries(n) {
  const result = [];
  let a = 0;
  let b = 1;

  for (let i = 0; i < n; i++) {
    result.push(a);
    const next = a + b;
    a = b;
    b = next;
  }

  return result;
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b || 1);
}

/* ======================
   BFHL API
====================== */
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body || {};
    const keys = Object.keys(body);

    // Must contain exactly one key
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one of fibonacci, prime, lcm, hcf, AI is required",
      });
    }

    const key = keys[0];

    /* -------- FIBONACCI CASE -------- */
    if (key === "fibonacci") {
      const n = body.fibonacci;

      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "fibonacci must be a non-negative integer",
        });
      }

      const data = fibonacciSeries(n);
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data,
      });
    }

    /* -------- PRIME CASE -------- */
    if (key === "prime") {
      const arr = body.prime;

      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "prime must be a non-empty array of integers",
        });
      }

      if (!arr.every((n) => Number.isInteger(n))) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "prime array must contain only integers",
        });
      }

      const primes = arr.filter(isPrime);
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: primes,
      });
    }

    /* -------- LCM CASE -------- */
    if (key === "lcm") {
      const arr = body.lcm;

      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "lcm must be a non-empty array of integers",
        });
      }

      if (!arr.every((n) => Number.isInteger(n))) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "lcm array must contain only integers",
        });
      }

      const value = arr.reduce((acc, n) => lcm(acc, n));
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: value,
      });
    }

    /* -------- HCF CASE -------- */
    if (key === "hcf") {
      const arr = body.hcf;

      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "hcf must be a non-empty array of integers",
        });
      }

      if (!arr.every((n) => Number.isInteger(n))) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "hcf array must contain only integers",
        });
      }

      const value = arr.reduce((acc, n) => gcd(acc, n));
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: value,
      });
    }

    /* -------- AI CASE -------- */
    if (key === "AI") {
      if (typeof body.AI !== "string" || !body.AI.trim()) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "AI must be a non-empty string",
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          is_success: false,
          official_email: EMAIL,
          error: "GEMINI_API_KEY not set",
        });
      }

      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

      const response = await axios.post(
        `${url}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text:
                    "Answer this question in ONE SINGLE WORD only, no punctuation:\n" +
                    body.AI,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const rawText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const answer = rawText.trim().split(/\s+/)[0]; 

      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: answer,
      });
    }

    
    return res.status(400).json({
      is_success: false,
      official_email: EMAIL,
      error: "Invalid key. Use fibonacci, prime, lcm, hcf, or AI",
    });
  } catch (error) {
    console.error("BFHL ERROR status:", error.response?.status);
    console.error("BFHL ERROR data:", error.response?.data);
    console.error("BFHL ERROR message:", error.message);

    return res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: "Internal server error",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});