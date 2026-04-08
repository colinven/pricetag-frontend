import Button from '../components/ui/Button'

export default function ComponentGallery() {
    return (
        <div>
            <Button variant="primary">Save quote</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost">Learn more</Button>
            <Button variant="danger">Delete</Button>

            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>

            <Button variant="primary" disabled>Can't click</Button>
            <Button variant="primary" fullWidth>Full width</Button>
        </div>
    )
};