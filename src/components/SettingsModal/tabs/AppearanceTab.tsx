import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";
import { useTranslation } from "../../../hooks/useTranslation";

interface TabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const AppearanceTab = ({ formData, onChange }: TabProps) => {
  const { t } = useTranslation(formData.system.language);

  return (
    <div className={styles.tabPane}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>{t('Appearance & Theme')}</span>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>{t('Font Family')}</label>
            <select
              value={formData.appearance.fontFamily}
              onChange={(e) => onChange("appearance", "fontFamily", e.target.value)}
            >
              <option value="Inter, system-ui, sans-serif">Default (Inter)</option>
              <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
              <option value="'Segoe UI', system-ui, sans-serif">Segoe UI</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>{t('Font Size')}</label>
            <input
              type="number"
              min="10"
              max="24"
              value={formData.appearance.fontSize}
              onChange={(e) => onChange("appearance", "fontSize", parseInt(e.target.value) || 14)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.field} style={{ gridColumn: "span 2" }}>
            <label>{t('Background Opacity')} ({(formData.appearance.backgroundOpacity * 100).toFixed(0)}%)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={formData.appearance.backgroundOpacity}
              onChange={(e) => onChange("appearance", "backgroundOpacity", parseFloat(e.target.value))}
              className={styles.rangeInput}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>{t('Text Color')}</label>
            <div className={styles.colorPickerWrapper}>
              <input
                type="color"
                value={formData.appearance.textColor}
                onChange={(e) => onChange("appearance", "textColor", e.target.value)}
              />
              <span>{formData.appearance.textColor}</span>
            </div>
          </div>
          <div className={styles.field}>
            <label>{t('Background Color')}</label>
            <div className={styles.colorPickerWrapper}>
              <input
                type="color"
                value={formData.appearance.backgroundColor}
                onChange={(e) => onChange("appearance", "backgroundColor", e.target.value)}
              />
              <span>{formData.appearance.backgroundColor}</span>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>{t('Border Color')}</label>
            <div className={styles.colorPickerWrapper}>
              <input
                type="color"
                value={formData.appearance.borderColor}
                onChange={(e) => onChange("appearance", "borderColor", e.target.value)}
              />
              <span>{formData.appearance.borderColor}</span>
            </div>
          </div>
          <div className={styles.field}>
            <label>{t('Dark Mode')}</label>
            <select
              value={formData.appearance.darkMode}
              onChange={(e) => onChange("appearance", "darkMode", e.target.value)}
            >
              <option value="auto">{t('Auto')}</option>
              <option value="light">{t('Light')}</option>
              <option value="dark">{t('Dark')}</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.field} style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              id="pureBlack"
              checked={formData.appearance.pureBlack}
              onChange={(e) => onChange("appearance", "pureBlack", e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="pureBlack" style={{ cursor: "pointer", marginBottom: 0 }}>{t('Pure Black')}</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
