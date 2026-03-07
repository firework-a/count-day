import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";

interface TabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const WorkTab = ({ formData, onChange }: TabProps) => {
  return (
    <div className={styles.tabPane}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>💼 工作时间</span>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>上班时间</label>
            <input
              type="time"
              value={formData.work.start}
              onChange={(e) => onChange("work", "start", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>下班时间</label>
            <input
              type="time"
              value={formData.work.end}
              onChange={(e) => onChange("work", "end", e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>周末模式</label>
            <select
              value={formData.work.weekendMode}
              onChange={(e) => onChange("work", "weekendMode", e.target.value)}
            >
              <option value="double">双休 (周六日)</option>
              <option value="single">单休 (仅周日)</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>🎉 假期与提醒</span>
        <div className={styles.formGroup}>
          <div className={styles.field} style={{ gridColumn: "span 2", flexDirection: "row", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.holidays.enabled}
              onChange={(e) => onChange("holidays", "enabled", e.target.checked)}
              id="holiday-sync"
            />
            <label htmlFor="holiday-sync" style={{ cursor: "pointer" }}>自动同步法定节假日调休</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTab;
