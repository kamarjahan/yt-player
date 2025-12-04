import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const options = {
  params: {
    maxResults: 50,
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  },
};

export const fetchFromAPI = async (url, customParams = {}) => {
  try {
    // FIX: Remove leading slash if present to avoid "https://.../v3//search"
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;

    const { data } = await axios.get(`${BASE_URL}/${cleanUrl}`, {
      ...options,
      params: {
        ...options.params,
        ...customParams,
      }
    });

    return data;

  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error ${error.response.status}:`, error.response.data.error.message);
      
      if (error.response.status === 403) {
         alert("API Quota Exceeded! You have used your daily YouTube limit. Please create a new API Key or wait until tomorrow.");
      }
    } else {
      console.error("API Error:", error.message);
    }
    return null;
  }
};