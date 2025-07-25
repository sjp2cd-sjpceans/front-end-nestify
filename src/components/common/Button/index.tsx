import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  disabled = false,
  variant = 'primary',
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-[#002B5C] text-white hover:bg-[#002B5C]/90',
    secondary: 'bg-[#FFD700] text-[#002B5C] hover:bg-[#FFD700]/90',
    outline: 'border border-[#002B5C] text-[#002B5C] hover:bg-[#002B5C]/10'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button; 