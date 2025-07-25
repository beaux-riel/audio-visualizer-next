# Audio Visualizer Next

[![CI](https://github.com/beaux-riel/audio-visualizer-next/actions/workflows/ci.yml/badge.svg)](https://github.com/beaux-riel/audio-visualizer-next/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/beaux-riel/audio-visualizer-next/branch/main/graph/badge.svg)](https://codecov.io/gh/beaux-riel/audio-visualizer-next)

🚀 **Live Demo**: [audio-visualizer-next.vercel.app](https://audio-visualizer-next.vercel.app)

Audio Visualizer Next is a dynamic web application designed to visualize audio input in real-time using advanced audio processing techniques. Leveraging [Next.js](https://nextjs.org) and modern web technologies, it ensures optimal performance and smooth visualization.

![Screenshot/GIF](https://your-image-url.com)

## Tech Stack

- **Framework**: Next.js
- **Languages**: TypeScript, JavaScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Local Development

To start local development, you'll need to run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The app will automatically reload if you change any of the source files.

### Development Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/beaux-riel/audio-visualizer-next.git
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Launch the development server:

   ```bash
   pnpm dev
   ```

4. Navigate to [http://localhost:3000](http://localhost:3000).

### Testing

To run tests:

- **Unit and Integration Tests**: `pnpm test`
- **End-to-End Tests**: `pnpm exec playwright test`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production Deployment

This project is configured for zero-config deployment on Vercel with the following setup:

- **Build Command**: `pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Framework**: Next.js

The deployment configuration is defined in `vercel.json` for optimal performance and build settings.

### Deploy on Vercel

1. Connect your GitHub repository to Vercel
2. The build settings are automatically configured via `vercel.json`
3. Every push to the main branch triggers automatic deployment
4. Pull requests create preview deployments

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
