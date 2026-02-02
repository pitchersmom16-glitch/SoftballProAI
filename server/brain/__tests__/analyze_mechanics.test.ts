/**
 * Brain Module Tests
 */

import { describe, it, expect } from '@jest/globals';
import { analyzeMechanics, getCorrectiveDrills } from '../analyze_mechanics';

describe('Brain - Analyze Mechanics', () => {
  it('should analyze pitching mechanics', async () => {
    const result = await analyzeMechanics({
      skillType: 'PITCHING',
      detectedIssues: ['hunched forward'],
      athleteLevel: 'Intermediate',
      limit: 3
    });

    expect(result).toBeDefined();
    expect(result.recommendations).toBeInstanceOf(Array);
  });

  it('should get corrective drills', async () => {
    const drills = await getCorrectiveDrills(['hunched forward']);
    expect(drills).toBeInstanceOf(Array);
  });
});
