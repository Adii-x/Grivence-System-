import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-transparent border border-border text-text-primary hover:bg-elevated',
  danger: 'bg-danger text-white hover:opacity-90',
  ghost: 'bg-transparent text-text-secondary hover:bg-elevated hover:text-text-primary',
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-md transition-colors active:scale-[0.97]
        ${size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm'}
        ${variantClasses[variant]}
        ${props.disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
