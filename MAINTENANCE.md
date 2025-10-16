# Project Maintenance & Update Guide

This guide provides detailed instructions for maintaining and updating the Exhibition Curator Project.

## Table of Contents
- [Running Tests](#running-tests)
- [Adding a New Museum API](#adding-a-new-museum-api)
- [Handling CORS Issues](#handling-cors-issues)
- [Deploying & Hosting](#deploying--hosting)
- [Common Troubleshooting](#common-troubleshooting)

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx playwright test tests/homepage-elements.spec.js
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### View Test Report
```bash
npx playwright show-report
```

### Writing New Tests
- Add test files in the `tests/` directory
- Use Playwright's API for browser automation
- Test keyboard navigation using actual `Tab` key presses:
  ```javascript
  await page.keyboard.press('Tab');
  ```
- Use `.first()` when multiple elements match to avoid strict mode violations
- Always test accessibility features (keyboard navigation, ARIA roles)

#### Notes:
While the the Cleveland Museum API is very good, it is also very tempremental.

During development, this API underwent changes which meant this project had to be adapted.

The tests around the Cleveland Museum API are a little flaky, as the API itself is sometimes unreliable. 
The API response can take a while to load, which sometimes causes tests to fail.

You may need to rerun the tests, with additional timeouts in order to assert correctly.

---

## Adding a New Museum API

### 1. Create API Client in `src/API.js`

Add a new Axios instance for the API:

```javascript
const isDevelopment = import.meta.env.DEV;
// ...
const newMuseumApi = axios.create({
  baseURL: isDevelopment 
    ? '/api/newmuseum' 
    : '/.netlify/functions/newmuseum-api'
});
```

**Important:** Do NOT include trailing slashes in `baseURL` to avoid path issues.

### 2. Add Data Normalisation Function

Create a function to normalise the API response to match your app's expected format:

```javascript
export const fetchNewMuseumArtworks = async (query, page = 1) => {
  try {
    const response = await newMuseumApi.get('/artworks', {
      params: { q: query, page }
    });
    
    // Normalise to your app's format
    return response.data.results.map(item => ({
      id: item.objectId,
      title: item.objectName,
      artist: item.artist || 'Unknown',
      imageUrl: item.primaryImage,
      // ...other fields
    }));
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return [];
  }
};
```

### 3. Handle CORS (See Next Section)

### 4. Update UI Components

Integrate the new API in components like `ContentList.jsx`:

```javascript
import { fetchNewMuseumArtworks } from './API';

// In your component
const loadNewMuseumData = async () => {
  const artworks = await fetchNewMuseumArtworks(searchTerm, currentPage);
  setItems(prevItems => [...prevItems, ...artworks]);
};
```

---

## Handling CORS Issues

### Development Environment

**Option 1: Vite Proxy (Recommended)**

Add a proxy configuration in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api/newmuseum': {
        target: 'https://api.newmuseum.org/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/newmuseum/, ''),
    }
  }
});
```

**Option 2: Direct API Calls (if API supports CORS)**

If the API has proper CORS headers, you can call it directly:

```javascript
baseURL: 'https://api.newmuseum.org/v1'
```

### Production Environment (Netlify)

**Create a Serverless Function**

1. Create `netlify/functions/newmuseum-api.js`:

```javascript
const axios = require('axios');

const BASE_URL = 'https://api.newmuseum.org/v1';

exports.handler = async (event, context) => {
  // Get the path after the function name
  const path = event.path.replace('/.netlify/functions/newmuseum-api', '');
  
  try {
    const response = await axios({
      method: event.httpMethod,
      url: `${BASE_URL}${path}`,
      params: event.queryStringParameters,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

2. The function will automatically be deployed with your site.

### When to Use Each Approach

- **No CORS issues:** Call API directly (like V&A Museum API)
- **CORS issues:** 
  - Development: Use Vite proxy
  - Production: Use Netlify serverless function

---

## Deploying & Hosting

### Netlify Auto-Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Netlify automatically deploys** when you push to the main branch.

### Deploy via Netlify UI

Netlify offers the option to automatically publish a new version of the application when new changes are merged to the repository.

To achieve this, you simply have to log in with your GitHub account and create a project from your GitHub repository.

Under 'Build & Deploy settings' -> 'Build Settings', ensure the `build` command is set to;
```
npm run build
```

your 'publish directory' is set to;
```
dist
```

and your 'production branch' is set to `main` (or `master`, depending on your repository settings).

You should also enable the 'Any pull request against your production branch / branch deploy branches' setting to ensure you automatically deploy the latest changes when you merge changes into your `main` branch.

### Manual Deploy via Netlify CLI
```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

If you need to add API keys or other secrets:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add your variables (e.g., `API_KEY=your_key_here`)
3. Access them in serverless functions via `process.env.API_KEY`

### Build Configuration

The build settings are defined in `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

---

## Common Troubleshooting

### Duplicate Artworks in Infinite Scroll

**Symptom:** Same artworks appear multiple times when scrolling.

**Solution:** The duplicate detection in `ContentList.jsx` should handle this:

```javascript
const existingIds = new Set([...items, ...collection].map(item => item.id));
const uniqueNewArtworks = artworks.filter(artwork => !existingIds.has(artwork.id));
```

If duplicates still appear, check if the API is returning different IDs for the same artwork.

### API 404 Errors

**Symptom:** API calls return 404 Not Found.

**Common Causes:**
1. Trailing slashes in `baseURL` - remove them if they are there.
2. Incorrect path rewriting in proxy/ serverless function
3. API endpoint changed

**Debug Steps:**
1. Check browser Network tab to see the actual URL being called
2. Verify the API endpoint in the API documentation
3. Test the API directly with your browser, curl or Postman

### Tests Failing with "Multiple Elements Found"

Playwright error about strict mode violation.

**Solution:** Use `.first()` to select the first matching element:

```javascript
await page.getByRole('button', { name: 'Add to Collection' }).first().click();
```

### Keyboard Navigation Not Working

**Checklist:**
1. Element has `role="button"` (if it's not a native button)
2. Element has `tabIndex={0}` (to make it focusable)
3. Element has `onKeyDown` handler for Enter and Space keys
4. Tests actually press Tab key, not just call `.focus()`

### Scroll-to-Top Button Overlapping Elements

**Solution:** The button dynamically adjusts its position based on collection bar visibility:

```javascript
<div className={selectedItems.length > 0 ? 'bottom-24' : 'bottom-8'}>
```

---

## Dependency Updates

### Check for Updates
```bash
npm outdated
```

### Update Dependencies
```bash
npm update
```

### Update Major Versions
```bash
# Update specific package
npm install react@latest

# Or use npm-check-updates
npx npm-check-updates -u
npm install
```

**Warning:** Always review changelogs for breaking changes before updating major versions.

---

## Code Quality & Best Practices

### Before Committing
1. Run tests: `npm test`
2. Check for console errors in browser
3. Test keyboard navigation manually
4. Verify accessibility with screen reader (if possible)

### Accessibility Checklist
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels are descriptive
- [ ] Images have alt text
- [ ] Color contrast meets WCAG standards

### Performance Tips
- Implement infinite scroll with duplicate detection
- Use React Context for shared state
- Lazy load images when possible
- Debounce search input

---

## Getting Help

- **API Documentation:**
  - Cleveland Museum: https://openaccess-api.clevelandart.org/
  - V&A Museum: https://developers.vam.ac.uk/

- **Framework Documentation:**
  - React: https://react.dev/
  - Vite: https://vitejs.dev/
  - Playwright: https://playwright.dev/

- **Project Issues:** Create an issue in the GitHub repository

---

**Last Updated:** October 2025
