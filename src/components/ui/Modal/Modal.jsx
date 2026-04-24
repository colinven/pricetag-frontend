import { Dialog } from 'radix-ui';
import clsx from 'clsx';
import styles from './Modal.module.css';

function Modal({ open, onOpenChange, title, description, children, className }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={clsx(styles.content, className)}>
                    <Dialog.Close className={styles.close} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </Dialog.Close>

                    <Dialog.Title className={styles.title}>{title}</Dialog.Title>

                    {description && (
                        <Dialog.Description className={styles.description}>
                            {description}
                        </Dialog.Description>
                    )}

                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function ModalFooter({ children, className }) {
    return <div className={clsx(styles.footer, className)}>{children}</div>;
}

Modal.Footer = ModalFooter;

export default Modal;
