const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const FormData = require('form-data');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/privacy-policy.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

app.get('/about-us.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'about-us.html'));
});

app.get('/terms-conditions.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms-conditions.html'));
});

app.get('/contact-us.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact-us.html'));
});

// Use tikwm.com API to get TikTok video info (no watermark, free)
async function fetchTikTokInfo(tiktokUrl) {
  const form = new FormData();
  form.append('url', tiktokUrl);
  form.append('count', 12);
  form.append('cursor', 0);

  const resp = await fetch('https://www.tikwm.com/api/', {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  const data = await resp.json();

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || 'Failed to fetch video info from TikTok');
  }

  return data.data;
}

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  if (!/tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i.test(url)) {
    return res.status(400).json({ error: 'Invalid TikTok URL. Please paste a valid TikTok video link.' });
  }

  try {
    console.log('Fetching info for:', url);
    const data = await fetchTikTokInfo(url);
    console.log('Got data:', JSON.stringify(data).substring(0, 200));

    const result = {
      title: data.title || 'TikTok Video',
      author: data.author?.unique_id || data.author?.nickname || '',
      thumbnail: data.cover || '',
      hdUrl: data.play || data.hdplay || '',
      mp3Url: data.music || '',
      duration: data.duration || 0
    };

    res.json(result);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to process video. Please check the URL and try again.' });
  }
});

// Proxy download to avoid CORS issues in browser
app.get('/api/proxy', async (req, res) => {
  const { url, filename } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tiktok.com/'
      },
      redirect: 'follow'
    });

    if (!resp.ok) {
      throw new Error('Upstream fetch failed: ' + resp.status);
    }

    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    const safeName = (filename || 'tiktok-download').replace(/[^a-zA-Z0-9_-]/g, '_');

    let ext = '.mp4';
    if (contentType.includes('audio')) ext = '.mp3';
    if (contentType.includes('image')) ext = '.jpg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}${ext}"`);
    resp.body.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// 500 handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).sendFile(path.join(__dirname, '500.html'));
});

app.listen(PORT, () => {
  console.log(`\n  TikTok Downloader running at http://localhost:${PORT}\n`);
});
