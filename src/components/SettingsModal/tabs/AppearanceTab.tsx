import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";

interface TabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const AppearanceTab = ({ formData, onChange }: TabProps) => {
  return (
    <div className={styles.tabPane}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>🎨 外观定制</span>
        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>字体族</label>
            <select
              value={formData.appearance.fontFamily}
              onChange={(e) => onChange("appearance", "fontFamily", e.target.value)}
            >
              <option value="Inter, system-ui, sans-serif">默认 (Inter)</option>
              <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
              <option value="'Segoe UI', system-ui, sans-serif">Segoe UI</option>
              <option value="monospace">等宽字体</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>字体大小 (px)</label>
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
            <label>背景透明度 ({(formData.appearance.backgroundOpacity * 100).toFixed(0)}%)</label>
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
            <label>文字颜色</label>
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
            <label>背景颜色</label>
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
            <label>边框颜色</label>
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
            <label>主题模式</label>
            <select
              value={formData.appearance.darkMode}
              onChange={(e) => onChange("appearance", "darkMode", e.target.value)}
            >
              <option value="auto">跟随系统</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
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
            <label htmlFor="pureBlack" style={{ cursor: "pointer", marginBottom: 0 }}>深色模式使用纯黑背景</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
