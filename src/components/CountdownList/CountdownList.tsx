import { useMemo } from "react";
import {
  differenceInDays,
  setDate,
  addMonths,
  isAfter,
  startOfDay,
  differenceInSeconds,
  parse,
  addDays
} from "date-fns";
import { CalendarDays, Rocket, Coffee } from "lucide-react";
import { UserSettings } from "../../utils/settings";
import { HolidayData, isWorkdayDynamic } from "../../utils/holidays";
import styles from "./CountdownList.module.scss";

interface CountdownListProps {
  settings: UserSettings;
  holidayData: HolidayData | null;
}

const CountdownList = ({ settings, holidayData }: CountdownListProps) => {
  const countdowns = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    
    // 1. 周末倒计时 (智能识别调休 - 使用动态数据)
    let weekendDays = 0;
    let nextWeekendDay = addDays(today, 1);
    
    // 寻找下一个非工作日
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
    // const _paydayDays = differenceInDays(paydayDate, today);

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
          const mins = Math.floor(diffSeconds / 60);
          workRemainingStr = `${mins}`;
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
      // 过滤出未来且 item.holiday 为 true (放假) 的日期
      const futureHolidays = holidayData.holidays
        .map(h => parse(h, 'yyyy-MM-dd', new Date()))
        .filter(h => isAfter(h, today))
        .sort((a, b) => a.getTime() - b.getTime());

      if (futureHolidays.length > 0) {
        nextHolidayStr = `${differenceInDays(futureHolidays[0], today)}`;
      }
    }

    return [
      { 
        label: isWorking ? "下班倒计时" : "非工作时段", 
        value: workRemainingStr, 
        unit: "MIN", 
        icon: <Coffee size={16} />, 
        colorClass: styles.blue,
        subValue: isWorkdayDynamic(today, holidayData) ? `今日已赚: ¥${earnedToday.toFixed(2)}` : "休息中..."
      },
      { 
        label: "距离周末", 
        value: weekendDays, 
        unit: "DAYS", 
        icon: <CalendarDays size={16} />, 
        colorClass: styles.emerald 
      },
      { 
        label: "下个长假", 
        value: nextHolidayStr, 
        unit: "DAYS", 
        icon: <Rocket size={16} />, 
        colorClass: styles.amber 
      },
    ];
  }, [settings, holidayData]);

  return (
    <div className={styles.container}>
      <div className={styles.countsList}>
        {countdowns.map((item, index) => (
          <div key={index} className={styles.countItem}>
            <div className={`${styles.iconBox} ${item.colorClass}`}>
              {item.icon}
            </div>
            <div className={styles.info}>
              <span className={styles.label} style={{ color: "inherit", opacity: 0.6 }}>{item.label}</span>
              <div className={styles.value} style={{ color: "inherit" }}>
                <span>{item.value}</span>
                <span className={styles.unit} style={{ color: "inherit", opacity: 0.8 }}>{item.unit}</span>
              </div>
              {item.subValue && <span className={styles.subText}>{item.subValue}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownList;
