import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import clsx from "clsx";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Stack from "../components/ui/Stack";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import styles from "./QuoteFormPage.module.css";
import { sendQuoteRequest } from "../api/quote";

export default function QuoteFormPage() {

    const { companyName, companyPhone, companyEmail, slug } = useOutletContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        lastWash: ""
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [howOpen, setHowOpen] = useState(false);

    const LAST_WASH_OPTIONS = [
        { value: "Never / First time", label: "Never / First time" },
        { value: "Less than 1 year ago", label: "Less than 1 year ago" },
        { value: "1 - 2 years ago", label: "1 - 2 years ago" },
        { value: "3 - 4 years ago", label: "3 - 4 years ago" },
        { value: "5+ years ago", label: "5+ years ago" },
        { value: "Not sure", label: "Not sure" },
    ]

    const validate = () => {
        const newErrors = {};
        for (let field in formData) {
            if (!formData[field].trim()) newErrors[field] = "This field is required";
        }
        if (!/^\d{5}$/.test(formData.zip)) newErrors.zip = "Zip must be 5 digits";
        if (!/^[A-Za-z]{2}$/.test(formData.state)) newErrors.state = "State must be abbreviated";
        if (!/^\d+\s+\S+/.test(formData.street)) newErrors.street = "Please enter a valid street name";
        if (!/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(formData.phone)) newErrors.phone = "Please enter a valid phone number."
        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setFormError("");
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);
        sendQuoteRequest(slug, formData)
        .then((response) => {
            if (!response.lookupResult.data) {
                setFormError(response.lookupResult.message)
                return;
            }
            if (!response.price) {
                navigate("more-info", {
                    state: {
                        customerId: response.customerId,
                        lookupResult: response.lookupResult,
                        address: response.address,
                        addressInfo: {
                            street: formData.street,
                            city: formData.city,
                            state: formData.state,
                            zip: formData.zip
                        },
                        lastWash: formData.lastWash,
                        companyName,
                        companyPhone,
                        companyEmail
                    }
                });
                return;
            }
            navigate("results", {
            state: { ...response, companyName, companyEmail, companyPhone }
            });
        })
        .catch((error) => {
            console.error("Failed to fulfill quote request:", error);
            setFormError(error.message)
        })
        .finally(() => setIsLoading(false));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const setSelect = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <div className={styles.page}>
            <div className={styles.layout}>

                {/* Info blurb — left on desktop, top on mobile */}
                <aside className={styles.infoBlurb}>
                    <div className={styles.companyInfo}>
                        <h1 className={styles.companyName}>{companyName}</h1>
                        <div className={styles.companyDetails}>
                            <p className={styles.companyDetail}>{companyPhone}</p>
                            <p className={styles.companyDetail}>{companyEmail}</p>
                        </div>
                    </div>

                    <h2 className={styles.infoHeading}>Here's what to expect</h2>
                    <ol className={styles.steps}>
                        <li className={styles.step}>
                            <span className={styles.stepNumber}>1</span>
                            <p className={styles.stepText}>Fill out your address and contact info below.</p>
                        </li>
                        <li className={styles.step}>
                            <span className={styles.stepNumber}>2</span>
                            <p className={styles.stepText}>We'll look up your property and give you an estimated price range right away.</p>
                        </li>
                        <li className={styles.step}>
                            <span className={styles.stepNumber}>3</span>
                            <p className={styles.stepText}>{companyName} will review your quote, set a final price, and send it to your email.</p>
                        </li>
                    </ol>

                    <div className={styles.disclosure}>
                        <button
                            type="button"
                            className={styles.disclosureToggle}
                            onClick={() => setHowOpen((prev) => !prev)}
                            aria-expanded={howOpen}
                        >
                            <span className={clsx(styles.disclosureArrow, howOpen && styles.disclosureArrowOpen)}>&#9654;</span>
                            How does this work?
                        </button>
                        <div className={clsx(styles.disclosureContent, howOpen && styles.disclosureContentOpen)}>
                            <div className={styles.disclosureInner}>
                                <p className={styles.disclosureBody}>
                                    When you submit your address, we use public property records to look up details
                                    about your home — like square footage, number of stories, and year built. That
                                    data is run through {companyName}'s pricing formula to generate an estimated price
                                    range instantly. No one needs to visit your property for the estimate.
                                    <strong> We do not share your info with any third parties.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Form card — right on desktop, below on mobile */}
                <Card className={styles.card}>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="column" gap={5} align="stretch">
                            <h2 className={styles.heading}>Get your free quote</h2>
                            <Stack direction="column" gap={4} align="stretch">
                                <h3 className={styles.sectionHeading}>Contact Info</h3>
                                <div className={styles.nameRow}>
                                    <FormField label="First Name" error={errors.firstName} required>
                                        <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jill" />
                                    </FormField>
                                    <FormField label="Last Name" error={errors.lastName} required>
                                        <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith" />
                                    </FormField>
                                </div>
                                <FormField label="Phone" error={errors.phone} required>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="(999) 999-9999" />
                                </FormField>
                                <FormField label="Email" error={errors.email} required>
                                    <Input name="email" value={formData.email} type="email" onChange={handleChange} placeholder="example@email.com" />
                                </FormField>
                                <h3 className={styles.sectionHeading}>Address</h3>
                                <FormField label="Street" error={errors.street} required>
                                    <Input name="street" value={formData.street} onChange={handleChange} placeholder="123 Oak Street" />
                                </FormField>
                                <FormField label="City" error={errors.city} required>
                                    <Input name="city" value={formData.city} onChange={handleChange} placeholder="San Jose" />
                                </FormField>
                                <div className={styles.nameRow}>
                                    <FormField label="State" error={errors.state} required>
                                        <Input name="state" value={formData.state} onChange={handleChange} maxLength={2} placeholder="CA" />
                                    </FormField>
                                    <FormField label="Zip" error={errors.zip} required>
                                        <Input name="zip" value={formData.zip} onChange={handleChange} maxLength={5} placeholder="95101" />
                                    </FormField>
                                </div>
                                <h3 className={styles.sectionHeading}>Last Wash</h3>
                                <FormField label="How long since your last house wash?" error={errors.lastWash} required>
                                    <Select
                                        options={LAST_WASH_OPTIONS}
                                        value={formData.lastWash}
                                        onValueChange={(val) => setSelect('lastWash', val)}
                                        placeholder="Select an interval"
                                    />
                                </FormField>
                            </Stack>
                            {formError && <p className={styles.formError}>{formError}</p>}
                            <Button size="lg" type="submit" fullWidth loading={isLoading}>Submit</Button>
                            <p className={styles.footer}>
                                By clicking submit, you agree to allow {companyName} to contact you by the phone number and email that you provided.
                            </p>
                        </Stack>
                    </form>
                </Card>

            </div>
        </div>
    );
}