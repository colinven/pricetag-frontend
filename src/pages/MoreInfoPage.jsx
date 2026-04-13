import { useLocation, Navigate, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Card from "../components/ui/Card";
import Stack from "../components/ui/Stack";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import { amendQuoteRequest } from "../api/quote";
import styles from "./MoreInfoPage.module.css";

export default function MoreInfoPage() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams();
    const [formData, setFormData] = useState({ sqft: "", stories: "" });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!location.state) {
        return <Navigate to={`/quote/${slug}`} replace />
    }

    const data = location.state;
    const lookupResultData = data.lookupResult.data;
    
    const mapFields = (keys) => {
        const fields = [];
        for (let i = 0; i < keys.length; i++) {
            if (lookupResultData[keys[i]] !== null) {
                fields.push({ id: i, key: keys[i], value: lookupResultData[keys[i]] })
            } 
        }
        return fields;
    }
    const fields = mapFields(Object.keys(lookupResultData));
    const displayNames = {
        sqft: "Square Footage",
        year_built: "Year Built",
        stories: "Number of Stories",
        garage: "Garage Size (number of cars)",
        property_type: "Property Type",
        SINGLE_FAMILY: "Single family",
        TOWNHOMES: "Townhomes"
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const validate = () => {
        let newErrors = {};
        for (let field in formData) {
            if (lookupResultData[field]) continue;
            if (!lookupResultData[field] && !formData[field].trim()) newErrors[field] = "This field is required";
            else if (!/^\d+$/.test(formData[field])) newErrors[field] = "Please enter a valid number";
        }
        
        return newErrors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setFormError("");
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }
        const mergedData = {
                ...lookupResultData,
                sqft: lookupResultData.sqft ?? formData.sqft,
                stories: lookupResultData.stories ?? formData.stories
            }
        amendQuoteRequest(slug, {
            customerId: data.customerId,
            data: mergedData,
            addressInfo: data.addressInfo,
            lastWash: data.lastWash
        })
        .then((response) => {
            navigate(`/quote/${slug}/results`, {
                state: {
                    data: mergedData,
                    price: response.price,
                    address: data.address
                }
            })
        })
        .catch((error) => {
            setFormError(error.message);
            console.error(error.message);
        })
        .finally(() => setIsLoading(false));
    }

    return (
        <div className={styles.page}>
            <Card className={styles.card}>
                <div className={styles.splitLayout}>

                    {/* ── Left: info panel ── */}
                    <div className={styles.infoPanel}>
                        <h1 className={styles.heading}>We found your home!</h1>
                        <p className={styles.explanation}>
                            We were able to look up your property, but a couple of
                            details were missing from the public records. Fill in
                            the fields on the right and we'll have your estimate
                            ready in seconds.
                        </p>

                        {/* Known property data summary */}
                        <h2 className={styles.formHeading}>What we found</h2>
                        <div className={styles.propertySummary}>
                            <p className={styles.summaryLabel}>{data.address}</p>
                            {fields.map((field) => 
                            <div key={field.id} className={styles.summaryRow}>
                                <span className={styles.summaryKey}>{displayNames[field.key]}</span>
                                <span className={styles.summaryValue}>{displayNames[field.value] || field.value || "N/A"}</span>
                            </div>)}
                        </div>
                    </div>

                    {/* ── Right: form panel ── */}
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formPanel}>
                            <h2 className={styles.formHeading}>What we still need</h2>
                            <Stack direction="column" gap={4} align="stretch">
                                { !lookupResultData.sqft &&
                                <FormField label="Square footage" error={errors.sqft} required>
                                    <Input name="sqft" value={formData.sqft} onChange={handleChange} type="number" min="1" step="1" placeholder="e.g. 2100" />
                                </FormField>}
                                { !lookupResultData.stories &&
                                <FormField label="Number of stories" error={errors.stories} required>
                                    <Input name="stories" value={formData.stories} onChange={handleChange} type="number" min="1" step="1" placeholder="e.g. 2" />
                                </FormField>}
                            </Stack>

                            {formError && <p className={styles.formError}>{formError}</p>}

                            <Button size="lg" type="submit" loading={isLoading} fullWidth>
                                Get my estimate
                            </Button>
                        </div>
                    </form>    
                </div>
            </Card>
        </div>
    );
}