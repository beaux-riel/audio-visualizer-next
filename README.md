# Audio Visualizer Next

[![CI](https://github.com/beaux-riel/audio-visualizer-next/actions/workflows/ci.yml/badge.svg)](https://github.com/beaux-riel/audio-visualizer-next/actions/workflows/ci.yml)
[![Deploy](https://github.com/beaux-riel/audio-visualizer-next/actions/workflows/deploy.yml/badge.svg)](https://github.com/beaux-riel/audio-visualizer-next/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/beaux-riel/audio-visualizer-next/branch/main/graph/badge.svg)](https://codecov.io/gh/beaux-riel/audio-visualizer-next)

🚀 **Live Demo**: [beaux-riel.github.io/audio-visualizer-next](https://beaux-riel.github.io/audio-visualizer-next)

Audio Visualizer Next is a dynamic web application designed to visualize audio input in real-time using advanced audio processing techniques. Leveraging [Next.js](https://nextjs.org) and modern web technologies, it ensures optimal performance and smooth visualization.

![Screenshot/GIF](https://your-image-url.com)

## Tech Stack

- **Framework**: Next.js
- **Languages**: TypeScript, JavaScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

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

This project is configured for deployment on GitHub Pages with the following setup:

- **Build Command**: `pnpm run build`
- **Output Directory**: `out`
- **Install Command**: `pnpm install`
- **Framework**: Next.js (Static Export)

The deployment is automated using GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

### Deploy on GitHub Pages

1. Enable GitHub Pages in your repository settings
2. Set the source to "GitHub Actions"
3. Every push to the main/master branch triggers automatic deployment via GitHub Actions
4. The site will be available at `https://[username].github.io/[repository-name]`

The deployment uses Next.js static export feature to generate a static site compatible with GitHub Pages.

📋 **Detailed Setup Instructions**: See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) for step-by-step setup guide.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
