// Main page functionality - simplified for modular structure
// Popup functionality
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('telegramPopup');
    const closeBtn = document.querySelector('.popup-close');
    
    if (popup && closeBtn) {
        popup.style.zIndex = '1000'; // Ensure popup is on top

        // Show popup on page load
        popup.style.display = 'flex';

        // Set URL hash to #batches for main homepage (only for local development)
        // Skip hash setting if on Netlify or production
        const isNetlify = window.location.hostname.includes('.netlify.app') || 
                         window.location.hostname.includes('netlify.com') ||
                         window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (!window.location.hash && !isNetlify) {
            window.location.hash = '#batches';
        }

        // Close popup when close button is clicked
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        // Close popup when clicking outside the popup content
        window.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });
    }
});

// Cache management utilities
function clearThumbnailCache() {
    // Clear browser cache for images
    if ('caches' in window) {
        caches.keys().then(function (names) {
            names.forEach(function (name) {
                caches.delete(name);
            });
        });
    }

    // Force reload of current page content
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        const bgImage = thumbnail.style.backgroundImage;
        if (bgImage) {
            const urlMatch = bgImage.match(/url\(["']?([^"'\)]+)["']?\)/);
            if (urlMatch) {
                const baseUrl = urlMatch[1].split('?')[0];
                const newCacheBuster = Date.now() + Math.random().toString(36).substr(2, 9);
                const newUrl = `${baseUrl}?cb=${newCacheBuster}&t=${Date.now()}`;
                thumbnail.style.backgroundImage = `url('${newUrl}')`;
            }
        }
    });

    console.log('Thumbnail cache cleared and refreshed!');
}

// Add keyboard shortcut to clear cache (Ctrl+Shift+R)
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        clearThumbnailCache();
        alert('Thumbnails refreshed! Cache cleared.');
    }
});
