import { useRef, useState } from "react";

const WakeLockToggle = ({ label }) => {
  const isWakeLockSupported = typeof navigator !== "undefined" && "wakeLock" in navigator;
  const [isChecked, setIsChecked] = useState(false);
  const wakeLockRef = useRef(null);

  if (!isWakeLockSupported){
    return null;
  }

  const handleChange = async () => {
    if (isWakeLockSupported === false) {
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
