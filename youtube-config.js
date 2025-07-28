// YouTube API Configuration
const YOUTUBE_CONFIG = {
    API_KEY: 'AIzaSyAHeRMqQ8Cvjrr6e5GJ7Q0ViE8FnZLUQqU',
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
};

const CHAPTER_PLAYLISTS = {
    // Physics Chapters
    'Units and Dimension': 'PL6NSTQ0P5K07v4swaLyzNnJUOjeLcBx03',
    'Basic Maths & Calculus': 'PL6NSTQ0P5K07TGYSBjMGKERGopGzwZnk3',
    'Motion in a Straight Line': 'PL6NSTQ0P5K07oSHB9flt1A0iDSqJHv6JE',
    'Vectors': 'PL6NSTQ0P5K05diiCZKemCeTav7Lz6wwIB',
    'Motion in a Plane': 'PL6NSTQ0P5K055wDxB2YqKWi1Rz5j8efjW',
    'Laws of Motion': 'PL6NSTQ0P5K07O90P9s_zeRc_cp0w5rKto',
    'Work, Energy and Power': 'PL6NSTQ0P5K06EVijlqlj6xe4PiMfoHueW',
    'System of Particles and Rotational Motion': 'PL6NSTQ0P5K055sl1xRC7HdUtZC-WlSyc-',
    'Gravitation': 'PL6NSTQ0P5K06mZiHGdH7A9IMfG_qYCCSN',
    'Mechanical Properties of Solids': 'PL6NSTQ0P5K07ceXlDeoTzdS7ZkK9NUnTu',
    'Mechanical Properties of Fluids': 'PL6NSTQ0P5K06rkORrH0ZwxuS0ANKmmVp-',
    'Thermal Properties of Matter': 'PL6NSTQ0P5K05gNckQ4jKFvNki1JdTOqJ-',
    'Thermodynamics': 'PL6NSTQ0P5K047BylJPoPqdhO2OLAOA5gV',
    'Kinetic Theory': 'PL6NSTQ0P5K050Tj7c_ttCW0mkuahr2JiB',
    'Oscillations': 'PL6NSTQ0P5K04O4KEOsz_OHDvVFiqR--6m',
    'Waves': 'PL6NSTQ0P5K06sjps5Kjcuu7_6UsZWwwdY',
    
    // Chemistry Chapters
    'Some Basic Concepts of Chemistry (Physical Chemistry)': 'PL6NSTQ0P5K04b35FKwEPdjD_KspxnwBw5',
    'Structure of Atom (Physical Chemistry)': 'PL6NSTQ0P5K07i_NtdtyBztgaCMDtX78Gc',
    'Classification of Elements (Inorganic Chemistry)': 'PL6NSTQ0P5K06Tr-YpjLmR0gF0eLxfPnFW',
    'Chemical Bonding and Molecular Structure (Physical Chemistry)': 'PL6NSTQ0P5K05zHPN5FpU0uNEAWonGXIQR',
    'States of Matter (Physical Chemistry)': 'PL6NSTQ0P5K05VTfSE53uqxPwbin_FLadC',
    'Thermodynamics (Physical Chemistry)': 'PL6NSTQ0P5K047BylJPoPqdhO2OLAOA5gV',
    'Equilibrium (Physical Chemistry)': 'PL6NSTQ0P5K07OWTihBfWpQbTtzZsKklG6',
    'Redox Reactions (Physical Chemistry)': 'PL6NSTQ0P5K06mcqS91cF0YRYoNlGWAyOw',
    'Hydrogen (Inorganic Chemistry)': 'PL6NSTQ0P5K04Fom9SbHAfbp3X4rU8BfPS',
    'The s-Block Elements (Inorganic Chemistry)': 'PL6NSTQ0P5K04VQWFNI5fpJ0cdo6-kyNwo',
    'The p-Block Elements (Inorganic Chemistry)': 'PL6NSTQ0P5K05Zy87nd1nrhoyZ0M7K8xDy',
    'Organic Chemistry - Some Basic Principles (Organic Chemistry)': 'PL6NSTQ0P5K05Z8C3xWJh6_x7YcYmgqm3L',
    'Hydrocarbons (Organic Chemistry)': 'PL6NSTQ0P5K0538oflea825Awcv99tdHvN',
    'Environmental Chemistry (Physical Chemistry)': 'PL6NSTQ0P5K07YANcOfuhHl1iyvQW2iLsU',
    
    // Mathematics Chapters
    'Sets': 'PL6NSTQ0P5K06z4c_fiuwP-earmQZ23133',
    'Relations And Functions': 'PL6NSTQ0P5K04Cu2KlKGC85P0KvzpHDUXn',
    'Trigonometric Functions': 'PL6NSTQ0P5K06Smsp_Gbhphj-CjGEhMQcf',
    'Principle of Mathematical Induction': 'PL6NSTQ0P5K06z7zAvO7D3eZSxDDbBE_-p',
    'Complex Numbers and Quadratic Equations': 'YOUR_PLAYLIST_ID_HERE',
    'Linear Inequations': 'PL6NSTQ0P5K056VwPkbL8OkRl-a2songPT',
    'Permutations and Combinations': 'YOUR_PLAYLIST_ID_HERE',
    'Binomial Theorem': 'YOUR_PLAYLIST_ID_HERE',
    'Sequences and Series': 'YOUR_PLAYLIST_ID_HERE',
    'Straight Lines': 'YOUR_PLAYLIST_ID_HERE',
    'Conic Sections': 'YOUR_PLAYLIST_ID_HERE',
    'Introduction to Three Dimensional Geometry': 'YOUR_PLAYLIST_ID_HERE',
    'Limits and Derivatives': 'YOUR_PLAYLIST_ID_HERE',
    'Mathematical Reasoning': 'YOUR_PLAYLIST_ID_HERE',
    'Statistics': 'YOUR_PLAYLIST_ID_HERE',
    'Probability': 'YOUR_PLAYLIST_ID_HERE',
    'Basic Mathematics': 'PL6NSTQ0P5K04sGuZfSwMHblrz1eq49HkK',
    
    // Biology Chapters
    'The Living World (Botany)': 'PL6NSTQ0P5K04HR-2RFhmUwqGq3zQaT2lW',
    'Biological Classification (Botany)': 'PL6NSTQ0P5K05Uwz7A3SPqzm_-VmdQnzRN',
    'Plant Kingdom (Botany)': 'PL6NSTQ0P5K062-NDa9wNaYtXUUY5Aszrl',
    'Morphology of Flowering Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Anatomy of Flowering Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Cell - The Unit of Life (Botany)': 'PL6NSTQ0P5K05Y5kwmdABGokjn4BAcslV7',
    'Cell Cycle and Cell Division (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Transport in Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Mineral Nutrition (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Photosynthesis in Higher Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Respiration in Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Plant Growth and Development (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Animal Kingdom (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Structural Organisation in Animals (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Biomolecules (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Digestion and Absorption (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Breathing and Exchange of Gases (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Body Fluids and Circulation (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Excretory Products and their Elimination (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Locomotion and Movement (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Neural Control and Coordination (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Chemical Coordination and Integration (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    
    // English Sections (Already Complete)
    'Hornbill : Prose': 'PL6NSTQ0P5K05lqp2O9VFWxzT415eSjA3s',
    'Snapshot : Prose': 'PL6NSTQ0P5K055hoyfWqfIfx57_QW688jY',
    'Figures of Speech': 'PL6NSTQ0P5K07LGmHdzLYUOGtSXQ0Baiwi',
    'Hornbill : Poetry': 'PL6NSTQ0P5K06QlUeEGL8eaP7cYoli-OoN',
    'Grammar': 'PL6NSTQ0P5K07HWmwISjxELpL-_z3tcOjU',
    'Writing Skills': 'PL6NSTQ0P5K04bcQc-rJIDC1ojjot4n3md',
    
    // Computer Science Chapters
    'Computer System and Organisation': 'YOUR_PLAYLIST_ID_HERE',
    'Computational Thinking and Programming': 'YOUR_PLAYLIST_ID_HERE',
    'Society, Law and Ethics': 'YOUR_PLAYLIST_ID_HERE',
    'Data Management': 'YOUR_PLAYLIST_ID_HERE',
    'Impact of Technology': 'YOUR_PLAYLIST_ID_HERE',
    
    // Physical Education Chapters
    'Physical Fitness, Wellness and Lifestyle': 'YOUR_PLAYLIST_ID_HERE',
    'Olympic Movement': 'YOUR_PLAYLIST_ID_HERE',
    'Yoga': 'YOUR_PLAYLIST_ID_HERE',
    'Physical Activity and Leadership Training': 'YOUR_PLAYLIST_ID_HERE'
};


