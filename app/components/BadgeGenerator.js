"use client";
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function BadgeGenerator({ results }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState({ badge: false, markdown: false, html: false, badgeSmall: false, markdownSmall: false, htmlSmall: false });
    
    if (!results || !results.metadata) return null;
    
    const score = Math.round(results.darkPercentage || 0);
    const website = results.metadata.url;
    const badgeUrl = `${window.location.origin}/api/badge?website=${encodeURIComponent(website)}&score=${score}`;
    const badgeUrlSmall = `${window.location.origin}/api/badge?website=${encodeURIComponent(website)}&score=${score}&size=small`;
    
    // Différents formats de badge
    const formats = {
        badge: badgeUrl,
        markdown: `[![OLED Energy Efficiency](${badgeUrl})](https://ct.thbo.ch)`,
        html: `<a href="https://ct.thbo.ch" target="_blank"><img src="${badgeUrl}" alt="OLED Energy Efficiency Badge" /></a>`,
        badgeSmall: badgeUrlSmall,
        markdownSmall: `[![OLED Energy Efficiency](${badgeUrlSmall})](https://ct.thbo.ch)`,
        htmlSmall: `<a href="https://ct.thbo.ch" target="_blank"><img src="${badgeUrlSmall}" alt="OLED Energy Efficiency Badge" /></a>`
    };

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied({ ...copied, [type]: true });
            
            toast.success('Copied to clipboard!', {
                className: '!bg-green-500/10 !border-green-400/30 !text-green-400',
                progressClassName: '!bg-green-400/40'
            });
            
            setTimeout(() => {
                setCopied({ ...copied, [type]: false });
            }, 2000);
        } catch (err) {
            toast.error('Failed to copy to clipboard', {
                className: '!bg-red-500/10 !border-red-400/30 !text-red-400',
                progressClassName: '!bg-red-400/40'
            });
        }
    };

    return (
        <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    🏆 Share Your Score
                </h3>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-400 hover:text-white transition-colors text-xl font-bold cursor-pointer"
                >
                    {isOpen ? '−' : '+'}
                </button>
            </div>
            
            {isOpen && (
                <div className="space-y-6 animate-fadeInUp">
                    {/* Aperçu des badges */}
                    <div className="text-center space-y-4">
                        <p className="text-gray-300 text-sm">
                            Show off your website&apos;s OLED energy efficiency!
                        </p>
                        
                        {/* Badge normal */}
                        <div className="space-y-2">
                            <p className="text-xs text-gray-400 font-medium">Regular Badge</p>
                            <div className="flex justify-center">
                                <a 
                                    href="https://ct.thbo.ch" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:scale-105 transition-transform duration-200"
                                >
                                    <img 
                                        src={badgeUrl} 
                                        alt="OLED Energy Efficiency Badge" 
                                        className="rounded-lg shadow-lg"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Badge small */}
                        <div className="space-y-2">
                            <p className="text-xs text-gray-400 font-medium">Compact Badge</p>
                            <div className="flex justify-center">
                                <a 
                                    href="https://ct.thbo.ch" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:scale-105 transition-transform duration-200"
                                >
                                    <img 
                                        src={badgeUrlSmall} 
                                        alt="OLED Energy Efficiency Badge Small" 
                                        className="rounded-lg shadow-lg"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Appel à l'action */}
                    <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                        <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                            🌐 Add to Your Website
                        </h4>
                        <p className="text-sm text-gray-300 mb-3">
                            Embed this badge on your website to showcase your commitment to energy-efficient design. 
                            Visitors can click it to analyze their own websites!
                        </p>
                        <ul className="text-xs text-gray-400 space-y-1">
                            <li>• Perfect for footers, README files, or about pages</li>
                            <li>• Automatically links to Color Tools for more analyses</li>
                            <li>• Shows your environmental consciousness</li>
                            <li>• Updates automatically if you re-analyze</li>
                            <li>• <span className="text-orange-400">Compact version</span> perfect for sidebars and tight spaces</li>
                        </ul>
                    </div>

                    {/* Options de copie - Version normale */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                📏 Regular Badge (320x120px)
                            </div>
                            
                            {/* Direct Image URL */}
                            <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">Direct Image URL</span>
                                    <button
                                        onClick={() => copyToClipboard(formats.badge, 'badge')}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                            copied.badge 
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/30'
                                        }`}
                                    >
                                        {copied.badge ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                                <code className="text-xs text-gray-400 break-all block font-mono">
                                    {formats.badge}
                                </code>
                            </div>

                            {/* HTML avec lien */}
                            <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">HTML (Recommended)</span>
                                    <button
                                        onClick={() => copyToClipboard(formats.html, 'html')}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                            copied.html 
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/30'
                                        }`}
                                    >
                                        {copied.html ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                                <code className="text-xs text-gray-400 break-all block font-mono">
                                    {formats.html}
                                </code>
                                <p className="text-xs text-green-400 mt-2">
                                    ✓ Includes clickable link to Color Tools
                                </p>
                            </div>

                            {/* Markdown */}
                            <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">Markdown (GitHub/Docs)</span>
                                    <button
                                        onClick={() => copyToClipboard(formats.markdown, 'markdown')}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                            copied.markdown 
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/30'
                                        }`}
                                    >
                                        {copied.markdown ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                                <code className="text-xs text-gray-400 break-all block font-mono">
                                    {formats.markdown}
                                </code>
                                <p className="text-xs text-blue-400 mt-2">
                                    ✓ Perfect for README files and documentation
                                </p>
                            </div>
                        </div>

                        {/* Options de copie - Version compact */}
                        <div className="space-y-4">
                            <div className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                📱 Compact Badge (200x80px) <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">SMALL</span>
                            </div>
                            
                            {/* Direct Image URL Small */}
                            <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">Direct Image URL</span>
                                    <button
                                        onClick={() => copyToClipboard(formats.badgeSmall, 'badgeSmall')}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                            copied.badgeSmall 
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/30'
                                        }`}
                                    >
                                        {copied.badgeSmall ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                                <code className="text-xs text-gray-400 break-all block font-mono">
                                    {formats.badgeSmall}
                                </code>
                            </div>

                            {/* HTML avec lien Small */}
                            <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">HTML (Recommended)</span>
                                    <button
                                        onClick={() => copyToClipboard(formats.htmlSmall, 'htmlSmall')}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                            copied.htmlSmall 
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/30'
                                        }`}
                                    >
                                        {copied.htmlSmall ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                                <code className="text-xs text-gray-400 break-all block font-mono">
                                    {formats.htmlSmall}
                                </code>
                                <p className="text-xs text-orange-400 mt-2">
                                    ✓ Perfect for sidebars and footers
                                </p>
                            </div>

                            {/* Markdown Small */}
                            <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">Markdown (GitHub/Docs)</span>
                                    <button
                                        onClick={() => copyToClipboard(formats.markdownSmall, 'markdownSmall')}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                            copied.markdownSmall 
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/30'
                                        }`}
                                    >
                                        {copied.markdownSmall ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                                <code className="text-xs text-gray-400 break-all block font-mono">
                                    {formats.markdownSmall}
                                </code>
                                <p className="text-xs text-orange-400 mt-2">
                                    ✓ Discrete option for documentation
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                        <h4 className="text-green-300 font-medium mb-2 flex items-center gap-2">
                            🚀 Drive More Traffic
                        </h4>
                        <p className="text-sm text-gray-300">
                            When visitors click your badge, they&apos;ll land on Color Tools where they can:
                        </p>
                        <ul className="text-sm text-gray-300 mt-2 space-y-1">
                            <li>• Analyze their own websites</li>
                            <li>• Learn about OLED energy efficiency</li>
                            <li>• Discover optimization techniques</li>
                            <li>• Generate badges for their sites</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}