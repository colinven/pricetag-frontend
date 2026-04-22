import { Link } from 'react-router-dom';
import { formatRelativeDate } from '../../util/dateUtils';
import styles from './DashboardHome.module.css';

export default function PendingQuoteRow({ quote }) {
    const customerName = `${quote.customerFirstName} ${quote.customerLastName}`;
    const priceRange = `$${quote.priceLow.toLocaleString()} – $${quote.priceHigh.toLocaleString()}`;

    return (
        <Link to={`/dashboard/quotes/${quote.id}`} className={styles.row}>
            <span className={styles.rowName}>{customerName}</span>
            <span className={styles.rowAddress}>{quote.propertyAddress}</span>
            <span className={styles.rowPrice}>{priceRange}</span>
            <span className={styles.rowDate}>{formatRelativeDate(quote.createdAt)}</span>
        </Link>
    );
}
