import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Select = forwardRef(
  ({ label, error, helperText, options, placeholder, className, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-colors appearance-none bg-white',
            'focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            !error && 'border-gray-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
