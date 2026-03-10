import { useState, useEffect } from "react";
import { X, GripHorizontal, Settings, Pin, PinOff, ArrowRightToLine } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getSettings } from "../../utils/settings";
import styles from "./HoverRegions.module.scss";

interface HoverRegionsProps {
  onSettingsClick: () => void;
  onDockClick: () => void;
}

const HoverRegions = ({ onSettingsClick, onDockClick }: HoverRegionsProps) => {
  const [isAlwaysOnTopState, setIsAlwaysOnTopState] = useState(false);
  const closeBehavior = getSettings().system.closeBehavior;

  useEffect(() => {
    // 初始化时获取当前的置顶状态
    const checkTopmost = async () => {
      try {
        const appWindow = getCurrentWindow();
        const top = await appWindow.isAlwaysOnTop();
        setIsAlwaysOnTopState(top);
      } catch (e) {
        console.error("Failed to check topmost status:", e);
      }
    };
    checkTopmost();
  }, []);

  const handleClose = async () => {
    try {
      const appWindow = getCurrentWindow();
      if (closeBehavior === "quit") {
        // 直接退出应用
        await appWindow.close();
      } else {
        // 隐藏到托盘区
        await appWindow.hide();
      }
    } catch (e) {
      console.error("Failed to close window:", e);
    }
  };

  const toggleAlwaysOnTop = async () => {
    try {
      const appWindow = getCurrentWindow();
      const nextState = !isAlwaysOnTopState;
      await appWindow.setAlwaysOnTop(nextState);
      setIsAlwaysOnTopState(nextState);
    } catch (e) {
      console.error("Failed to toggle topmost:", e);
    }
  };

  return (
    <div className={styles.hoverRegions}>
      <div className={`${styles.region} ${styles.left}`}>
        <button 
          onClick={onDockClick} 
          className={`${styles.iconBtn} ${styles.dock}`} 
          title="贴边收起"
        >
          <ArrowRightToLine size={12} />
        </button>
      </div>
      
      <div className={`${styles.region} ${styles.middle}`}>
        <GripHorizontal className={styles.dragIcon} size={14} />
      </div>
      
      <div className={`${styles.region} ${styles.right}`}>
        <button 
          onClick={toggleAlwaysOnTop} 
          className={`${styles.iconBtn} ${styles.pin} ${isAlwaysOnTopState ? styles.active : ""}`} 
          title={isAlwaysOnTopState ? "取消置顶" : "固定置顶"}
        >
          {isAlwaysOnTopState ? <PinOff size={12} /> : <Pin size={12} />}
        </button>
        <button 
          onClick={onSettingsClick} 
          className={`${styles.iconBtn} ${styles.settings}`} 
          title="设置"
        >
          <Settings size={12} />
        </button>
        <button 
          onClick={handleClose} 
          className={`${styles.iconBtn} ${styles.close}`} 
          title="关闭"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

export default HoverRegions;