const CUSTOM_VIDEO_OVERRIDES = {
    'ym0if1NY2yM': {
        title: 'Sets 01 : Sets || Representation of Sets || Types of Sets || The Empty Set',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/e7ab34fd-f5bb-409e-9f33-2131a333cf14.png'
    },
    'YIItUETFjnA': {
        title: 'Units and Dimension 01 : Introduction to Physics || Units of Measurement || NO DPP',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/d9644373-18ba-4870-88ab-7422164de818.png'
    },
    '02rjTlcyIUo': {
        title: 'Some Basic Concepts of Chemistry 01 : Importance of Chemistry || Introduction to Matter || Physical and Chemical Classification of Matter || NO DPP',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/c0534d1b-e11c-4d4e-b25f-2fda39ba3c61.png'
    },
    'McbBoH2zAFQ': {
        title: 'Cell - The Unit of Life 01 : Introduction to Cell || Cell Theory || Rescheduled @05:00 PM',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/d8853433-3a04-4b29-9d00-b56c2df27b78.png'
    },
    'hB478LQayc4': {
        title: 'Hornbill 01 : Prose 01 : The Portrait of a Lady',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bb0d31fb-f05d-466e-8a8d-78de03605897.png'
    },
    
};

// YouTube API Functions
class YouTubeAPI {
    constructor() {
        this.apiKey = YOUTUBE_CONFIG.API_KEY;
        this.baseUrl = YOUTUBE_CONFIG.BASE_URL;
    }
    
