import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Allow local dev origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const reviewFile = path.join(process.cwd(), 'public', 'review.json');

async function readReviews() {
  try {
    const raw = await fs.readFile(reviewFile, 'utf-8');
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (err) {
    return [];
  }
}

app.get('/api/reviews', async (req, res) => {
  const arr = await readReviews();
  res.json(arr);
});

app.post('/api/reviews', async (req, res) => {
  const review = req.body;
  if (!review || !review.id) return res.status(400).json({ error: 'invalid' });

  try {
    const arr = await readReviews();
    // prevent duplicates by id
    const exists = arr.find((r) => r.id === review.id);
    if (!exists) arr.unshift(review);
    await fs.writeFile(reviewFile, JSON.stringify(arr, null, 2), 'utf-8');
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
