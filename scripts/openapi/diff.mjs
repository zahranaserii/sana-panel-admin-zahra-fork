/**
 * مقایسه فایل‌های OpenAPI فعلی با آخرین نسخه کامیت‌شده (یا یک ref دلخواه):
 * سرویس‌های اضافه‌شده، حذف‌شده و تغییرکرده (پارامتر، بدنه یا پاسخ).
 * اجرا: npm run api:diff  یا  npm run api:diff -- origin/main
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

const ref = process.argv[2] ?? 'HEAD';
const DIR = 'openapi';

const readOld = (file) => {
  try {
    return JSON.parse(execFileSync('git', ['show', `${ref}:${DIR}/${file}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    return { paths: {}, components: {} };
  }
};

/** هر سرویس با schemaهای ارجاع‌شده‌اش (تا عمق کامل) برای تشخیص تغییر */
const operations = (spec) => {
  const schemas = spec.components?.schemas ?? {};
  const resolve = (node, seen = new Set()) => {
    if (Array.isArray(node)) return node.map((item) => resolve(item, seen));
    if (!node || typeof node !== 'object') return node;
    if (node.$ref) {
      const name = node.$ref.split('/').at(-1);
      if (seen.has(name)) return { $ref: name };
      return resolve(schemas[name], new Set([...seen, name]));
    }
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, resolve(value, seen)]));
  };
  const result = new Map();
  Object.entries(spec.paths ?? {}).forEach(([path, item]) =>
    Object.entries(item).forEach(([method, operation]) => {
      const key = `${method.toUpperCase().padEnd(6)} ${path}`;
      const { parameters, requestBody, responses } = operation;
      result.set(key, {
        summary: operation.summary ?? '',
        signature: JSON.stringify(resolve({ parameters, requestBody, responses })),
      });
    }),
  );
  return result;
};

readdirSync(DIR)
  .filter((file) => file.endsWith('.json'))
  .forEach((file) => {
    const before = operations(readOld(file));
    const after = operations(JSON.parse(readFileSync(`${DIR}/${file}`, 'utf8')));
    const added = [...after.keys()].filter((key) => !before.has(key));
    const removed = [...before.keys()].filter((key) => !after.has(key));
    const changed = [...after.keys()].filter(
      (key) => before.has(key) && before.get(key).signature !== after.get(key).signature,
    );
    console.log(`\n${file} (در مقایسه با ${ref})`);
    if (!added.length && !removed.length && !changed.length) console.log('  بدون تغییر');
    const print = (title, keys, source) =>
      keys.length &&
      console.log(`  ${title}:\n${keys.map((key) => `    ${key}  ${source.get(key).summary}`).join('\n')}`);
    print('اضافه‌شده', added, after);
    print('حذف‌شده', removed, before);
    print('تغییرکرده', changed, after);
  });
