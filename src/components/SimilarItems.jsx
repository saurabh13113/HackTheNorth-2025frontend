import { useState } from 'react';
import { ShoppingBag, ExternalLink, Star, Package, X, Sparkles, Search, Zap } from 'lucide-react';
import { findSimilarItems, findSimilarWithGemini } from '../lib/api';

const SimilarItems = ({ isOpen, onClose, product }) => {
  const [similarItems, setSimilarItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMethod, setSearchMethod] = useState('shopify');

  const handleFindSimilar = async (method = searchMethod) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      let response;
      if (method === 'gemini') {
        response = await findSimilarWithGemini(product);
      } else {
        response = await findSimilarItems(product);
      }
      setSimilarItems(response.similar_items || response.products || []);
    } catch (error) {
      console.error('Failed to find similar items:', error);
      setSimilarItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-color">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Similar Items</h3>
                <p className="text-secondary text-sm">
                  Find products similar to: {product?.type} {product?.color && `in ${product.color}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-tertiary rounded-lg text-muted hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!hasSearched ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-xl inline-block mb-6">
                <ShoppingBag className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-primary mb-2">Find Similar Products</h4>
              <p className="text-secondary mb-6 max-w-md mx-auto">
                Search for products similar to this {product?.type} using different search methods.
              </p>

              {/* Search Method Selection */}
              <div className="flex gap-2 mb-6 p-1 bg-tertiary rounded-xl max-w-md mx-auto">
                <button
                  onClick={() => setSearchMethod('shopify')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchMethod === 'shopify'
                      ? 'bg-primary text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shopify Store
                </button>
                <button
                  onClick={() => setSearchMethod('gemini')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchMethod === 'gemini'
                      ? 'bg-primary text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  AI Web Search
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleFindSimilar(searchMethod)}
                  className="btn btn-primary btn-lg"
                >
                  {searchMethod === 'gemini' ? (
                    <>
                      <Zap className="w-5 h-5" />
                      Search Online with AI
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Search Store Catalog
                    </>
                  )}
                </button>

                <p className="text-xs text-muted max-w-sm mx-auto">
                  {searchMethod === 'gemini'
                    ? 'Uses Gemini AI to search the web for similar fashion items'
                    : 'Searches your Shopify store inventory for matching products'
                  }
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-primary mb-2">
                {searchMethod === 'gemini' ? 'AI Searching...' : 'Searching...'}
              </h4>
              <p className="text-secondary">
                {searchMethod === 'gemini'
                  ? 'Using Gemini AI to search the web for similar products'
                  : 'Finding similar products in store catalog'
                }
              </p>
            </div>
          ) : similarItems.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-primary">
                    Found {similarItems.length} similar items
                  </h4>
                  <p className="text-xs text-muted">
                    {searchMethod === 'gemini' ? 'From AI web search' : 'From store catalog'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFindSimilar(searchMethod === 'gemini' ? 'shopify' : 'gemini')}
                    className="btn btn-ghost btn-sm"
                  >
                    {searchMethod === 'gemini' ? (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Try Store
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Try AI
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleFindSimilar(searchMethod)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Search className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarItems.map((item, index) => (
                  <div key={index} className="card p-4 group hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-tertiary rounded-lg mb-3 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-semibold text-primary line-clamp-2 group-hover:text-accent-primary transition-colors">
                        {item.title || item.name || 'Similar Product'}
                      </h5>

                      <div className="flex items-center justify-between">
                        {item.price && (
                          <span className="font-bold text-accent-primary">
                            ${typeof item.price === 'string' ? item.price : item.price.toFixed(2)}
                          </span>
                        )}
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                            <span className="text-xs text-secondary">{item.rating}</span>
                          </div>
                        )}
                      </div>

                      {item.vendor && (
                        <p className="text-xs text-muted">by {item.vendor}</p>
                      )}

                      {item.description && (
                        <p className="text-xs text-secondary line-clamp-2">{item.description}</p>
                      )}

                      <button
                        onClick={() => item.url && window.open(item.url, '_blank')}
                        className="w-full btn btn-ghost btn-sm mt-3"
                        disabled={!item.url}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {searchMethod === 'gemini' ? 'View Online' : 'View Product'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl inline-block mb-6">
                <ShoppingBag className="w-12 h-12 text-muted" />
              </div>
              <h4 className="text-lg font-bold text-primary mb-2">No Similar Items Found</h4>
              <p className="text-secondary mb-6 max-w-md mx-auto">
                We couldn't find any products similar to this {product?.type}. Try searching for a different item.
              </p>
              <button
                onClick={handleFindSimilar}
                className="btn btn-secondary"
              >
                <Sparkles className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarItems;