/**
 * Code Execution Service & Mock Compilation Engine
 * Simulates code compilation, test case verification, runtime metrics, and AI complexity evaluation
 * for Java, Python, C++, JavaScript, and C.
 */

export const STARTER_TEMPLATES = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,

  python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        hashmap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hashmap:
                return [hashmap[complement], i]
            hashmap[num] = i
        return []`,

  java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,

  cpp: `#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,

  c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}`
};

export const SAMPLE_CODING_CHALLENGES = [
  {
    id: 'two-sum',
    title: '1. Two Sum',
    difficulty: 'Easy',
    topicTags: ['Arrays', 'Hash Table'],
    timeLimit: '2.0s',
    memoryLimit: '256 MB',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      { tier: 1, title: 'Hint 1: Conceptual Approach', text: 'A brute force solution uses nested loops in O(N^2) time. Can you use a hash map to look up complements in O(1) time?' },
      { tier: 2, title: 'Hint 2: Data Structure Selection', text: 'Iterate through the array while storing each number\'s value and its index inside a Hash Table / Map.' },
      { tier: 3, title: 'Hint 3: Optimal Complexity Target', text: 'Target Time Complexity: O(N), Target Auxiliary Space Complexity: O(N).' }
    ],
    sampleTestCases: [
      { id: 't1', input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]' },
      { id: 't2', input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]' },
      { id: 't3', input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]' }
    ],
    hiddenTestCases: [
      { id: 'h1', input: 'nums = [1,5,9,14,22], target = 23', expectedOutput: '[0, 4]' },
      { id: 'h2', input: 'nums = [-3,4,3,90], target = 0', expectedOutput: '[0, 2]' }
    ],
    optimalSolutions: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i`
    }
  },
  {
    id: 'valid-palindrome',
    title: '2. Valid Palindrome',
    difficulty: 'Easy',
    topicTags: ['Two Pointers', 'String'],
    timeLimit: '2.0s',
    memoryLimit: '256 MB',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    hints: [
      { tier: 1, title: 'Hint 1: Conceptual Approach', text: 'Use two pointers starting at the beginning and end of the string.' },
      { tier: 2, title: 'Hint 2: Character Skipping', text: 'Skip non-alphanumeric characters moving inward until left < right pointers match.' },
      { tier: 3, title: 'Hint 3: Optimal Complexity Target', text: 'Target Time Complexity: O(N), Target Auxiliary Space Complexity: O(1).' }
    ],
    sampleTestCases: [
      { id: 't1', input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { id: 't2', input: 's = "race a car"', expectedOutput: 'false' },
      { id: 't3', input: 's = " "', expectedOutput: 'true' }
    ],
    hiddenTestCases: [
      { id: 'h1', input: 's = "0P"', expectedOutput: 'false' }
    ]
  }
];

/**
 * Simulates code execution against test cases
 * @param {string} code - User written code
 * @param {string} language - Selected programming language
 * @param {Array} testCases - Array of test cases to run against
 * @returns {Promise<object>} Execution results
 */
export async function executeCode(code, language, testCases) {
  // Simulate compilation delay
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!code || code.trim().length < 10) {
    return {
      success: false,
      compilationError: `Compilation Error: Unexpected end of input. Empty code body submitted for ${language.toUpperCase()}.`,
      testResults: []
    };
  }

  // Check for basic syntax issues
  if (code.includes('SYNTAX_ERROR') || code.includes('import sys_error')) {
    return {
      success: false,
      compilationError: `SyntaxError in ${language}: Invalid syntax at line 4 column 12. Unmatched bracket context.`,
      testResults: []
    };
  }

  // Simulate test case verification
  const results = testCases.map((tc, index) => {
    const runtimeMs = (Math.random() * 25 + 5).toFixed(1);
    const memoryMb = (Math.random() * 4 + 14).toFixed(1);
    
    // Simulate pass unless code has explicitly buggy text
    const isPassed = !code.includes('FAIL_CASE');

    return {
      id: tc.id || `tc-${index}`,
      passed: isPassed,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: isPassed ? tc.expectedOutput : '[]',
      runtimeMs: `${runtimeMs} ms`,
      memoryMb: `${memoryMb} MB`
    };
  });

  const allPassed = results.every(r => r.passed);

  return {
    success: true,
    allPassed,
    compilationError: null,
    testResults: results,
    metrics: {
      timeComplexity: allPassed ? 'O(N)' : 'O(N^2)',
      spaceComplexity: 'O(N)',
      overallRuntime: `${(Math.random() * 15 + 10).toFixed(1)} ms`,
      memoryConsumed: '18.4 MB',
      readabilityScore: '92/100'
    }
  };
}
