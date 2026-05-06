const formatRelativeDate = (iso) => {
    if (iso == null) return "";
    const date = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    
    const now = new Date;
    const timeDiffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    const TIME_CONVERSIONS = {
        MINUTES: 60,
        HOURS: 3600,
        DAYS: 86400
    };

    if (timeDiffSec < 60) return "Just now";

    const timeDiffMin = Math.floor(timeDiffSec / TIME_CONVERSIONS.MINUTES);
    const timeDiffHr = Math.floor(timeDiffSec / TIME_CONVERSIONS.HOURS);
    const timeDiffDay = Math.floor(timeDiffSec / TIME_CONVERSIONS.DAYS);

    if (timeDiffMin < 60) return `${timeDiffMin} minute${timeDiffMin === 1 ? "" : "s"} ago`;
    if (timeDiffHr < 24) return `${timeDiffHr} hour${timeDiffHr === 1 ? "" : "s"} ago`;
    if (timeDiffDay < 7) return `${timeDiffDay} day${timeDiffDay === 1 ? "" : "s"} ago`;

    const sameYear = date.getFullYear() === now.getFullYear();
    const options = sameYear 
        ? { month: "short", day: "numeric" } 
        : { month: "short", day: "numeric", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
    
}

const formatAbsoluteDateTime = (iso) => {
    if (iso == null) return null;
    const date = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
    }).format(date);
}

const formatAbsoluteDate = (iso) => {
    if (iso == null) return null;
    const date = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    }).format(date);
}

const formatRelativeFuture = (iso) => {
    if (iso == null) return null;
    const date = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(date.getTime())) return null;

    const now = new Date();
    const diffSec = Math.floor((date.getTime() - now.getTime()) / 1000);

    if (diffSec <= 0) return null;
    if (diffSec < 60) return 'in less than a minute';

    const diffMin = Math.floor(diffSec / 60);
    const diffHr  = Math.floor(diffSec / 3600);
    const diffDay = Math.floor(diffSec / 86400);

    if (diffMin < 60) return `in ${diffMin} minute${diffMin === 1 ? '' : 's'}`;
    if (diffHr < 24)  return `in ${diffHr} hour${diffHr === 1 ? '' : 's'}`;
    if (diffDay < 30) return `in ${diffDay} day${diffDay === 1 ? '' : 's'}`;

    return null;
}

export { formatRelativeDate, formatAbsoluteDateTime, formatAbsoluteDate, formatRelativeFuture };