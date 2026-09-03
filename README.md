# LeadGen Giant

A lead generation dashboard that scrapes business data (name, phone, website, email, social links, and address) from Google Maps based on a niche, keyword, and location — then stores unique, deduplicated leads in Google Sheets for easy export.

## How it works

This is a frontend-only React app. The actual scraping and data pipeline runs entirely in an **n8n workflow**, which this app talks to over webhooks.

```
React Dashboard (this repo)
        |
        | POST /webhook/scrape-leads  { niche, keyword, country, state, city }
        v
   n8n Workflow
        |
        +--> Apify (Google Maps Scraper actor) — pulls business listings
        +--> Website crawl — extracts email + social links per business
        +--> Deduplication — checks placeId against existing Google Sheet rows
        +--> Google Sheets — stores Jobs (status tracking) and Leads (results)
        |
        v
React Dashboard polls GET /webhook/job-status?jobId=xxx
        |
        v
Displays results, offers CSV / XLSX export
```

The React app never talks to Apify or Google Sheets directly — everything goes through the two n8n webhook endpoints.

## Features

- Search leads by **niche, keyword, country, state, and city**
- Real-time job progress (Queued → Scraping → Done)
- Automatic deduplication — a business already in the sheet won't be added twice
- Extracted fields: business name, category, phone, website, email, social links, zip code, address
- Job history with per-job stats (total found / new leads / duplicates)
- Export results as CSV or XLSX

## Tech stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend/automation**: n8n (self-hosted or n8n.cloud workflow, not included in this repo)
- **Data source**: Apify's Google Maps Scraper actor
- **Storage**: Google Sheets (Jobs tab + Leads tab)

## Getting started

### Prerequisites

- Node.js and npm installed
- A running n8n workflow with two published webhooks:
  - `POST /webhook/scrape-leads` — starts a scrape job
  - `GET /webhook/job-status?jobId=...` — returns job status and results

### Installation

```bash
git clone https://github.com/Irfan-CodeSynth/Ai-lead-generations-giant-tool.git
cd Ai-lead-generations-giant-tool
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
VITE_N8N_SCRAPE_WEBHOOK=https://your-n8n-instance.app.n8n.cloud/webhook/scrape-leads
VITE_N8N_STATUS_WEBHOOK=https://your-n8n-instance.app.n8n.cloud/webhook/job-status
```

`.env` is excluded from version control via `.gitignore` — never commit real webhook URLs or credentials.

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

## Project structure

```
src/
  components/     # ScrapeForm, JobProgress, LeadsTable, JobHistoryPanel, etc.
  hooks/          # useJobPolling and other custom hooks
  ...
index.html
package.json
vite.config.js
tailwind.config.js
```

## n8n workflow

The n8n workflow this app depends on is not part of this repository (n8n workflows live on your n8n instance, not in git). At a high level it:

1. Receives the scrape request via webhook
2. Calls the Apify Google Maps Scraper actor and polls until the run completes
3. Fetches the resulting dataset
4. For each business, checks Google Sheets for an existing row with the same `placeId` to avoid duplicates
5. Enriches new leads by crawling their website for an email and social links
6. Appends new leads to the Leads sheet, tagged with the originating `jobId`
7. Updates job status in the Jobs sheet so the frontend can poll for progress

