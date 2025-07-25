# GitHub Pages Setup Instructions

To enable GitHub Pages deployment for this repository, follow these steps:

## 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")

## 2. Push Changes

The GitHub Actions workflow will automatically trigger when you push to the `master` or `main` branch.

## 3. Access Your Site

Once the workflow completes successfully, your site will be available at:
`https://beaux-riel.github.io/audio-visualizer-next`

## 4. Monitor Deployment

- Check the **Actions** tab in your repository to monitor the deployment progress
- The workflow includes both build and deploy jobs
- Any errors will be displayed in the workflow logs

## Troubleshooting

If you see the repository README instead of the app:

- Ensure GitHub Pages source is set to "GitHub Actions" (not "Deploy from a branch")
- Check that the workflow has completed successfully in the Actions tab
- Wait a few minutes for DNS propagation after the first deployment

## Workflow Details

The deployment workflow:

- Triggers on pushes to `master` or `main` branches
- Builds the Next.js app as a static export
- Deploys the built files to GitHub Pages
- Uses the `out` directory as the deployment source
