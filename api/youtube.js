// api/youtube.js - Serverless function for YouTube Data API

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Get video ID from request body
        const { videoId } = req.body;

        if (!videoId) {
            return res.status(400).json({ 
                error: 'Video ID is required' 
            });
        }

        // Validate video ID format (YouTube video IDs are 11 characters)
        if (typeof videoId !== 'string' || videoId.length !== 11) {
            return res.status(400).json({ 
                error: 'Invalid YouTube video ID format' 
            });
        }

     
        const API_KEY = process.env.YOUTUBE_API_KEY;
        
        if (!API_KEY) {
            console.error('YouTube API key not found in environment variables');
            return res.status(500).json({ 
                error: 'Server configuration error' 
            });
        }

        // YouTube Data API v3 endpoints
        const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
        
        // Fetch video details and statistics
        const videoResponse = await fetch(
            `${YOUTUBE_API_BASE}/videos?` +
            `part=snippet,statistics,contentDetails&` +
            `id=${videoId}&` +
            `key=${API_KEY}`
        );

        if (!videoResponse.ok) {
            if (videoResponse.status === 403) {
                return res.status(403).json({ 
                    error: 'YouTube API quota exceeded or invalid API key' 
                });
            }
            throw new Error(`YouTube API error: ${videoResponse.status}`);
        }

        const videoData = await videoResponse.json();

        // Check if video exists
        if (!videoData.items || videoData.items.length === 0) {
            return res.status(404).json({ 
                error: 'Video not found or is private/unavailable' 
            });
        }

        const video = videoData.items[0];
        const channelId = video.snippet.channelId;


        let channelData = null;
        try {
            const channelResponse = await fetch(
                `${YOUTUBE_API_BASE}/channels?` +
                `part=snippet,statistics&` +
                `id=${channelId}&` +
                `key=${API_KEY}`
            );

            if (channelResponse.ok) {
                const channelResult = await channelResponse.json();
                if (channelResult.items && channelResult.items.length > 0) {
                    channelData = channelResult.items[0];
                }
            }
        } catch (error) {
            console.error('Error fetching channel data:', error);
            // Continue without channel data
        }

        const responseData = {
            video: {
                id: video.id,
                snippet: {
                    title: video.snippet.title,
                    description: video.snippet.description,
                    channelId: video.snippet.channelId,
                    channelTitle: video.snippet.channelTitle,
                    publishedAt: video.snippet.publishedAt,
                    thumbnails: video.snippet.thumbnails,
                    tags: video.snippet.tags || [],
                    defaultLanguage: video.snippet.defaultLanguage,
                    defaultAudioLanguage: video.snippet.defaultAudioLanguage
                },
                statistics: {
                    viewCount: video.statistics.viewCount || '0',
                    likeCount: video.statistics.likeCount || '0',
                    commentCount: video.statistics.commentCount || '0'
                },
                contentDetails: {
                    duration: video.contentDetails.duration,
                    definition: video.contentDetails.definition
                }
            },
            channel: channelData ? {
                id: channelData.id,
                snippet: {
                    title: channelData.snippet.title,
                    description: channelData.snippet.description,
                    thumbnails: channelData.snippet.thumbnails
                },
                statistics: {
                    subscriberCount: channelData.statistics.subscriberCount,
                    videoCount: channelData.statistics.videoCount,
                    viewCount: channelData.statistics.viewCount
                }
            } : null,
            fetchedAt: new Date().toISOString()
        };

        // Return successful response
        return res.status(200).json(responseData);

    } catch (error) {
        console.error('YouTube API function error:', error);

        // Handle different types of errors
        if (error.message.includes('fetch')) {
            return res.status(503).json({ 
                error: 'Unable to connect to YouTube API. Please try again later.' 
            });
        }

        if (error.message.includes('timeout')) {
            return res.status(408).json({ 
                error: 'Request timeout. Please try again.' 
            });
        }

        // Generic server error
        return res.status(500).json({ 
            error: 'Internal server error. Please try again later.' 
        });
    }
}

