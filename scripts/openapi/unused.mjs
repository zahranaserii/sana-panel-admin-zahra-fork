/**
 * گزارش سرویس‌های تولیدشده‌ای که در کد فرانت (خارج از src/api/generated) استفاده نشده‌اند.
 * یک سرویس «استفاده‌شده» است اگر خودش یا هوک/آپشن‌های آن (useX، getXQueryOptions، …) جایی import شده باشد.
 * اجرا: npm run api:unused
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const GENERATED = 'src/api/generated';

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const capitalize = (name) => name[0].toUpperCase() + name.slice(1);
const variants = (name) => {
  const pascal = capitalize(name);
  return [
    name,
    `use${pascal}`,
    `get${pascal}QueryOptions`,
    `get${pascal}QueryKey`,
    `get${pascal}MutationOptions`,
  ];
};

/** توابع سرویس هر فایل تولیدشده همراه با متد و آدرس */
const operations = walk(GENERATED)
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.msw.ts') && !file.endsWith('index.ts'))
  .flatMap((file) => {
    const chunks = readFileSync(file, 'utf8').split('export const ').slice(1);
    return chunks.flatMap((chunk) => {
      const name = /^(\w+) = \(/.exec(chunk)?.[1];
      const request = /url: `([^`]+)`, method: '(\w+)'/.exec(chunk);
      if (!name || !request || !chunk.includes('apiClient<')) return [];
      return [{ name, url: request[1], method: request[2], file: relative(GENERATED, file) }];
    });
  });

const appSource = walk('src')
  .filter((file) => !file.startsWith(GENERATED) && /\.(ts|tsx)$/.test(file))
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

const unused = operations.filter(
  ({ name }) => !variants(name).some((variant) => new RegExp(`\\b${variant}\\b`).test(appSource)),
);

const byFile = Object.groupBy(unused, (item) => item.file);
console.log(`سرویس‌های تولیدشده: ${operations.length} · استفاده‌نشده در UI: ${unused.length}\n`);
Object.entries(byFile).forEach(([file, items]) => {
  console.log(file);
  items.forEach(({ name, method, url }) => console.log(`  ${method.padEnd(6)} ${url}  (${name})`));
});
