import { Select as RadixSelect } from 'radix-ui';
import clsx from 'clsx';
import styles from './Select.module.css';

/**
 * options: Array<{ value: string, label: string, disabled?: boolean }>
 * placeholder: string shown when no value is selected
 *
 * The id, aria-describedby, aria-invalid, and aria-required props are
 * injected automatically by FormField via cloneElement — do not pass manually.
 */
export default function Select({
    options = [],
    value,
    onValueChange,
    placeholder = 'Select an option',
    disabled = false,
    className,
    // injected by FormField
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
}) {
    return (
        <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
            <RadixSelect.Trigger
                id={id}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                aria-required={ariaRequired}
                className={clsx(
                    styles.trigger,
                    ariaInvalid && styles.error,
                    className
                )}
            >
                <RadixSelect.Value placeholder={placeholder} />
                <RadixSelect.Icon className={styles.icon}>
                    <ChevronIcon />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
                    <RadixSelect.Viewport className={styles.viewport}>
                        {options.map((option) => (
                            <RadixSelect.Item
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className={styles.item}
                            >
                                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                                <RadixSelect.ItemIndicator className={styles.itemIndicator}>
                                    <CheckIcon />
                                </RadixSelect.ItemIndicator>
                            </RadixSelect.Item>
                        ))}
                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
}

function ChevronIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}