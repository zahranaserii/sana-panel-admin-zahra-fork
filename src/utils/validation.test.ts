import { describe, expect, it } from 'vitest';

import { getNewPasswordError } from './validation';

describe('new password validation', () => {
  it.each(Array.from('!@#$%&*_-'))('accepts the symbol %s', (symbol) => {
    expect(getNewPasswordError('1abcdef' + symbol)).toBeUndefined();
  });

  it('accepts the maximum length', () => {
    expect(getNewPasswordError('a'.repeat(28) + '1!')).toBeUndefined();
  });

  it.each([
    'a12345!',
    'a'.repeat(29) + '1!',
    '!abc1234',
    'abcdefgh1',
    'abcdefgh!',
    '1234567!',
    'abcdef۱!',
    'a123456!',
    'abcdef1?',
    'abcdef1! ',
    'abcdef1!\n',
  ])('rejects invalid or reused password %j', (value) => {
    expect(getNewPasswordError(value, 'a123456!')).toBeTruthy();
  });
});
