import '@fontsource-variable/vazirmatn';
import './styles/digits.css';
import './styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import { useThemeStore } from './store/useThemeStore';
import { applyPaletteToDocument } from './theme/palette';

// متغیرهای رنگ قبل از اولین رندر ست می‌شوند تا پرش رنگ نداشته باشیم
applyPaletteToDocument(useThemeStore.getState().mode);

const enableMocking = async () => {
  // شرط مستقیم روی import.meta.env تا در بیلدِ بدون ماک، کد ماک (MSW و faker) اصلاً ساخته نشود
  if (import.meta.env.VITE_ENABLE_MOCK !== 'true') return;
  // ماک مستقیماً روی axios وصل می‌شود (بدون Service Worker) تا روی هر سروری بعد از دیپلوی هم کار کند
  const { enableMockAdapter } = await import('./test/msw/mockAdapter');
  enableMockAdapter();
};

void enableMocking().then(() => {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