    // Search for videos based on query
    async searchVideos(query, maxResults = 10) {
        try {
            const url = `${this.baseUrl}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${this.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error('YouTube API Error:', data.error);
                return [];
            }
            
            return data.items || [];
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            return [];
        }
    }
    
    // Get video details including duration
    async getVideoDetails(videoIds) {
        try {
            const ids = videoIds.join(',');
            const url = `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${ids}&key=${this.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error('YouTube API Error:', data.error);
                return [];
            }
            
            return data.items || [];
        } catch (error) {
            console.error('Error fetching video details:', error);
            return [];
        }
    }
    
    // Convert ISO 8601 duration to readable format
    parseDuration(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');
        
        let result = '';
        if (hours) result += hours.padStart(2, '0') + ':';
        result += (minutes || '0').padStart(2, '0') + ':';
        result += (seconds || '0').padStart(2, '0');
        
        return result;
    }
    
    // Format video data for display
    formatVideoData(videoItems) {
        return videoItems.map(item => {
            const snippet = item.snippet;
            const duration = item.contentDetails ? this.parseDuration(item.contentDetails.duration) : '00:00';
            
            // Check for custom overrides
            const customOverride = CUSTOM_VIDEO_OVERRIDES[item.id];
            
            return {
                id: item.id,
                title: customOverride?.title || snippet.title,
                description: snippet.description,
                thumbnail: customOverride?.thumbnail || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
                duration: duration,
                publishedAt: new Date(snippet.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                channelTitle: snippet.channelTitle,
                videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
                embedUrl: `https://www.youtube.com/embed/${item.id}`
            };
        });
    }
    
    // Get videos from a specific playlist
    async getPlaylistVideos(playlistId, maxResults = 50) {
        try {
            const url = `${this.baseUrl}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${this.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error('YouTube Playlist API Error:', data.error);
                return [];
            }
            
            return data.items || [];
        } catch (error) {
            console.error('Error fetching playlist videos:', error);
            return [];
        }
    }
    
    // FETCH VIDEOS FROM PLAYLIST - Main function
    async getChapterVideos(chapterName, maxResults = 8) {
        try {
            console.log(`Fetching videos for chapter: ${chapterName}`);
            
            // Get playlist ID for this chapter
            const playlistId = CHAPTER_PLAYLISTS[chapterName];
            
            if (!playlistId || playlistId === 'YOUR_PLAYLIST_ID_HERE' || playlistId === 'YOUR_ALL_VIDEOS_PLAYLIST_ID') {
                console.log(`No playlist ID configured for chapter: ${chapterName}`);
                return [];
            }
            
            // Get videos from the specific playlist
            const playlistVideos = await this.getPlaylistVideos(playlistId, maxResults);
            
            if (playlistVideos.length === 0) {
                console.log(`No videos found in playlist for chapter: ${chapterName}`);
                return [];
            }
            
            console.log(`Found ${playlistVideos.length} videos in playlist for ${chapterName}`);
            
            // Get video IDs from playlist items
            const videoIds = playlistVideos.map(item => item.snippet.resourceId.videoId);
            
            // Get detailed video information
            const videoDetails = await this.getVideoDetails(videoIds);
            
            // Format and return video data
            return this.formatVideoData(videoDetails);
            
        } catch (error) {
            console.error('Error in getChapterVideos:', error);
            return [];
        }
    }
}

// Export for use in main script
window.YouTubeAPI = YouTubeAPI;
