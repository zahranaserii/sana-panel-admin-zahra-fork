import { describe, expect, it } from 'vitest';

import { getStaffDateError, toSearchParams, validStaffFilters } from '@/features/staff/types';

import {
  captchaRule,
  descriptionRule,
  fullNameRule,
  normalizeText,
  personnelCodeRule,
  usernameRule,
} from './inputRules';

describe('panel input rules', () => {
  it('accepts Persian personal names and keyboard variants', () => {
    expect(fullNameRule.pattern.test(normalizeText('علي‌اكبر رضایی'))).toBe(true);
    for (const name of ['علی۲', 'John', '،', '   ', '‌'])
      expect(fullNameRule.pattern.test(name)).toBe(false);
  });

  it('uses different alphabets for usernames, personnel codes and captchas', () => {
    expect(usernameRule.pattern.test('user.12')).toBe(true);
    expect(usernameRule.pattern.test('a'.repeat(21))).toBe(false);
    expect(usernameRule.pattern.test('user-12')).toBe(false);
    expect(personnelCodeRule.pattern.test('HR-12')).toBe(true);
    expect(captchaRule.pattern.test('aB12')).toBe(true);
    expect(captchaRule.pattern.test('a.12')).toBe(false);
  });

  it('limits a multiline description to 300 characters', () => {
    expect(descriptionRule.pattern.test('الف،\nب.')).toBe(true);
    expect(descriptionRule.pattern.test('ب'.repeat(300))).toBe(true);
    expect(descriptionRule.pattern.test('ب'.repeat(301))).toBe(false);
  });

  it('validates URL filters before a personnel query', () => {
    expect(validStaffFilters({ q: 'HR-۱۲' })).toBe(true);
    expect(toSearchParams({ q: 'HR-۱۲' }).Term).toBe('HR-12');
    expect(validStaffFilters({ q: '<علی>' })).toBe(false);
    expect(validStaffFilters({ q: 'a'.repeat(31) })).toBe(false);
    expect(validStaffFilters({ hireFrom: '2026-02-30' })).toBe(false);
    expect(getStaffDateError({ hireFrom: '2026-02-02', hireTo: '2026-02-01' })).toBeTruthy();
  });
});
