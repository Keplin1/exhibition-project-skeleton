import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ContentList from '../ContentList';
import { ItemProvider } from '../contexts/ItemContext';
import { CollectionProvider } from '../contexts/CollectionContext';
import * as API from '../API';

// Mock the API module
vi.mock('../API', () => ({
  default: vi.fn(),
}));

// Test data - normalized format matching API structure
const mockArtworks = [
  {
    id: 'cleveland-123456',
    title: 'Zebra Painting',
    source: 'Cleveland Museum of Art',
    image: 'https://openaccess-cdn.clevelandart.org/123456/web.jpg',
    creator: 'Alice Artist',
    date: '1950',
    parsedDate: 1950, // Pre-computed for efficient sorting
    url: 'https://www.clevelandart.org/art/123456',
    description: 'A vibrant painting featuring zebra motifs.',
    materials: 'Oil on canvas',
    rawData: {}
  },
  {
    id: 'vam-O78901',
    title: 'Apple Sculpture',
    source: 'Victoria & Albert Museum',
    image: 'https://framemark.vam.ac.uk/collections/full/O78901.jpg',
    creator: 'Bob Builder',
    date: '1920',
    parsedDate: 1920,
    url: 'https://collections.vam.ac.uk/item/O78901/',
    description: 'A modernist apple sculpture.',
    materials: 'Bronze',
    rawData: {}
  },
  {
    id: 'cleveland-234567',
    title: 'Mountain View',
    source: 'Cleveland Museum of Art',
    image: 'https://openaccess-cdn.clevelandart.org/234567/web.jpg',
    creator: 'Charlie Creator',
    date: '1980',
    parsedDate: 1980,
    url: 'https://www.clevelandart.org/art/234567',
    description: 'A landscape depicting mountain scenery.',
    materials: 'Acrylic on canvas',
    rawData: {}
  },
  {
    id: 'vam-O89012',
    title: 'Abstract Dream',
    source: 'Victoria & Albert Museum',
    image: 'https://framemark.vam.ac.uk/collections/full/O89012.jpg',
    creator: 'Alice Artist',
    date: '19th century',
    parsedDate: 1850.5, // 19th century midpoint
    url: 'https://collections.vam.ac.uk/item/O89012/',
    description: 'An abstract composition exploring dreamlike imagery.',
    materials: 'Watercolor on paper',
    rawData: {}
  },
  {
    id: 'cleveland-345678',
    title: 'Ocean Waves',
    source: 'Cleveland Museum of Art',
    image: 'https://openaccess-cdn.clevelandart.org/345678/web.jpg',
    creator: 'Diana Designer',
    date: 'c. 1810-20',
    parsedDate: 1815, // circa 1810-20 average
    url: 'https://www.clevelandart.org/art/345678',
    description: 'A maritime scene with dramatic ocean waves.',
    materials: 'Oil on canvas',
    rawData: {}
  },
];

// Helper function to render ContentList with all providers
const renderContentList = (searchTerm = 'test') => {
  return render(
    <BrowserRouter>
      <ItemProvider>
        <CollectionProvider>
          <ContentList searchTerm={searchTerm} />
        </CollectionProvider>
      </ItemProvider>
    </BrowserRouter>
  );
};

// Helper to get all artwork titles from the rendered list
const getRenderedTitles = () => {
  const artworkElements = screen.getAllByRole('listitem');
  return artworkElements.map(element => {
    const heading = element.querySelector('h3');
    return heading ? heading.textContent : '';
  });
};

// Helper to get all artist names from the rendered list
const getRenderedArtists = () => {
  const artworkElements = screen.getAllByRole('listitem');
  return artworkElements.map(element => {
    const paragraphs = element.querySelectorAll('p');
    // First paragraph after the heading is typically the artist
    return paragraphs[0] ? paragraphs[0].textContent : '';
  });
};

