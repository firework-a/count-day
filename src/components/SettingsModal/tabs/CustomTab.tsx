import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";

interface TabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const CustomTab = (_props: TabProps) => {
  return (
    <div className={styles.tabPane}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>📅 自定义纪念日</span>
        <p style={{ fontSize: "12px", color: "#64748b" }}>即将推出：添加您自己的重要日期倒计时。</p>
      </div>
    </div>
  );
};

export default CustomTab;
