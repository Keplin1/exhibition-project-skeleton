# Exhibition Curator

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
   git clone <repository-url>
   cd <project-folder>
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
