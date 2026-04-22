const formatRelativeDate = (iso) => {
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

export { formatRelativeDate };