import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './StreetViewEmbed.module.css';
import placeholderImage from '../../../assets/no-streetview.png';
import { getCachedStreetView } from '../../../util/googleMapsUtils';

export default function StreetViewEmbed({ address, alt, className }) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        
        let settled = false;

        const timeoutId = setTimeout(() => {
            if (settled) return;
            settled = true;
            setUrl(placeholderImage);
        }, 5000);

        getCachedStreetView(address)
        .then((url) => {
            settled = true;
            setUrl(url ?? placeholderImage);
            clearTimeout(timeoutId);
            return;
        });

        return () => {
            settled = true;
            clearTimeout(timeoutId);
        }
    }, [address]);

    return (
        <div className={clsx(styles.wrapper, className)}>
            {url === null ? (
                <div className={styles.skeleton} />
            ) : (
                <img
                    src={url}
                    alt={alt ?? `Street view of ${address}`}
                    className={styles.image}
                />
            )}
        </div>
    );
}
