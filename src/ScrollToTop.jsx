import { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Add event listener when component mounts
        window.addEventListener('scroll', toggleVisibility);

        // Remove event listener when component unmounts
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 px-6 py-4 bg-blue-200 text-black rounded shadow-lg flex items-center gap-2"
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
                    Scroll to top ↑
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
