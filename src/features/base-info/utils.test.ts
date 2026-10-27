import { EMPTY_VALUES, toPayload } from './utils';

describe('toPayload', () => {
  const values = { ...EMPTY_VALUES, title: ' طرح ', code: 'A' };

  it('sends the rowVersion from the scheme detail on edit', () => {
    expect(toPayload(values, 'AAAAAAAAB9E=').rowVersion).toBe('AAAAAAAAB9E=');
  });

  it('leaves rowVersion out when there is none (create)', () => {
    expect(toPayload(values)).not.toHaveProperty('rowVersion');
  });
});
