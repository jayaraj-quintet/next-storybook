import { ButtonHTMLAttributes, ReactNode } from 'react';
import './ButtonSCSS.scss';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonSCSSProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    isLoading?: boolean;
    showAsHover?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const Spinner = ({ className }: { className?: string }) => (
    <svg
        className={`animate-spin ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

export function ButtonSCSS({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    showAsHover = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}: ButtonSCSSProps) {
    const isDisabled = disabled || isLoading;

    const buttonClasses = [
        `${variant}-button`,
        `has-${size}`,
        showAsHover ? 'hover' : '',
        disabled ? 'disabled' : '',
        className,
    ].filter(Boolean).join(' ');

    const leftContent = isLoading ? (
        <Spinner className={`button-icon`} />
    ) : leftIcon ? (
        <span className="button-icon">{leftIcon}</span>
    ) : null;

    return (
        <button
            className={buttonClasses}
            disabled={isDisabled}
            {...props}
        >
            {leftContent}
            {children}
            {rightIcon && !isLoading && <span className="button-icon">{rightIcon}</span>}
        </button>
    );
}

export default ButtonSCSS;
