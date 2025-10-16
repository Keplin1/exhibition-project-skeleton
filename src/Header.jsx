import { useNavigate, useLocation } from 'react-router-dom';
import { useCollection } from './contexts/useCollection';

const Header = () => {
    const { collection } = useCollection();
    const navigate = useNavigate();
    const location = useLocation();
    const isCollectionPage = location.pathname === '/collection';

    return (
        <header className="mb-8" role="banner">
            <h1 className="text-3xl font-bold mb-2">Exhibition Curator</h1>
            <p className="text-gray-600">Search and curate artworks from museum collections</p>

            {!isCollectionPage && (
                <nav className="fixed top-8 right-8 z-1" aria-label="Collection navigation">
                    <button
                        onClick={() => navigate('/collection')}
                        className="px-4 py-2 bg-green-200 text-gray-800 rounded hover:bg-green-300 whitespace-nowrap shadow-md"
                        aria-label={`View my collection: ${collection.length} ${collection.length === 1 ? 'artwork' : 'artworks'} saved`}
                        data-testid="my-collection-button"
                        title={`View your collection (${collection.length} artwork${collection.length === 1 ? '' : 's'})`}
                    >
                        My Collection ({collection.length})
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;