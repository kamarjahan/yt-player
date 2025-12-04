'use client';
import { useState, useEffect, use } from 'react'; // Added 'use' hook
import { fetchFromAPI } from '@/utils/fetchFromAPI';
import CustomPlayer from '@/components/CustomPlayer';
import Link from 'next/link';
import { FaThumbsUp, FaShare } from 'react-icons/fa';

export default function VideoDetails({ params }) {
  // FIX: Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (!id) return;

    // 1. Fetch Video Details
    fetchFromAPI(`videos`, {
      part: 'snippet,statistics',
      id: id
    }).then((data) => setVideoDetail(data?.items[0]));

    // 2. Fetch Related Videos
    fetchFromAPI(`search`, {
      part: 'snippet',
      relatedToVideoId: id,
      type: 'video'
    }).then((data) => setRelatedVideos(data?.items || []));
  }, [id]);

  if (!videoDetail?.snippet) return <div className="p-10 text-center text-white">Loading...</div>;

  const { snippet: { title, channelTitle, description }, statistics: { viewCount, likeCount } } = videoDetail;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 min-h-screen bg-yt-base text-white">
      
      {/* LEFT SIDE: Player & Info */}
      <div className="flex-1">
        <div className="w-full">
           <CustomPlayer videoId={id} />
        </div>
        
        <h1 className="text-xl font-bold mt-4 mb-2">{title}</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-yt-light/20 pb-4">
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                 {channelTitle.slice(0,1)}
              </div>
              <div>
                 <h3 className="font-semibold">{channelTitle}</h3>
                 <p className="text-xs text-gray-400">1.2M subscribers</p>
              </div>
              <button className="ml-4 bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200">
                 Subscribe
              </button>
           </div>

           <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-yt-light px-4 py-2 rounded-full hover:bg-yt-hover">
                 <FaThumbsUp /> {parseInt(likeCount).toLocaleString()}
              </button>
              <button className="flex items-center gap-2 bg-yt-light px-4 py-2 rounded-full hover:bg-yt-hover">
                 <FaShare /> Share
              </button>
           </div>
        </div>

        <div className="mt-4 bg-yt-light/30 p-3 rounded-xl text-sm">
           <p className="font-bold mb-1">{parseInt(viewCount).toLocaleString()} views</p>
           <p className="whitespace-pre-wrap">{description?.slice(0, 250)}...</p>
        </div>
      </div>

      {/* RIGHT SIDE: Related Videos */}
      <div className="w-full md:w-[350px] flex flex-col gap-3">
        <h3 className="text-lg font-bold mb-2 hidden md:block">Related Videos</h3>
        {relatedVideos.map((item, idx) => (
          <Link key={idx} href={`/video/${item.id.videoId}`} className="flex gap-2 group cursor-pointer">
             <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                <img 
                  src={item.snippet.thumbnails.medium.url} 
                  alt={item.snippet.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
             </div>
             <div className="flex flex-col gap-1">
                <h4 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-blue-400">
                  {item.snippet.title}
                </h4>
                <p className="text-xs text-gray-400">{item.snippet.channelTitle}</p>
                <p className="text-xs text-gray-400">New</p>
             </div>
          </Link>
        ))}
      </div>

    </div>
  );
}