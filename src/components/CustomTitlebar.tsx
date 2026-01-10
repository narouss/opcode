import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Minus, Square, X, Bot, BarChart3, FileText, Network, Info, MoreVertical, Maximize2 } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { TooltipProvider, TooltipSimple } from '@/components/ui/tooltip-modern';
import { useTranslation } from 'react-i18next';

interface CustomTitlebarProps {
  onSettingsClick?: () => void;
  onAgentsClick?: () => void;
  onUsageClick?: () => void;
  onClaudeClick?: () => void;
  onMCPClick?: () => void;
  onInfoClick?: () => void;
}

export const CustomTitlebar: React.FC<CustomTitlebarProps> = ({
  onSettingsClick,
  onAgentsClick,
  onUsageClick,
  onClaudeClick,
  onMCPClick,
  onInfoClick
}) => {
  const { t } = useTranslation();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 检查窗口最大化状态
  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const window = getCurrentWindow();
        const maximized = await window.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error('Failed to check maximized state:', error);
      }
    };
    checkMaximized();

    // 监听窗口大小变化
    const handleResize = () => {
      checkMaximized();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMinimize = async () => {
    try {
      const window = getCurrentWindow();
      await window.minimize();
      console.log('Window minimized successfully');
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };

  const handleMaximize = async () => {
    try {
      const window = getCurrentWindow();
      const maximized = await window.isMaximized();
      if (maximized) {
        await window.unmaximize();
        setIsMaximized(false);
        console.log('Window unmaximized successfully');
      } else {
        await window.maximize();
        setIsMaximized(true);
        console.log('Window maximized successfully');
      }
    } catch (error) {
      console.error('Failed to maximize/unmaximize window:', error);
    }
  };

  const handleClose = async () => {
    try {
      const window = getCurrentWindow();
      await window.close();
      console.log('Window closed successfully');
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  return (
    <TooltipProvider>
      <div
        className="relative z-[200] h-11 bg-background/95 backdrop-blur-sm flex items-center justify-between select-none border-b border-border/50 tauri-drag"
        data-tauri-drag-region
      >
        {/* Left side - Navigation icons */}
        <div className="flex items-center pl-5 gap-3 tauri-no-drag">
          {/* Primary actions group */}
          <div className="flex items-center gap-1">
            {onAgentsClick && (
              <TooltipSimple content={t('titlebar.agents')} side="bottom">
                <motion.button
                  onClick={onAgentsClick}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors tauri-no-drag"
                >
                  <Bot size={16} />
                </motion.button>
              </TooltipSimple>
            )}

            {onUsageClick && (
              <TooltipSimple content={t('titlebar.usage')} side="bottom">
                <motion.button
                  onClick={onUsageClick}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors tauri-no-drag"
                >
                  <BarChart3 size={16} />
                </motion.button>
              </TooltipSimple>
            )}
          </div>

          {/* Visual separator */}
          <div className="w-px h-5 bg-border/50" />

          {/* Secondary actions group */}
          <div className="flex items-center gap-1">
            {onSettingsClick && (
              <TooltipSimple content={t('titlebar.settings')} side="bottom">
                <motion.button
                  onClick={onSettingsClick}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors tauri-no-drag"
                >
                  <Settings size={16} />
                </motion.button>
              </TooltipSimple>
            )}

            {/* Dropdown menu for additional options */}
            <div className="relative" ref={dropdownRef}>
              <TooltipSimple content={t('titlebar.moreOptions')} side="bottom">
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1"
                >
                  <MoreVertical size={16} />
                </motion.button>
              </TooltipSimple>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-[250]">
                  <div className="py-1">
                    {onClaudeClick && (
                      <button
                        onClick={() => {
                          onClaudeClick();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3"
                      >
                        <FileText size={14} />
                        <span>{t('titlebar.claudeMd')}</span>
                      </button>
                    )}

                    {onMCPClick && (
                      <button
                        onClick={() => {
                          onMCPClick();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3"
                      >
                        <Network size={14} />
                        <span>{t('titlebar.mcpServers')}</span>
                      </button>
                    )}

                    {onInfoClick && (
                      <button
                        onClick={() => {
                          onInfoClick();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3"
                      >
                        <Info size={14} />
                        <span>{t('common.about')}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Windows style window controls */}
        <div className="flex items-center tauri-no-drag">
          {/* Minimize button - Windows style */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
            className="h-11 w-12 flex items-center justify-center hover:bg-accent transition-colors"
            title={t('titlebar.minimize')}
          >
            <Minus size={16} className="text-foreground/80" />
          </button>

          {/* Maximize/Restore button - Windows style */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            className="h-11 w-12 flex items-center justify-center hover:bg-accent transition-colors"
            title={isMaximized ? t('titlebar.restore') : t('titlebar.maximize')}
          >
            {isMaximized ? (
              <Square size={12} className="text-foreground/80" />
            ) : (
              <Square size={14} className="text-foreground/80" />
            )}
          </button>

          {/* Close button - Windows style with red hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="h-11 w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            title={t('titlebar.close')}
          >
            <X size={16} className="text-foreground/80 group-hover:text-white" />
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};
