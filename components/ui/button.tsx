import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'outline' | 'secondary';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', ...props }, ref) => {
		return (
			<button
				className={cn(
					'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
					'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400',
					'disabled:pointer-events-none disabled:opacity-50',

					variant === 'default' && 'bg-white/10 text-white hover:bg-white/20',
					variant === 'secondary' && 'bg-black/20 text-white hover:bg-black/30',
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Button.displayName = 'Button';

export { Button };
