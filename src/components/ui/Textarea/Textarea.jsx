import clsx from 'clsx';
import styles from './Textarea.module.css';

export default function Textarea({
    placeholder,
    value,
    onChange,
    onBlur,
    rows = 4,
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
        <textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired}
            className={clsx(
                styles.textarea,
                ariaInvalid && styles.error,
                className
            )}
            {...rest}
        />
    );
}