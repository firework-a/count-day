import { useState } from "react";
import { X, Wallet, Briefcase, Calendar, Palette, Settings as SettingsIcon, CheckCircle2 } from "lucide-react";
import { UserSettings, saveSettings } from "../../utils/settings";
import SalaryTab from "./tabs/SalaryTab";
import WorkTab from "./tabs/WorkTab";
import AppearanceTab from "./tabs/AppearanceTab";
import CustomTab from "./tabs/CustomTab";
import styles from "./SettingsModal.module.scss";

interface SettingsModalProps {
  settings: UserSettings;
  onClose: () => void;
  onSave: (newSettings: UserSettings) => void;
  isStandalone?: boolean;
}

type TabType = "appearance" | "salary" | "work" | "custom";

const SettingsModal = ({ settings, onClose, onSave, isStandalone = false }: SettingsModalProps) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [activeTab, setActiveTab] = useState<TabType>("appearance");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (section: keyof UserSettings, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    saveSettings(formData);
    onSave(formData);
    
    // 显示成功反馈
    setShowSuccess(true);
    
    // 1.5秒后关闭或隐藏
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "appearance":
        return <AppearanceTab formData={formData} onChange={handleChange} />;
      case "salary":
        return <SalaryTab formData={formData} onChange={handleChange} />;
      case "work":
        return <WorkTab formData={formData} onChange={handleChange} />;
      case "custom":
        return <CustomTab formData={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`${styles.container} ${isStandalone ? styles.standalone : ""}`}
    >
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <SettingsIcon size={18} />
          <span>偏好设置</span>
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === "appearance" ? styles.active : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <Palette size={16} />
            <span>外观与主题</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === "salary" ? styles.active : ""}`}
            onClick={() => setActiveTab("salary")}
          >
            <Wallet size={16} />
            <span>薪资与收入</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === "work" ? styles.active : ""}`}
            onClick={() => setActiveTab("work")}
          >
            <Briefcase size={16} />
            <span>工作与假期</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === "custom" ? styles.active : ""}`}
            onClick={() => setActiveTab("custom")}
          >
            <Calendar size={16} />
            <span>自定义日期</span>
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {!isStandalone && (
          <header className={styles.header}>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={16} />
            </button>
          </header>
        )}
        
        <div className={styles.scrollArea}>
          {renderContent()}
        </div>

        <footer className={styles.footer}>
          {showSuccess && (
            <div className={styles.successMessage}>
              <CheckCircle2 size={16} />
              <span>设置已保存并同步</span>
            </div>
          )}
          <button className={styles.saveBtn} onClick={handleSave} disabled={showSuccess}>
            {showSuccess ? "已保存" : "保存并应用"}
          </button>
        </footer>
      </main>
    </div>
  );
};

export default SettingsModal;
