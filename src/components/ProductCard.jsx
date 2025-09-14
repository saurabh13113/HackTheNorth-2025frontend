import { ShoppingBag, Tag, Palette, Package, Star, Sparkles, Eye, Clock } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';

const ProductCard = ({ product, index }) => {
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'clothing':
      case 'shirt':
      case 'dress':
      case 'pants':
        return <Package className="w-5 h-5" />;
      case 'bag':
      case 'handbag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'jewelry':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  const confidence = product.average_confidence || 0;

  return (
    <div className="card p-6 h-full animate-fadeInUp group" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
          {getTypeIcon(product.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-primary mb-2 group-hover:text-accent-primary transition-colors">
            {product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : `Product ${index + 1}`}
          </h3>
          {product.brand_text && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 mb-3">
              <Star className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{product.brand_text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border-l-4 border-accent-primary">
          <p className="text-secondary text-sm leading-relaxed italic">
            "{product.description}"
          </p>
        </div>
      )}

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {product.color && (
          <div className="flex items-center gap-3 p-3 bg-tertiary rounded-lg hover:bg-accent-primary/10 transition-colors">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: product.color.toLowerCase() }}
              title={product.color}
            />
            <span className="text-sm font-medium text-secondary capitalize">{product.color}</span>
          </div>
        )}

        {product.material && (
          <div className="flex items-center gap-3 p-3 bg-tertiary rounded-lg hover:bg-accent-primary/10 transition-colors">
            <Package className="w-4 h-4 text-muted" />
            <span className="text-sm font-medium text-secondary capitalize">{product.material}</span>
          </div>
        )}
      </div>

      {/* Pattern */}
      {product.pattern && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pattern</span>
          </div>
          <span className="text-sm font-medium text-amber-800 dark:text-amber-200 capitalize">{product.pattern}</span>
        </div>
      )}

      {/* Confidence Meter */}
      <div className="mb-6">
        <ConfidenceMeter confidence={confidence} />
      </div>

      {/* Frame Information */}
      {product.frames_seen && product.frames_seen.length > 0 && (
        <div className="mb-6 p-4 bg-secondary rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-muted" />
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Detected in {product.frames_seen.length} frame{product.frames_seen.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.frames_seen.slice(0, 6).map((frame, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-tertiary text-secondary hover:bg-accent-primary/20 transition-colors cursor-pointer"
              >
                <Clock className="w-3 h-3" />
                {frame}
              </div>
            ))}
            {product.frames_seen.length > 6 && (
              <div className="px-3 py-1 text-xs font-medium text-muted">
                +{product.frames_seen.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-color">
        <button className="w-full btn btn-primary group-hover:scale-105 transition-transform">
          <ShoppingBag className="w-4 h-4" />
          Find Similar Items
        </button>
        <button className="w-full btn btn-ghost text-xs">
          <Sparkles className="w-3 h-3" />
          View in Context
        </button>
      </div>

      {/* Floating Badge */}
      {confidence >= 0.9 && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
          <Star className="w-4 h-4 text-white" fill="currentColor" />
        </div>
      )}
    </div>
  );
};

export default ProductCard;