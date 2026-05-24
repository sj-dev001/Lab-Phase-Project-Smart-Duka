Seed generation pipeline for Smart Duka

Run:

1. Install dependencies for the seed package (from repo root):

```bash
cd seed
npm install
```

2. Generate products JSON:

```bash
npm run generate:products
```

3. Seed MongoDB:

```bash
npm run seed
```

Environment:
- Ensure root `.env` contains `MONGODB_URI` and other env vars used by the server.
