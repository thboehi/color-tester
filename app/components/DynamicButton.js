"use client";

export default function DynamicButton({ 
  title, 
  description, 
  onClick, 
  href,
  className = "",
  variant = "default",
  openInNewTab = false 
}) {
  const baseClasses = "group relative flex flex-col items-center justify-center rounded-4xl backdrop-blur-sm border cursor-pointer transition-all duration-500 overflow-hidden";
  
  const variants = {
    default: "bg-white/0 hover:bg-gray-400/10 border-gray-400/20 text-gray-500",
    primary: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-400/30 text-blue-400",
    secondary: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-400/30 text-purple-400"
  };

  const handleClick = (e) => {
    // Si onClick est défini, il est prioritaire
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }

    // Sinon, gérer la navigation avec href
    if (href) {
      if (openInNewTab) {
        e.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      }
      // Si openInNewTab est false, laisser le comportement par défaut du lien
    }
  };

  // Si on a un href et pas d'onClick, utiliser un élément <a>
  // Sinon utiliser un <button>
  const Component = href && !onClick ? 'a' : 'button';
  
  // Props spécifiques selon le type d'élément
  const elementProps = href && !onClick ? {
    href: href,
    target: openInNewTab ? '_blank' : undefined,
    rel: openInNewTab ? 'noopener noreferrer' : undefined
  } : {};

  return (
    <Component
      onClick={handleClick}
      {...elementProps}
      className={`${baseClasses} ${variants[variant]} px-4 py-2 z-50 hover:px-6 hover:py-6 w-64 hover:w-80 md:w-64 md:hover:w-72 ${className}`}
    >
      {/* Titre toujours visible */}
      <span className="font-medium transition-all duration-300 text-center">
        {title}
        {/* Indicateur visuel pour nouvel onglet */}
        {(openInNewTab && !onClick) && (
          <svg 
            className="inline-block ml-1 w-3 h-3 opacity-60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </span>
      
      {/* Description qui apparaît au hover sur desktop, toujours visible sur mobile */}
      <span className="block md:opacity-0 md:max-h-0 md:group-hover:opacity-70 md:group-hover:max-h-20 transition-all duration-500 delay-100 text-sm font-normal text-center mt-2 md:mt-0 md:group-hover:mt-2 leading-relaxed px-2">
        {description}
      </span>
    </Component>
  );
}