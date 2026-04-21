import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { useAuth } from '../../../context/AuthContext';
import styles from './MobileTopBar.module.css';

export default function MobileTopBar({ title }) {
    const { user, logout } = useAuth();
    const initial = user?.firstName?.[0]?.toUpperCase() ?? '';

    return (
        <header className={styles.bar}>
            <h1 className={styles.title}>{title}</h1>

            {user && (
                <RadixDropdownMenu.Root>
                    <RadixDropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            className={styles.trigger}
                            aria-label="Account menu"
                        >
                            {initial}
                        </button>
                    </RadixDropdownMenu.Trigger>

                    <RadixDropdownMenu.Portal>
                        <RadixDropdownMenu.Content
                            className={styles.content}
                            sideOffset={8}
                            align="end"
                        >
                            <div className={styles.userBlock}>
                                <span className={styles.userName}>
                                    {user.firstName} {user.lastName}
                                </span>
                                <span className={styles.userEmail}>{user.email}</span>
                            </div>
                            <RadixDropdownMenu.Separator className={styles.separator} />
                            <RadixDropdownMenu.Item
                                className={styles.item}
                                onSelect={logout}
                            >
                                Sign out
                            </RadixDropdownMenu.Item>
                        </RadixDropdownMenu.Content>
                    </RadixDropdownMenu.Portal>
                </RadixDropdownMenu.Root>
            )}
        </header>
    );
}