describe('ContentList', () => {
  describe('Sorting Functionality', () => {

    beforeEach(() => {
      // Reset mocks before each test
      vi.clearAllMocks();

      // Mock API to return our test data
      API.default.mockResolvedValue(mockArtworks);
    });

    it('should display artworks in original order by default (no sorting)', async () => {
      renderContentList('test');

      // Wait for artworks to load
      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      const titles = getRenderedTitles();
      expect(titles).toEqual([
        'Zebra Painting',
        'Apple Sculpture',
        'Mountain View',
        'Abstract Dream',
        'Ocean Waves',
      ]);
    });

    it('should sort artworks by artist name (A to Z)', async () => {
      const user = userEvent.setup();
      renderContentList('test');

      // Wait for artworks to load
      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      // Select sort option
      const sortSelect = screen.getByLabelText(/Sort artworks by different/i);
      await user.selectOptions(sortSelect, 'artist-asc');

      // Get the rendered artist names
      const artists = getRenderedArtists();

      // Verify they are sorted alphabetically
      const sortedArtists = [...artists].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      );
      expect(artists).toEqual(sortedArtists);

      // Specifically verify the first and last artists
      expect(artists[0]).toBe('Alice Artist');
      expect(artists[artists.length - 1]).toBe('Diana Designer');
    });

    it('should sort artworks by artist name (Z to A)', async () => {
      const user = userEvent.setup();
      renderContentList('test');

      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort artworks by different/i);
      await user.selectOptions(sortSelect, 'artist-desc');

      const artists = getRenderedArtists();

      // Verify they are sorted in reverse alphabetical order
      const sortedArtists = [...artists].sort((a, b) =>
        b.toLowerCase().localeCompare(a.toLowerCase())
      );
      expect(artists).toEqual(sortedArtists);

      // Verify first artist is now last alphabetically
      expect(artists[0]).toBe('Diana Designer');
    });

    it('should sort artworks by title (A to Z)', async () => {
      const user = userEvent.setup();
      renderContentList('test');

      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort artworks by different/i);
      await user.selectOptions(sortSelect, 'title-asc');

      const titles = getRenderedTitles();

      // Verify they are sorted alphabetically
      const sortedTitles = [...titles].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      );
      expect(titles).toEqual(sortedTitles);

      // Verify the order
      expect(titles[0]).toBe('Abstract Dream');
      expect(titles[titles.length - 1]).toBe('Zebra Painting');
    });

    it('should sort artworks by title (Z to A)', async () => {
      const user = userEvent.setup();
      renderContentList('test');

      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort artworks by different/i);
      await user.selectOptions(sortSelect, 'title-desc');

      const titles = getRenderedTitles();

      // Verify they are sorted in reverse alphabetical order
      const sortedTitles = [...titles].sort((a, b) =>
        b.toLowerCase().localeCompare(a.toLowerCase())
      );
      expect(titles).toEqual(sortedTitles);

      expect(titles[0]).toBe('Zebra Painting');
      expect(titles[titles.length - 1]).toBe('Abstract Dream');
    });

    it('should sort artworks by creation date (oldest first)', async () => {
      const user = userEvent.setup();
      renderContentList('test');

      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort artworks by different/i);
      await user.selectOptions(sortSelect, 'date-asc');

      const titles = getRenderedTitles();

      // Expected order based on parseHistoricalDate:
      // "c. 1810-20" (1815) -> "19th century" (1850.5) -> "1920" -> "1950" -> "1980"
      expect(titles).toEqual([
        'Ocean Waves',      // c. 1810-20 (circa 1815)
        'Abstract Dream',   // 19th century (1850.5)
        'Apple Sculpture',  // 1920
        'Zebra Painting',   // 1950
        'Mountain View',    // 1980
      ]);
    });

    it('should sort artworks by creation date (newest first)', async () => {
      const user = userEvent.setup();
      renderContentList('test');

      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort artworks by different/i);
      await user.selectOptions(sortSelect, 'date-desc');

      const titles = getRenderedTitles();

      // Expected order (reversed from oldest first)
      expect(titles).toEqual([
        'Mountain View',    // 1980
        'Zebra Painting',   // 1950
        'Apple Sculpture',  // 1920
        'Abstract Dream',   // 19th century (1850.5)
        'Ocean Waves',      // c. 1810-20 (circa 1815)
      ]);
    });

    it('should maintain sort order when switching between sort options', async () => {
      const user = userEvent.setup();
      renderContentList('test');

      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort artworks by different/i);

      // First sort by artist A-Z
      await user.selectOptions(sortSelect, 'artist-asc');
      let artists = getRenderedArtists();
      expect(artists[0]).toBe('Alice Artist');

      // Then switch to title Z-A
      await user.selectOptions(sortSelect, 'title-desc');
      let titles = getRenderedTitles();
      expect(titles[0]).toBe('Zebra Painting');

      // Then switch to date oldest
      await user.selectOptions(sortSelect, 'date-asc');
      titles = getRenderedTitles();
      expect(titles[0]).toBe('Ocean Waves');
    });

    it('should display sort controls only when artworks are present', async () => {
      renderContentList('test');

      // Initially, sort controls should not be visible (during loading)
      expect(screen.queryByText('Sort by:')).not.toBeInTheDocument();

      // Wait for artworks to load
      await waitFor(() => {
        expect(screen.getByText('Zebra Painting')).toBeInTheDocument();
      });

      // Now sort controls should be visible
      expect(screen.getByText('Sort by:')).toBeInTheDocument();
    });

    it('should handle empty search results without sort controls', async () => {
      // Mock empty results
      API.default.mockResolvedValue([]);

      renderContentList('nonexistent');

      // Wait for "no results" message
      await waitFor(() => {
        expect(screen.getByText(/No results found/i)).toBeInTheDocument();
      });

      // Sort controls should not be visible
      expect(screen.queryByText('Sort by:')).not.toBeInTheDocument();
    });
  });
});
