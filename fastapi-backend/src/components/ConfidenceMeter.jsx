import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ConfidenceMeter = ({ confidence = 0, size = 'md', showIcon = true, showPercentage = true }) => {
  const percentage = Math.round(confidence * 100);

  const getConfidenceLevel = () => {
    if (confidence >= 0.8) return { level: 'high', color: 'confidence-high', icon: TrendingUp };
    if (confidence >= 0.6) return { level: 'medium', color: 'confidence-medium', icon: Minus };
    return { level: 'low', color: 'confidence-low', icon: TrendingDown };
  };

  const { level, color, icon: IconComponent } = getConfidenceLevel();

  const sizes = {
    sm: { height: 'h-2', text: 'text-xs' },
    md: { height: 'h-3', text: 'text-sm' },
    lg: { height: 'h-4', text: 'text-base' }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showIcon && <IconComponent className="w-4 h-4 opacity-70" />}
          <span className={`font-medium ${sizes[size].text} opacity-80`}>
            Confidence
          </span>
        </div>
        {showPercentage && (
          <span className={`font-semibold ${sizes[size].text}`}>
            {percentage}%
          </span>
        )}
      </div>

      <div className={`confidence-meter ${sizes[size].height} w-full`}>
        <div
          className={`confidence-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className={`text-xs opacity-60 ${sizes[size].text}`}>
        {level === 'high' && 'High accuracy detection'}
        {level === 'medium' && 'Moderate confidence level'}
        {level === 'low' && 'Low confidence - verify manually'}
      </div>
    </div>
  );
};

export default ConfidenceMeter;