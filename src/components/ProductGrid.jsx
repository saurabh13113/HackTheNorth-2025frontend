import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './SkeletonLoader';
import { ShoppingBag, Search, Sparkles, TrendingUp, Filter } from 'lucide-react';

const EmptyState = ({ type = 'default' }) => {
  const states = {
    default: {
      icon: Search,
      title: 'No Products Detected Yet',
      description: 'Upload or analyze a video to discover fashion products automatically.',
      cta: 'Start by uploading a video or pasting a link above'
    },
    loading: {
      icon: Sparkles,
      title: 'Analyzing Video...',
      description: 'Our AI is scanning frames for fashion products and accessories.',
      cta: 'This usually takes 10-30 seconds'
    },
    empty: {
      icon: Search,
      title: 'No Fashion Items Found',
      description: 'This video might not contain detectable fashion products.',
      cta: 'Try uploading a different video with clothing or accessories'
    }
  };

  const state = states[type];
  const IconComponent = state.icon;

  return (
    <div className="flex items-center justify-center h-96 animate-fadeInUp">
      <div className="text-center max-w-md">
        <div className="relative mb-6">
          <div className="p-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 inline-block">
            <IconComponent className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          {type === 'loading' && (
            <div className="absolute inset-0 rounded-full bg-blue-200 dark:bg-blue-800 animate-ping opacity-20"></div>
          )}
        </div>

        <h3 className="font-bold text-xl text-primary mb-3">{state.title}</h3>
        <p className="text-secondary mb-6 leading-relaxed">{state.description}</p>

        <div className="inline-flex items-center px-4 py-2 rounded-full bg-tertiary text-secondary text-sm font-medium">
          <TrendingUp className="w-4 h-4 mr-2" />
          {state.cta}
        </div>

        {type === 'default' && (
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 dark:text-green-400 font-bold">1</span>
              </div>
              <p className="text-xs text-muted">Upload Video</p>
            </div>
            <div className="p-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              <p className="text-xs text-muted">AI Analysis</p>
            </div>
            <div className="p-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <p className="text-xs text-muted">Get Results</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="loading-shimmer h-6 w-6 rounded" />
              <div className="loading-shimmer h-6 w-40 rounded" />
            </div>
            <div className="loading-shimmer h-4 w-32 rounded mt-2" />
          </div>
          <div className="loading-shimmer h-8 w-24 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState type="empty" />;
  }

  const totalConfidence = products.reduce((sum, product) => sum + (product.average_confidence || 0), 0);
  const averageConfidence = totalConfidence / products.length;

  const getConfidenceBadge = () => {
    if (averageConfidence >= 0.8) return { text: 'High Accuracy', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
    if (averageConfidence >= 0.6) return { text: 'Good Results', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
    return { text: 'Review Needed', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
  };

  const confidenceBadge = getConfidenceBadge();

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            Detected Products
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-secondary">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${confidenceBadge.color}`}>
              {confidenceBadge.text}
            </span>
          </div>
        </div>

        <button className="btn btn-secondary">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-secondary rounded-xl border">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-primary">{products.length}</div>
          <div className="text-xs text-muted uppercase tracking-wider">Items</div>
        </div>
        <div className="text-center border-l border-r border-color">
          <div className="text-2xl font-bold text-green-600">{Math.round(averageConfidence * 100)}%</div>
          <div className="text-xs text-muted uppercase tracking-wider">Avg. Confidence</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(products.map(p => p.type)).size}
          </div>
          <div className="text-xs text-muted uppercase tracking-wider">Categories</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.type}-${product.color}-${index}`}
            product={product}
            index={index}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-color">
        <p className="text-muted text-sm">
          Powered by advanced AI fashion recognition technology
        </p>
      </div>
    </div>
  );
};

export { EmptyState };
export default ProductGrid;