import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';

import { SessionExpiredModal } from '@/features/auth/components/SessionExpiredModal';
import { useThemeStore } from '@/store/useThemeStore';
import { FONT_FAMILY } from '@/theme/typography';

import { ErrorFallback } from './ErrorFallback';
import { queryClient } from './queryClient';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const mode = useThemeStore((state) => state.mode);

  return (
    <ThemeProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => queryClient.clear()}>
        <QueryClientProvider client={queryClient}>
          {children}
          <SessionExpiredModal />
          <Toaster
            dir="rtl"
            position="top-left"
            richColors
            closeButton
            visibleToasts={1}
            theme={mode}
            toastOptions={{ style: { fontFamily: FONT_FAMILY } }}
          />
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
