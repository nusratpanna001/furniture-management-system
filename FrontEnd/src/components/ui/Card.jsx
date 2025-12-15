import { cn } from '../../lib/utils';

function Card({ children, className, title, subtitle, actions, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden',
        className
      )}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export default Card;
