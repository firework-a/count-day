import { invoke } from "@tauri-apps/api/core";

export const enableAutoLaunch = async (): Promise<boolean> => {
  return invoke("enable_autostart");
};

export const disableAutoLaunch = async (): Promise<boolean> => {
  return invoke("disable_autostart");
};

export const checkAutoLaunch = async (): Promise<boolean> => {
  return invoke("is_autostart_enabled");
};
