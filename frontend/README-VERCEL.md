## Vercel Deploy

This frontend is ready to deploy on Vercel as a Vite app.

Required Vercel settings:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variable:

- `VITE_API_BASE_URL=https://servicemart.alwaysdata.net`

Notes:

- If `VITE_API_BASE_URL` is not set, the app falls back to `https://servicemart.alwaysdata.net`.
