
import { Loader2, Brain, Zap, Sparkles } from "lucide-react";

interface LoadingAnimationProps {
  message?: string;
  type?: 'thinking' | 'processing' | 'analyzing' | 'mining';
  className?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Processing...", 
  type = 'thinking',
  className = ""
}) => {
  const getIcon = () => {
    switch (type) {
      case 'thinking':
        return <Brain className="w-8 h-8 animate-pulse text-blue-400" />;
      case 'processing':
        return <Loader2 className="w-8 h-8 animate-spin text-green-400" />;
      case 'analyzing':
        return <Sparkles className="w-8 h-8 animate-pulse text-purple-400" />;
      case 'mining':
        return <Zap className="w-8 h-8 animate-bounce text-yellow-400" />;
      default:
        return <Loader2 className="w-8 h-8 animate-spin text-blue-400" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'thinking':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'processing':
        return 'from-green-500/20 to-emerald-500/20';
      case 'analyzing':
        return 'from-purple-500/20 to-pink-500/20';
      case 'mining':
        return 'from-yellow-500/20 to-orange-500/20';
      default:
        return 'from-blue-500/20 to-cyan-500/20';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className={`bg-gradient-to-r ${getGradient()} rounded-full p-6 mb-4 animate-pulse-glow`}>
        {getIcon()}
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold text-white mb-2">{message}</div>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};
