import { Power, RefreshCw, Globe } from "lucide-react";
import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";
import { enableAutoLaunch, disableAutoLaunch } from "../../../hooks/useAutoLaunch";
import { useTranslation } from "../../../hooks/useTranslation";

interface SystemTabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const SystemTab = ({ formData, onChange }: SystemTabProps) => {
  const { t, languageList } = useTranslation(formData.system.language);

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
      onChange("system", "autoLaunch", !enabled);
    }
  };

  return (
    <div className={styles.tabPane}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('Startup & Updates')}</h3>
        
        <div className={styles.formGroup}>
          <div className={styles.toggleField}>
            <div className={styles.toggleHeader}>
              <Power size={16} />
              <label>{t('Auto Launch')}</label>
            </div>
            <p className={styles.toggleDesc}>
              {t('Auto Launch Description')}
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
                  {formData.system.autoLaunch ? t('On') : t('Off')}
                </span>
              </button>
            </div>
          </div>

          <div className={styles.toggleField}>
            <div className={styles.toggleHeader}>
              <RefreshCw size={16} />
              <label>{t('Auto Check Update')}</label>
            </div>
            <p className={styles.toggleDesc}>
              {t('Auto Check Update Description')}
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
                  {formData.system.autoCheckUpdate ? t('On') : t('Off')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('Language')}</h3>
        
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>
              <Globe size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              {t('Interface Language')}
            </label>
            <select
              value={formData.system.language}
              onChange={(e) => onChange("system", "language", e.target.value)}
            >
              {languageList.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemTab;
