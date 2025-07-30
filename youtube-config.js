// YouTube API Configuration
const YOUTUBE_CONFIG = {
    API_KEY: 'AIzaSyAHeRMqQ8Cvjrr6e5GJ7Q0ViE8FnZLUQqU',
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
};

// Ensure global variables exist (they should be loaded from id.js)
if (typeof window !== 'undefined' && !window.CHAPTER_PLAYLISTS) {
    window.CHAPTER_PLAYLISTS = {};
}
if (typeof window !== 'undefined' && !window.CUSTOM_VIDEO_OVERRIDES) {
    window.CUSTOM_VIDEO_OVERRIDES = {};
}

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
            const override = window.CUSTOM_VIDEO_OVERRIDES[item.id];
            
            return {
                id: item.id,
                title: override?.title || snippet.title,
                description: snippet.description,
                thumbnail: override?.thumbnail || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
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
            const playlistId = window.CHAPTER_PLAYLISTS[chapterName];
            
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
window.YOUTUBE_CONFIG = YOUTUBE_CONFIG;
