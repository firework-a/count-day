import { Github, Shield, Award, Tag, Folder } from "lucide-react";
import styles from "../SettingsModal.module.scss";
import { useTranslation } from "../../../hooks/useTranslation";

interface AboutTabProps {
  version?: string;
  name?: string;
  repository?: string;
  issues?: string;
  language?: string;
}

const AboutTab = ({
  version = __APP_VERSION__,
  name = __APP_NAME__,
  repository = __APP_REPOSITORY__,
  issues = __APP_ISSUES__,
  language = 'zh-CN',
}: AboutTabProps) => {
  const { t } = useTranslation(language as 'zh-CN' | 'en-US');

  return (
    <div className={styles.tabPane}>
      <section className={styles.aboutSection}>
        <div className={styles.aboutHeader}>
          <div className={styles.appIcon}>
            <Award size={48} />
          </div>
          <h2 className={styles.appName}>{name}</h2>
          <p className={styles.appVersion}>{t('Version')} {version}</p>
        </div>

        <p className={styles.appDescription}>
          {t('App Description')}
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('Project Info')}</h3>
        
        <div className={styles.infoList}>
          <a
            href={repository}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoItem}
          >
            <Folder size={16} />
            <span>{t('Repository')}</span>
          </a>
          
          <a
            href={issues}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoItem}
          >
            <Github size={16} />
            <span>{t('Issues')}</span>
          </a>
          
          <a
            href={`${repository}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoItem}
          >
            <Tag size={16} />
            <span>{t('Releases')}</span>
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('License')}</h3>
        
        <div className={styles.licenseBox}>
          <div className={styles.licenseHeader}>
            <Shield size={16} />
            <span>MIT License</span>
          </div>
          <p className={styles.licenseText}>
            Copyright (c) 2026 Firework
            <br />
            {t('MIT License Text')}
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('Tech Stack')}</h3>
        
        <div className={styles.techStack}>
          <span className={styles.techTag}>Tauri</span>
          <span className={styles.techTag}>React</span>
          <span className={styles.techTag}>TypeScript</span>
          <span className={styles.techTag}>Rust</span>
          <span className={styles.techTag}>Vite</span>
        </div>
      </section>

      <footer className={styles.aboutFooter}>
        <span>{t('Built with love')}</span>
      </footer>
    </div>
  );
};

export default AboutTab;
