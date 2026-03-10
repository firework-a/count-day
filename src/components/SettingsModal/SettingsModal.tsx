import { useState } from "react";
import { X, Wallet, Briefcase, Palette, CheckCircle2, Settings, Info } from "lucide-react";
import { UserSettings, saveSettings } from "../../utils/settings";
import SalaryTab from "./tabs/SalaryTab";
import WorkTab from "./tabs/WorkTab";
import AppearanceTab from "./tabs/AppearanceTab";
import SystemTab from "./tabs/SystemTab";
import AboutTab from "./tabs/AboutTab";
import styles from "./SettingsModal.module.scss";
import { useTranslation } from "../../hooks/useTranslation";

interface SettingsModalProps {
  settings: UserSettings;
  onClose: () => void;
  onSave: (newSettings: UserSettings) => void;
  isStandalone?: boolean;
}

type TabType = "system" | "appearance" | "salary" | "work" | "about";

const SettingsModal = ({ settings, onClose, onSave, isStandalone = false }: SettingsModalProps) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [activeTab, setActiveTab] = useState<TabType>("system");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { t } = useTranslation(formData.system.language);

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

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "system":
        return <SystemTab formData={formData} onChange={handleChange} />;
      case "appearance":
        return <AppearanceTab formData={formData} onChange={handleChange} />;
      case "salary":
        return <SalaryTab formData={formData} onChange={handleChange} />;
      case "work":
        return <WorkTab formData={formData} onChange={handleChange} />;
      case "about":
        return <AboutTab language={formData.system.language} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.container} ${isStandalone ? styles.standalone : ""}`}
    >
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeTab === "system" ? styles.active : ""}`}
            onClick={() => setActiveTab("system")}
          >
            <Settings size={16} />
            <span>{t('System')}</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "appearance" ? styles.active : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <Palette size={16} />
            <span>{t('Appearance')}</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "salary" ? styles.active : ""}`}
            onClick={() => setActiveTab("salary")}
          >
            <Wallet size={16} />
            <span>{t('Salary')}</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "work" ? styles.active : ""}`}
            onClick={() => setActiveTab("work")}
          >
            <Briefcase size={16} />
            <span>{t('Work')}</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "about" ? styles.active : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <Info size={16} />
            <span>{t('About')}</span>
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
              <span>{t('Settings Saved')}</span>
            </div>
          )}
          <button className={styles.saveBtn} onClick={handleSave} disabled={showSuccess}>
            {showSuccess ? t('Saved') : t('Save')}
          </button>
        </footer>
      </main>
    </div>
  );
};

export default SettingsModal;
