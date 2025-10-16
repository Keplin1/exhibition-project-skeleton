# Exhibition Curator

[![Netlify Status](https://api.netlify.com/api/v1/badges/75ca7761-196c-4ffd-a644-55cb0a7a848b/deploy-status)](https://app.netlify.com/projects/exhibition-curator-northcoders/deploys)

A web application for searching and curating artworks from museum collections.

## Features

- Search artworks from Cleveland Museum of Art and Victoria & Albert Museum
- Curate your own collection
- View detailed artwork information
- Responsive design

## API Proxy Setup

This app uses museum APIs that don't support CORS. To handle this:

- **Development**: Vite dev server proxy (configured in `vite.config.js`)
- **Production**: Netlify serverless functions (in `netlify/functions/`)

## Getting Started

Follow these steps to run the project locally:

1. **Download the repository**

   ```bash
   git clone git@github.com:Keplin1/exhibition-project-skeleton.git
   cd exhibition-project-skeleton
   ```
 
2. **Download the dependencies**

   ```bash
   npm i
   ```

3. **Run the development server**
 
   ```bash
   npm run dev
   ```

4. **View the website** 

   Open your browser and go to the URL shown in the terminal (usually http://localhost:5173)

## Deployment

The app is configured for Netlify deployment:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically detect the configuration from `netlify.toml`
4. The serverless functions will handle API requests in production

## Maintenance & Development

For detailed information on maintaining and updating this project, see [MAINTENANCE.md](./MAINTENANCE.md).

Topics covered:
- Running and writing tests
- Adding new museum APIs
- Handling CORS issues
- Deploying updates
- Troubleshooting common issues
