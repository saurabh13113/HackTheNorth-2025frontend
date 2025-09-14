const SkeletonLoader = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-tertiary via-bg-secondary to-tertiary bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const ProductCardSkeleton = () => {
  return (
    <div className="card p-4 h-full">
      <div className="flex items-start gap-3 mb-3">
        <SkeletonLoader className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader className="h-6 w-3/4" />
          <SkeletonLoader className="h-4 w-1/2" />
        </div>
      </div>

      <div className="space-y-3">
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-5/6" />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <SkeletonLoader className="w-4 h-4 rounded" />
            <SkeletonLoader className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonLoader className="w-4 h-4 rounded" />
            <SkeletonLoader className="h-3 w-16" />
          </div>
        </div>

        <SkeletonLoader className="h-8 w-full rounded-lg" />
        <SkeletonLoader className="h-8 w-full rounded-lg" />

        <div className="pt-3 border-t border-color">
          <SkeletonLoader className="h-3 w-24 mb-2" />
          <div className="flex flex-wrap gap-1">
            <SkeletonLoader className="h-6 w-8 rounded-md" />
            <SkeletonLoader className="h-6 w-8 rounded-md" />
            <SkeletonLoader className="h-6 w-8 rounded-md" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-color">
          <SkeletonLoader className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

export { SkeletonLoader, ProductCardSkeleton };