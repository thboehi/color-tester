"use client";

export default function AnalysisHistory({ history, onSelect, onClose, isClosing = false }) {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDomainFromUrl = (url) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    const getEnergyLevel = (darkPercentage) => {
        if (darkPercentage >= 70) return { color: 'text-green-400', label: 'Excellent' };
        if (darkPercentage >= 50) return { color: 'text-yellow-400', label: 'Good' };
        if (darkPercentage >= 30) return { color: 'text-orange-400', label: 'Moderate' };
        return { color: 'text-red-400', label: 'Poor' };
    };

    return (
        <div 
            className={`fixed inset-0 z-40 flex items-center justify-center p-2 md:p-4 transition-all duration-300 ${
                isClosing 
                    ? 'bg-black/0 backdrop-blur-none' 
                    : 'bg-black/50 backdrop-blur-sm'
            }`}
            onClick={onClose}
            style={{
                animation: isClosing 
                    ? 'fadeOut 0.3s ease-out forwards' 
                    : 'fadeIn 0.3s ease-out forwards'
            }}
        >
            <div 
                className={`bg-black/90 backdrop-blur-sm border border-gray-400/20 rounded-2xl p-4 md:p-6 w-full max-w-xs md:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto transition-all duration-300 ${
                    isClosing 
                        ? 'scale-95 opacity-0 translate-y-4' 
                        : 'scale-100 opacity-100 translate-y-0'
                }`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: isClosing 
                        ? 'slideOut 0.3s ease-out forwards' 
                        : 'slideIn 0.3s ease-out forwards'
                }}
            >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-400">Analysis History</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-gray-500 cursor-pointer hover:rotate-90 hover:scale-110"
                    >
                        ×
                    </button>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No analysis history yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item, index) => {
                            const energyLevel = getEnergyLevel(item.darkPercentage);
                            
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => onSelect(item)}
                                    className="bg-white/5 hover:bg-white/10 border border-gray-400/20 rounded-xl p-3 md:p-4 cursor-pointer transition-all group animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 md:space-x-3 mb-2">
                                                {/* Favicon */}
                                                {item.siteMetadata?.favicon && (
                                                    <img
                                                        src={item.siteMetadata.favicon}
                                                        alt="Favicon"
                                                        className="w-4 h-4 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                
                                                {/* Titre ou domaine */}
                                                <h3 className="text-gray-300 font-medium truncate text-sm md:text-base">
                                                    {item.siteMetadata?.title || getDomainFromUrl(item.url)}
                                                </h3>
                                            </div>
                                            
                                            {/* URL */}
                                            <p className="text-xs text-gray-500 truncate mb-2">
                                                {getDomainFromUrl(item.url)}
                                            </p>
                                            
                                            {/* Description - masquée sur mobile */}
                                            {item.siteMetadata?.description && (
                                                <p className="hidden md:block text-xs text-gray-600 line-clamp-2 mb-2">
                                                    {item.siteMetadata.description}
                                                </p>
                                            )}
                                            
                                            {/* Stats */}
                                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0 text-xs">
                                                <span className="text-gray-500">
                                                    {formatDate(item.timestamp)}
                                                </span>
                                                <span className={energyLevel.color}>
                                                    {item.darkPercentage.toFixed(0)}% dark • {energyLevel.label}
                                                </span>
                                                {/* Thème sur mobile */}
                                                <span className="text-gray-600 md:hidden">
                                                    {item.theme === 'dark' ? '🌙' : '☀️'} {item.theme}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Couleurs dominantes */}
                                        <div className="flex space-x-1 justify-center md:justify-end md:ml-4">
                                            {item.dominantColors.slice(0, 3).map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-400/30"
                                                    style={{ backgroundColor: color.hex }}
                                                    title={`${color.hex} (${color.percentage.toFixed(1)}%)`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Barre de progression dark/light */}
                                    <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gray-300 transition-all duration-300"
                                            style={{ width: `${item.darkPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {/* Actions */}
                <div className="mt-4 md:mt-6 pt-4 border-t border-gray-400/20">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-xs text-gray-500">
                        <span>{history.length} analysis{history.length > 1 ? 'es' : ''} saved</span>
                        <button
                            onClick={() => {
                                localStorage.removeItem('website-analysis-history');
                                window.location.reload();
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors text-center md:text-right cursor-pointer"
                        >
                            Clear history
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}