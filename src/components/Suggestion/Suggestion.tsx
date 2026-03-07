import { useState, useEffect } from "react";
import styles from "./Suggestion.module.scss";
import suggestionsData from "./suggestions.json";

const Suggestion = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    const updateSuggestion = () => {
      const hour = new Date().getHours();
      let type: keyof typeof suggestionsData = "general";

      if (hour >= 5 && hour < 9) {
        type = "morning";
      } else if (hour >= 11 && hour < 14) {
        type = "noon";
      } else if (hour >= 14 && hour < 18) {
        type = "afternoon";
      } else if (hour >= 18 && hour < 22) {
        type = "evening";
      } else if (hour >= 22 || hour < 5) {
        type = "night";
      }

      const list = suggestionsData[type];
      const randomText = list[Math.floor(Math.random() * list.length)];
      setText(randomText);
    };

    updateSuggestion();
    // 每小时更新一次建议语
    const timer = setInterval(updateSuggestion, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.suggestionContainer} title={text}>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default Suggestion;
