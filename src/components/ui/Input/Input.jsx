import clsx from 'clsx';
import styles from './Input.module.css';

export default function Input({
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    disabled = false,
    readOnly = false,
    className,
    // injected by FormField — do not pass manually
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...rest
}) {
    return (
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired}
            className={clsx(
                styles.input,
                ariaInvalid && styles.error,
                className
            )}
            {...rest}
        />
    );
}