import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const PixelButton: React.FC<PixelButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  
  const baseStyles = "relative font-pixel border-4 border-black transition-transform active:translate-y-1 active:shadow-none focus:outline-none";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500",
    secondary: "bg-gray-200 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white",
    danger: "bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PixelButton;