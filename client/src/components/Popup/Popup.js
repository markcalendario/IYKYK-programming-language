"use client";

import { useEffect, useState } from "react";
import styles from "./Popup.module.scss";

export default function Popup({ isVisible, icon, message }) {
  if (!isVisible) {
    return;
  }

  return (
    <div className={styles.popup}>
      <i className={"fas fa-fw " + (!icon ? "fa-info" : "fa-times")} />
      <p>{message}</p>
    </div>
  );
}

export function usePopup(defaultVisibility, defaultMessage) {
  const [isVisible, setIsVisible] = useState(defaultVisibility);
  const [message, setMessage] = useState(defaultMessage ? defaultMessage : "");

  const setIsPopupVisible = (isVisible) => {
    setIsVisible(isVisible ? Math.random() : false);
  };

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible]);

  return { isPopupVisible: isVisible, setIsPopupVisible, message, setMessage };
}
