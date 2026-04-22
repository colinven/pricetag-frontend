import { useState } from 'react';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Toast from '../components/ui/Toast';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Stack from '../components/ui/Stack';
import Divider from '../components/ui/Divider';
import StatCard from '../components/ui/StatCard';
import QuoteStatusBadge from '../components/ui/QuoteStatusBadge';

const LAST_WASH_OPTIONS = [
    { value: 'never', label: 'Never' },
    { value: 'lt-6mo', label: 'Less than 6 months ago' },
    { value: '6-12mo', label: '6–12 months ago' },
    { value: '1-2yr', label: '1–2 years ago' },
    { value: 'gt-2yr', label: '2+ years ago' },
];

export default function ComponentGallery() {
    const [selectValue, setSelectValue] = useState('');
    const [selectErrorValue, setSelectErrorValue] = useState('');
    const [toast, setToast] = useState({ message: '', variant: 'info' });

    function showToast(variant, message) {
        setToast({ message, variant });
    }

    return (
        <div style={{ padding: '40px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* ── Buttons ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Buttons</h2>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button variant="primary">Save quote</Button>
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="ghost">Learn more</Button>
                    <Button variant="danger">Delete</Button>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button variant="primary" loading>Loading</Button>
                    <Button variant="secondary" loading>Loading</Button>
                </div>

                <Button variant="primary" fullWidth>Full width</Button>
            </section>

            {/* ── Input ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Input</h2>

                <FormField label="First name" required>
                    <Input placeholder="e.g. John" />
                </FormField>

                <FormField label="Email" hint="We'll send your quote here.">
                    <Input type="email" placeholder="you@example.com" />
                </FormField>

                <FormField label="Zip code" error="Please enter a valid 5-digit zip code.">
                    <Input placeholder="78701" />
                </FormField>

                <FormField label="Read only">
                    <Input value="123 Main St" readOnly />
                </FormField>

                <FormField label="Disabled">
                    <Input placeholder="Not available" disabled />
                </FormField>
            </section>

            {/* ── Textarea ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Textarea</h2>

                <FormField label="Notes" hint="Anything you'd like us to know.">
                    <Textarea placeholder="e.g. Gate code is 1234..." />
                </FormField>

                <FormField label="Notes" error="This field is required.">
                    <Textarea placeholder="e.g. Gate code is 1234..." />
                </FormField>

                <FormField label="Notes">
                    <Textarea placeholder="Not available" disabled />
                </FormField>
            </section>

            {/* ── Card + Stack + Divider ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Card / Stack / Divider</h2>

                <Card shadow="sm">
                    <Stack gap={4}>
                        <p>Shadow sm — default card</p>
                        <Divider />
                        <p>Content below a divider</p>
                    </Stack>
                </Card>

                <Card shadow="md">
                    <Stack direction="row" gap={4} align="center">
                        <Badge variant="info">Reviewed</Badge>
                        <p>Shadow md — row stack with badge</p>
                    </Stack>
                </Card>

                <Card shadow="lg">
                    <Stack gap={2}>
                        <p>Shadow lg</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                            Muted subtext below
                        </p>
                    </Stack>
                </Card>

                <Card shadow="none">
                    <p>No shadow</p>
                </Card>
            </section>

            {/* ── Spinner ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Spinner</h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                </div>
            </section>

            {/* ── Badge ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Badge</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Badge variant="success">Accepted</Badge>
                    <Badge variant="warning">Pending</Badge>
                    <Badge variant="error">Declined</Badge>
                    <Badge variant="info">Reviewed</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                </div>
            </section>

            {/* ── Toast ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Toast</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button variant="secondary" onClick={() => showToast('success', 'Quote finalized and sent to customer.')}>
                        Success
                    </Button>
                    <Button variant="secondary" onClick={() => showToast('error', 'Something went wrong. Please try again.')}>
                        Error
                    </Button>
                    <Button variant="secondary" onClick={() => showToast('warning', 'This quote expires in 2 days.')}>
                        Warning
                    </Button>
                    <Button variant="secondary" onClick={() => showToast('info', 'A new quote request has been submitted.')}>
                        Info
                    </Button>
                </div>

                <Toast
                    message={toast.message}
                    variant={toast.variant}
                    onDismiss={() => setToast({ message: '', variant: 'info' })}
                />
            </section>

            {/* ── Select ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Select</h2>

                <FormField label="Last wash" required>
                    <Select
                        options={LAST_WASH_OPTIONS}
                        value={selectValue}
                        onValueChange={setSelectValue}
                        placeholder="Select an interval"
                    />
                </FormField>

                <FormField label="Last wash" error="Please select an option.">
                    <Select
                        options={LAST_WASH_OPTIONS}
                        value={selectErrorValue}
                        onValueChange={setSelectErrorValue}
                        placeholder="Select an interval"
                    />
                </FormField>

                <FormField label="Last wash">
                    <Select
                        options={LAST_WASH_OPTIONS}
                        placeholder="Not available"
                        disabled
                    />
                </FormField>
            </section>
            {/* ── Stat Cards ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Stat Cards</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <StatCard label="Quotes to Review" value="3" description="Awaiting your review" />
                    <StatCard label="Total Quotes" value="1,208" description="All time" />
                    <StatCard label="Last 30 Days" value="42" />
                    <StatCard label="Conversion Rate" value="65%" description="Accepted / finalized" />
                </div>
            </section>
            {/* ── Quote Status Badges ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Quote Status Badges</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <QuoteStatusBadge status="PENDING" />
                    <QuoteStatusBadge status="REVIEWED" />
                    <QuoteStatusBadge status="ACCEPTED" />
                    <QuoteStatusBadge status="DECLINED" />
                </div>
            </section>
        </div>
    );
}