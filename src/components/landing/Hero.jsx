
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">

        <span className="badge">
          <span className="badge__dot" />
          Free, Fast House Wash Quotes
        </span>

        <h1 className="hero__title">
          Your Home's Price,
          <br />
          <span className="hero__title-accent">In Seconds.</span>
        </h1>

        <p className="hero__description">
          Enter your address and get an accurate house wash quote instantly —
          no waiting, no back-and-forth. PriceTag pulls your home's data
          automatically and calculates a price range on the spot.
        </p>

        <div className="hero__actions">
          <Link to="/get-a-quote" className="app-btn app-btn--primary">
            Get My Free Quote
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-value">30 sec</span>
            <span className="hero__stat-label">Average quote time</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value">100%</span>
            <span className="hero__stat-label">Free, no obligation</span>
          </div>
        </div>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__card glass-card">
          <div className="hero__card-header">
            <span className="hero__card-dot hero__card-dot--red" />
            <span className="hero__card-dot hero__card-dot--yellow" />
            <span className="hero__card-dot hero__card-dot--green" />
            <span className="hero__card-label">Quote Preview</span>
          </div>
          <div className="hero__card-body">
            <div className="hero__card-row">
              <span className="hero__card-key">Address</span>
              <span className="hero__card-val">412 Maple Drive</span>
            </div>
            <div className="hero__card-row">
              <span className="hero__card-key">Sq. Footage</span>
              <span className="hero__card-val">2,340 sqft</span>
            </div>
            <div className="hero__card-row">
              <span className="hero__card-key">Stories</span>
              <span className="hero__card-val">2</span>
            </div>
            <div className="hero__card-row">
              <span className="hero__card-key">Year Built</span>
              <span className="hero__card-val">2003</span>
            </div>
            <div className="hero__card-divider" />
            <div className="hero__card-price-label">Estimated Range</div>
            <div className="hero__card-price">$245 — $315</div>
          </div>
        </div>
      </div>
    </section>
  );
}