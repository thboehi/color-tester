"use client";

export default function DynamicButton({ 
  title, 
  description, 
  onClick, 
  className = "",
  variant = "default" 
}) {
  const baseClasses = "group relative flex flex-col items-center justify-center rounded-4xl backdrop-blur-sm border cursor-pointer transition-all duration-500 overflow-hidden";
  
  const variants = {
    default: "bg-white/0 hover:bg-gray-400/10 border-gray-400/20 text-gray-500",
    primary: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-400/30 text-blue-400",
    secondary: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-400/30 text-purple-400"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} px-4 py-2 z-50 hover:px-6 hover:py-6 w-64 hover:w-80 md:w-64 md:hover:w-72 ${className}`}
    >
      {/* Titre toujours visible */}
      <span className="font-medium transition-all duration-300 text-center">
        {title}
      </span>
      
      {/* Description qui apparaît au hover sur desktop, toujours visible sur mobile */}
      <span className="block md:opacity-0 md:max-h-0 md:group-hover:opacity-70 md:group-hover:max-h-20 transition-all duration-500 delay-100 text-sm font-normal text-center mt-2 md:mt-0 md:group-hover:mt-2 leading-relaxed px-2">
        {description}
      </span>
    </button>
  );
}