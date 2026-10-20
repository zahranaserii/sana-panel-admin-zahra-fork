/**
 * بعد از تولید: پاسخ ماک‌های تولیدشده داخل قالب پاسخ بک‌اند قرار می‌گیرد
 * (`HttpResponse.json(x)` → `json(x)` از test/msw/utils که `{ data, statusCode, message, isSuccess }` می‌سازد).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/api/generated';
const IMPORT = "import { json } from '@/test/msw/utils';";

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const files = walk(ROOT).filter((file) => file.endsWith('.msw.ts'));
files.forEach((file) => {
  const source = readFileSync(file, 'utf8');
  if (source.includes(IMPORT)) return;
  let wrapped = source.replaceAll('HttpResponse.json(', 'json(');
  if (wrapped.includes('json(')) {
    wrapped = wrapped.replace(/(import type \{\s*RequestHandlerOptions\s*\} from 'msw';)/, `$1\n${IMPORT}`);
  }
  // اگر دیگر HttpResponse استفاده نمی‌شود از import حذف شود
  if (!/new HttpResponse|HttpResponse\./.test(wrapped)) {
    wrapped = wrapped.replace(/\n\s*HttpResponse,/, '');
  }
  writeFileSync(file, wrapped);
});
console.log(`mocks wrapped in the backend envelope: ${files.length} files`);
