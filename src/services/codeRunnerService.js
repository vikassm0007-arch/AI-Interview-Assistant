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
  },
  {
    id: 'container-with-most-water',
    title: '3. Container With Most Water',
    difficulty: 'Medium',
    topicTags: ['Two Pointers', 'Greedy', 'Arrays'],
    timeLimit: '2.0s',
    memoryLimit: '256 MB',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    hints: [
      { tier: 1, title: 'Hint 1: Two Pointer Scan', text: 'Start with maximum width (pointers at start and end).' },
      { tier: 2, title: 'Hint 2: Greedy Choice', text: 'Move the pointer pointing to the shorter line inward, as moving the taller line can never yield a larger area.' },
      { tier: 3, title: 'Hint 3: Optimal Complexity Target', text: 'Target Time Complexity: O(N), Target Auxiliary Space Complexity: O(1).' }
    ],
    sampleTestCases: [
      { id: 't1', input: 'height = [1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
      { id: 't2', input: 'height = [1,1]', expectedOutput: '1' }
    ],
    hiddenTestCases: [
      { id: 'h1', input: 'height = [4,3,2,1,4]', expectedOutput: '16' }
    ],
    optimalSolutions: {
      javascript: `function maxArea(height) {\n  let left = 0, right = height.length - 1, maxWater = 0;\n  while (left < right) {\n    const area = Math.min(height[left], height[right]) * (right - left);\n    maxWater = Math.max(maxWater, area);\n    if (height[left] < height[right]) left++; else right--;\n  }\n  return maxWater;\n}`,
      python: `class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        left, right, max_water = 0, len(height) - 1, 0\n        while left < right:\n            area = min(height[left], height[right]) * (right - left)\n            max_water = max(max_water, area)\n            if height[left] < height[right]:\n                left += 1\n            else:\n                right -= 1\n        return max_water`
    }
  },
  {
    id: 'coin-change',
    title: '4. Coin Change (Min Coins)',
    difficulty: 'Medium',
    topicTags: ['Dynamic Programming', 'BFS'],
    timeLimit: '2.0s',
    memoryLimit: '256 MB',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    hints: [
      { tier: 1, title: 'Hint 1: Subproblem Overlap', text: 'Let dp[i] be the minimum coins required for amount i.' },
      { tier: 2, title: 'Hint 2: Recurrence Relation', text: 'dp[i] = min(dp[i - coin] + 1) for all coins <= i.' },
      { tier: 3, title: 'Hint 3: Optimal Complexity Target', text: 'Target Time Complexity: O(N * amount), Space: O(amount).' }
    ],
    sampleTestCases: [
      { id: 't1', input: 'coins = [1,2,5], amount = 11', expectedOutput: '3' },
      { id: 't2', input: 'coins = [2], amount = 3', expectedOutput: '-1' },
      { id: 't3', input: 'coins = [1], amount = 0', expectedOutput: '0' }
    ],
    hiddenTestCases: [
      { id: 'h1', input: 'coins = [186,419,83,408], amount = 6249', expectedOutput: '20' }
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
