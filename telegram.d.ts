/// <reference types="telegram-web-app" />

interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void;
      close: () => void;
      expand: () => void;
      MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isProgressVisible: boolean;
        isActive: boolean;
        setText: (text: string) => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        showProgress: (leaveActive: boolean) => void;
        hideProgress: () => void;
      };
      BackButton: {
        isVisible: boolean;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        show: () => void;
        hide: () => void;
      };
      initData: string;
      initDataUnsafe: {
        query_id?: string;
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code?: string;
          is_premium?: boolean;
        };
        auth_date: number;
        hash: string;
      };
      version: string;
      platform: string;
      colorScheme: 'light' | 'dark';
      themeParams: {
        bg_color?: string;
        text_color?: string;
        hint_color?: string;
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
      };
      isExpanded: boolean;
      viewportHeight: number;
      viewportStableHeight: number;
      headerColor: string;
      backgroundColor: string;
      setHeaderColor: (color: string) => void;
      setBackgroundColor: (color: string) => void;
      isClosingConfirmationEnabled: boolean;
      enableClosingConfirmation: () => void;
      disableClosingConfirmation: () => void;
      showAlert: (message: string, callback?: () => void) => void;
      showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
      showPopup: (params: {
        title?: string;
        message: string;
        buttons?: Array<{
          id?: string;
          type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
          text?: string;
        }>;
      }, callback?: (buttonId: string) => void) => void;
      openLink: (url: string) => void;
      openTelegramLink: (url: string) => void;
      HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        selectionChanged: () => void;
      };
    };
  };
}
