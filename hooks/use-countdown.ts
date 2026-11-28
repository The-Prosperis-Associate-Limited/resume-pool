import { useEffect, useState } from "react";

export const useCountdown = function (startedAt: number | null, seconds: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!startedAt) return 0;
  // Never above the full window, so a just-stamped startedAt doesn't read one tick stale.
  return Math.min(seconds, Math.max(0, Math.ceil((startedAt + seconds * 1000 - now) / 1000)));
};

export const formatCountdown = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
