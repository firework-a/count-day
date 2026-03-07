import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";

interface TabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const SalaryTab = ({ formData, onChange }: TabProps) => {
  return (
    <div className={styles.tabPane}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>💰 薪资与发薪日</span>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>每月发薪日</label>
            <input
              type="number"
              min="1"
              max="31"
              value={formData.salary.day}
              onChange={(e) => onChange("salary", "day", parseInt(e.target.value) || 1)}
            />
          </div>
          <div className={styles.field}>
            <label>月薪 (用于算窝囊费)</label>
            <input
              type="number"
              value={formData.salary.amount}
              onChange={(e) => onChange("salary", "amount", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryTab;
