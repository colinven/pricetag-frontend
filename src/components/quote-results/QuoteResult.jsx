
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkStreetView from "../../util/checkStreetView";

export default function QuoteResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { lookupResult, price, address } = state;
  const encodedAddress = encodeURIComponent(address);
  const placeholderImageURL = "src/assets/no-streetview.png";
  const [image, setImage] = useState(placeholderImageURL);

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);

    const hasStreetView = async () => {
          const result = await checkStreetView(address);
          if (result) setImage(`https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${encodedAddress}&key=${import.meta.env.VITE_MAPS_API_KEY}`)
        }
    hasStreetView();
    
  }, [])

  const propertyTypeLabel = lookupResult.data.property_type
    ? lookupResult.data.property_type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : "Residential";

  return (
    <div className="result-page">

      {/* Page header */}
      <div className="result-page__header">
        <span className="badge">
          <span className="badge__dot" />
          Instant Estimate
        </span>
        <h1 className="result-page__title">
          Quote for <span className="result-page__title-accent">{address}</span>
        </h1>
      </div>

      {/* Mobile map — shown above card on small screens */}
      <div className="result-page__map result-page__map--mobile">
        <img src={image} alt={`Street view of ${address}`} />
      </div>

      {/* Main content */}
      <div className="result-page__body">

        {/* Desktop map — shown beside card on large screens */}
        <div className="result-page__map result-page__map--desktop glass-card">
          <img src={image} alt={`Street view of ${address}`} />
          <div className="result-page__map-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {address}
          </div>
        </div>

        {/* Quote card */}
        <div className="result-card glass-card">

          {/* Card header */}
          <div className="result-card__header">
            <div className="result-card__header-dots">
              <span className="result-card__dot result-card__dot--red" />
              <span className="result-card__dot result-card__dot--yellow" />
              <span className="result-card__dot result-card__dot--green" />
            </div>
            <span className="result-card__header-label">House Wash Estimate</span>
          </div>

          <div className="result-card__body">

            {/* Property info section */}
            <div className="result-card__section-label section-label">Property Info</div>

            <div className="result-card__props">
              <div className="result-card__prop">
                <span className="result-card__prop-key">Type</span>
                <span className="result-card__prop-val">{propertyTypeLabel}</span>
              </div>
              <div className="result-card__prop">
                <span className="result-card__prop-key">Sq. Footage</span>
                <span className="result-card__prop-val">
                  {lookupResult.data.sqft ? `${lookupResult.data.sqft.toLocaleString()} sqft` : "N/A"}
                </span>
              </div>
              <div className="result-card__prop">
                <span className="result-card__prop-key">Stories</span>
                <span className="result-card__prop-val">{lookupResult.data.stories ?? "N/A"}</span>
              </div>
              <div className="result-card__prop">
                <span className="result-card__prop-key">Year Built</span>
                <span className="result-card__prop-val">{lookupResult.data.year_built ?? "N/A"}</span>
              </div>
            </div>

            {/* Price range */}
            <div className="result-card__price-label section-label">Estimated Range</div>
            <div className="result-card__price">
              ${price ? price[0].toLocaleString() : "N/A"} <span className="result-card__price-sep">—</span> ${price ? price[1].toLocaleString() : "N/A"}
            </div>
            <p className="result-card__price-note">
              Final price may vary based on condition, access, and additional services.
            </p>

            {/* Divider */}
            <div className="result-card__divider" />

            {/* CTA */}
            <div className="result-card__cta">
              <p className="result-card__cta-text">
                Ready to book or have questions? Reach out and we'll get you scheduled.
              </p>
              <a href="" className="app-btn app-btn--primary result-card__cta-btn">
                {/* TODO: Replace with real phone number */}
                Contact Us
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}