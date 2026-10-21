Catalogue image and API loading fix

Copy each supplied file over the corresponding path in your existing frontend or Django backend project. Build/deploy the Next.js frontend AND redeploy Django. Keep the original project configuration, image assets, and all other source files.

Frontend: the five homepage carousels share one in-flight full-catalogue request and filter locally; cache expires after two minutes, failed requests can be retried. Product cards below the initial viewport load images lazily with low priority. Hero and videos are unchanged.

Backend: reads and parses Google Sheets at most once per two minutes per process. Concurrent requests on the same process share one read. If a refresh fails, the last good catalogue is used for up to an hour. Known /wineboxes/ image URL aliases are corrected to /wine-boxes/ in API output.

Operational limits: Django's default local-memory cache is per process; multiple worker processes can each read Sheets. This does not diagnose Render's earlier memory-limit restart. If the API process is down, a fresh browser session cannot load products. Broken images whose URLs already match the frontend files need deployed-file verification. Correct Image 1-3 cells in Google Sheets for permanent consistency.

Focused checks performed: JavaScript shared-request and filtering behavior; Python URL mapping, cache reuse, stale-data fallback, syntax; matching WebP files present in provided frontend archive. No live hosting credentials or logs were provided.
