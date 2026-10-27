/**
 * طرح کلان مشترک چند درخواست (دلایل فقط از Schemes/{schemeId}/Reasons خوانده می‌شود).
 * اگر درخواست‌ها از چند طرح مختلف باشند `mixed` برمی‌گردد.
 */
export const schemeOfRequests = (requests: { schemeId?: number }[]) => {
  const ids = new Set(requests.map((request) => request.schemeId));
  if (ids.size > 1) return 'mixed' as const;
  return requests[0]?.schemeId;
};

export const MIXED_SCHEMES_MESSAGE =
  'درخواست‌های انتخاب‌شده از چند طرح مختلف هستند؛ فقط درخواست‌های یک طرح را با هم انتخاب کنید.';
