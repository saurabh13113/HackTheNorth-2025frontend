import { useState } from 'react';
import { ShoppingBag, Tag, Palette, Package, Star, Sparkles, Eye, Clock } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';
import SimilarItems from './SimilarItems';

const ProductCard = ({ product, index }) => {
  const [showSimilarItems, setShowSimilarItems] = useState(false);

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
    <div className="card p-4 h-full animate-fadeInUp group" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
          {getTypeIcon(product.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-primary mb-1 group-hover:text-accent-primary transition-colors">
            {product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : `Product ${index + 1}`}
          </h3>
          {product.brand_text && (
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 mb-2">
              <Star className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">{product.brand_text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mb-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border-l-2 border-accent-primary">
          <p className="text-secondary text-xs leading-relaxed italic line-clamp-2">
            "{product.description}"
          </p>
        </div>
      )}

      {/* Attributes Compact */}
      <div className="space-y-2 mb-3">
        {product.color && (
          <div className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: product.color.toLowerCase() }}
              title={product.color}
            />
            <span className="text-secondary capitalize">{product.color}</span>
          </div>
        )}

        {product.material && (
          <div className="flex items-center gap-2 text-xs">
            <Package className="w-3 h-3 text-muted" />
            <span className="text-secondary capitalize">{product.material}</span>
          </div>
        )}

        {product.pattern && (
          <div className="flex items-center gap-2 text-xs">
            <Palette className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-secondary capitalize">{product.pattern}</span>
          </div>
        )}
      </div>

      {/* Confidence Meter */}
      <div className="mb-3">
        <ConfidenceMeter confidence={confidence} />
      </div>

      {/* Frame Information - Simplified */}
      {product.frames_seen && product.frames_seen.length > 0 && (
        <div className="mb-3 text-center">
          <div className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-tertiary rounded-full">
            <Eye className="w-3 h-3 text-muted" />
            <span className="text-muted">
              {product.frames_seen.length} frame{product.frames_seen.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-color btn-group">
        <button
          onClick={() => setShowSimilarItems(true)}
          className="w-full btn btn-primary btn-sm btn-mobile-full group-hover:scale-105 transition-transform"
        >
          <ShoppingBag className="w-3 h-3" />
          Find Similar
        </button>
        <button className="w-full btn btn-ghost btn-sm btn-mobile-full text-xs">
          <Sparkles className="w-3 h-3" />
          View Context
        </button>
      </div>

      {/* Similar Items Modal */}
      <SimilarItems
        isOpen={showSimilarItems}
        onClose={() => setShowSimilarItems(false)}
        product={product}
      />

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