import { useState } from 'react';
import { Link, Upload } from 'lucide-react';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { ToastProvider } from './components/Toast';
import Header from './components/Header';
import TabButton from './components/TabButton';
import VideoPreview from './components/VideoPreview';
import VideoUpload from './components/VideoUpload';
import ProductGrid, { EmptyState } from './components/ProductGrid';
import './styles/globals.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('link');
  const [videoUrl, setVideoUrl] = useState('');
  const [analyzedProducts, setAnalyzedProducts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVideoLinkAnalysis = async (url) => {
    setIsAnalyzing(true);
    try {
      // For now, just simulate analysis since the backend expects file upload
      // In a real implementation, you'd need a separate endpoint for URL analysis
      console.log('Analyzing video URL:', url);

      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Set some mock data for demonstration
      setAnalyzedProducts([
        {
          type: 'shirt',
          color: 'navy blue',
          pattern: 'striped',
          material: 'cotton',
          brand_text: 'Nike',
          description: 'Classic navy striped cotton shirt with modern athletic fit and moisture-wicking technology',
          average_confidence: 0.92,
          frames_seen: ['0:05', '0:12', '0:18']
        },
        {
          type: 'jeans',
          color: 'dark indigo',
          material: 'denim',
          description: 'Premium dark wash skinny jeans with stretch comfort',
          average_confidence: 0.87,
          frames_seen: ['0:08', '0:15', '0:22', '0:28']
        },
        {
          type: 'sneakers',
          color: 'white',
          brand_text: 'Adidas',
          material: 'leather',
          description: 'Clean white leather sneakers with classic three-stripe design',
          average_confidence: 0.94,
          frames_seen: ['0:10', '0:20', '0:25']
        },
        {
          type: 'watch',
          color: 'silver',
          material: 'stainless steel',
          brand_text: 'Apple',
          description: 'Modern smartwatch with silver stainless steel band',
          average_confidence: 0.78,
          frames_seen: ['0:07', '0:14']
        }
      ]);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalyzedProducts([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVideoUpload = (result) => {
    if (result.analysis && result.analysis.consolidated_products) {
      setAnalyzedProducts(result.analysis.consolidated_products);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear results when switching tabs for better UX
    if (tab !== activeTab) {
      setAnalyzedProducts([]);
      setVideoUrl('');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <Header />

      <main className="container py-8">
        <div className="grid-2 gap-8">
          {/* Left Column - Video Content */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">Video Analysis</h2>
                <p className="text-secondary">
                  Upload a video or paste a link to discover fashion products using AI
                </p>
              </div>

              {/* Enhanced Tab Navigation */}
              <div className="flex gap-1 mb-8 p-1 bg-tertiary rounded-xl">
                <TabButton
                  active={activeTab === 'link'}
                  onClick={() => handleTabChange('link')}
                  icon={Link}
                >
                  Video Link
                </TabButton>
                <TabButton
                  active={activeTab === 'upload'}
                  onClick={() => handleTabChange('upload')}
                  icon={Upload}
                >
                  Upload File
                </TabButton>
              </div>

              {/* Tab Content */}
              <div className="animate-fadeInUp">
                {activeTab === 'link' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-3">
                        Video URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="Paste TikTok or Instagram video URL here..."
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="input pr-12"
                        />
                        {videoUrl && (
                          <button
                            onClick={() => setVideoUrl('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                          >
                            <Link className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'upload' && (
                  <VideoUpload onUpload={handleVideoUpload} />
                )}
              </div>
            </div>

            {/* Video Preview Section - Only for link tab */}
            {activeTab === 'link' && videoUrl && (
              <div className="animate-fadeInUp">
                <VideoPreview
                  url={videoUrl}
                  onAnalyze={handleVideoLinkAnalysis}
                />
              </div>
            )}
          </div>

          {/* Right Column - Product Cards */}
          <div className="card p-6">
            {!isAnalyzing && analyzedProducts.length === 0 ? (
              <EmptyState type="default" />
            ) : (
              <ProductGrid
                products={analyzedProducts}
                isLoading={isAnalyzing}
              />
            )}
          </div>
        </div>

        {/* Additional Features Section */}
        {analyzedProducts.length > 0 && (
          <div className="mt-12 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className="card p-8 text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-bold text-primary mb-4">
                🎉 Analysis Complete!
              </h3>
              <p className="text-secondary mb-6 max-w-2xl mx-auto">
                We've successfully identified {analyzedProducts.length} fashion items in your video.
                Each product has been analyzed for style, color, material, and brand recognition.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <button className="btn btn-primary">
                  <Upload className="w-4 h-4" />
                  Export Results
                </button>
                <button className="btn btn-secondary">
                  <Link className="w-4 h-4" />
                  Share Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;