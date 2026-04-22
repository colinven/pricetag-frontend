import Badge from '../Badge';

const STATUS_MAP = {
    PENDING:  { variant: 'warning', label: 'Pending'  },
    REVIEWED: { variant: 'info',    label: 'Reviewed' },
    ACCEPTED: { variant: 'success', label: 'Accepted' },
    DECLINED: { variant: 'neutral', label: 'Declined' },
};

export default function QuoteStatusBadge({ status }) {
    const entry = STATUS_MAP[status];
    if (!entry) return null;
    return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
