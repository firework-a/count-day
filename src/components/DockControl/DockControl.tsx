import { ArrowLeftToLine } from "lucide-react";
import styles from "./DockControl.module.scss";

interface DockControlProps {
  onExpand: () => void;
  onHover: () => void;
  onLeave: () => void;
  isPeeking: boolean;
}

const DockControl = ({ onExpand, onHover, onLeave, isPeeking }: DockControlProps) => {
  return (
    <div 
      className={`${styles.dockBar} ${isPeeking ? styles.peeking : ""}`} 
      onClick={onExpand}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={styles.expandBtn}>
        <ArrowLeftToLine size={16} />
      </div>
    </div>
  );
};

export default DockControl;
