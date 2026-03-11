import { useMemo, useState, useEffect } from "react";
import {
  differenceInDays,
  setDate,
  addMonths,
  isAfter,
  startOfDay,
  differenceInSeconds,
  parse,
  addDays,
} from "date-fns";
import { CalendarDays, Rocket, Coffee } from "lucide-react";
import { UserSettings } from "../../utils/settings";
import { HolidayData, isWorkdayDynamic } from "../../utils/holidays";
import styles from "./CountdownList.module.scss";
import { useTranslation } from "../../hooks/useTranslation";

interface CountdownListProps {
  settings: UserSettings;
  holidayData: HolidayData | null;
}

const CountdownList = ({ settings, holidayData }: CountdownListProps) => {
  const [now, setNow] = useState(new Date());
  const { t, language } = useTranslation(settings.system.language);

  useEffect(() => {
    console.log(
      "CountdownList language:",
      language,
      "settings.system.language:",
      settings.system.language,
    );
  }, [language, settings.system.language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const countdowns = useMemo(() => {
    const today = startOfDay(now);

    // 1. 周末倒计时 (智能识别调休 - 使用动态数据)
    let weekendDays = 0;
    let nextWeekendDay = addDays(today, 1);

    while (isWorkdayDynamic(nextWeekendDay, holidayData)) {
      nextWeekendDay = addDays(nextWeekendDay, 1);
    }
    weekendDays = differenceInDays(nextWeekendDay, today);

    if (!isWorkdayDynamic(today, holidayData)) {
      weekendDays = 0;
    }

    // 2. 发薪日倒计时
    let paydayDate = setDate(today, settings.salary.day);
    if (isAfter(today, paydayDate)) {
      paydayDate = addMonths(paydayDate, 1);
    }

    // 3. 下班倒计时 (分钟)
    const endTime = parse(settings.work.end, "HH:mm", now);
    let workRemainingStr = "--";
    let isWorking = false;

    if (isWorkdayDynamic(today, holidayData)) {
      if (isAfter(endTime, now)) {
        const startTime = parse(settings.work.start, "HH:mm", now);
        if (isAfter(now, startTime)) {
          isWorking = true;
          const diffSeconds = differenceInSeconds(endTime, now);
          
          // 根据设置显示不同格式
          if (settings.work.countdownGranularity === "hourMinute") {
            const hours = Math.floor(diffSeconds / 3600);
            const mins = Math.floor((diffSeconds % 3600) / 60);
            workRemainingStr = `${hours}h${mins}m`;
          } else {
            const mins = Math.floor(diffSeconds / 60);
            workRemainingStr = `${mins}`;
          }
        }
      }
    }

    // 4. 窝囊费计算
    const dailyRate = settings.salary.amount / 21.75;
    const startTime = parse(settings.work.start, "HH:mm", now);
    const totalWorkSeconds = differenceInSeconds(endTime, startTime);
    let earnedToday = 0;

    if (isWorking) {
      const workedSeconds = differenceInSeconds(now, startTime);
      earnedToday = (workedSeconds / totalWorkSeconds) * dailyRate;
    } else if (isWorkdayDynamic(today, holidayData) && isAfter(now, endTime)) {
      earnedToday = dailyRate;
    }

    // 5. 寻找下一个法定长假 (使用动态数据)
    let nextHolidayStr = "--";
    if (holidayData) {
      const futureHolidays = holidayData.holidays
        .map((h) => parse(h, "yyyy-MM-dd", new Date()))
        .filter((h) => isAfter(h, today))
        .sort((a, b) => a.getTime() - b.getTime());

      if (futureHolidays.length > 0) {
        nextHolidayStr = `${differenceInDays(futureHolidays[0], today)}`;
      }
    }

    return [
      {
        label: isWorkdayDynamic(today, holidayData)
          ? isWorking
            ? t("Time Until Off Work")
            : t("After Work")
          : t("Non-working"),
        value: workRemainingStr,
        unit: settings.work.countdownGranularity === "hourMinute" ? "" : "MIN",
        icon: <Coffee size={16} />,
        colorClass: styles.blue,
        subValue:
          isWorkdayDynamic(today, holidayData) && earnedToday > 0
            ? `${t("Earned")}: ¥${earnedToday.toFixed(2)}`
            : t("Resting..."),
      },
      {
        label: t("Until Weekend"),
        value: weekendDays,
        unit: "DAYS",
        icon: <CalendarDays size={16} />,
        colorClass: styles.emerald,
      },
      {
        label: t("Next Long Holiday"),
        value: nextHolidayStr,
        unit: "DAYS",
        icon: <Rocket size={16} />,
        colorClass: styles.amber,
      },
    ];
  }, [settings, holidayData, now, t]);

  return (
    <div className={styles.container}>
      <div className={styles.countsList}>
        {countdowns.map((item, index) => (
          <div key={index} className={styles.countItem}>
            <div className={`${styles.iconBox} ${item.colorClass}`}>
              {item.icon}
            </div>
            <div className={styles.info}>
              <span
                className={styles.label}
                style={{ color: "inherit", opacity: 0.6 }}
              >
                {item.label}
              </span>
              <div className={styles.value} style={{ color: "inherit" }}>
                <span>{item.value}</span>
                <span
                  className={styles.unit}
                  style={{ color: "inherit", opacity: 0.8 }}
                >
                  {item.unit}
                </span>
              </div>
              {item.subValue && (
                <span className={styles.subText}>{item.subValue}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownList;
