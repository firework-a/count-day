import { Heart, Github, Shield, Award, Tag, Folder } from "lucide-react";
import styles from "../SettingsModal.module.scss";

interface AboutTabProps {
  version?: string;
  name?: string;
  repository?: string;
  issues?: string;
}

const AboutTab = ({
  version = __APP_VERSION__,
  name = __APP_NAME__,
  repository = __APP_REPOSITORY__,
  issues = __APP_ISSUES__,
}: AboutTabProps) => {
  return (
    <div className={styles.tabPane}>
      <section className={styles.aboutSection}>
        <div className={styles.aboutHeader}>
          <div className={styles.appIcon}>
            <Award size={48} />
          </div>
          <h2 className={styles.appName}>{name}</h2>
          <p className={styles.appVersion}>版本 {version}</p>
        </div>

        <p className={styles.appDescription}>
          一款简洁优雅的倒计时挂件应用，帮助你追踪重要日期和工作时间。
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>项目信息</h3>

        <div className={styles.infoList}>
          <a
            href={repository}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoItem}
          >
            <Folder size={16} />
            <span>项目仓库</span>
          </a>

          <a
            href={issues}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoItem}
          >
            <Github size={16} />
            <span>问题反馈</span>
          </a>

          <a
            href={`${repository}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoItem}
          >
            <Tag size={16} />
            <span>版本历史</span>
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>开源协议</h3>

        <div className={styles.licenseBox}>
          <div className={styles.licenseHeader}>
            <Shield size={16} />
            <span>MIT License</span>
          </div>
          <p className={styles.licenseText}>
            Copyright (c) 2026 Firework
            <br />
            本软件基于 MIT 协议开源，您可以自由使用、修改和分发。
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>技术栈</h3>

        <div className={styles.techStack}>
          <span className={styles.techTag}>Tauri</span>
          <span className={styles.techTag}>React</span>
          <span className={styles.techTag}>TypeScript</span>
          <span className={styles.techTag}>Rust</span>
          <span className={styles.techTag}>Vite</span>
        </div>
      </section>

      <footer className={styles.aboutFooter}>
        <span>
          使用 <Heart size={12} className={styles.heartIcon} /> 构建
        </span>
      </footer>
    </div>
  );
};

export default AboutTab;
