import { useEffect, useRef, useState } from "react";

import "./style.css";

const WakeLockToggle = ({ label }) => {
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    setWakeLockSupported("wakeLock" in navigator);
  }, []);

  const handleChange = async () => {
    if (wakeLockSupported === false) {
      return;
    }

    if (!isChecked) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          setIsChecked(false);
        });
      } catch (error) {
        alert(error.message);
        return;
      }
    } else {
      await wakeLockRef.current?.release();
      wakeLockRef.current = null;
    }

    setIsChecked(!isChecked);
  };

  if (wakeLockSupported === false) {
    return null;
  }

  return (
    <label id="wake-lock-label">
      <span>{label}</span>
      <input
        id="wake-lock-toggle"
        type="checkbox"
        role="switch"
        checked={isChecked}
        aria-checked={isChecked}
        onChange={handleChange}
      />
    </label>
  );
};

export default WakeLockToggle;
