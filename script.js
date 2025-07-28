 // Popup functionality
 document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('telegramPopup');
    const closeBtn = document.querySelector('.popup-close');
    popup.style.zIndex = '1000'; // Ensure popup is on top

    // Show popup on page load
    popup.style.display = 'flex';

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
});

// Cache management utilities
function clearThumbnailCache() {
    // Clear browser cache for images
    if ('caches' in window) {
        caches.keys().then(function(names) {
            names.forEach(function(name) {
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
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        clearThumbnailCache();
        alert('Thumbnails refreshed! Cache cleared.');
    }
});

// URL-based navigation system
function updateURL(section, subject = '', chapter = '') {
    let hash = `#${section}`;
    if (subject) hash += `/${subject}`;
    if (chapter) hash += `/${encodeURIComponent(chapter)}`;
    window.history.replaceState(null, null, hash);
}

function parseURL() {
    const hash = window.location.hash.substring(1); // Remove #
    if (!hash) return { section: 'welcome' };
    
    const parts = hash.split('/');
    return {
        section: parts[0] || 'welcome',
        subject: parts[1] || '',
        chapter: decodeURIComponent(parts[2] || '')
    };
}

// Function to control top bar visibility
function toggleTopBar(show) {
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        if (show) {
            topBar.style.display = 'block';
            topBar.style.opacity = '0';
            topBar.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                topBar.style.opacity = '1';
                topBar.style.transform = 'translateY(0)';
            }, 50);
        } else {
            topBar.style.opacity = '0';
            topBar.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                topBar.style.display = 'none';
            }, 300);
        }
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const exploreBtn = document.getElementById('explore-btn');
    const backBtn = document.getElementById('back-btn');
    const chaptersBackBtn = document.getElementById('chapters-back-btn');
    const contentBackBtn = document.getElementById('content-back-btn');
    const welcomeCard = document.getElementById('welcome-card');
    const subjectsSection = document.getElementById('subjects-section');
    const chaptersSection = document.getElementById('chapters-section');
    const chapterContentSection = document.getElementById('chapter-content-section');
    const subjectTitle = document.getElementById('subject-title');
    const chaptersContent = document.getElementById('chapters-content');
    const chapterContentTitle = document.getElementById('chapter-content-title');
    const contentGrid = document.getElementById('content-grid');
    const subjectCards = document.querySelectorAll('.subject-card');
    const tabButtons = document.querySelectorAll('.tab-button');

    // Add click event to explore button
    exploreBtn.addEventListener('click', function() {
        showSubjects();
    });
    
    // Add click event to back button
    backBtn.addEventListener('click', function() {
        showWelcomeCard();
    });
    
    // Add click event to chapters back button
    chaptersBackBtn.addEventListener('click', function() {
        showSubjects();
    });
    
    // Add click event to content back button
    contentBackBtn.addEventListener('click', function() {
        showChaptersFromContent();
    });
    

    
    // Add click events to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            switchTab(tabType, this);
        });
    });
    
    // Initialize search functionality
    initializeSearch();
    
    // Function to restore state from URL (moved inside DOMContentLoaded)
    function restoreStateFromURL() {
        const state = parseURL();
        
        switch (state.section) {
            case 'subjects':
                showSubjects(false); // false = don't update URL again
                break;
            case 'chapters':
                if (state.subject) {
                    showSubjects(false);
                    setTimeout(() => {
                        showChapters(state.subject, false);
                    }, 100);
                } else {
                    showSubjects(false);
                }
                break;
            case 'content':
                if (state.subject && state.chapter) {
                    showSubjects(false);
                    setTimeout(() => {
                        showChapters(state.subject, false);
                        setTimeout(() => {
                            showChapterContent(state.chapter, chaptersData[state.subject]?.title || state.subject, false);
                        }, 100);
                    }, 100);
                } else if (state.subject) {
                    showSubjects(false);
                    setTimeout(() => {
                        showChapters(state.subject, false);
                    }, 100);
                } else {
                    showSubjects(false);
                }
                break;
            default:
                showWelcomeCard(false);
                break;
        }
    }
    
    // Function to show subjects
    function showSubjects(updateUrl = true) {
        if (updateUrl) updateURL('subjects');
        // Hide top bar when showing subjects
        toggleTopBar(false);
        // Check if we're coming from chapters section
        if (chaptersSection.style.display === 'block') {
            // Clear search when navigating away from chapters
            if (window.clearSearch) {
                window.clearSearch();
            }
            
            // Hide chapters section first
            chaptersSection.style.opacity = '0';
            chaptersSection.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                chaptersSection.style.display = 'none';
                subjectsSection.style.display = 'block';
                subjectsSection.style.opacity = '1';
                subjectsSection.style.transform = 'translateY(0)';

                // Refresh chapter counts each time subjects view is presented
                updateSubjectChapterCounts();
            }, 300);
        } else {
            // Coming from welcome card
            // Reset any existing styles
            subjectsSection.style.opacity = '1';
            subjectsSection.style.transform = 'translateY(0)';
            
            // Add fade out animation to welcome card
            welcomeCard.style.opacity = '0';
            welcomeCard.style.transform = 'translateY(-20px)';
            
            // After animation completes, hide welcome card and show subjects
            setTimeout(() => {
                welcomeCard.style.display = 'none';
                subjectsSection.style.display = 'block';
                
                // Ensure subjects section is visible and properly positioned
                subjectsSection.style.opacity = '1';
                subjectsSection.style.transform = 'translateY(0)';
                
                // Reset all subject cards to visible state
                subjectCards.forEach((card) => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.display = 'block';
                });
            }, 300);
        }
    }
    
    // Function to show welcome card
    function showWelcomeCard(updateUrl = true) {
        if (updateUrl) updateURL('welcome');
        // Show top bar when showing welcome card
        toggleTopBar(true);
        
        // Add fade out animation to subjects
        subjectsSection.style.opacity = '0';
        subjectsSection.style.transform = 'translateY(-20px)';
        
        // After animation completes, hide subjects and show welcome card
        setTimeout(() => {
            subjectsSection.style.display = 'none';
            welcomeCard.style.display = 'block';
            
            // Start with welcome card hidden, then animate it in
            welcomeCard.style.opacity = '0';
            welcomeCard.style.transform = 'translateY(20px)';
            
            // Animate welcome card in
            setTimeout(() => {
                welcomeCard.style.opacity = '1';
                welcomeCard.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }

    // Chapter data for CBSE Class 11 subjects (first 3 chapters each)
    const chaptersData = {
        physics: {
            title: 'Physics',
            chapters: [
                { name: 'Units and Dimension' },
                { name: 'Basic Maths & Calculus' },
                { name: 'Motion in a Straight Line' },
                { name: 'Vectors' },
                { name: 'Motion in a Plane' },
                // { name: 'Laws of Motion' },
                // { name: 'Work, Energy and Power' },
                // { name: 'System of Particles and Rotational Motion' },
                // { name: 'Gravitation' },
                // { name: 'Mechanical Properties of Solids' },
                // { name: 'Mechanical Properties of Fluids' },
                // { name: 'Thermal Properties of Matter' },
                // { name: 'Thermodynamics' },
                // { name: 'Kinetic Theory' },
                // { name: 'Oscillations' },
                // { name: 'Waves' },
                { name: 'Practice Sheet || (Only PDF)' },
                { name: 'Short Notes || (Only PDF)' }
            ]
        },
        chemistry: {
            title: 'Chemistry',
            chapters: [
                { name: 'Some Basic Concepts of Chemistry (Physical Chemistry)' },
                { name: 'Structure of Atom (Physical Chemistry)' },
                // { name: 'Classification of Elements (Inorganic Chemistry)' },
                // { name: 'Chemical Bonding and Molecular Structure (Physical Chemistry)' },
                // { name: 'States of Matter (Physical Chemistry)' },
                // { name: 'Thermodynamics (Physical Chemistry)' },
                // { name: 'Equilibrium (Physical Chemistry)' },
                // { name: 'Redox Reactions (Physical Chemistry)' },
                // { name: 'Hydrogen (Inorganic Chemistry)' },
                // { name: 'The s-Block Elements (Inorganic Chemistry)' },
                // { name: 'The p-Block Elements (Inorganic Chemistry)' },
                // { name: 'Organic Chemistry - Some Basic Principles (Organic Chemistry)' },
                // { name: 'Hydrocarbons (Organic Chemistry)' },
                // { name: 'Environmental Chemistry (Physical Chemistry)' },
                { name: 'Practice Sheet || (Only PDF)' },
                { name: 'Short Notes || (Only PDF)' }
            ]
        },
        mathematics: {
            title: 'Mathematics',
            chapters: [
                { name: 'Sets' },
                { name: 'Linear Inequations' },
                { name: 'Relations And Functions' },
                { name: 'Basic Mathematics' },
                { name: 'Trigonometric Functions' },
                // { name: 'Principle of Mathematical Induction' },
                // { name: 'Complex Numbers and Quadratic Equations' },
                // { name: 'Permutations and Combinations' },
                // { name: 'Binomial Theorem' },
                // { name: 'Sequences and Series' },
                // { name: 'Straight Lines' },
                // { name: 'Conic Sections' },
                // { name: 'Introduction to Three Dimensional Geometry' },
                // { name: 'Limits and Derivatives' },
                // { name: 'Mathematical Reasoning' },
                // { name: 'Statistics' },
                // { name: 'Probability' },
                { name: 'Practice Sheet || (Only PDF)' },
                { name: 'Short Notes || (Only PDF)' }
            ]
        },
        biology: {
            title: 'Biology',
            chapters: [
                { name: 'Cell - The Unit of Life (Botany)' },
                { name: 'The Living World (Botany)', },
                { name: 'Biological Classification (Botany)', },
                { name: 'Plant Kingdom (Botany)', },
                // { name: 'Morphology of Flowering Plants (Botany)' },
                // { name: 'Anatomy of Flowering Plants (Botany)', },
                // { name: 'Cell Cycle and Cell Division (Botany)' },
                // { name: 'Transport in Plants (Botany)', },
                // { name: 'Mineral Nutrition (Botany)' },
                // { name: 'Photosynthesis in Higher Plants (Botany)', },
                // { name: 'Respiration in Plants (Botany)', },
                // { name: 'Plant Growth and Development (Botany)' },
                // { name: 'Animal Kingdom (Zoology)', },
                // { name: 'Structural Organisation in Animals (Zoology)' },
                // { name: 'Biomolecules (Zoology)', notes: 10 },
                // { name: 'Digestion and Absorption (Zoology)' },
                // { name: 'Breathing and Exchange of Gases (Zoology)' },
                // { name: 'Body Fluids and Circulation (Zoology)', },
                // { name: 'Excretory Products and their Elimination (Zoology)' },
                // { name: 'Locomotion and Movement (Zoology)' },
                // { name: 'Neural Control and Coordination (Zoology)', },
                // { name: 'Chemical Coordination and Integration (Zoology)', }
                { name: 'Practice Sheet || (Only PDF)' },
                { name: 'Short Notes || (Only PDF)' }
            ]
        },
        english: {
            title: 'English',
            chapters: [
                { name: 'Hornbill : Prose', },
                { name: 'Snapshot : Prose', },
                { name: 'Figures of Speech' },
                { name: 'Hornbill : Poetry' },
                { name: 'Grammar', },
                { name: 'Writing Skills'},
            ]
        },
        notices: {
            title: 'Notices',
            chapters: [
                { name: 'Batch Demo Videos' },
                { name: 'Master NCERT with AI' },
                { name: 'Lecture Planner || PDF Only' },
                { name: 'Test Planner || PDF Only' },
                { name: 'Class Schedule || PDF Only' },
                { name: 'Telegram Group Link || PDF Only' },
                { name: 'Test Syllabus || PDF Only' },
                { name: 'Test Paper || PDF Only' },
                { name: 'Subjective Test Paper Discussion' }
            ]
        },
        'computer-science': {
            title: 'Computer Science',
            chapters: [
                
            ]
        },
        'physical-education': {
            title: 'Physical Education',
            chapters: [
                
            ]
        }
    };
    
    // Add hover effects and click handlers for subject cards
    subjectCards.forEach(card => {
        card.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            showChapters(subject);
        });
    });
    
    // Add click handler for Live Classes card
    const liveClassesCard = document.getElementById('live-classes-card');
    if (liveClassesCard) {
        liveClassesCard.addEventListener('click', function() {
            window.open('/Live/main.html', '_blank');
        });
    }
    
    // Utility: update chapter count on subject cards
    function updateSubjectChapterCounts() {
        document.querySelectorAll('.subject-card').forEach(card => {
            const subjectKey = card.getAttribute('data-subject');
            // Skip cards that don't map to chaptersData (e.g., notices)
            if (chaptersData[subjectKey]) {
                const count = chaptersData[subjectKey].chapters.length;
                const infoP = card.querySelector('.subject-info p');
                if (infoP) {
                    infoP.textContent = `${count} Chapters`;
                }
            }
        });
    }

    // Update subject cards with dynamic chapter counts
    updateSubjectChapterCounts();


    
    // Function to show chapters
    function showChapters(subject, updateUrl = true) {
        if (updateUrl) updateURL('chapters', subject);
        // Hide top bar when showing chapters
        toggleTopBar(false);
        
        // Clear search when entering a new subject
        if (window.clearSearch) {
            window.clearSearch();
        }
        
        const subjectData = chaptersData[subject];
        if (!subjectData) return;
        
        // Update subject title and global variable
        subjectTitle.textContent = subjectData.title;
        currentSubjectName = subjectData.title;
        
        // Clear existing chapters
        chaptersContent.innerHTML = '';
        
        // Add "All Contents" section first for all subjects
        const allContentsCard = document.createElement('div');
        allContentsCard.className = 'chapter-card';
        allContentsCard.innerHTML = `
            <h3 class="chapter-title">All Contents</h3>
            <div class="chapter-stats">
                <span class="stat-item">All Videos</span>
                <span class="stat-item">All Notes</span>
                <span class="stat-item">All DPP</span>
            </div>
        `;
        // Add click event to all contents card
        allContentsCard.addEventListener('click', function() {
            showChapterContent('All Contents', subjectData.title);
        });
        
        chaptersContent.appendChild(allContentsCard);
        
        // Regular chapters for all subjects
            subjectData.chapters.forEach(async (chapter) => {
                const chapterCard = document.createElement('div');
                chapterCard.className = 'chapter-card';
                chapterCard.innerHTML = `
                    <h3 class="chapter-title">${chapter.name}</h3>
                    <div class="chapter-stats">
                        <span class="stat-item video-count">Loading...</span>
                        <span class="stat-item note-count">Loading...</span>
                        <span class="stat-item dpp-count">Loading...</span>
                    </div>
                `;
                chapterCard.addEventListener('click', function() {
                    showChapterContent(chapter.name, subjectData.title);
                });
                chaptersContent.appendChild(chapterCard);

                // fetch real video count
                const countElem = chapterCard.querySelector('.video-count');
                try {
                    const videosArr = await youtubeAPI.getChapterVideos(chapter.name, 50);
                    countElem.textContent = `${videosArr.length} Videos`;
                } catch(err) {
                    console.error('Count fetch error', err);
                    countElem.textContent = '0 Videos';
                }
                
                // fetch real notes count
                const noteCountElem = chapterCard.querySelector('.note-count');
                try {
                    // Map subject name to key for Google Sheets
                    const subjectKey = Object.keys(chaptersData).find(key => 
                        chaptersData[key].title.toLowerCase() === subjectData.title.toLowerCase()
                    ) || subject.toLowerCase();
                    
                    const notesData = await googleSheetsAPI.getSheetData(subjectKey, chapter.name, 'Notes');
                    noteCountElem.innerHTML = `<span class="stat-number">${notesData.length}</span> Notes`;
                } catch(err) {
                    console.error('Notes count fetch error', err);
                    noteCountElem.innerHTML = `<span class="stat-number">0</span> Notes`;
                }
                
                // fetch real DPP count
                const dppCountElem = chapterCard.querySelector('.dpp-count');
                try {
                    // Map subject name to key for Google Sheets
                    const subjectKey = Object.keys(chaptersData).find(key => 
                        chaptersData[key].title.toLowerCase() === subjectData.title.toLowerCase()
                    ) || subject.toLowerCase();
                    
                    const dppData = await googleSheetsAPI.getSheetData(subjectKey, chapter.name, 'DPP');
                    dppCountElem.innerHTML = `<span class="stat-number">${dppData.length}</span> DPP`;
                } catch(err) {
                    console.error('DPP count fetch error', err);
                    dppCountElem.innerHTML = `<span class="stat-number">0</span> DPP`;
                }
            });
        
        // Hide subjects and show chapters
        subjectsSection.style.opacity = '0';
        subjectsSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            subjectsSection.style.display = 'none';
            chaptersSection.style.display = 'block';
            chaptersSection.style.opacity = '1';
            chaptersSection.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Function to show chapter content
    function showChapterContent(chapterName, subjectName, updateUrl = true) {
        // Hide top bar when showing chapter content
        toggleTopBar(false);
        
        // Clear search when navigating to chapter content
        if (window.clearSearch) {
            window.clearSearch();
        }
        
        if (updateUrl) {
            // Find the subject key from the title
            const subjectKey = Object.keys(chaptersData).find(key => 
                chaptersData[key].title === subjectName
            ) || subjectName.toLowerCase();
            updateURL('content', subjectKey, chapterName);
        }
        chapterContentTitle.textContent = chapterName;
        
        // Store current subject name globally
        currentSubjectName = subjectName;
        
        // If returning to the same chapter, keep the same tab active
        // If it's a new chapter, reset to lectures tab
        if (lastChapterName !== chapterName) {
            currentActiveTab = 'lectures';
            lastChapterName = chapterName;
        }
        
        // Hide chapters and show content
        chaptersSection.style.opacity = '0';
        chaptersSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            chaptersSection.style.display = 'none';
            chapterContentSection.style.display = 'block';
            chapterContentSection.style.opacity = '1';
            chapterContentSection.style.transform = 'translateY(0)';
            
            // Set the correct active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const activeTabButton = document.querySelector(`[data-tab="${currentActiveTab}"]`);
            if (activeTabButton) {
                activeTabButton.classList.add('active');
            }
            
            // Load content for the active tab
            loadContent(currentActiveTab, chapterName, subjectName);
        }, 300);
    }
    
    // Function to show chapters from content
    function showChaptersFromContent() {
        // Update URL to chapters section
        // Find the current subject key from the global currentSubjectName
        const subjectKey = Object.keys(chaptersData).find(key => 
            chaptersData[key].title === currentSubjectName
        ) || currentSubjectName.toLowerCase();
        updateURL('chapters', subjectKey);
        
        chapterContentSection.style.opacity = '0';
        chapterContentSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            chapterContentSection.style.display = 'none';
            chaptersSection.style.display = 'block';
            chaptersSection.style.opacity = '1';
            chaptersSection.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Function to switch tabs
    function switchTab(tabType, activeButton) {
        // Store the current active tab
        currentActiveTab = tabType;
        
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        activeButton.classList.add('active');
        
        // Load content for the selected tab
        const currentChapter = chapterContentTitle.textContent;
        loadContent(tabType, currentChapter, currentSubjectName);
    }
    
    // Global state variables
    let currentSubjectName = '';
    let currentActiveTab = 'lectures';
    let lastChapterName = '';
    
    // Initialize YouTube API
    const youtubeAPI = new YouTubeAPI();
    
    // Initialize Google Sheets API
    const googleSheetsAPI = new GoogleSheetsAPI();
    
    // Function to load content based on tab
    async function loadContent(tabType, chapterName, subjectName) {
        contentGrid.innerHTML = '';
        
        // Check if this is "All Contents" section
        const isAllContents = chapterName === 'All Contents';
        
        if (tabType === 'lectures') {
            // Show cool loading message with animation
            contentGrid.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                    border-radius: 20px;
                    margin: 20px;
                ">
                    <div style="
                        font-size: 3rem;
                        margin-bottom: 20px;
                        animation: spin 2s linear infinite;
                    ">🎬</div>
                    <div style="
                        color: #00d4aa;
                        font-size: 1.4rem;
                        font-weight: 600;
                        margin-bottom: 10px;
                        text-shadow: 0 2px 10px rgba(0, 212, 170, 0.3);
                    ">Loading Videos</div>
                    <div style="
                        color: #888;
                        font-size: 1rem;
                        opacity: 0.8;
                    ">Please Wait...</div>
                    <div style="
                        width: 200px;
                        height: 4px;
                        background: rgba(0, 212, 170, 0.2);
                        border-radius: 2px;
                        margin-top: 20px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, #00d4aa, #0096ff);
                            border-radius: 2px;
                            animation: loading 1.5s ease-in-out infinite;
                        "></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        50% { transform: translateX(0%); }
                        100% { transform: translateX(100%); }
                    }
                </style>
            `;
            
            try {
                let videos = [];
                
                if (isAllContents) {
                    // Get videos from all chapters for "All Contents"
                    const subjectKey = Object.keys(chaptersData).find(key => 
                        chaptersData[key].title === subjectName
                    );
                    
                    if (subjectKey && chaptersData[subjectKey]) {
                        // Get ALL videos for each chapter in DESCENDING order (Chapter N to Chapter 1)
                        const chapters = [...chaptersData[subjectKey].chapters].reverse();
                        for (const chapter of chapters) {
                        const chapterVideos = await youtubeAPI.getChapterVideos(chapter.name, 999);
                        videos = videos.concat(chapterVideos);
                    }
                }
                } else {
                    // Get ALL videos for specific chapter
                    videos = await youtubeAPI.getChapterVideos(chapterName, 999);
                }
                
                // Clear loading message
                contentGrid.innerHTML = '';
                
                if (videos.length === 0) {
                    contentGrid.innerHTML = `
                        <div style="
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 60px 20px;
                            text-align: center;
                            border-radius: 20px;
                            margin: 20px;
                        ">
                            <div style="
                                font-size: 4rem;
                                margin-bottom: 20px;
                                opacity: 0.7;
                            ">📺</div>
                            <div style="
                                color: #ff6b6b;
                                font-size: 1.5rem;
                                font-weight: 600;
                                margin-bottom: 10px;
                                text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                            ">No Videos Found</div>
                            <div style="
                                color: #888;
                                font-size: 1rem;
                                opacity: 0.8;
                            ">This chapter doesn't have any videos yet</div>
                        </div>
                    `;
                    return;
                }
                
                // Create video cards with YouTube data
                videos.forEach((video, index) => {
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card';
                    
                    // Add cache-busting parameter to thumbnail URL to force refresh
                    const cacheBuster = Date.now() + Math.random().toString(36).substr(2, 9);
                    const thumbnailUrl = `${video.thumbnail}?cb=${cacheBuster}&t=${Date.now()}`;
                    
                    // Preload image to ensure fresh load
                    const img = new Image();
                    img.src = thumbnailUrl;
                    
                    videoCard.innerHTML = `
                        <div class="video-thumbnail" style="background-image: url('${thumbnailUrl}'); background-size: cover; background-position: center;">
                            <!-- Watermark overlay with logo -->
                            <div class="video-watermark-top">
                                <img src="https://gknodfvnbjkifcghajsf.supabase.co/storage/v1/object/sign/logo/logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lMTI1ZTg2Ny04ODI1LTRmMDktOTExNS01YjYyZDZmMmNlYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2xvZ28uanBnIiwiaWF0IjoxNzUxNjk1MzQwLCJleHAiOjMzMjU2MTU5MzQwfQ.ZKq1SAE3ShgV9gZiFJTov9CV9vNBimARDqnXJwkjZW4" alt="Logo" class="watermark-logo">
                                @Genius_Hub_Official_01
                            </div>
                            <div class="play-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="video-info">
                            <div class="video-meta">
                                <div class="video-date">${video.publishedAt}</div>
                                <div class="video-duration">${video.duration}</div>
                            </div>
                            <div class="video-title">${video.title}</div>
                        </div>
                    `;
                    
                    // Make entire card clickable
                    videoCard.addEventListener('click', function() {
                        openYouTubeVideo(video.videoUrl, video.title, chapterName, subjectName);
                    });
                    
                    contentGrid.appendChild(videoCard);
                });
                
            } catch (error) {
                console.error('Error loading YouTube videos:', error);
                contentGrid.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 60px 20px;
                        text-align: center;
                        border-radius: 20px;
                        margin: 20px;
                    ">
                        <div style="
                            font-size: 3.5rem;
                            margin-bottom: 20px;
                            animation: shake 0.5s ease-in-out infinite alternate;
                        ">⚠️</div>
                        <div style="
                            color: #ff6b6b;
                            font-size: 1.4rem;
                            font-weight: 600;
                            margin-bottom: 10px;
                            text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                        ">Connection Error</div>
                        <div style="
                            color: #888;
                            font-size: 1rem;
                            opacity: 0.9;
                            line-height: 1.5;
                        ">Please check your internet connection</div>
                    </div>
                    <style>
                        @keyframes shake {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(5px); }
                        }
                    </style>
                `;
            }
            
        } else if (tabType === 'notes') {
            // Show loading message for notes
            contentGrid.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                    border-radius: 20px;
                    margin: 20px;
                ">
                    <div style="
                        font-size: 3rem;
                        margin-bottom: 20px;
                        animation: spin 2s linear infinite;
                    ">📝</div>
                    <div style="
                        color: #ffc107;
                        font-size: 1.4rem;
                        font-weight: 600;
                        margin-bottom: 10px;
                        text-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
                    ">Loading Notes</div>
                    <div style="
                        color: #888;
                        font-size: 1rem;
                        opacity: 0.8;
                    ">Please Wait...</div>
                    <div style="
                        width: 200px;
                        height: 4px;
                        background: rgba(255, 193, 7, 0.2);
                        border-radius: 2px;
                        margin-top: 20px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, #ffc107, #ff9800);
                            border-radius: 2px;
                            animation: loading 1.5s ease-in-out infinite;
                        "></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        50% { transform: translateX(0%); }
                        100% { transform: translateX(100%); }
                    }
                </style>
            `;
            
            try {
                // Map subject name to key for Google Sheets
                const subjectKey = Object.keys(chaptersData).find(key => 
                    chaptersData[key].title.toLowerCase() === subjectName.toLowerCase()
                ) || subjectName.toLowerCase();
                
                // Fetch notes data from Google Sheets
                const notesData = await googleSheetsAPI.getSheetData(subjectKey, chapterName, 'Notes');
                
                // Clear loading message
                contentGrid.innerHTML = '';
                
                if (notesData.length === 0) {
                    contentGrid.innerHTML = `
                        <div style="
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 60px 20px;
                            text-align: center;
                            border-radius: 20px;
                            margin: 20px;
                        ">
                            <div style="
                                font-size: 4rem;
                                margin-bottom: 20px;
                                opacity: 0.7;
                            ">📝</div>
                            <div style="
                                color: #ff6b6b;
                                font-size: 1.5rem;
                                font-weight: 600;
                                margin-bottom: 10px;
                                text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                            ">No Notes Found</div>
                            <div style="
                                color: #888;
                                font-size: 1rem;
                                opacity: 0.8;
                            ">This chapter doesn't have any notes yet</div>
                        </div>
                    `;
                    return;
                }
                
                // Create note cards in descending order
                notesData.slice().reverse().forEach(note => {
                    const noteCard = document.createElement('div');
                    noteCard.className = 'note-card'; // Use custom note card styling
                    
                    noteCard.innerHTML = `
                        <div class="note-card-content">
                            <div class="note-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="#FFA726"/>
                                </svg>
                            </div>
                            <div class="note-content">
                                <div class="note-title">${note.title}</div>
                                <div class="note-label">Notes</div>
                            </div>
                            <div class="note-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#888"/>
                                </svg>
                            </div>
                        </div>
                    `;
                    
                    // Make entire card clickable to open PDF
                    noteCard.addEventListener('click', function() {
                        window.open(note.link, '_blank');
                    });
                    
                    contentGrid.appendChild(noteCard);
                });
                
            } catch (error) {
                console.error('Error loading notes:', error);
                contentGrid.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 60px 20px;
                        text-align: center;
                        border-radius: 20px;
                        margin: 20px;
                    ">
                        <div style="
                            font-size: 3.5rem;
                            margin-bottom: 20px;
                            animation: shake 0.5s ease-in-out infinite alternate;
                        ">⚠️</div>
                        <div style="
                            color: #ff6b6b;
                            font-size: 1.4rem;
                            font-weight: 600;
                            margin-bottom: 10px;
                            text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                        ">Connection Error</div>
                        <div style="
                            color: #888;
                            font-size: 1rem;
                            opacity: 0.9;
                            line-height: 1.5;
                        ">Please check your internet connection</div>
                    </div>
                    <style>
                        @keyframes shake {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(5px); }
                        }
                    </style>
                `;
            }
        } else if (tabType === 'dpp') {
            // Show loading message for DPP
            contentGrid.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                    border-radius: 20px;
                    margin: 20px;
                ">
                    <div style="
                        font-size: 3rem;
                        margin-bottom: 20px;
                        animation: spin 2s linear infinite;
                    ">📊</div>
                    <div style="
                        color: #9c27b0;
                        font-size: 1.4rem;
                        font-weight: 600;
                        margin-bottom: 10px;
                        text-shadow: 0 2px 10px rgba(156, 39, 176, 0.3);
                    ">Loading DPP</div>
                    <div style="
                        color: #888;
                        font-size: 1rem;
                        opacity: 0.8;
                    ">Please Wait...</div>
                    <div style="
                        width: 200px;
                        height: 4px;
                        background: rgba(156, 39, 176, 0.2);
                        border-radius: 2px;
                        margin-top: 20px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, #9c27b0, #673ab7);
                            border-radius: 2px;
                            animation: loading 1.5s ease-in-out infinite;
                        "></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        50% { transform: translateX(0%); }
                        100% { transform: translateX(100%); }
                    }
                </style>
            `;
            
            try {
                // Map subject name to key for Google Sheets
                const subjectKey = Object.keys(chaptersData).find(key => 
                    chaptersData[key].title.toLowerCase() === subjectName.toLowerCase()
                ) || subjectName.toLowerCase();
                
                // Fetch DPP data from Google Sheets
                const dppData = await googleSheetsAPI.getSheetData(subjectKey, chapterName, 'DPP');
                
                // Clear loading message
                contentGrid.innerHTML = '';
                
                if (dppData.length === 0) {
                    contentGrid.innerHTML = `
                        <div style="
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 60px 20px;
                            text-align: center;
                            border-radius: 20px;
                            margin: 20px;
                        ">
                            <div style="
                                font-size: 4rem;
                                margin-bottom: 20px;
                                opacity: 0.7;
                            ">📊</div>
                            <div style="
                                color: #ff6b6b;
                                font-size: 1.5rem;
                                font-weight: 600;
                                margin-bottom: 10px;
                                text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                            ">No DPP Found</div>
                            <div style="
                                color: #888;
                                font-size: 1rem;
                                opacity: 0.8;
                            ">This chapter doesn't have any DPP yet</div>
                        </div>
                    `;
                    return;
                }
                
                // Create DPP cards in descending order
                dppData.slice().reverse().forEach(dpp => {
                    const dppCard = document.createElement('div');
                    dppCard.className = 'dpp-card'; // Use custom DPP card styling
                    
                    dppCard.innerHTML = `
                        <div class="dpp-card-content">
                            <div class="dpp-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="#9C27B0"/>
                                </svg>
                            </div>
                            <div class="dpp-content">
                                <div class="dpp-title">${dpp.title}</div>
                                <div class="dpp-label">DPP</div>
                            </div>
                            <div class="dpp-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#888"/>
                                </svg>
                            </div>
                        </div>
                    `;
                    
                    // Make entire card clickable to open PDF
                    dppCard.addEventListener('click', function() {
                        window.open(dpp.link, '_blank');
                    });
                    
                    contentGrid.appendChild(dppCard);
                });
                
            } catch (error) {
                console.error('Error loading DPP:', error);
                contentGrid.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 60px 20px;
                        text-align: center;
                        border-radius: 20px;
                        margin: 20px;
                    ">
                        <div style="
                            font-size: 3.5rem;
                            margin-bottom: 20px;
                            animation: shake 0.5s ease-in-out infinite alternate;
                        ">⚠️</div>
                        <div style="
                            color: #ff6b6b;
                            font-size: 1.4rem;
                            font-weight: 600;
                            margin-bottom: 10px;
                            text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                        ">Connection Error</div>
                        <div style="
                            color: #888;
                            font-size: 1rem;
                            opacity: 0.9;
                            line-height: 1.5;
                        ">Please check your internet connection</div>
                    </div>
                    <style>
                        @keyframes shake {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(5px); }
                        }
                    </style>
                `;
            }
        }
    }
    
    // Function to open our embedded video-player.html in a NEW TAB
    window.openYouTubeVideo = function(videoUrl, videoTitle, chapterName, subjectName) {
        console.log('Opening embedded player for:', videoUrl);
        
        // Extract video ID from URL
        let videoId = extractVideoId(videoUrl);
        if (!videoId) {
            // Try parsing via URLSearchParams as fallback
            try {
                const urlObj = new URL(videoUrl);
                videoId = urlObj.searchParams.get('v');
            } catch (e) {
                console.error('URL parsing failed', e);
            }
        }
        if (!videoId) {
            console.error('Could not determine video ID from URL:', videoUrl);
            return; // Do nothing instead of opening YouTube directly
        }
        
        // Build player page URL with parameters
        const playerUrl = `video-player.html?v=${videoId}&title=${encodeURIComponent(videoTitle || 'Video Lecture')}&chapter=${encodeURIComponent(chapterName || '')}&subject=${encodeURIComponent(subjectName || '')}`;
        
        // Open in new browser tab
        window.open(playerUrl, '_blank');
    };
    
    // Helper function to extract video ID from YouTube URL
    function extractVideoId(url) {
        if (!url) return null;
        // Common patterns
        const regex = /(?:youtube\.com\/(?:.*[?&]v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Restore state from URL on page load
    restoreStateFromURL();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        restoreStateFromURL();
    });
    
    // Add some interactive effects
    const topBar = document.querySelector('.top-bar h1');
    
    // Add a subtle animation to the title
    setInterval(() => {
        topBar.style.textShadow = '2px 2px 8px rgba(102, 126, 234, 0.3)';
        setTimeout(() => {
            topBar.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)';
        }, 1000);
    }, 3000);
    
    // Live Classes Card Status Management
    let isLiveEnabled = true; // Track live status globally
    let isLiveLoading = true; // Track loading state
    
    function applyLiveLoadingState() {
        const liveCard = document.getElementById('live-classes-card');
        if (!liveCard) return;
        
        const liveText = liveCard.querySelector('.live-classes-text');
        const liveDot = liveCard.querySelector('.live-dot');
        const liveIndicatorText = liveCard.querySelector('.live-text');
        
        // Loading state
        liveCard.style.display = 'flex';
        liveCard.style.opacity = '0.7';
        liveCard.style.cursor = 'wait';
        liveCard.style.filter = 'none';
        liveCard.style.pointerEvents = 'none';
        
        // Update text and indicator for loading
        if (liveText) liveText.textContent = 'Loading';
        if (liveIndicatorText) liveIndicatorText.textContent = 'LOADING';
        
        // Make live dot loading (slow pulsing animation with orange color)
        if (liveDot) {
            liveDot.style.backgroundColor = '#ff9800';
            liveDot.style.animation = 'pulse 1.5s infinite';
        }
    }
    
    function applyLiveStatus(isEnabled) {
        const liveCard = document.getElementById('live-classes-card');
        if (!liveCard) return;
        
        // Update global status
        isLiveEnabled = isEnabled;
        isLiveLoading = false;
        
        const liveText = liveCard.querySelector('.live-classes-text');
        const liveDot = liveCard.querySelector('.live-dot');
        const liveIndicatorText = liveCard.querySelector('.live-text');
        
        if (isEnabled) {
            // Enable live state
            liveCard.style.display = 'flex';
            liveCard.style.opacity = '1';
            liveCard.style.cursor = 'pointer';
            liveCard.style.filter = 'none';
            liveCard.style.pointerEvents = 'auto';
            
            // Update text and indicator
            if (liveText) liveText.textContent = 'Join Live Class';
            if (liveIndicatorText) liveIndicatorText.textContent = 'LIVE';
            
            // Make live dot active (pulsing animation)
            if (liveDot) {
                liveDot.style.backgroundColor = '#ff4444';
                liveDot.style.animation = 'pulse 2s infinite';
            }
        } else {
            // Disable live state
            liveCard.style.display = 'flex';
            liveCard.style.opacity = '0.6';
            liveCard.style.cursor = 'not-allowed';
            liveCard.style.filter = 'grayscale(50%)';
            liveCard.style.pointerEvents = 'none';
            
            // Update text and indicator
            if (liveText) liveText.textContent = 'No Live Class';
            if (liveIndicatorText) liveIndicatorText.textContent = 'OFFLINE';
            
            // Make live dot inactive (no animation, gray color)
            if (liveDot) {
                liveDot.style.backgroundColor = '#666';
                liveDot.style.animation = 'none';
            }
        }
    }
    
    // Set up click handler for live classes card
    function setupLiveCardHandler() {
        const liveCard = document.getElementById('live-classes-card');
        if (!liveCard) return;
        
        liveCard.addEventListener('click', function(e) {
            if (isLiveLoading || !isLiveEnabled) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            window.open('/Live/main.html', '_blank');
        });
    }
    
    // Initialize Supabase live status checking
    function initializeLiveStatus() {
        // Check if Supabase client is available
        if (!window.supabaseClient) {
            console.warn('Supabase client not available, live status checking disabled');
            return;
        }
        
        const supabase = window.supabaseClient;
        
        // Listen for live status changes in real-time
        supabase
            .channel('live_status')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'admin', filter: 'id=eq.videoLive' },
                (payload) => {
                    applyLiveStatus(payload.new.enabled);
                }
            )
            .subscribe();
        
        // Fetch initial live status
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('admin')
                    .select('enabled')
                    .eq('id', 'videoLive')
                    .single();
                    
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching live status:', error);
                    applyLiveStatus(true); // Default to enabled if error
                } else {
                    applyLiveStatus(data?.enabled ?? true); // Default to enabled if no data
                }
            } catch (err) {
                console.error('Error initializing live status:', err);
                applyLiveStatus(true); // Default to enabled if error
            }
        })();
    }
    
    // Set up live card click handler
    setupLiveCardHandler();
    
    // Initialize loading state immediately
    applyLiveLoadingState();
    
    // Initialize live status checking after a short delay to ensure Supabase is loaded
    // But ensure loading state shows for at least 5 seconds
    const startTime = Date.now();
    setTimeout(() => {
        initializeLiveStatus();
        
        // Override the applyLiveStatus to ensure minimum loading time
        const originalApplyLiveStatus = applyLiveStatus;
        window.applyLiveStatus = function(isEnabled) {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, 5000 - elapsed);
            
            if (remainingTime > 0) {
                // Still need to wait
                setTimeout(() => {
                    originalApplyLiveStatus(isEnabled);
                }, remainingTime);
            } else {
                // Minimum time has passed
                originalApplyLiveStatus(isEnabled);
            }
        };
    }, 1000);
    
    // Search Functionality
    function initializeSearch() {
    const searchInput = document.getElementById('lecture-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const chaptersContent = document.getElementById('chapters-content');
    
    if (!searchInput || !clearSearchBtn || !chaptersContent) {
        return; // Elements not found, search not available
    }
    
    let searchTimeout;
    let allVideosCache = {}; // Cache for all videos by subject
    
    // Search input event listener
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Show/hide clear button
        clearSearchBtn.style.display = query ? 'block' : 'none';
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        if (query.length === 0) {
            restoreOriginalChapters();
            return;
        }
        
        if (query.length < 2) {
            return; // Wait for at least 2 characters
        }
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Clear search button event listener
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        restoreOriginalChapters();
        searchInput.focus();
    });
    
    let originalChaptersHTML = ''; // Store original chapters HTML
    let isSearchActive = false;
    
    function restoreOriginalChapters() {
        if (originalChaptersHTML && isSearchActive) {
            chaptersContent.innerHTML = originalChaptersHTML;
            isSearchActive = false;
            
            // Reattach event listeners to chapter cards after restoring content
            const chapterCards = chaptersContent.querySelectorAll('.chapter-card');
            
            if (currentSubjectName) {
                // Find subject key from title
                const subjectKey = Object.keys(chaptersData).find(key => 
                    chaptersData[key].title === currentSubjectName
                ) || currentSubjectName.toLowerCase();
                
                const subjectData = chaptersData[subjectKey];
                if (subjectData) {
                    chapterCards.forEach((card, index) => {
                        // Skip the first card if it's "All Contents"
                        if (index === 0 && card.querySelector('.chapter-title').textContent === 'All Contents') {
                            card.addEventListener('click', function() {
                                showChapterContent('All Contents', currentSubjectName);
                            });
                        } else {
                            // Regular chapter cards
                            const chapterIndex = index - (card.querySelector('.chapter-title').textContent === 'All Contents' ? 1 : 0);
                            if (subjectData.chapters[chapterIndex]) {
                                const chapter = subjectData.chapters[chapterIndex];
                                card.addEventListener('click', function() {
                                    showChapterContent(chapter.name, currentSubjectName);
                                });
                            }
                        }
                    });
                }
            }
        }
    }
    
    // Function to clear search input and reset search state
    function clearSearch() {
        if (searchInput) {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            restoreOriginalChapters();
            originalChaptersHTML = ''; // Reset stored HTML
        }
    }
    
    // Make clearSearch available globally
    window.clearSearch = clearSearch;
    
    function storeOriginalChapters() {
        if (!originalChaptersHTML) {
            originalChaptersHTML = chaptersContent.innerHTML;
        }
    }
    
    async function performSearch(query) {
        // Store original chapters if not already stored
        storeOriginalChapters();
        
        // Show loading state
        chaptersContent.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                text-align: center;
                grid-column: 1 / -1;
            ">
                <div class="search-loading-spinner"></div>
                <div style="color: #00d4aa; font-size: 1.2rem; margin-top: 15px;">Searching lectures...</div>
            </div>
        `;
        isSearchActive = true;
        
        try {
            // Get current subject name
            const currentSubject = getCurrentSubjectName();
            if (!currentSubject) {
                showNoResults('No subject selected');
                return;
            }
            
            // Get all videos for current subject if not cached
            if (!allVideosCache[currentSubject]) {
                await cacheAllVideosForSubject(currentSubject);
            }
            
            const allVideos = allVideosCache[currentSubject] || [];
            
            // Filter videos based on search query (only video titles, not chapter names)
            const filteredVideos = allVideos.filter(video => 
                video.title.toLowerCase().includes(query.toLowerCase())
            );
            
            if (filteredVideos.length === 0) {
                showNoResults('No lectures found matching your search');
                return;
            }
            
            // Display search results
            displaySearchResults(filteredVideos, query);
            
        } catch (error) {
            console.error('Search error:', error);
            chaptersContent.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                    grid-column: 1 / -1;
                ">
                    <div style="font-size: 3rem; margin-bottom: 15px; opacity: 0.7;">⚠️</div>
                    <div style="color: #ff6b6b; font-size: 1.2rem; margin-bottom: 10px;">Search failed</div>
                    <div style="color: #888; font-size: 1rem;">Please try again</div>
                </div>
            `;
        }
    }
    
    function getCurrentSubjectName() {
        const subjectTitle = document.getElementById('subject-title');
        return subjectTitle ? subjectTitle.textContent.trim() : null;
    }
    
    async function cacheAllVideosForSubject(subjectName) {
        const subjectKey = Object.keys(chaptersData).find(key => 
            chaptersData[key].title === subjectName
        );
        
        if (!subjectKey || !chaptersData[subjectKey]) {
            allVideosCache[subjectName] = [];
            return;
        }
        
        const allVideos = [];
        const chapters = chaptersData[subjectKey].chapters;
        
        // Fetch videos from all chapters
        for (const chapter of chapters) {
            try {
                const chapterVideos = await youtubeAPI.getChapterVideos(chapter.name, 999);
                // Add chapter name to each video for search context
                chapterVideos.forEach(video => {
                    video.chapterName = chapter.name;
                });
                allVideos.push(...chapterVideos);
            } catch (error) {
                console.error(`Error fetching videos for chapter ${chapter.name}:`, error);
            }
        }
        
        allVideosCache[subjectName] = allVideos;
    }
    
    function displaySearchResults(videos, query) {
        // Add cancel search button at the top
        const cancelSearchButton = `
            <div style="
                display: flex;
                justify-content: flex-start;
                margin-bottom: 20px;
                grid-column: 1 / -1;
            ">
                <button id="cancel-search-btn" class="cancel-search-button" style="
                    background: #ff4757;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Chapters
                </button>
            </div>
        `;
        
        const resultsHTML = videos.map(video => {
            // Highlight search terms in title
            const highlightedTitle = highlightSearchTerm(video.title, query);
            
            return `
                <div class="search-result-card" data-video-url="${video.videoUrl}" data-video-title="${video.title}" data-chapter-name="${video.chapterName}" data-subject-name="${getCurrentSubjectName()}">
                    <div class="search-result-thumbnail" style="background-image: url('${video.thumbnail}')">
                        <div class="search-result-play-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="search-result-info">
                        <div class="search-result-meta">
                            <div class="search-result-date">${video.publishedAt}</div>
                            <div class="search-result-duration">${video.duration}</div>
                        </div>
                        <div class="search-result-title">${highlightedTitle}</div>
                        <div class="search-result-chapter">${video.chapterName}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        chaptersContent.innerHTML = cancelSearchButton + resultsHTML;
        
        // Add click event listeners to search results
        const resultItems = chaptersContent.querySelectorAll('.search-result-card');
        resultItems.forEach(item => {
            item.addEventListener('click', function() {
                const videoUrl = this.getAttribute('data-video-url');
                const videoTitle = this.getAttribute('data-video-title');
                const chapterName = this.getAttribute('data-chapter-name');
                const subjectName = this.getAttribute('data-subject-name');
                
                // Open video while preserving search state
                openYouTubeVideo(videoUrl, videoTitle, chapterName, subjectName);
            });
        });
        
        // Add click event listener for cancel search button
        const cancelSearchBtn = document.getElementById('cancel-search-btn');
        if (cancelSearchBtn) {
            cancelSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
                restoreOriginalChapters();
                searchInput.focus();
            });
        }
    }
    
    function highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark style="background: rgba(0, 212, 170, 0.3); color: #fff; padding: 1px 2px; border-radius: 2px;">$1</mark>');
    }
    
    function showNoResults(message) {
        chaptersContent.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                text-align: center;
                grid-column: 1 / -1;
            ">
                <div style="font-size: 3rem; margin-bottom: 15px; opacity: 0.7;">🔍</div>
                <div style="color: #888; font-size: 1.2rem; margin-bottom: 10px;">${message}</div>
                <div style="color: #666; font-size: 1rem;">Try different keywords or check spelling</div>
            </div>
        `;
    }
    
    } // End of initializeSearch function
    
    // Function to open YouTube video in video player
    function openYouTubeVideo(videoUrl, videoTitle, chapterName, subjectName) {
        // Extract video ID from YouTube URL
        const videoId = getYouTubeVideoId(videoUrl);
        if (!videoId) {
            console.error('Invalid YouTube URL:', videoUrl);
            return;
        }
        
        // Construct URL with parameters
        const playerUrl = `video-player.html?v=${videoId}&title=${encodeURIComponent(videoTitle)}&chapter=${encodeURIComponent(chapterName)}&subject=${encodeURIComponent(subjectName)}`;
        
        // Open in new tab
        window.open(playerUrl, '_blank');
    }
    
    // Helper function to extract YouTube video ID
    function getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Make functions available globally
    window.openYouTubeVideo = openYouTubeVideo;
    window.getYouTubeVideoId = getYouTubeVideoId;
    
}); // End of DOMContentLoaded

