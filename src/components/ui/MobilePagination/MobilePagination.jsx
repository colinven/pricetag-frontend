import styles from './MobilePagination.module.css';

export default function MobilePagination({
    page,
    totalPages,
    totalItems,
    onPageChange,
    itemLabel = 'item',
    itemLabelPlural = 'items',
}) {
    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
        <div className={styles.mobilePagination}>
            <button
                type="button"
                className={styles.mobilePageBtn}
                disabled={!canPrev}
                onClick={() => onPageChange(page - 1)}
            >
                ← Prev
            </button>
            <span className={styles.mobilePageMeta}>
                Page {page} of {totalPages || 1}
                {totalItems !== undefined && (
                    <> · {totalItems.toLocaleString()} {totalItems === 1 ? itemLabel : itemLabelPlural}</>
                )}
            </span>
            <button
                type="button"
                className={styles.mobilePageBtn}
                disabled={!canNext}
                onClick={() => onPageChange(page + 1)}
            >
                Next →
            </button>
        </div>
    );
}
