import { check } from "@tauri-apps/plugin-updater";

export interface UpdateResult {
  available: boolean;
  version?: string;
  date?: string;
  body?: string;
}

/**
 * 检查是否有可用更新
 */
export const checkForUpdates = async (): Promise<UpdateResult> => {
  try {
    const update = await check();
    
    if (update) {
      return {
        available: true,
        version: update.version,
        date: update.date,
        body: update.body,
      };
    }
    
    return { available: false };
  } catch (error) {
    console.error("Failed to check for updates:", error);
    throw error;
  }
};

/**
 * 下载并安装更新
 */
export const downloadAndInstall = async (): Promise<void> => {
  try {
    const update = await check();
    if (update) {
      await update.downloadAndInstall();
    }
  } catch (error) {
    console.error("Failed to download and install update:", error);
    throw error;
  }
};
