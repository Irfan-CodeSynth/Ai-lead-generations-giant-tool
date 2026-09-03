export async function startScrapeJob(formData) {
  const url = 'https://leadgen-systm.app.n8n.cloud/webhook/scrape-leads';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      niche: formData.niche,
      keyword: formData.keyword,
      country: formData.country,
      state: formData.state,
      city: formData.city,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start job: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    throw new Error('Received empty response when starting job');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON received: ${text.slice(0, 100)}`);
  }
}

export async function fetchJobStatus(jobId) {
  const url = `https://leadgen-systm.app.n8n.cloud/webhook/job-status?jobId=${encodeURIComponent(jobId)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch job status: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    // If n8n returns an empty body during interim execution, don't crash the UI — return scraping status
    return { status: 'scraping', totalFound: 0, newLeads: 0, duplicates: 0, leads: [] };
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON received from job status: ${text.slice(0, 100)}`);
  }
}
