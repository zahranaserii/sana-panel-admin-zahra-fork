import { isEmptyValue, removeEmpty } from './object';

describe('object utils', () => {
  it('detects empty values', () => {
    expect([undefined, null, '', []].every(isEmptyValue)).toBe(true);
    expect([0, false, ' ', [0], {}].some(isEmptyValue)).toBe(false);
  });

  it('removes empty keys', () => {
    expect(removeEmpty({ a: 1, b: '', c: null, d: undefined, e: [], f: false, g: 0 })).toEqual({
      a: 1,
      f: false,
      g: 0,
    });
  });
});
