import { useState, useEffect, useCallback } from "react";
import styles from "./Suggestion.module.scss";
import suggestionsData from "./suggestions.json";

const Suggestion = () => {
  const [text, setText] = useState("");

  // 获取更细致的时间段
  const getTimeType = useCallback((): string => {
    const hour = new Date().getHours();

    // 凌晨 (0-5 点)
    if (hour >= 0 && hour < 5) {
      return "night";
    }
    // 清晨 (5-9 点)
    else if (hour >= 5 && hour < 9) {
      return "morning";
    }
    // 上午工作前 (9-10 点)
    else if (hour >= 10 && hour < 11) {
      return "morningWork";
    }
    // 午餐前 (11-12 点)
    else if (hour >= 11 && hour < 12) {
      return "preLunch";
    }
    // 午餐时间 (12-13 点)
    else if (hour >= 12 && hour < 13) {
      return "lunch";
    }
    // 午休后 (13-14 点)
    else if (hour >= 14 && hour < 15) {
      return "postLunch";
    }
    // 下午茶时间 (15-16 点)
    else if (hour >= 15 && hour < 16) {
      return "teaTime";
    }
    // 下午工作 (16-18 点)
    else if (hour >= 16 && hour < 18) {
      return "afternoonWork";
    }
    // 下班时间 (18-19 点)
    else if (hour >= 18 && hour < 19) {
      return "offWork";
    }
    // 晚餐时间 (19-20 点)
    else if (hour >= 19 && hour < 20) {
      return "dinner";
    }
    // 晚间休闲 (20-22 点)
    else if (hour >= 20 && hour < 22) {
      return "evening";
    }
    // 深夜 (22-24 点)
    else {
      return "night";
    }
  }, []);

  // 判断是否是工作日
  const isWorkday = (): boolean => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5; // 周一到周五
  };

  // 获取星期几
  const getDayOfWeek = (): number => {
    return new Date().getDay(); // 0=周日，1=周一...6=周六
  };

  // 获取智能提示语（核心算法）
  const getSmartSuggestion = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const dayOfWeek = getDayOfWeek();
    const workday = isWorkday();

    // 1. 基础时段提示
    const timeType = getTimeType();
    const timeList = suggestionsData[timeType as keyof typeof suggestionsData] || suggestionsData.general;

    // 2. 特殊时间点优先提示（最高优先级）
    // 整点提示
    if (minute === 0) {
      const specialHourSuggestions = [
        `${hour}点整！时间过得真快～`,
        `现在是${hour}点，继续加油！`,
        `${hour}点的钟声敲响，给自己一个微笑吧！`,
      ];
      if (hour === 9 && workday) {
        return "9 点啦！开始今天的工作吧！";
      }
      if (hour === 12 && workday) {
        return "12 点啦！该吃午饭了！";
      }
      if (hour === 18 && workday) {
        return "18 点啦！下班时间到！";
      }
      if (hour === 22) {
        return "22 点啦！该准备睡觉了！";
      }
      return specialHourSuggestions[Math.floor(Math.random() * specialHourSuggestions.length)];
    }

    // 半点提示
    if (minute === 30) {
      const halfHourSuggestions = [
        "半小时过去了，进度条 +1！",
        "时间过半，任务完成多少啦？",
        "30 分钟打卡！休息一下眼睛吧～",
      ];
      return halfHourSuggestions[Math.floor(Math.random() * halfHourSuggestions.length)];
    }

    // 3. 喝水提醒（每隔 2 小时，工作时间）
    if (workday && hour >= 9 && hour <= 17 && hour % 2 === 1 && minute >= 0 && minute < 10) {
      const waterSuggestions = [
        "💧 喝水时间到！保持水分补充～",
        "工作再忙也要记得喝水哦！",
        "来杯温水，让身体和大脑都清醒一下！",
        "喝水小贴士：小口慢饮更健康～",
      ];
      return waterSuggestions[Math.floor(Math.random() * waterSuggestions.length)];
    }

    // 4. 休息提醒（工作 1 小时后）
    if (workday && ((hour === 10 && minute >= 0 && minute < 15) || (hour === 15 && minute >= 0 && minute < 15))) {
      const breakSuggestions = [
        "☕ 工作一小时了，起来活动活动吧！",
        "眺望远方，让眼睛休息一下～",
        "伸个懒腰，缓解一下久坐的疲劳！",
        "休息 5 分钟，效率更高哦！",
      ];
      return breakSuggestions[Math.floor(Math.random() * breakSuggestions.length)];
    }

    // 5. 周末特殊提示
    if (!workday) {
      const weekendSuggestions = [
        "周末愉快！好好享受休闲时光～",
        "休息日也要保持好心情！",
        "今天是周末，做点自己喜欢的事吧！",
        "放松身心，周末时光最珍贵～",
      ];
      // 周末早上 10 点前不显示提示
      if (hour < 10) {
        return weekendSuggestions[Math.floor(Math.random() * weekendSuggestions.length)];
      }
    }

    // 6. 根据星期几的变化（增加趣味性）
    const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const todayName = dayNames[dayOfWeek];

    // 周一早上：鼓励
    if (dayOfWeek === 1 && hour >= 8 && hour < 10) {
      return `💪 ${todayName}早上好！新的一周，新的开始，加油！`;
    }

    // 周五下午：期待周末
    if (dayOfWeek === 5 && hour >= 14) {
      const fridaySuggestions = [
        "🎉 周五下午！周末在向你招手～",
        "坚持一下，马上就是愉快的周末了！",
        "周五不摸鱼，周末更安心～（开玩笑的，适当放松）",
      ];
      return fridaySuggestions[Math.floor(Math.random() * fridaySuggestions.length)];
    }

    // 7. 默认：返回当前时段的随机提示
    const randomIndex = Math.floor(Math.random() * timeList.length);
    return timeList[randomIndex];
  }, [getTimeType]);

  // 获取随机提示语（备用）
  const getRandomSuggestion = useCallback(() => {
    const timeType = getTimeType();
    const dayOfWeek = getDayOfWeek();
    const timeList = suggestionsData[timeType as keyof typeof suggestionsData] || suggestionsData.general;
    const generalList = suggestionsData.general;

    // 可选类别池
    const categoryPool: (keyof typeof suggestionsData)[] = [
      "motivation",
      "health",
      "mindfulness",
      "funny",
      "seasonal"
    ];

    // 根据星期几选择额外类别（增加变化）
    const extraCategory = categoryPool[dayOfWeek % categoryPool.length];
    const extraList = suggestionsData[extraCategory] || [];

    // 合并：当前时段 + 通用 + 额外类别
    const allSuggestions = [...timeList, ...generalList, ...extraList];
    const randomIndex = Math.floor(Math.random() * allSuggestions.length);
    setText(allSuggestions[randomIndex]);
  }, [getTimeType]);

  // 更新提示语
  const updateSuggestion = useCallback(() => {
    const smartText = getSmartSuggestion();
    setText(smartText);
  }, [getSmartSuggestion]);

  useEffect(() => {
    // 初始化
    updateSuggestion();

    // 每分钟检查一次（用于整点、半点等精确时间提示）
    const minuteTimer = setInterval(updateSuggestion, 1000 * 60);

    // 每小时更新一次（时段变化）
    const hourlyTimer = setInterval(updateSuggestion, 1000 * 60 * 60);

    // 每 15 分钟有 15% 概率刷新（增加随机性，但不影响特殊时间提示）
    const randomTimer = setInterval(() => {
      const now = new Date();
      const minute = now.getMinutes();
      // 避开整点和半点，让特殊时间提示显示更久
      if (minute !== 0 && minute !== 30 && Math.random() > 0.85) {
        getRandomSuggestion();
      }
    }, 1000 * 60 * 15);

    return () => {
      clearInterval(minuteTimer);
      clearInterval(hourlyTimer);
      clearInterval(randomTimer);
    };
  }, [updateSuggestion, getRandomSuggestion]);

  return (
    <div className={styles.suggestionContainer} title={text}>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default Suggestion;
