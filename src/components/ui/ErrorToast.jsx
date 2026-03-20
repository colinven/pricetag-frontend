import { useEffect, useState } from "react";
import "./ErrorToast.scss";

export default function ErrorToast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    const fadeTimer = setTimeout(() => setVisible(false), 6000);
    const dismissTimer = setTimeout(() => onDismiss?.(), 6400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [message]);

  if (!message) return null;

  return (
    <div className={`toast ${visible ? "toast--visible" : "toast--hidden"}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{message}</span>
    </div>
  );
}