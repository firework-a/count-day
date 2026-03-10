import { Power, RefreshCw, Globe } from "lucide-react";
import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";
import { enableAutoLaunch, disableAutoLaunch } from "../../../hooks/useAutoLaunch";

interface SystemTabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const SystemTab = ({ formData, onChange }: SystemTabProps) => {
  const handleAutoLaunchToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        await enableAutoLaunch();
        console.log("Auto-launch enabled");
      } else {
        await disableAutoLaunch();
        console.log("Auto-launch disabled");
      }
      onChange("system", "autoLaunch", enabled);
    } catch (error) {
      console.error("Failed to toggle auto launch:", error);
      alert(`操作失败：${error}`);
      // 如果失败，回滚状态
      onChange("system", "autoLaunch", !enabled);
    }
  };

  return (
    <div className={styles.tabPane}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>启动与更新</h3>
        
        <div className={styles.formGroup}>
          <div className={styles.toggleField}>
            <div className={styles.toggleHeader}>
              <Power size={16} />
              <label>开机自启动</label>
            </div>
            <p className={styles.toggleDesc}>
              登录系统后自动启动倒计时挂件
            </p>
            <div className={styles.toggleWrapper}>
              <button
                className={`${styles.toggleBtn} ${formData.system.autoLaunch ? styles.active : ""}`}
                onClick={() => handleAutoLaunchToggle(!formData.system.autoLaunch)}
              >
                <span className={styles.toggleTrack}>
                  <span className={styles.toggleThumb} />
                </span>
                <span className={styles.toggleLabel}>
                  {formData.system.autoLaunch ? "开启" : "关闭"}
                </span>
              </button>
            </div>
          </div>

          <div className={styles.toggleField}>
            <div className={styles.toggleHeader}>
              <RefreshCw size={16} />
              <label>自动检查更新</label>
            </div>
            <p className={styles.toggleDesc}>
              启动时自动检查是否有新版本
            </p>
            <div className={styles.toggleWrapper}>
              <button
                className={`${styles.toggleBtn} ${formData.system.autoCheckUpdate ? styles.active : ""}`}
                onClick={() => onChange("system", "autoCheckUpdate", !formData.system.autoCheckUpdate)}
              >
                <span className={styles.toggleTrack}>
                  <span className={styles.toggleThumb} />
                </span>
                <span className={styles.toggleLabel}>
                  {formData.system.autoCheckUpdate ? "开启" : "关闭"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>语言设置</h3>
        
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>
              <Globe size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              界面语言
            </label>
            <select
              value={formData.system.language}
              onChange={(e) => onChange("system", "language", e.target.value as "zh-CN" | "en-US")}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemTab;
