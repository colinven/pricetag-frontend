import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Stack from "../components/ui/Stack";
import styles from "./RegisterPage.module.css";
import Divider from "../components/ui/Divider";


export default function RegisterPage() {

    const navigate = useNavigate();
    const { isAuthenticated, register } = useAuth();

    

    const [formData, setFormData] = useState({
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "" 
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const validate = () => {
        const newErrors = {};
        if (formData.password.length < 14 ) newErrors.password = "Password must be atleast 14 characters long";
        for (let field in formData) {
            if (!formData[field].trim()) newErrors[field] = "This field is required";
        }
        
        return newErrors;
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
        setIsSubmitting(true);
        register(formData)
        .then(() => navigate("/dashboard", { replace: true }))
        .catch((error) => {
            if (error.statusCode === 409) {
                setFormError(error.message)
            } else {
                console.error("Failed to register user:", error);
                setFormError("Something went wrong. Please try again.")
            }
        })
        .finally(() => setIsSubmitting(false));
        
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack direction="column" gap={5} align="stretch">
                <h1 className={styles.heading}>Get started</h1>
                <Stack direction="column" gap={4} align="stretch">
                    <h2 className={styles.sectionHeading}>Company</h2>
                    <FormField label="Company Name" error={errors.companyName} required>
                        <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Example Inc." />
                    </FormField>
                    <FormField label="Company Email" error={errors.companyEmail} required>
                        <Input name="companyEmail" value={formData.companyEmail} onChange={handleChange} type="email" placeholder="example@company.com" />
                    </FormField>
                    <FormField label="Company Phone" error={errors.companyPhone} required>
                        <Input name="companyPhone" value={formData.companyPhone} onChange={handleChange} placeholder="(999) 999-9999" />
                    </FormField>
                </Stack>
                <Divider />
                <Stack direction="column" gap={4} align="stretch">
                    <h2 className={styles.sectionHeading}>Your Account</h2>
                    <div className={styles.nameRow}>
                        <FormField label="First Name" error={errors.firstName} required>
                            <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                        </FormField>
                        <FormField label="Last Name" error={errors.lastName} required>
                            <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                        </FormField>
                    </div>
                    <FormField label="Email" error={errors.email} required>
                        <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="johndoe@email.com" />
                    </FormField>
                    <FormField label="Password" error={errors.password} required>
                        <Input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Enter your password" />
                    </FormField>
                </Stack>
                {formError && <p className={styles.formError}>{formError}</p>}
                <Button size="lg" type="submit" fullWidth loading={isSubmitting}>Create Account</Button>
                <p className={styles.footer}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </Stack>
        </form>
    );
}