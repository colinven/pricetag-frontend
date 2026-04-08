import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const STORIES_OPTIONS = ["1", "2", "3"];

export default function NeedMoreInfo({ onSubmit }) {
  const { state } = useLocation();
  const navigate = useNavigate();

  //TODO: prevent users from being able to navigate back and alter updated property details once submitted
  if (!state) {
    navigate("/");
    return null;
  }

  const { QuoteResponse, lastWash } = state;

  const data = QuoteResponse.lookupResult.data;
  const address = QuoteResponse.address;

  const needsSqft = data.sqft === null;
  const needsStories = data.stories === null;

  const [fields, setFields] = useState({
    sqft: "",
    stories: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  }

  function validate() {
    const errs = {};
    if (needsSqft && !fields.sqft) errs.sqft = "Please enter the square footage";
    if (needsSqft && fields.sqft && (isNaN(fields.sqft) || Number(fields.sqft) <= 0))
      errs.sqft = "Please enter a valid square footage";
    if (needsStories && !fields.stories) errs.stories = "Please select the number of stories";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const updatedData = {
      ...data,
      sqft: needsSqft ? Number(fields.sqft) : data.sqft,
      stories: needsStories ? Number(fields.stories) : data.stories,
    };
    const amendedQuoteRequest = {
      data: updatedData,
      lastWash: lastWash
    };
    
    if (onSubmit) await onSubmit({ QuoteResponse, amendedQuoteRequest });
  }

  const propertyTypeLabel = data.property_type
    ? data.property_type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : "Residential";

  return (
    <div className="page">
      <div className="nmi-wrapper">

        {/* Left — explanation */}
        <div className="nmi-info">
          <span className="badge">
            <span className="badge__dot" />
            Almost There
          </span>

          <h2 className="nmi-info__title">
            We found your home —<br />
            just need a couple more details.
          </h2>

          <p className="nmi-info__body">
            We pulled what we could from public records, but a few details
            weren't available. Fill in the missing info and we'll calculate
            your quote instantly.
          </p>

          {/* Known property data */}
          <div className="nmi-info__known glass-card">
            <div className="nmi-info__known-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {address}
            </div>
            <div className="nmi-info__known-body">
              {data.property_type && (
                <div className="nmi-info__known-row">
                  <span className="nmi-info__known-key">Type</span>
                  <span className="nmi-info__known-val">{propertyTypeLabel}</span>
                </div>
              )}
              {data.year_built && (
                <div className="nmi-info__known-row">
                  <span className="nmi-info__known-key">Year Built</span>
                  <span className="nmi-info__known-val">{data.year_built}</span>
                </div>
              )}
              {!needsSqft && (
                <div className="nmi-info__known-row">
                  <span className="nmi-info__known-key">Sq. Footage</span>
                  <span className="nmi-info__known-val">{data.sqft.toLocaleString()} sqft</span>
                </div>
              )}
              {!needsStories && (
                <div className="nmi-info__known-row">
                  <span className="nmi-info__known-key">Stories</span>
                  <span className="nmi-info__known-val">{data.stories}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — input card */}
        <div className="nmi-card glass-card">
          <div className="nmi-card__header">
            <div className="nmi-card__dots">
              <span className="nmi-card__dot nmi-card__dot--red" />
              <span className="nmi-card__dot nmi-card__dot--yellow" />
              <span className="nmi-card__dot nmi-card__dot--green" />
            </div>
            <span className="nmi-card__header-label">Missing Details</span>
          </div>

          <form className="nmi-card__body" onSubmit={handleSubmit} noValidate>
            <p className="nmi-card__hint">
              You can find this info on your county tax assessor's website,
              a past appraisal, or by checking your home's listing history.
            </p>

            <div className="section-label">Fill in what's missing</div>

            {needsSqft && (
              <div className="nmi-card__field">
                <label className="quote-form__label" htmlFor="sqft">
                  Approximate Square Footage
                </label>
                <input
                  className={`quote-form__input ${errors.sqft ? "input--error" : ""}`}
                  id="sqft"
                  name="sqft"
                  type="number"
                  placeholder="e.g. 2000"
                  min="1"
                  value={fields.sqft}
                  onChange={handleChange}
                />
                {errors.sqft && <span className="field-error">{errors.sqft}</span>}
              </div>
            )}

            {needsStories && (
              <div className="nmi-card__field">
                <label className="quote-form__label" htmlFor="stories">
                  Number of Stories
                </label>
                <div className="quote-form__select-wrapper">
                  <select
                    className={`quote-form__select ${errors.stories ? "input--error" : ""}`}
                    id="stories"
                    name="stories"
                    value={fields.stories}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select...</option>
                    {STORIES_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt} {opt === "1" ? "story" : "stories"}</option>
                    ))}
                  </select>
                  <svg className="quote-form__select-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {errors.stories && <span className="field-error">{errors.stories}</span>}
              </div>
            )}

            <button className="app-btn app-btn--primary nmi-card__submit" type="submit">
              Calculate My Quote
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}