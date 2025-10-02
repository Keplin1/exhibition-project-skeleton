import { Link, useLocation } from 'react-router-dom';
import { useCollection } from './contexts/CollectionContext';

const Header = () => {
    const { collection } = useCollection();
    const location = useLocation();
    const isCollectionPage = location.pathname === '/collection';

    return (
        <header className="mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Exhibition Curator</h1>
                    <p className="text-gray-600">Search and curate artworks from museum collections</p>
                </div>

                {!isCollectionPage && (
                    <Link
                        to="/collection"
                        className="px-4 py-2 text-gray-800 bg-green-200 rounded hover:bg-green-400 transition-colors"
                    >
                        My Collection ({collection.length})
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;