# TikTok Downloader - Project Progress

## Overview

A responsive, modern TikTok downloader landing page with a Node.js backend that extracts and proxies video downloads without watermarks. Uses the free [tikwm.com](https://www.tikwm.com) API for video extraction.

---

## Tech Stack

- **Frontend:** HTML, Tailwind CSS (CDN), Vanilla JavaScript
- **Backend:** Node.js, Express, node-fetch, form-data
- **API:** tikwm.com (free, no key required)
- **Hosting target:** Render.com (free tier)

---

## Project Structure

```
Tiktok downloader/
├── index.html              # Landing page (Tailwind CSS + vanilla JS)
├── server.js               # Express backend (API + proxy)
├── package.json            # Dependencies
├── package-lock.json       # Locked dependency versions
├── robots.txt              # Crawler rules for search engines
├── sitemap.xml             # XML sitemap for Google indexing
├── Tiktok downloader icon.jpg  # Favicon and logo icon
├── node_modules/           # Auto-generated
├── .gitignore              # Git ignore rules
└── TikTok-Downloader.md    # This file
```

---

## Features

### Frontend (`index.html`)
- Dark gradient glassmorphism UI with TikTok pink/cyan accents
- Centered URL input card with **Paste** and **Download** buttons
- Loading spinner during fetch
- Results card with **Download HD (No Watermark)** and **Download MP3** buttons
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Favicon and apple-touch-icon from custom icon file
- Logo uses custom icon with rounded corners
- Downloads saved with original video title as filename
- SEO-optimized:
  - Meta tags (title, description, keywords)
  - Open Graph + Twitter Card tags
  - JSON-LD structured data (WebApplication + FAQPage)
  - robots.txt for crawler rules
  - sitemap.xml for Google indexing
  - FAQ section (9 items) targeting keywords: "tiktok downloader no watermark", "tiktok downloader without watermark", "tiktok downloader hd", "tiktok downloader mp3"
  - Dedicated HD content section targeting "tiktok downloader hd"
  - Dedicated MP3 content section targeting "tiktok downloader mp3"
  - Semantic HTML with `how-it-works`, `features`, `faq` sections
- Enter key support on input field
- Proxy-based downloads (avoids CORS issues)

### Backend (`server.js`)
- `POST /api/download` — Extracts video info via tikwm.com API
- `GET /api/proxy` — Proxies video/audio files to browser (avoids CORS)
- Input validation for TikTok URLs
- Serves `index.html` at root

---

## How It Works

1. User pastes TikTok URL into input field
2. Frontend sends `POST /api/download` with the URL
3. Backend calls tikwm.com API to get video metadata (title, author, thumbnail, HD link, music link)
4. Results card appears with download buttons
5. On click, frontend calls `GET /api/proxy?url=...&filename=...`
6. Backend fetches the file from TikTok CDN and pipes it to the user's browser

---

## Setup & Run Locally

```bash
cd "Tiktok downloader"
npm install
node server.js
```

Open `http://localhost:3000` in your browser.

**Live:** https://tiktok-downloader-17i6.onrender.com/

---

## Deployment (Render.com)

### Prerequisites
- GitHub account + repo
- Render account (free)

### Steps

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USER/tiktok-downloader.git
   git branch -M main
   git push -u origin main
   ```

2. **On Render:**
   - Click **New > Web Service**
   - Connect your GitHub repo
   - Settings:
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
     - **Port:** `3000`
     - **Instance Type:** Free
   - Click **Create Web Service**

3. **Keep alive (optional):**
   - Use [keepalive.dashdashhard.com](https://keepalive.dashdashhard.com) to ping your service every 10 min
   - Prevents free tier from sleeping after 15 min idle

### Render Free Tier Limits

| Feature | Limit |
|---|---|
| Bandwidth | 100 GB/month |
| RAM | 512 MB |
| CPU | 0.1 |
| Build minutes | 500/month |
| Idle timeout | 15 minutes (cold start: 30-60s) |

---

## API Reference

### `POST /api/download`

**Request:**
```json
{ "url": "https://www.tiktok.com/@user/video/1234567890" }
```

**Response:**
```json
{
  "title": "Video caption text",
  "author": "username",
  "thumbnail": "https://...",
  "hdUrl": "https://...",
  "mp3Url": "https://...",
  "duration": 15
}
```

### `GET /api/proxy?url=VIDEO_URL&filename=NAME`

Proxies the file and serves it as a download attachment.

---

## Current Status

- [x] Landing page built with Tailwind CSS
- [x] Backend server with Express
- [x] Video extraction via tikwm.com API
- [x] Proxy endpoint for CORS-free downloads
- [x] Loading states and error handling
- [x] SEO meta tags and structured data
- [x] Local testing verified working
- [x] Push to GitHub
- [x] Deploy to Render.com
- [x] Favicon and logo with custom icon
- [x] Download filenames use original video title
- [x] Fixed download arrow icon direction
- [x] robots.txt and sitemap.xml
- [x] HD and MP3 dedicated SEO content sections
- [x] FAQ structured data for rich snippets
- [x] 9 FAQ items covering all target keywords
- [x] UptimeRobot keepalive configured
- [ ] Custom domain (optional)

---

## Notes

- The tikwm.com API is free and requires no API key
- TikTok video URLs from the API expire after some time — downloads must happen promptly
- MP3 extraction depends on tikwm.com providing the `music` field in their response
- Free tier on Render spins down after 15 min — use a keepalive ping for always-on
- UptimeRobot configured to ping every 5 minutes to prevent sleep
- Target keywords: "tiktok downloader" (100K+), "tiktok downloader hd", "tiktok downloader no watermark", "tiktok downloader without watermark", "tiktok downloader mp3"
- Submit sitemap to Google Search Console for faster indexing
