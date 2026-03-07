import { useState, useEffect } from "react";
import Clock from "./components/Clock/Clock";
import CountdownList from "./components/CountdownList/CountdownList";
import HoverRegions from "./components/HoverRegions/HoverRegions";
import DockControl from "./components/DockControl/DockControl";
import SettingsModal from "./components/SettingsModal/SettingsModal";
import Suggestion from "./components/Suggestion/Suggestion";
import { UserSettings, getSettings } from "./utils/settings";
import { HolidayData, getCachedHolidays, fetchHolidays } from "./utils/holidays";
import { WebviewWindow, getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition, getCurrentWindow, currentMonitor } from "@tauri-apps/api/window";
import { emit, listen } from "@tauri-apps/api/event";
import styles from "./App.module.scss";

const currentWebviewWindow = getCurrentWebviewWindow();
const appWindow = getCurrentWindow();

function App() {
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [holidayData, setHolidayData] = useState<HolidayData | null>(null);
  const [isSettingsWindow, setIsSettingsWindow] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [lastPosition, setLastPosition] = useState<LogicalPosition | null>(null);

  useEffect(() => {
    // 将主题和纯黑模式应用到 document 根节点
    document.documentElement.setAttribute("data-theme", settings.appearance.darkMode);
    document.documentElement.setAttribute("data-pure-black", settings.appearance.pureBlack ? "true" : "false");
  }, [settings.appearance.darkMode, settings.appearance.pureBlack]);

  const isDarkMode = settings.appearance.darkMode === "dark" || 
    (settings.appearance.darkMode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const getBackgroundColor = () => {
    if (isDarkMode) {
      // 深色模式下：如果开启纯黑则用全黑，否则用稍微浅一点的黑色（带透明度）
      const baseColor = settings.appearance.pureBlack ? "0, 0, 0" : "24, 24, 27"; // #18181b (Zinc-900)
      return `rgba(${baseColor}, ${settings.appearance.backgroundOpacity})`;
    }
    
    // 浅色模式下：使用用户设置的颜色
    const hex = settings.appearance.backgroundColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${settings.appearance.backgroundOpacity})`;
  };

  const getTextColor = () => {
    if (isDarkMode) return "#ffffff"; // 深色模式强制白色
    return settings.appearance.textColor; // 浅色模式使用自定义
  };

  const getBorderColor = () => {
    if (isDarkMode) return "#27272a"; // 深色模式强制深灰边框
    return settings.appearance.borderColor; // 浅色模式使用自定义
  };

  useEffect(() => {
    const label = currentWebviewWindow.label;
    setIsSettingsWindow(label === "settings");

    // 只有主窗口执行自动定位逻辑
    if (label === "main") {
      const positionWindow = async () => {
        try {
          const monitor = await currentMonitor();
          if (monitor) {
            const { width } = monitor.size;
            const scaleFactor = monitor.scaleFactor;
            const logicalWidth = width / scaleFactor;
            
            // 挂件宽度为 440，设置右边距 40
            const x = logicalWidth - 440 - 40;
            const y = 40;
            
            console.log(`Positioning to: ${x}, ${y}`);
            await appWindow.setPosition(new LogicalPosition(x, y));
          }
          // 定位完成后再显示，避免闪烁
          await appWindow.show();
          await appWindow.setFocus();
        } catch (e) {
          console.error("Failed to position window:", e);
          await appWindow.show();
        }
      };
      positionWindow();
    }

    // 初始化加载节假日数据
    const initHolidays = async () => {
      const year = new Date().getFullYear();
      let data = getCachedHolidays(year);
      if (!data) {
        data = await fetchHolidays(year);
      }
      setHolidayData(data);
    };

    initHolidays();

    // 使用全局监听器监听设置更新事件 (多窗口同步)
    const unlisten = listen("settings-updated", (event) => {
      console.log("Settings updated in", currentWebviewWindow.label, event.payload);
      setSettings(event.payload as UserSettings);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  const openSettingsWindow = async () => {
    try {
      // 检查窗口是否已经存在
      const settingsWin = await WebviewWindow.getByLabel("settings");
      if (settingsWin) {
        await settingsWin.show();
        await settingsWin.setFocus();
      } else {
        // 如果窗口不存在，则动态创建
        const newWin = new WebviewWindow("settings", {
          url: "index.html",
          title: "倒计时挂件 - 偏好设置",
          width: 800,
          height: 600,
          minWidth: 600,
          minHeight: 400,
          resizable: true,
          decorations: true,
          center: true, // 确保窗口在屏幕中央
          alwaysOnTop: true, // 设置窗口建议置顶
          hiddenTitle: false,
        });
        
        newWin.once("tauri://created", () => {
          console.log("Settings window created");
        });

        newWin.once("tauri://error", (e) => {
          console.error("Failed to create settings window:", e);
        });
      }
    } catch (error) {
      console.error("Error opening settings window:", error);
    }
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    // 通知所有窗口更新设置 (使用全局广播)
    await emit("settings-updated", newSettings);
  };

  const handleDockToggle = async () => {
    try {
      const monitor = await currentMonitor();
      if (!monitor) return;
      
      const { width } = monitor.size;
      const scaleFactor = monitor.scaleFactor;
      const logicalWidth = width / scaleFactor;
      
      if (!isDocked) {
        // 保存当前位置
        const currentPos = await appWindow.outerPosition();
        const logicalPos = currentPos.toLogical(scaleFactor);
        setLastPosition(logicalPos);

        // 收起前保存当前置顶状态，并强制置顶以便于 Hover
        await appWindow.setAlwaysOnTop(true);
        // 收起：缩回去，露出 10px 以保证可见性
        const x = logicalWidth - 10;
        await appWindow.setPosition(new LogicalPosition(x, logicalPos.y));
        setIsDocked(true);
        setIsPeeking(false);
      } else {
        // 展开：恢复到之前保存的位置或默认位置
        const x = lastPosition ? lastPosition.x : logicalWidth - 440 - 40;
        const y = lastPosition ? lastPosition.y : 40;
        await appWindow.setPosition(new LogicalPosition(x, y));
        // 展开后恢复为不置顶（或根据用户之前的状态，这里暂时默认不置顶）
        await appWindow.setAlwaysOnTop(false);
        setIsDocked(false);
        setIsPeeking(false);
      }
    } catch (e) {
      console.error("Failed to toggle dock:", e);
    }
  };

  const handleDockHover = async () => {
    if (!isDocked || isPeeking) return;
    try {
      const monitor = await currentMonitor();
      if (!monitor) return;
      const scaleFactor = monitor.scaleFactor;
      const logicalWidth = monitor.size.width / scaleFactor;
      // 探头：移动到露出 40px 的位置
      const y = lastPosition ? lastPosition.y : 40;
      await appWindow.setPosition(new LogicalPosition(logicalWidth - 40, y));
      setIsPeeking(true);
    } catch (e) {
      console.error("Failed to peek dock:", e);
    }
  };

  const handleDockLeave = async () => {
    if (!isDocked || !isPeeking) return;
    try {
      const monitor = await currentMonitor();
      if (!monitor) return;
      const scaleFactor = monitor.scaleFactor;
      const logicalWidth = monitor.size.width / scaleFactor;
      // 缩回去：露出 8px
      const y = lastPosition ? lastPosition.y : 40;
      await appWindow.setPosition(new LogicalPosition(logicalWidth - 8, y));
      setIsPeeking(false);
    } catch (e) {
      console.error("Failed to unpeek dock:", e);
    }
  };

  // 如果是设置窗口，渲染全屏设置内容
  if (isSettingsWindow) {
    return (
      <div className={styles.settingsWrapper}>
        <SettingsModal 
          settings={settings} 
          onClose={() => appWindow.hide()} 
          onSave={handleSaveSettings}
          isStandalone={true}
        />
      </div>
    );
  }

  // 渲染主挂件界面
  return (
    <div
      className={`${styles.widgetWrapper} ${isDocked ? styles.isDocked : ""}`}
      style={{
        fontFamily: settings.appearance.fontFamily,
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        borderColor: getBorderColor(),
      }}
    >
      {isDocked ? (
        <DockControl
          onExpand={handleDockToggle}
          onHover={handleDockHover}
          onLeave={handleDockLeave}
          isPeeking={isPeeking}
        />
      ) : (
        <>
          {/* 上：工具栏区域（小） */}
          <div className={styles.toolbar}>
            <HoverRegions onSettingsClick={openSettingsWindow} onDockClick={handleDockToggle} />
          </div>

          {/* 中：时间和倒计时区域（最大）- 保持原有左右布局 */}
          <div className={styles.mainContent}>
            <Clock />
            <div className={styles.divider}></div>
            <CountdownList settings={settings} holidayData={holidayData} />
          </div>

          {/* 下：提示语区域（第二） */}
          <div className={styles.footer}>
            <Suggestion />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
