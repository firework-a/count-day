import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";
import { useTranslation } from "../../../hooks/useTranslation";

interface TabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const WorkTab = ({ formData, onChange }: TabProps) => {
  const { t } = useTranslation(formData.system.language);

  return (
    <div className={styles.tabPane}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>{t('Work & Holidays')}</span>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>{t('Work Start Time')}</label>
            <input
              type="time"
              value={formData.work.start}
              onChange={(e) => onChange("work", "start", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>{t('Work End Time')}</label>
            <input
              type="time"
              value={formData.work.end}
              onChange={(e) => onChange("work", "end", e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>{t('Weekend Mode')}</label>
            <select
              value={formData.work.weekendMode}
              onChange={(e) => onChange("work", "weekendMode", e.target.value)}
            >
              <option value="double">{t('Double Weekend')}</option>
              <option value="single">{t('Single Weekend')}</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>{t('Show Holidays')}</span>
        <div className={styles.formGroup}>
          <div className={styles.field} style={{ gridColumn: "span 2", flexDirection: "row", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.holidays.enabled}
              onChange={(e) => onChange("holidays", "enabled", e.target.checked)}
              id="holiday-sync"
            />
            <label htmlFor="holiday-sync" style={{ cursor: "pointer" }}>{t('Holidays Description')}</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTab;
