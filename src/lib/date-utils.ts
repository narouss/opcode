import i18n from '@/lib/i18n';

/**
 * 获取当前语言的 locale 代码
 */
function getLocale(): string {
  const lang = i18n.language || 'zh-CN';
  return lang === 'zh-CN' ? 'zh-CN' : 'en-US';
}

/**
 * Formats a Unix timestamp to a human-readable date string
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 * 
 * @example
 * formatUnixTimestamp(1735555200) // "12月30日" or "Dec 30, 2024"
 */
export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const locale = getLocale();
  
  // If it's today, show time
  if (isToday(date)) {
    return formatTime(date);
  }
  
  // If it's yesterday
  if (isYesterday(date)) {
    const yesterday = locale === 'zh-CN' ? '昨天' : 'Yesterday';
    return `${yesterday}, ${formatTime(date)}`;
  }
  
  // If it's within the last week, show day of week
  if (isWithinWeek(date)) {
    return `${getDayName(date)}, ${formatTime(date)}`;
  }
  
  // If it's this year, don't show year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(locale, { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Otherwise show full date
  return date.toLocaleDateString(locale, { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats an ISO timestamp string to a human-readable date
 * @param isoString - ISO timestamp string
 * @returns Formatted date string
 * 
 * @example
 * formatISOTimestamp("2025-01-04T10:13:29.000Z") // "1月4日" or "Jan 4, 2025"
 */
export function formatISOTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return formatUnixTimestamp(Math.floor(date.getTime() / 1000));
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Gets the first line of text
 * @param text - Text to process
 * @returns First line of text
 */
export function getFirstLine(text: string): string {
  const lines = text.split('\n');
  return lines[0] || '';
}

// Helper functions
function formatTime(date: Date): string {
  const locale = getLocale();
  return date.toLocaleTimeString(locale, { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: locale !== 'zh-CN'
  });
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function isWithinWeek(date: Date): boolean {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date > weekAgo;
}

function getDayName(date: Date): string {
  const locale = getLocale();
  return date.toLocaleDateString(locale, { weekday: 'long' });
}

/**
 * Formats a timestamp to a relative time string (e.g., "2小时前", "3天前")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string
 * 
 * @example
 * formatTimeAgo(Date.now() - 3600000) // "1小时前" or "1 hour ago"
 * formatTimeAgo(Date.now() - 86400000) // "1天前" or "1 day ago"
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const locale = getLocale();
  const isZh = locale === 'zh-CN';
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) {
    return isZh ? `${years}年前` : (years === 1 ? '1 year ago' : `${years} years ago`);
  }
  if (months > 0) {
    return isZh ? `${months}个月前` : (months === 1 ? '1 month ago' : `${months} months ago`);
  }
  if (weeks > 0) {
    return isZh ? `${weeks}周前` : (weeks === 1 ? '1 week ago' : `${weeks} weeks ago`);
  }
  if (days > 0) {
    return isZh ? `${days}天前` : (days === 1 ? '1 day ago' : `${days} days ago`);
  }
  if (hours > 0) {
    return isZh ? `${hours}小时前` : (hours === 1 ? '1 hour ago' : `${hours} hours ago`);
  }
  if (minutes > 0) {
    return isZh ? `${minutes}分钟前` : (minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`);
  }
  if (seconds > 0) {
    return isZh ? `${seconds}秒前` : (seconds === 1 ? '1 second ago' : `${seconds} seconds ago`);
  }
  
  return isZh ? '刚刚' : 'just now';
}
 
