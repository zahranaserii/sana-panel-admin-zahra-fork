import { schemeOfRequests } from './schemeOfRequests';

describe('schemeOfRequests', () => {
  it('returns the shared scheme of the selected requests', () => {
    expect(schemeOfRequests([{ schemeId: 5 }, { schemeId: 5 }])).toBe(5);
  });

  it('reports mixed when requests belong to different schemes', () => {
    expect(schemeOfRequests([{ schemeId: 5 }, { schemeId: 6 }])).toBe('mixed');
  });

  it('returns undefined for no requests', () => {
    expect(schemeOfRequests([])).toBeUndefined();
  });
});
