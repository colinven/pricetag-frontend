import { useLocation, Navigate ,useOutletContext, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { hasStreetView, getStreetView, getCachedStreetView } from "../util/googleMapsUtils";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import styles from "./QuoteResultsPage.module.css";
import placeholderImage from "../assets/no-streetview.png"

const displayNames = {
        SINGLE_FAMILY: "Single Family",
        TOWNHOMES: "Townhome"
    }

export default function QuoteResultsPage() {

    const location = useLocation();
    const { slug } = useParams();
    const { companyName, companyPhone, companyEmail} = useOutletContext();
    const [streetViewUrl, setStreetViewUrl] = useState(null);

    const { data, price, address } = location.state ?? {};

    useEffect(() => {
        if (!address) return;
        let settled = false;

        // fallback if google maps is slow/unreachable - show placeholder after 5sec
        const timeoutId = setTimeout(() => {
            if (settled) return;
            settled = true;
            setStreetViewUrl(placeholderImage);
        }, 5000);

        getCachedStreetView(address)
        .then((url) => {
            settled = true;
            clearTimeout(timeoutId);
            setStreetViewUrl(url ?? placeholderImage);
            return;
        });

        return () => {
            settled = true;
            clearTimeout(timeoutId);
        };
    }, [address]);

    if (!location.state) return <Navigate to={`/quote/${slug}`} replace />;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <SuccessHeader />

                <Card className={styles.propertyCard}>
                    <div className={styles.imageWrapper}>
                        {streetViewUrl === null ? (
                            <div className={styles.imageSkeleton} />
                        ) : (
                            <img
                                src={streetViewUrl}
                                alt={`Street view of ${address}`}
                                className={styles.streetView}
                            />
                        )}          
                    </div>

                    <div className={styles.propertyBody}>
                        <h1 className={styles.address}>{address}</h1>

                        <div className={styles.divider} />

                        <div className={styles.detailsGrid}>
                            <section className={styles.priceSection}>
                                <h2 className={styles.sectionLabel}>Estimated range</h2>
                                <p className={styles.price}>
                                    ${price[0].toLocaleString()} – ${price[1].toLocaleString()}
                                </p>
                                <p className={styles.priceCaption}>
                                    <strong>Your final price will typically fall within this range.</strong> Note that this is only an estimate,
                                    and it is subject to change. In some cases, {companyName} may conclude that more info is needed in order to
                                    provide an accurate final quote. {companyName} will notify you in such conditions.
                                </p>
                                <Button
                                    as="a"
                                    href={`tel:${companyPhone}`}
                                    variant="secondary"
                                    className={styles.callButton}
                                >
                                    <PhoneIcon />
                                    Call {companyPhone}
                                </Button>
                            </section>

                            <section className={styles.detailsSection}>
                                <h2 className={styles.sectionLabel}>Property details</h2>
                                <ul className={styles.detailsList}>
                                    <li><span>Square footage</span><span>{data.sqft.toLocaleString()}</span></li>
                                    <li><span>Stories</span><span>{data.stories}</span></li>
                                    <li><span>Year built</span><span>{data.year_built}</span></li>
                                    <li><span>Garage</span><span>{data.garage}-car</span></li>
                                    <li><span>Type</span><span>{displayNames[data.property_type]}</span></li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </Card>

                <Card className={styles.stepperCard}>
                    <h2 className={styles.stepperHeading}>What happens next</h2>
                    <ProgressStepper currentStep={0} />
                </Card>

                <ContactFooter company={{name: companyName, phone: companyPhone, email: companyEmail}} />
            </div>
        </div>
    );
}

/* ─── Local subcomponents ────────────────────────────────── */

function SuccessHeader() {
    return (
        <div className={styles.successHeader}>
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <div className={styles.successText}>
                <p className={styles.successTitle}>Quote request received!</p>
                <p className={styles.successSubtitle}>
                    We will review your quote, and send you an email with a final price shortly.
                </p>
            </div>
        </div>
    );
}

function ProgressStepper({ currentStep = 0 }) {
    const steps = [
        { label: "Submitted", caption: "Just now" },
        { label: "Under review", caption: null },
        { label: "Final quote sent", caption: "Usually within 24h" },
    ];

    return (
        <ol className={styles.stepper}>
            {steps.map((step, i) => {
                const state =
                    i < currentStep ? "complete" :
                    i === currentStep ? "current" :
                    "upcoming";
                return (
                    <li key={step.label} className={styles.step} data-state={state}>
                        <div className={styles.stepNodeWrapper}>
                            <div className={styles.stepConnector} data-position="left" />
                            <div className={styles.stepNode} />
                            <div className={styles.stepConnector} data-position="right" />
                        </div>
                        <div className={styles.stepLabels}>
                            <p className={styles.stepLabel}>{step.label}</p>
                            {step.caption && (
                                <p className={styles.stepCaption}>{step.caption}</p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

function PhoneIcon() {
    return (
        <svg
            className={styles.callIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

function ContactFooter({ company }) {
    return (
        <div className={styles.contactFooter}>
            <span className={styles.contactLabel}>Questions?</span>
            <span className={styles.contactDivider}>·</span>
            <span className={styles.contactCompany}>{company.name}</span>
            <span className={styles.contactDivider}>·</span>
            <a href={`tel:${company.phone}`} className={styles.contactLink}>
                {company.phone}
            </a>
            <span className={styles.contactDivider}>·</span>
            <a href={`mailto:${company.email}`} className={styles.contactLink}>
                {company.email}
            </a>
        </div>
    );
}