import clsx from 'clsx';
import { Link } from 'react-router-dom';
import styles from './Table.module.css';

export default function Table({
    columns,
    rows,
    rowKey,
    rowHref,
    sortBy,
    sortDirection,
    onSortChange,
    page,
    totalPages,
    totalItems,
    itemLabel = 'item',
    itemLabelPlural = 'items',
    onPageChange,
}) {
    const gridStyle = { '--table-cols': columns.length };
    const hasPagination = totalPages !== undefined && onPageChange !== undefined;

    return (
        <div className={styles.wrapper}>
            <div role="table" className={styles.table} style={gridStyle}>
                <div role="row" className={styles.headerRow}>
                    {columns.map((col) => (
                        <HeaderCell
                            key={col.key}
                            column={col}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            onSortChange={onSortChange}
                        />
                    ))}
                </div>

                {rows.map((row) => {
                    const key = rowKey(row);
                    const href = rowHref?.(row);
                    const cells = columns.map((col) => (
                        <div
                            role="cell"
                            key={col.key}
                            className={clsx(
                                styles.cell,
                                col.align === 'right' && styles.cellRight,
                            )}
                        >
                            {col.render(row)}
                        </div>
                    ));

                    return href ? (
                        <Link
                            key={key}
                            to={href}
                            role="row"
                            className={clsx(styles.row, styles.rowLink)}
                        >
                            {cells}
                        </Link>
                    ) : (
                        <div key={key} role="row" className={styles.row}>
                            {cells}
                        </div>
                    );
                })}
            </div>

            {hasPagination && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemLabel={itemLabel}
                    itemLabelPlural={itemLabelPlural}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

function HeaderCell({ column, sortBy, sortDirection, onSortChange }) {
    const isSorted = column.sortable && sortBy === column.key;
    const nextDirection = isSorted && sortDirection === 'asc' ? 'desc' : 'asc';

    const cellClass = clsx(
        styles.headerCell,
        column.align === 'right' && styles.cellRight,
    );

    if (!column.sortable) {
        return (
            <div role="columnheader" className={cellClass}>
                <span className={styles.headerLabel}>{column.header}</span>
            </div>
        );
    }

    return (
        <div
            role="columnheader"
            className={cellClass}
            aria-sort={
                isSorted
                    ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                    : 'none'
            }
        >
            <button
                type="button"
                className={styles.sortButton}
                onClick={() =>
                    onSortChange?.({ key: column.key, direction: nextDirection })
                }
            >
                <span className={styles.headerLabel}>{column.header}</span>
                <SortArrow direction={isSorted ? sortDirection : null} />
            </button>
        </div>
    );
}

function SortArrow({ direction }) {
    if (direction === 'asc') {
        return (
            <svg width="10" height="12" viewBox="0 0 10 12" className={styles.sortArrowActive} aria-hidden="true">
                <path d="M5 2L9 7H1L5 2Z" fill="currentColor" />
            </svg>
        );
    }
    if (direction === 'desc') {
        return (
            <svg width="10" height="12" viewBox="0 0 10 12" className={styles.sortArrowActive} aria-hidden="true">
                <path d="M5 10L1 5H9L5 10Z" fill="currentColor" />
            </svg>
        );
    }
    return (
        <svg width="10" height="12" viewBox="0 0 10 12" className={styles.sortArrow} aria-hidden="true">
            <path d="M5 1L8 4H2L5 1Z" fill="currentColor" />
            <path d="M5 11L2 8H8L5 11Z" fill="currentColor" />
        </svg>
    );
}

function Pagination({ page, totalPages, totalItems, itemLabel, itemLabelPlural, onPageChange }) {
    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

    return (
        <div className={styles.pagination}>
            <button
                type="button"
                className={styles.pageBtn}
                disabled={!canPrev}
                onClick={() => onPageChange(page - 1)}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Prev
            </button>

            <span className={styles.pageMeta}>
                Page {page + 1} of {totalPages}
                {totalItems !== undefined && (
                    <>
                        {' · '}
                        {totalItems.toLocaleString()}{' '}
                        {totalItems === 1 ? itemLabel : itemLabelPlural}
                    </>
                )}
            </span>

            <button
                type="button"
                className={styles.pageBtn}
                disabled={!canNext}
                onClick={() => onPageChange(page + 1)}
            >
                Next
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}
