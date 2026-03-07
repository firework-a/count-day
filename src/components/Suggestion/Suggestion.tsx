import { useState, useEffect, useCallback } from "react";
import styles from "./Suggestion.module.scss";
import suggestionsData from "./suggestions.json";

const Suggestion = () => {
  const [text, setText] = useState("");

  // 获取当前时段
  const getTimeType = useCallback((): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 9) {
      return "morning";
    } else if (hour >= 11 && hour < 14) {
      return "noon";
    } else if (hour >= 14 && hour < 18) {
      return "afternoon";
    } else if (hour >= 18 && hour < 22) {
      return "evening";
    } else {
      return "night";
    }
  }, []);

  // 获取星期几
  const getDayOfWeek = (): number => {
    return new Date().getDay(); // 0=周日，1=周一...6=周六
  };

  // 获取随机提示语
  const updateSuggestion = useCallback(() => {
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

  useEffect(() => {
    // 初始化
    updateSuggestion();

    // 每小时更新一次
    const hourlyTimer = setInterval(updateSuggestion, 1000 * 60 * 60);

    // 每 15 分钟有 20% 概率刷新（增加随机性）
    const randomTimer = setInterval(() => {
      if (Math.random() > 0.8) {
        updateSuggestion();
      }
    }, 1000 * 60 * 15);

    return () => {
      clearInterval(hourlyTimer);
      clearInterval(randomTimer);
    };
  }, [updateSuggestion]);

  return (
    <div className={styles.suggestionContainer} title={text}>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default Suggestion;
