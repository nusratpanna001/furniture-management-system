import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(
  ({ label, error, helperText, className, icon, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2 border rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:ring-red-500',
              !error && 'border-gray-300',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
