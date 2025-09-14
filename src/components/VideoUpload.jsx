import { useState, useRef } from 'react';
import { Upload, File, X, Play, CheckCircle, AlertCircle, Film } from 'lucide-react';
import { useToast } from './Toast';
import { analyzeVideo } from '../lib/api';

const VideoUpload = ({ onUpload, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragState, setDragState] = useState('idle'); // idle, active, accept, reject
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
      toast.success('Video file selected successfully!', 'Ready to Analyze');
    } else {
      toast.error('Please select a valid video file', 'Invalid File Type');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      const items = Array.from(e.dataTransfer.items);
      const hasVideoFile = items.some(item => item.type.startsWith('video/'));
      setDragState(hasVideoFile ? 'accept' : 'reject');
    } else if (e.type === 'dragleave') {
      setDragState('idle');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState('idle');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    toast.info('Starting video analysis...', 'Please Wait');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await analyzeVideo(formData);
      onUpload(result);

      toast.success(
        `Successfully analyzed video! Found ${result.analysis?.consolidated_products?.length || 0} products.`,
        'Analysis Complete'
      );
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.message, 'Upload Failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('File selection cleared', 'Reset');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDragClasses = () => {
    const baseClasses = 'card p-8 text-center border-2 border-dashed transition-all duration-300 transform';

    switch (dragState) {
      case 'accept':
        return `${baseClasses} drag-accept scale-105`;
      case 'reject':
        return `${baseClasses} drag-reject`;
      case 'active':
        return `${baseClasses} drag-active`;
      default:
        return `${baseClasses} border-border-color hover:border-accent-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:scale-102`;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div
        className={getDragClasses()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="space-y-6">
            <div className="relative">
              <div className={`p-6 rounded-full inline-block transition-all duration-300 ${
                dragState === 'accept'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 scale-110'
                  : dragState === 'reject'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400'
              }`}>
                {dragState === 'accept' ? (
                  <CheckCircle className="w-16 h-16" />
                ) : dragState === 'reject' ? (
                  <AlertCircle className="w-16 h-16" />
                ) : (
                  <Upload className="w-16 h-16" />
                )}
              </div>

              {dragState === 'active' && (
                <div className="absolute inset-0 rounded-full bg-blue-200 dark:bg-blue-800 animate-ping opacity-20"></div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-xl text-primary mb-2">
                {dragState === 'accept' && 'Drop video to analyze'}
                {dragState === 'reject' && 'Invalid file type'}
                {(dragState === 'idle' || dragState === 'active') && 'Upload Video File'}
              </h3>

              <p className="text-secondary mb-6 max-w-md mx-auto leading-relaxed">
                {dragState === 'reject'
                  ? 'Only video files are supported (MP4, MOV, AVI, etc.)'
                  : 'Drag and drop your fashion video here, or click to browse your files'
                }
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary btn-lg"
                disabled={dragState === 'reject'}
              >
                <Film className="w-5 h-5" />
                Choose Video File
              </button>

              <div className="flex items-center justify-center space-x-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  MP4
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  MOV
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  AVI
                </span>
                <span className="opacity-50">Max 100MB</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeInUp">
            <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Film className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <div className="flex-1 text-left">
                <h4 className="font-bold text-green-800 dark:text-green-200 text-lg mb-1">
                  {selectedFile.name}
                </h4>

                <div className="flex items-center gap-4 text-sm text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1">
                    <File className="w-3 h-3" />
                    {formatFileSize(selectedFile.size)}
                  </span>

                  {selectedFile.type && (
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {selectedFile.type.split('/')[1].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={clearFile}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                disabled={isUploading}
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center btn-group">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn btn-primary btn-lg flex-1 max-w-xs btn-mobile-full"
              >
                {isUploading ? (
                  <>
                    <div className="loading-spinner w-5 h-5" />
                    Analyzing Video...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Analyze Video
                  </>
                )}
              </button>

              {!isUploading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-ghost btn-mobile-full"
                >
                  <Upload className="w-4 h-4" />
                  Choose Different File
                </button>
              )}
            </div>

            {isUploading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="loading-spinner w-4 h-4" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Processing video frames...
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  This may take 30-60 seconds depending on video length
                </p>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default VideoUpload;