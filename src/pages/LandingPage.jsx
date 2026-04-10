import { Navigate, Link } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import useInView from "../hooks/useInView";
import Button from "../components/ui/Button";
import logo from "../assets/pricetag-logo.png";
import styles from "./LandingPage.module.css";

const features = [
    {
        title: "Automatic Property Lookup",
        body: "Enter an address. Get square footage, stories, and year built — pulled automatically. No manual research.",
    },
    {
        title: "Your Pricing Rules",
        body: "Configure your formula once. Every quote is priced consistently, whether you send five a week or fifty.",
    },
    {
        title: "One-Click Quotes",
        body: "Review the property, set the final price, send. Your customer gets a branded page — not a text message.",
    },
    {
        title: "Built for the Field",
        body: "Works on your phone, your tablet, and your desktop. Quote from the job site or the office.",
    },
];

const narrativeSections = [
    {
        label: "Step 1",
        title: "Customer submits their address",
        body: "They fill out a form on your branded page. PriceTag pulls property data automatically — square footage, stories, year built — and runs it through your pricing formula to generate an instant price range. Your customer sees an estimate before you even open the app.",
        visual: "Quote form preview",
    },
    {
        label: "Step 2",
        title: "You review and set the final price",
        body: "The price range is already calculated. You review the property details, check the numbers, and set a final price. One click sends your customer a professional quote page with your company name on it.",
        visual: "Dashboard preview",
    },
    {
        label: "Step 3",
        title: "They accept with one click",
        body: "No phone tag. No PDF attachments. No chasing people down. Your customer gets a clean, branded page with the final price. They accept or decline online, and you get notified instantly.",
        visual: "Customer quote page preview",
    },
];

function FadeSection({ children, className }) {
    const [ref, isVisible] = useInView();
    return (
        <div
            ref={ref}
            className={clsx(styles.fadeTarget, isVisible && styles.fadeVisible, className)}
        >
            {children}
        </div>
    );
}

export default function LandingPage() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return (
        <div>
            {/* Nav */}
            <nav className={styles.nav}>
                <img src={logo} alt="PriceTag" className={styles.navLogo} />
                <div className={styles.navActions}>
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary" size="sm">Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero — fades in on page load */}
            <section className={clsx(styles.hero, styles.heroFadeIn)}>
                <img src={logo} alt="PriceTag" className={styles.heroLogo} />
                <h1 className={styles.heroHeadline}>
                    Professional quotes, sent in minutes
                </h1>
                <p className={styles.heroSub}>
                    PriceTag turns an address into a price range in seconds — and sends your customer a branded quote they can accept online. No more texting estimates from your truck.
                </p>
                <Link to="/register">
                    <Button size="lg">Get Started</Button>
                </Link>
            </section>

            {/* Narrative sections — each fades in on scroll */}
            {narrativeSections.map((section, i) => (
                <FadeSection key={i}>
                    <section className={styles.narrativeSection}>
                        <div className={styles.narrativeText}>
                            <p className={styles.narrativeLabel}>{section.label}</p>
                            <h2 className={styles.narrativeTitle}>{section.title}</h2>
                            <p className={styles.narrativeBody}>{section.body}</p>
                        </div>
                        <div className={styles.narrativeVisual}>
                            {section.visual}
                        </div>
                    </section>
                </FadeSection>
            ))}

            {/* Feature cards — grid fades in with staggered children */}
            <FadeSection>
                <section className={styles.featuresSection}>
                    <h2 className={styles.featuresSectionTitle}>Everything you need to quote faster</h2>
                    <div className={styles.featuresGrid}>
                        {features.map((feature, i) => (
                            <div key={i} className={styles.featureCard}>
                                <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                                <p className={styles.featureCardBody}>{feature.body}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </FadeSection>

            {/* Bottom CTA — fades in on scroll */}
            <FadeSection>
                <section className={styles.bottomCta}>
                    <h2 className={styles.bottomCtaHeadline}>
                        Your competitors are still texting quotes.
                    </h2>
                    <Link to="/register">
                        <Button size="lg">Create your account</Button>
                    </Link>
                </section>
            </FadeSection>

            {/* Footer */}
            <footer className={styles.footer}>
                <span>&copy; 2026 PriceTag</span>
                <Link to="/login" className={styles.footerLink}>Login</Link>
            </footer>
        </div>
    );
}