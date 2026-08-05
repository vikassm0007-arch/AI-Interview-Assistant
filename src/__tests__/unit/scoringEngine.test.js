import { describe, it, expect } from 'vitest';
import { 
  calculateDimensionScore, 
  calculateCompositeScore, 
  getEvaluationStatus, 
  getProgressColorClass 
} from '../../utils/scoringEngine';

describe('Scoring Engine Unit Tests', () => {
  
  describe('calculateDimensionScore', () => {
    it('returns 0 for empty or invalid sub-score arrays', () => {
      expect(calculateDimensionScore([])).toBe(0);
      expect(calculateDimensionScore(null)).toBe(0);
    });

    it('calculates rounded average of sub-scores', () => {
      expect(calculateDimensionScore([80, 90, 70])).toBe(80);
      expect(calculateDimensionScore([85, 90, 95])).toBe(90);
    });

    it('clamps results strictly between 0 and 100', () => {
      expect(calculateDimensionScore([120, 150])).toBe(100);
      expect(calculateDimensionScore([-20, -50])).toBe(0);
    });
  });

  describe('calculateCompositeScore', () => {
    it('applies formula weights: (Tech * 0.45) + (Comm * 0.35) + (Conf * 0.20)', () => {
      // (100 * 0.45 = 45) + (100 * 0.35 = 35) + (100 * 0.20 = 20) = 100
      expect(calculateCompositeScore(100, 100, 100)).toBe(100);

      // (80 * 0.45 = 36) + (80 * 0.35 = 28) + (80 * 0.20 = 16) = 80
      expect(calculateCompositeScore(80, 80, 80)).toBe(80);

      // (90 * 0.45 = 40.5) + (80 * 0.35 = 28) + (70 * 0.20 = 14) = 82.5 -> rounds to 83
      expect(calculateCompositeScore(90, 80, 70)).toBe(83);
    });

    it('clamps output score within 0 to 100 bounds', () => {
      expect(calculateCompositeScore(120, 110, 100)).toBe(100);
      expect(calculateCompositeScore(-10, -5, 0)).toBe(0);
    });
  });

  describe('getEvaluationStatus', () => {
    it('returns "Job Ready" for scores >= 85', () => {
      const status = getEvaluationStatus(85);
      expect(status.label).toBe('Job Ready');
    });

    it('returns "Strong Candidate" for scores between 70 and 84', () => {
      const status = getEvaluationStatus(75);
      expect(status.label).toBe('Strong Candidate');
    });

    it('returns "Needs Practice" for scores < 70', () => {
      const status = getEvaluationStatus(65);
      expect(status.label).toBe('Needs Practice');
    });
  });

  describe('getProgressColorClass', () => {
    it('returns emerald color class for scores >= 80', () => {
      expect(getProgressColorClass(85)).toBe('bg-emerald-500');
    });

    it('returns amber color class for scores between 60 and 79', () => {
      expect(getProgressColorClass(65)).toBe('bg-amber-500');
    });

    it('returns rose color class for scores < 60', () => {
      expect(getProgressColorClass(45)).toBe('bg-rose-500');
    });
  });

});
