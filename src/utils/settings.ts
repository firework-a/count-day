export interface UserSettings {
  salary: {
    day: number;
    amount: number;
  };
  work: {
    start: string;
    end: string;
    weekendMode: "double" | "single";
  };
  holidays: {
    enabled: boolean;
  };
  appearance: {
    fontFamily: string;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    backgroundOpacity: number;
    borderColor: string;
    darkMode: "auto" | "light" | "dark";
    pureBlack: boolean;
  };
  customDates: {
    id: string;
    label: string;
    date: string;
  }[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  salary: {
    day: 15,
    amount: 10000,
  },
  work: {
    start: "09:00",
    end: "18:00",
    weekendMode: "double",
  },
  holidays: {
    enabled: true,
  },
  appearance: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontSize: 14,
    textColor: "#0f172a",
    backgroundColor: "#ffffff",
    backgroundOpacity: 1.0,
    borderColor: "#e2e8f0",
    darkMode: "auto",
    pureBlack: true,
  },
  customDates: [],
};

const SETTINGS_KEY = "count-day-user-settings";

export const getSettings = (): UserSettings => {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(saved);
    // 深度合并默认配置，确保新增字段（如 appearance）存在
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      appearance: {
        ...DEFAULT_SETTINGS.appearance,
        ...(parsed.appearance || {}),
      },
      salary: {
        ...DEFAULT_SETTINGS.salary,
        ...(parsed.salary || {}),
      },
      work: {
        ...DEFAULT_SETTINGS.work,
        ...(parsed.work || {}),
      }
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
