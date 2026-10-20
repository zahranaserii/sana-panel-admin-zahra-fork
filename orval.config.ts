import { defineConfig } from 'orval';

/**
 * تولید سرویس‌ها، هوک‌های React Query و ماک MSW از فایل‌های OpenAPI پوشه openapi/.
 * اجرا: npm run api:generate
 *
 * پیش‌فرض: GET = useQuery و بقیه = useMutation؛ استثناها در OPERATIONS.
 */
const mutator = { path: './src/services/http/apiClient.ts', name: 'apiClient' };

const common = (input: string, target: string) => ({
  input: {
    target: input,
    override: { transformer: './scripts/openapi/unwrap-envelope.mjs' },
  },
  output: {
    target,
    mode: 'tags-split' as const,
    client: 'react-query' as const,
    httpClient: 'axios' as const,
    clean: true,
    mock: {
      indexMockFiles: true,
      generators: [{ type: 'msw' as const, delay: 250, baseUrl: '*', locale: 'fa' as const }],
    },
    override: {
      mutator,
      header: () => [
        'تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)',
      ],
      query: { version: 5 as const, signal: true },
      /** ماک‌ها همه فیلدها را پر کنند */
      mock: { required: true },
      operations: OPERATIONS,
    },
  },
  hooks: { afterAllFilesWrite: 'node scripts/openapi/postprocess-mocks.mjs' },
});

/** رفتار متفاوت با پیش‌فرض متد HTTP */
const OPERATIONS = {
  /** POST ولی فقط محاسبه/نمایش است و چیزی ذخیره نمی‌کند */
  Loans_Preview: { query: { useQuery: true, useMutation: false } },
  /** GET ولی اثر جانبی دارد (پایان نشست) */
  Authentication_Logout_Get: { query: { useQuery: false, useMutation: true } },
};

export default defineConfig({
  facility: common('./openapi/facility.json', './src/api/generated/facility'),
  admin: common('./openapi/admin.json', './src/api/generated/admin'),
});
