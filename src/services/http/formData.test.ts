import { describe, expect, it } from 'vitest';

import { toAspNetFormData } from './formData';

describe('toAspNetFormData', () => {
  it('sends object arrays with ASP.NET indexed keys and skips null values', () => {
    const file = new File(['x'], 'doc.pdf');
    const form = toAspNetFormData({
      Months: [
        { month: '1405/01', averageBalance: 1000 },
        { month: '1405/02', averageBalance: null },
      ],
      PlanIds: [1, 2],
      RowVersion: 'v1',
      DocumentDescription: undefined,
      files: [file],
    });

    expect([...form.keys()]).toEqual([
      'Months[0].month',
      'Months[0].averageBalance',
      'Months[1].month',
      'PlanIds',
      'PlanIds',
      'RowVersion',
      'files',
    ]);
    expect(form.get('Months[0].averageBalance')).toBe('1000');
    expect(form.getAll('PlanIds')).toEqual(['1', '2']);
    expect((form.get('files') as File).name).toBe('doc.pdf');
  });
});
