'use client';
import { useState, useEffect, use } from 'react'; // 1. Import 'use'
import { fetchFromAPI } from '@/utils/fetchFromAPI';
import CustomPlayer from '@/components/CustomPlayer';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchFeed({ params }) {
  // 2. Unwrap the params Promise
  const unwrappedParams = use(params);
  const searchTerm = unwrappedParams.searchTerm;

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // 3. Fetch data using the unwrapped search term
    fetchFromAPI(`search`, {
      part: 'snippet',
      q: decodeURIComponent(searchTerm),
      type: 'video' 
    }).then((data) => setVideos(data?.items || []));
  }, [searchTerm]);

  return (
    <div className="p-4 h-full overflow-y-auto bg-[#0f0f0f] text-white">
      <h2 className="text-xl font-bold mb-6">
        Results for <span className="text-[#ff0000]">{decodeURIComponent(searchTerm)}</span>
      </h2>

      {/* Featured Player if a video is clicked */}
      {selectedVideo && (
        <div className="mb-6 aspect-video w-full max-w-4xl mx-auto">
          <CustomPlayer videoId={selectedVideo} />
          <button 
             onClick={() => setSelectedVideo(null)}
             className="mt-2 text-sm text-gray-400 hover:text-white"
          >
            Close Player
          </button>
        </div>
      )}

      {/* List Layout for Search Results */}
      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        {videos.map((item, idx) => {
          const videoId = item.id.videoId;
          if (!videoId) return null;

          return (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row gap-4 cursor-pointer group"
              onClick={() => setSelectedVideo(videoId)}
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-[360px] aspect-video rounded-xl overflow-hidden bg-[#272727] shrink-0">
                <Image 
                  src={item.snippet?.thumbnails?.medium?.url} 
                  alt={item.snippet?.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {item.snippet?.liveBroadcastContent === 'live' && (
                   <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                     <span className="w-2 h-2 bg-white rounded-full animate-pulse"/> LIVE
                   </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col py-1">
                <h3 className="text-lg font-medium line-clamp-2 leading-tight group-hover:text-[#3ea6ff]">
                  {item.snippet?.title}
                </h3>
                <p className="text-[#aaaaaa] text-xs mt-1 mb-2">
                   {item.snippet?.publishTime?.slice(0, 10)}
                </p>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-[#272727] flex items-center justify-center text-[10px] text-[#aaaaaa]">
                      {item.snippet?.channelTitle?.slice(0,1)}
                   </div>
                   <span className="text-[#aaaaaa] text-sm hover:text-white transition-colors">
                     {item.snippet?.channelTitle}
                   </span>
                </div>
                <p className="text-[#aaaaaa] text-sm line-clamp-2 hidden sm:block">
                  {item.snippet?.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}