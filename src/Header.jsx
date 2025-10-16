import { Link, useLocation } from 'react-router-dom';
import { useCollection } from './contexts/CollectionContext';

const Header = () => {
    const { collection } = useCollection();
    const location = useLocation();
    const isCollectionPage = location.pathname === '/collection';

    return (
        <header className="mb-8" role="banner">
            <div className="pr-40">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Exhibition Curator</h1>
                    <p className="text-gray-600">Search and curate artworks from museum collections</p>
                </div>
            </div>

            {!isCollectionPage && (
                <nav className="fixed top-8 right-8 z-1" aria-label="Collection navigation">
                    <Link
                        to="/collection"
                        className="px-4 py-2 text-gray-800 bg-green-200 rounded hover:bg-green-400 transition-colors whitespace-nowrap shadow-md"
                        aria-label={`View my collection: ${collection.length} ${collection.length === 1 ? 'artwork' : 'artworks'} saved`}
                        data-testid="my-collection-button"
                        title={`View your collection (${collection.length} artwork${collection.length === 1 ? '' : 's'})`}
                    >
                        My Collection ({collection.length})
                    </Link>
                </nav>
            )}
        </header>
    );
};

export default Header;