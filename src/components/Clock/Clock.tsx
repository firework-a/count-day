import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import styles from "./Clock.module.scss";

const Clock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.clockBox}>
      <div className={styles.clock} style={{ color: "inherit" }}>{format(now, "HH:mm")}</div>
      <div className={styles.date} style={{ color: "inherit", opacity: 0.8 }}>{format(now, "MM/dd EEEE", { locale: zhCN })}</div>
    </div>
  );
};

export default Clock;
