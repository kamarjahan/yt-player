'use client';
import { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/utils/fetchFromAPI';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('New');
  const [videos, setVideos] = useState([]);

  const categories = [
    { name: 'All', query: 'New' },
    { name: 'Live', query: 'Live', type: 'live' },
    { name: 'Music', query: 'Music' },
    { name: 'Gaming', query: 'Gaming' },
    { name: 'JavaScript', query: 'JavaScript' },
    { name: 'React', query: 'ReactJS' },
    { name: 'Computer programming', query: 'Coding' },
    { name: 'Podcasts', query: 'Podcasts' },
  ];

  useEffect(() => {
    setVideos([]);
    const isLive = selectedCategory === 'Live';
    const params = {
      part: 'snippet',
      q: isLive ? 'news' : selectedCategory,
      type: 'video',
      eventType: isLive ? 'live' : undefined
    };

    fetchFromAPI(`search`, params)
      .then((data) => setVideos(data?.items || []));
  }, [selectedCategory]);

  return (
    <div className="p-4 sm:p-6 pb-20 w-full">
      
      {/* Category Pills - Sticky & Smooth */}
      <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2 sticky top-0 bg-yt-base z-30 py-2 w-full">
        {categories.map((cat) => (
          <button 
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.name 
                ? 'bg-white text-black' 
                : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Pro Video Grid - 4 Columns on Large Screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4">
        {videos.map((item, idx) => {
           if(!item.id.videoId) return null;
           
           return (
            <Link 
              key={idx} 
              href={`/video/${item.id.videoId}`}
              className="group cursor-pointer flex flex-col gap-2"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727]">
                <Image 
                   src={item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url}
                   alt={item.snippet?.title}
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {item.snippet?.liveBroadcastContent === 'live' ? (
                  <div className="absolute bottom-2 right-2 bg-red-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/> LIVE
                  </div>
                ) : (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                    12:45
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-1 items-start">
                 <div className="w-9 h-9 rounded-full bg-[#272727] shrink-0 flex items-center justify-center text-xs text-[#aaaaaa] font-bold border border-transparent overflow-hidden">
                    {/* Fallback avatar if no image */}
                    {item.snippet?.channelTitle?.slice(0,1).toUpperCase()}
                 </div>
                 
                 <div className="flex flex-col">
                    <h3 className="text-white font-semibold text-[15px] line-clamp-2 leading-tight group-hover:text-white" title={item.snippet?.title}>
                      {item.snippet?.title}
                    </h3>
                    <div className="text-[#aaaaaa] text-sm mt-1">
                       <p className="hover:text-white transition-colors">{item.snippet?.channelTitle}</p>
                       <p>{item.snippet?.publishTime ? new Date(item.snippet.publishTime).toDateString().slice(4) : 'Just now'}</p>
                    </div>
                 </div>
              </div>
            </Link>
           );
        })}
      </div>
    </div>
  );
}