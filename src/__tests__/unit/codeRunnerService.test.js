import { describe, it, expect } from 'vitest';
import { executeCode, STARTER_TEMPLATES, SAMPLE_CODING_CHALLENGES } from '../../services/codeRunnerService';

describe('Code Execution Service Unit Tests', () => {

  describe('STARTER_TEMPLATES', () => {
    it('provides valid starter code templates for Java, Python, C++, JS, and C', () => {
      expect(STARTER_TEMPLATES.javascript).toContain('function twoSum');
      expect(STARTER_TEMPLATES.python).toContain('def twoSum');
      expect(STARTER_TEMPLATES.java).toContain('class Solution');
      expect(STARTER_TEMPLATES.cpp).toContain('class Solution');
      expect(STARTER_TEMPLATES.c).toContain('int* twoSum');
    });
  });

  describe('SAMPLE_CODING_CHALLENGES', () => {
    it('contains valid coding problem definitions with 3-tier hints', () => {
      expect(SAMPLE_CODING_CHALLENGES.length).toBeGreaterThan(0);
      const firstProblem = SAMPLE_CODING_CHALLENGES[0];
      expect(firstProblem.title).toBe('1. Two Sum');
      expect(firstProblem.hints.length).toBe(3);
      expect(firstProblem.sampleTestCases.length).toBeGreaterThan(0);
    });
  });

  describe('executeCode', () => {
    it('handles empty code submission by returning compilation error', async () => {
      const result = await executeCode('', 'javascript', []);
      expect(result.success).toBe(false);
      expect(result.compilationError).toContain('Compilation Error');
    });

    it('simulates test case execution for valid code', async () => {
      const code = STARTER_TEMPLATES.javascript;
      const testCases = SAMPLE_CODING_CHALLENGES[0].sampleTestCases;
      
      const result = await executeCode(code, 'javascript', testCases);
      expect(result.success).toBe(true);
      expect(result.allPassed).toBe(true);
      expect(result.testResults.length).toBe(testCases.length);
      expect(result.metrics.timeComplexity).toBe('O(N)');
    });
  });

});
