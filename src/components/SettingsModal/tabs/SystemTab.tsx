import { useState } from "react";
import { Power, RefreshCw, Globe, LogOut, Download } from "lucide-react";
import { UserSettings } from "../../../utils/settings";
import styles from "../SettingsModal.module.scss";
import { enableAutoLaunch, disableAutoLaunch } from "../../../hooks/useAutoLaunch";
import { useTranslation } from "../../../hooks/useTranslation";
import { checkForUpdates, downloadAndInstall } from "../../../hooks/useUpdate";

interface SystemTabProps {
  formData: UserSettings;
  onChange: (section: keyof UserSettings, field: string, value: any) => void;
}

const SystemTab = ({ formData, onChange }: SystemTabProps) => {
  const { t, languageList } = useTranslation(formData.system.language);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    version?: string;
    error?: string;
  }>({ checking: false, available: null });

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

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    setUpdateStatus({ checking: true, available: null });

    try {
      const result = await checkForUpdates();
      
      if (result.available) {
        setUpdateStatus({
          checking: false,
          available: true,
          version: result.version,
        });
        
        // 询问用户是否下载更新
        if (window.confirm(`发现新版本 ${result.version}，是否立即下载安装？`)) {
          await downloadAndInstall();
          alert("更新已下载，应用将在重启后完成安装。");
        }
      } else {
        setUpdateStatus({
          checking: false,
          available: false,
        });
      }
    } catch (error: any) {
      setUpdateStatus({
        checking: false,
        available: null,
        error: error.message || "检查更新失败",
      });
    } finally {
      setCheckingUpdate(false);
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

        <div className={styles.formGroup}>
          <div className={styles.updateField}>
            <div className={styles.updateHeader}>
              <Download size={16} />
              <label>{t('Manual Update')}</label>
            </div>
            <p className={styles.updateDesc}>
              {t('Manual Update Description')}
            </p>
            <button
              className={styles.checkUpdateBtn}
              onClick={handleCheckUpdate}
              disabled={checkingUpdate}
            >
              {checkingUpdate ? (
                <>
                  <RefreshCw size={16} className={styles.spinning} />
                  <span>{t('Checking...')}</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>{t('Check for Updates')}</span>
                </>
              )}
            </button>
            {updateStatus.available === true && (
              <p className={styles.updateAvailable}>
                ✅ {t('Update Available')}: v{updateStatus.version}
              </p>
            )}
            {updateStatus.available === false && (
              <p className={styles.updateNoAvailable}>
                ✅ {t('Up to Date')}
              </p>
            )}
            {updateStatus.error && (
              <p className={styles.updateError}>
                ❌ {updateStatus.error}
              </p>
            )}
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

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('Close Behavior')}</h3>

        <div className={styles.formGroup}>
          <div className={styles.radioField}>
            <div className={styles.radioHeader}>
              <LogOut size={16} />
              <label>{t('Click Close Button')}</label>
            </div>
            <div className={styles.radioOptions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="closeBehavior"
                  value="hide"
                  checked={formData.system.closeBehavior === "hide"}
                  onChange={(e) => onChange("system", "closeBehavior", e.target.value)}
                />
                <span>{t('Hide to Tray')}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="closeBehavior"
                  value="quit"
                  checked={formData.system.closeBehavior === "quit"}
                  onChange={(e) => onChange("system", "closeBehavior", e.target.value)}
                />
                <span>{t('Quit App')}</span>
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemTab;
