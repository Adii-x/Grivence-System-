import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-text-secondary">{label}</label>}
      <input
        ref={ref}
        className={`h-9 rounded-md bg-elevated border px-3 text-sm text-text-primary placeholder:text-text-muted
          focus:outline-none focus:border-accent transition-colors
          ${error ? 'border-danger' : 'border-border'}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
