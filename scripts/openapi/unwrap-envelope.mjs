/**
 * همه پاسخ‌های بک‌اند داخل `{ data, statusCode, message, isSuccess }` هستند و لایه HTTP فقط `data` را برمی‌گرداند.
 * این transformer قبل از تولید کد، schema پاسخ هر سرویس را با schema فیلد `data` آن جایگزین می‌کند
 * تا تایپ خروجی سرویس‌ها و ماک‌ها همان `data` باشد (ماک‌ها بعد از تولید دوباره داخل قالب پاسخ قرار می‌گیرند).
 */
const ENVELOPE_KEYS = ['data', 'statusCode', 'isSuccess'];

const refName = (ref) => ref?.split('/').at(-1);

/**
 * ایراد spec بک‌اند: پارامتر مسیر بدون تعریف (مثل companyId در Personnel_Search) — با نوع int64 اضافه می‌شود
 */
const addMissingPathParams = (path, operation) => {
  if (!operation || typeof operation !== 'object') return;
  const declared = new Set(
    (operation.parameters ?? []).filter((param) => param.in === 'path').map((param) => param.name),
  );
  [...path.matchAll(/{(\w+)}/g)]
    .map((match) => match[1])
    .filter((name) => !declared.has(name))
    .forEach((name) => {
      operation.parameters = [
        ...(operation.parameters ?? []),
        { name, in: 'path', required: true, schema: { type: 'integer', format: 'int64' } },
      ];
    });
};

/** سرویس بدون operationId (Admin.Api) → نام خوانا از مسیر و متد، مثل Authentication_MainMenu_Get یا UserManagement_Roles_ById_Put */
const ensureOperationId = (path, method, operation) => {
  if (!operation || typeof operation !== 'object' || operation.operationId) return;
  const segments = path
    .replace(/^\/gateway\/[^/]+\//, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => (segment.startsWith('{') ? 'ById' : segment));
  operation.operationId = [...segments, method[0].toUpperCase() + method.slice(1)].join('_');
};

export default (spec) => {
  const schemas = spec.components?.schemas ?? {};
  const isEnvelope = (schema) =>
    schema?.type === 'object' && ENVELOPE_KEYS.every((key) => key in (schema.properties ?? {}));

  Object.entries(spec.paths ?? {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      ensureOperationId(path, method, operation);
      addMissingPathParams(path, operation);
      // هدرهای ثابت (x-api-version، DeviceId و…) را لایه HTTP به همه درخواست‌ها اضافه می‌کند؛
      // در Admin.Api این پارامترها schema ندارند و spec را نامعتبر می‌کنند
      if (Array.isArray(operation?.parameters)) {
        operation.parameters = operation.parameters.filter((param) => param.in !== 'header');
      }
      Object.values(operation?.responses ?? {}).forEach((response) => {
        Object.values(response?.content ?? {}).forEach((media) => {
          const envelope = schemas[refName(media.schema?.$ref)];
          if (isEnvelope(envelope)) media.schema = envelope.properties.data;
        });
      });
    });
  });
  return spec;
};
