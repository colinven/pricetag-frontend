import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Stack from "../components/ui/Stack";
import styles from "./LoginPage.module.css";


export default function LoginPage() {

    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuth();

    

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
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
        login(formData.email, formData.password)
        .then(() => navigate("/dashboard", { replace: true }))
        .catch((error) => {
            if (error.statusCode === 401) {
                setFormError(error.message)
            } else {
                console.error("Failed to authenticate user:", error);
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
                <h1 className={styles.heading}>Sign in</h1>
                <Stack direction="column" gap={4} align="stretch">
                    <FormField label="Email" error={errors.email} required>
                        <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="you@company.com" />
                    </FormField>
                    <FormField label="Password" error={errors.password} required>
                        <Input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Enter your password" />
                    </FormField>
                </Stack>
                {formError && <p className={styles.formError}>{formError}</p>}
                <Button size="lg" type="submit" fullWidth loading={isSubmitting}>Sign in</Button>
                <p className={styles.footer}>
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </Stack>
        </form>
    );
}