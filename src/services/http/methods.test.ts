import { fileNameFromDisposition } from './methods';

describe('fileNameFromDisposition', () => {
  it('reads the UTF-8 encoded name first', () => {
    expect(
      fileNameFromDisposition(
        `attachment; filename="report.xlsx"; filename*=UTF-8''${encodeURIComponent('گزارش.xlsx')}`,
      ),
    ).toBe('گزارش.xlsx');
  });

  it('falls back to the plain name, or nothing without the header', () => {
    expect(fileNameFromDisposition('attachment; filename="report.xlsx"')).toBe('report.xlsx');
    expect(fileNameFromDisposition(null)).toBeUndefined();
  });
});
