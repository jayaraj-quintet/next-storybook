import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    showAsHover?: boolean; // Show button in permanent hover state (for docs)
}

const variantStyles: Record<ButtonVariant, { base: string; hover: string; hoverStatic: string; disabled: string }> = {
    primary: {
        base: 'bg-button-primary-fill text-button-primary-text border border-button-primary-stroke',
        hover: 'hover:bg-button-primary-fill-hover hover:border-button-primary-stroke-hover',
        hoverStatic: 'bg-button-primary-fill-hover border-button-primary-stroke-hover text-button-primary-text',
        disabled: 'bg-button-primary-fill-disabled border-button-primary-stroke-disabled text-button-primary-text cursor-not-allowed',
    },
    secondary: {
        base: 'bg-button-secondary-fill text-button-secondary-text border border-button-secondary-stroke',
        hover: 'hover:bg-button-secondary-fill-hover hover:border-button-secondary-stroke-hover',
        hoverStatic: 'bg-button-secondary-fill-hover border-button-secondary-stroke-hover text-button-secondary-text',
        disabled: 'bg-button-secondary-fill-disabled border-button-secondary-stroke-disabled text-button-secondary-text-disabled cursor-not-allowed',
    },
    tertiary: {
        base: 'bg-button-tertiary-fill text-button-tertiary-text border border-button-tertiary-stroke',
        hover: 'hover:text-button-tertiary-text-hover border border-button-tertiary-stroke',
        hoverStatic: 'text-button-tertiary-text-hover border border-button-tertiary-stroke',
        disabled: 'text-button-tertiary-text-disabled cursor-not-allowed border border-button-tertiary-stroke',
    },
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-sm py-xs text-xs leading-5 rounded-sm h-8',
    md: 'px-md py-xs text-sm leading-6 rounded-md h-9',
    lg: 'px-md py-sm text-base leading-7 rounded-md h-11',
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    showAsHover = false,
    className = '',
    ...props
}: ButtonProps) {
    const styles = variantStyles[variant];

    let stateClasses: string;
    if (disabled) {
        stateClasses = styles.disabled;
    } else if (showAsHover) {
        stateClasses = styles.hoverStatic;
    } else {
        stateClasses = `${styles.base} ${styles.hover}`;
    }

    const buttonClasses = [
        'inline-flex items-center justify-center font-regular border',
        sizeStyles[size],
        stateClasses,
        className,
    ].join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;

