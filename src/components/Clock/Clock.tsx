import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhCN, enUS, zhTW, ja, ko } from "date-fns/locale";
import styles from "./Clock.module.scss";

interface ClockProps {
  language?: string;
}

const Clock = ({ language = 'zh-CN' }: ClockProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 根据语言选择 date-fns 的 locale
  const getDateLocale = () => {
    switch (language) {
      case 'en-US':
        return enUS;
      case 'zh-TW':
        return zhTW;
      case 'ja-JP':
        return ja;
      case 'ko-KR':
        return ko;
      default:
        return zhCN;
    }
  };

  const dateLocale = getDateLocale();

  return (
    <div className={styles.clockBox}>
      <div className={styles.clock} style={{ color: "inherit" }}>{format(now, "HH:mm")}</div>
      <div className={styles.date} style={{ color: "inherit", opacity: 0.8 }}>{format(now, "MM/dd EEEE", { locale: dateLocale })}</div>
    </div>
  );
};

export default Clock;
