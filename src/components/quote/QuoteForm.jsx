import { useState } from "react";


const WASH_INTERVALS = [
  "Never / First time",
  "Less than 1 year ago",
  "1 - 2 years ago",
  "3 - 4 years ago",
  "5+ years ago",
  "Not sure",
];

export default function QuoteForm({ onSubmit }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    lastWash: "",
  });

  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    street: null,
    city: null,
    state: null,
    zip: null,
    lastWash: null,
  });

  function validate(form) {
    const errors = {};
    Object.keys(form).forEach(name => {
      const error = validateField(name, form[name]);
      if (error) errors[name] = error;
    });
    return errors;
  }

  function validateField(name, value) {
    switch (name) {
    case "firstName":
      return value.trim() ? null : "This field is required";
    case "lastName":
      return value.trim() ? null : "This field is required";
    case "street":
      return /^\d+\s+\S+/.test(value) ? null : "Enter a valid street address";
    case "city":
      return value.trim() ? null : "This field is required";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Enter a valid email address";
    case "phone":
      return value.replace(/\D/g, "").length === 10 ? null : "Enter a valid 10-digit phone number";
    case "state":
      return /^[A-Za-z]{2}$/.test(value) ? null : "Enter a valid 2-letter state code";
    case "zip":
      return /^\d{5}$/.test(value) ? null : "Enter a valid 5-digit ZIP code";
    case "lastWash":
      return value ? null : "Please select an option";
    default:
      return null;
  }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setLoading(true);
    if (onSubmit) await onSubmit(form);
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="quote-form-wrapper glass-card">

        <div className="quote-form__header">
          <span className="badge">
            <span className="badge__dot" />
            Free Estimate
          </span>
          <h2 className="quote-form__title">Get Your Instant Quote</h2>
          <p className="quote-form__subtitle">
            Fill out the form below and we'll calculate a price range for your
            home in seconds. <strong>We will never share your information.</strong>
          </p>
        </div>

        <form className="quote-form" onSubmit={handleSubmit} noValidate>

          <div className="quote-form__row">
            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="firstName">First Name</label>
              <input className={`quote-form__input ${errors.firstName ? "input--error" : "" }`} id="firstName" name="firstName" type="text" placeholder="John" value={form.firstName} onChange={handleChange} onBlur={handleBlur} required />
              {errors && <span className="field-error">{errors.firstName}</span>}
            </div>
            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="lastName">Last Name</label>
              <input className={`quote-form__input ${errors.lastName ? "input--error" : "" }`} id="lastName" name="lastName" type="text" placeholder="Smith" value={form.lastName} onChange={handleChange} onBlur={handleBlur} required />
              {errors && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="quote-form__row">
            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="phone">Phone Number</label>
              <input className={`quote-form__input ${errors.phone ? "input--error" : "" }`} id="phone" name="phone" type="tel" placeholder="(704) 555-0123" value={form.phone} onChange={handleChange} onBlur={handleBlur} required />
              {errors && <span className="field-error">{errors.phone}</span>}            
            </div>
            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="email">Email Address</label>
              <input className={`quote-form__input ${errors.email ? "input--error" : "" }`} id="email" name="email" type="email" placeholder="john@email.com" value={form.email} onChange={handleChange} onBlur={handleBlur} required />
              {errors && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="section-label">Property Address</div>

          <div className="quote-form__field quote-form__field--full">
            <label className="quote-form__label" htmlFor="street">Street Address</label>
            <input className={`quote-form__input ${errors.street ? "input--error" : "" }`} id="street" name="street" type="text" placeholder="412 Maple Drive" value={form.street} onChange={handleChange} onBlur={handleBlur} required />
            {errors && <span className="field-error">{errors.street}</span>}
          </div>

          <div className="quote-form__row quote-form__row--thirds">
            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="city">City</label>
              <input className={`quote-form__input ${errors.city ? "input--error" : "" }`} id="city" name="city" type="text" placeholder="Charlotte" value={form.city} onChange={handleChange} onBlur={handleBlur} required />
              {errors && <span className="field-error">{errors.city}</span>}
            </div>
            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="state">State</label>
              <input className={`quote-form__input ${errors.state ? "input--error" : "" }`} id="state" name="state" type="text" placeholder="NC" maxLength={2} value={form.state} onChange={handleChange} onBlur={handleBlur} required />
              {errors && <span className="field-error">{errors.state}</span>}
            </div>
            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="zip">ZIP Code</label>
              <input className={`quote-form__input ${errors.zip ? "input--error" : "" }`} id="zip" name="zip" type="text" placeholder="28205" maxLength={5} value={form.zip} onChange={handleChange} onBlur={handleBlur} required />
              {errors && <span className="field-error">{errors.zip}</span>}
            </div>
          </div>

          <div className="quote-form__field quote-form__field--full">
            <label className="quote-form__label" htmlFor="lastWash">How long since your last house wash?</label>
            <div className="quote-form__select-wrapper">
              <select className={`quote-form__select ${errors.lastWash ? "input--error" : "" }`} id="lastWash" name="lastWash" value={form.lastWash} onChange={handleChange} onBlur={handleBlur} required>
                <option value="" disabled>Select an option...</option>
                {WASH_INTERVALS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              
              <svg className="quote-form__select-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {errors && <span className="field-error">{errors.lastWash}</span>}
          </div>
          
          <button className={`app-btn app-btn--primary quote-form__submit ${loading ? "quote-form__submit--loading" : ""}`} type="submit" disabled={loading}>
            {loading ? (
              <><span className="spinner" />Calculating your quote...</>
            ) : (
              <>Get My Free Quote
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          <p className="quote-form__subtitle">
            By submitting, you agree to allow &lt;company&gt; to contact you by phone and email to follow up on your quote request.
          </p>

        </form>
      </div>
    </div>
  );
}