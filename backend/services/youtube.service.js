import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * @description Searches YouTube for videos matching the given query using
 * the YouTube Data API v3. Returns an array of video URLs.
 *
 * @param {string} query - The search query (will be prefixed with "teaching")
 * @param {number} [maxResults=5] - Maximum number of video links to return
 * @returns {Promise<string[]>} Array of YouTube video URLs
 */
export async function searchVideos(query, maxResults = 5) {
  const apiKey = process.env.YT_API_KEY;
  const searchQuery = `teaching ${query}`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=${maxResults}&key=${apiKey}`;

  const response = await axios.get(url, { withCredentials: true });
  const videos = response.data.items;
  const linkArray = [];

  videos.forEach((video) => {
    if (video.id.videoId) {
      linkArray.push(`https://www.youtube.com/watch?v=${video.id.videoId}`);
    }
  });

  return linkArray;
}
