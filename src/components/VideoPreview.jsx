import { useState } from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';

const VideoPreview = ({ url, onAnalyze }) => {
  const [isLoading, setIsLoading] = useState(false);

  const extractTikTokId = (url) => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const handleAnalyze = async () => {
    if (!url) return;

    setIsLoading(true);
    try {
      await onAnalyze(url);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderVideoEmbed = () => {
    if (url.includes('tiktok.com')) {
      const videoId = extractTikTokId(url);
      if (videoId) {
        const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
        return (
          <div className="flex justify-center">
            <iframe
              src={embedUrl}
              width="325"
              height="580"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
        );
      }
    }

    if (url.includes('instagram.com')) {
      return (
        <div className="card p-6 text-center">
          <Video className="w-12 h-12 text-muted mx-auto mb-3" />
          <h3 className="font-semibold text-primary mb-2">Instagram Video</h3>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:text-accent-hover flex items-center justify-center gap-2"
          >
            View on Instagram
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-muted text-sm mt-2">
            Instagram embeds require oEmbed API
          </p>
        </div>
      );
    }

    return (
      <div className="card p-6 text-center">
        <Video className="w-12 h-12 text-muted mx-auto mb-3" />
        <h3 className="font-semibold text-primary mb-2">Video Preview</h3>
        <p className="text-secondary mb-3">{url}</p>
        <p className="text-muted text-sm">Platform not recognized - showing fallback preview</p>
      </div>
    );
  };

  if (!url) {
    return (
      <div className="card p-8 text-center">
        <Play className="w-16 h-16 text-muted mx-auto mb-4" />
        <h3 className="font-semibold text-primary mb-2">No Video Selected</h3>
        <p className="text-secondary">
          Enter a TikTok or Instagram video URL above to preview it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-secondary p-4 rounded-lg">
        {renderVideoEmbed()}
      </div>

      <div className="flex items-center justify-between p-4 card">
        <div>
          <p className="text-sm text-muted">Ready to analyze</p>
          <p className="font-medium text-primary">Extract products from this video</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner w-4 h-4" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Analyze Video
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;