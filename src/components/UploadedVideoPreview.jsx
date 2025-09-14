import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const UploadedVideoPreview = ({ file, onAnalyze, isAnalyzing }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };

  if (!file || !videoUrl) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            muted={isMuted}
            preload="metadata"
          />

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Progress Bar */}
              <div
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-accent-primary rounded-full transition-all duration-150"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>

                  <button
                    onClick={resetVideo}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>

                <div className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info & Analysis Button */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-primary mb-1">{file.name}</h3>
            <div className="flex items-center gap-4 text-sm text-secondary">
              <span>Size: {(file.size / (1024 * 1024)).toFixed(1)} MB</span>
              {duration > 0 && (
                <span>Duration: {formatTime(duration)}</span>
              )}
              <span>Type: {file.type.split('/')[1].toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={() => onAnalyze({ analysis: { consolidated_products: [] } })}
            disabled={isAnalyzing}
            className="btn btn-primary btn-lg"
          >
            {isAnalyzing ? (
              <>
                <div className="loading-spinner w-5 h-5" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Analyze Video
              </>
            )}
          </button>
        </div>

        {isAnalyzing && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="loading-spinner w-4 h-4" />
              <span>Processing video frames for fashion product detection...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadedVideoPreview;