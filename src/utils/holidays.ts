import { format } from "date-fns";

/**
 * 节假日 API 响应结构 (以 timor.tech 为例)
 */
// interface HolidayResponse {
//   code: number;
//   holiday: {
//     [key: string]: {
//       holiday: boolean;
//       name: string;
//       wage: number;
//       date: string;
//       rest?: number;
//     }
//   };
// }

const CACHE_KEY = "count-day-holiday-cache";
const CACHE_EXPIRE = 24 * 60 * 60 * 1000; // 24小时过期

export interface HolidayData {
  updatedAt: number;
  year: number;
  holidays: string[]; // 放假的日子
  workdays: string[];  // 补班的日子
}

/**
 * 从网络获取指定年份的节假日数据
 */
export const fetchHolidays = async (year: number): Promise<HolidayData | null> => {
  try {
    // 使用 Nager.Date 或类似的公共 API，或者专门的中国节假日 API
    // 这里以 timor.tech 的 API 为例 (注意：实际使用时建议使用更稳定的源或多个备选源)
    const response = await fetch(`https://timor.tech/api/holiday/year/${year}`);
    const data = await response.json();

    if (data.code === 0) {
      const holidays: string[] = [];
      const workdays: string[] = [];

      Object.values(data.holiday).forEach((item: any) => {
        // item.holiday 为 true 表示是法定节假日（放假）
        // item.holiday 为 false 表示是调休补班（工作）
        if (item.holiday) {
          holidays.push(item.date);
        } else {
          workdays.push(item.date);
        }
      });

      const holidayData: HolidayData = {
        updatedAt: Date.now(),
        year,
        holidays,
        workdays,
      };

      localStorage.setItem(`${CACHE_KEY}-${year}`, JSON.stringify(holidayData));
      return holidayData;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    return null;
  }
};

/**
 * 获取本地缓存的节假日数据
 */
export const getCachedHolidays = (year: number): HolidayData | null => {
  const cached = localStorage.getItem(`${CACHE_KEY}-${year}`);
  if (!cached) return null;

  try {
    const data: HolidayData = JSON.parse(cached);
    // 检查是否过期
    if (Date.now() - data.updatedAt > CACHE_EXPIRE) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

/**
 * 判断某天是否为工作日 (考虑在线获取的数据)
 */
export const isWorkdayDynamic = (date: Date, holidayData: HolidayData | null): boolean => {
  if (holidayData && holidayData.year === date.getFullYear()) {
    const dateStr = format(date, 'yyyy-MM-dd');
    // 1. 如果在放假名单里，不是工作日
    if (holidayData.holidays.includes(dateStr)) return false;
    // 2. 如果在补班名单里，是工作日
    if (holidayData.workdays.includes(dateStr)) return true;
  }
  
  // 3. 默认周末逻辑
  const day = date.getDay();
  return day !== 0 && day !== 6;
};
