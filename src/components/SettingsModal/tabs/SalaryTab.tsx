import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";
import { useTranslation } from "../../../hooks/useTranslation";

interface TabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const SalaryTab = ({ formData, onChange }: TabProps) => {
  const { t } = useTranslation(formData.system.language);

  const workDaysPerMonth = formData.work.weekendMode === "double" ? 21.75 : 26;
  const dailySalary = Math.round(formData.salary.amount / workDaysPerMonth);
  const hourlySalary = Math.round(dailySalary / 8);

  return (
    <div className={styles.tabPane}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>{t('Salary & Income')}</span>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>{t('Work Days')}</label>
            <input
              type="number"
              min="1"
              max="31"
              value={formData.salary.day}
              onChange={(e) => onChange("salary", "day", parseInt(e.target.value) || 1)}
            />
          </div>
          <div className={styles.field}>
            <label>{t('Monthly Salary')}</label>
            <input
              type="number"
              value={formData.salary.amount}
              onChange={(e) => onChange("salary", "amount", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>{t('Daily Salary')}</label>
            <div className={styles.infoValue}>¥{dailySalary.toLocaleString()}</div>
          </div>
          <div className={styles.field}>
            <label>{t('Hourly Salary')}</label>
            <div className={styles.infoValue}>¥{hourlySalary.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryTab;
