'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaCog, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaCircle } from 'react-icons/fa';

const CustomPlayer = ({ videoId }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // NEW: State for auto-hiding controls
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const opts = useMemo(() => ({
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3, 
    },
  }), []);

  // --- Auto-Hide Logic ---
  const handleInteraction = () => {
    setShowControls(true);

    // Clear existing timer
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Only set timer to hide if video is playing
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000); // 3 Seconds delay
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Ensure controls stay visible when paused
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      // If we just started playing, trigger the auto-hide logic
      handleInteraction();
    }
  }, [isPlaying]);

  // --- Helper: Format Time ---
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    return `${mm}:${ss}`;
  };

  // --- Player Event Handlers ---
  const onReady = (event) => {
    const p = event.target;
    setPlayer(p);
    setDuration(p.getDuration());
    p.playVideo(); 
  };

  const onStateChange = (event) => {
    setIsPlaying(event.data === 1);
  };

  // --- Tracking Progress ---
  useEffect(() => {
    if (isPlaying && player) {
      intervalRef.current = setInterval(() => {
        const time = player.getCurrentTime();
        setCurrentTime(time);
        
        const dur = player.getDuration();
        if (dur && dur !== duration) setDuration(dur);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, player, duration]);

  // --- Controls Logic ---
  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    player.seekTo(newTime);
    handleInteraction(); // Keep controls shown while dragging
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if(containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if(document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleQuality = (quality) => {
    if (player && player.setPlaybackQuality) {
       player.setPlaybackQuality(quality);
       setShowSettings(false);
    }
  };

  const handleSpeed = (rate) => {
    if (player) {
      player.setPlaybackRate(rate);
      setPlaybackSpeed(rate);
      setShowSettings(false);
    }
  };

  const jumpToLive = () => {
    if (player) {
      const liveDuration = player.getDuration();
      player.seekTo(liveDuration - 1); 
      player.playVideo();
    }
  };

  const isLiveStream = duration === 0 || duration > 100000 || (player?.getVideoData?.()?.isLive); 
  const isAtLiveEdge = Math.abs(duration - currentTime) < 15;

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleInteraction}
      onMouseLeave={handleMouseLeave}
      onClick={handleInteraction}
      className={`relative group w-full bg-black overflow-hidden shadow-2xl ${isFullScreen ? 'h-screen' : 'aspect-video rounded-xl'} ${!showControls && isPlaying ? 'cursor-none' : 'cursor-default'}`}
    >
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        onReady={onReady}
        onStateChange={onStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />

      {/* --- Custom Overlay --- */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        
        {/* Progress Bar */}
        <div className="w-full mb-4 flex items-center gap-4 group/slider">
           <input
             type="range"
             min="0"
             max={duration || 100}
             value={currentTime}
             onChange={handleSeek}
             className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-1.5 transition-all"
           />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-yt-red transition-colors">
              {isPlaying ? <FaPause size={22}/> : <FaPlay size={22}/>}
            </button>

            <div className="group/vol flex items-center gap-2">
                <button onClick={() => { setIsMuted(!isMuted); player.isMuted() ? player.unMute() : player.mute(); }}>
                  {isMuted ? <FaVolumeMute size={20}/> : <FaVolumeUp size={20}/>}
                </button>
                <input 
                  type="range" min="0" max="100" 
                  value={volume} 
                  onChange={(e) => { setVolume(e.target.value); player.setVolume(e.target.value); }}
                  className="w-0 group-hover/vol:w-20 transition-all duration-300 h-1 accent-white appearance-none bg-gray-600 rounded"
                />
            </div>

            <div className="text-xs font-medium flex items-center gap-2">
               {isLiveStream ? (
                 <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-white ${isAtLiveEdge ? 'bg-red-600' : 'bg-gray-600'}`}>
                       <FaCircle size={6} className={isAtLiveEdge ? "animate-pulse" : ""} /> 
                       {isAtLiveEdge ? "LIVE" : "DELAYED"}
                    </span>
                    {!isAtLiveEdge && (
                      <button onClick={jumpToLive} className="text-gray-300 hover:text-white uppercase font-bold tracking-wider">
                        Jump to Live
                      </button>
                    )}
                 </div>
               ) : (
                 <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
               )}
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {showSettings && (
              <div className="absolute bottom-12 right-0 bg-yt-light/95 backdrop-blur-md p-3 rounded-xl w-48 shadow-xl border border-white/10 z-50 animate-fade-in mb-2">
                <div className="mb-3 border-b border-gray-700 pb-2">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Speed</p>
                  <div className="flex justify-between text-xs gap-1">
                    {[0.5, 1, 1.5, 2].map(r => (
                      <button 
                        key={r} 
                        onClick={() => handleSpeed(r)}
                        className={`px-2 py-1 rounded w-full ${playbackSpeed === r ? 'bg-white text-black font-bold' : 'hover:bg-white/10'}`}
                      >
                        {r}x
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Quality</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {['hd1080', 'hd720', 'large', 'small'].map((q, i) => (
                      <button 
                         key={q} 
                         onClick={() => handleQuality(q)}
                         className="hover:bg-white/10 p-1.5 rounded text-left transition-colors"
                      >
                        {['1080p', '720p', '480p', '240p'][i]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setShowSettings(!showSettings)} className={`transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`}>
              <FaCog size={20} />
            </button>
            
            <button onClick={toggleFullScreen} className="hover:scale-110 transition-transform">
              {isFullScreen ? <FaCompress size={20}/> : <FaExpand size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;