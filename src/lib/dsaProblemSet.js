// PARICHAYA AURA — DSA Problem Set
// Exactly 30 Real, Functional Coding Challenges: 10 Easy, 10 Medium, 10 Hard

export const DSA_PROBLEMS = [
  // =================== 10 EASY PROBLEMS ===================
  {
    id: 'easy-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays & Hashing',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume exactly one valid solution exists.',
    functionName: 'twoSum',
    initialCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] }
    ],
    referenceUrl: 'https://leetcode.com/problems/two-sum/'
  },
  {
    id: 'easy-2',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    topic: 'Strings & Hashing',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    functionName: 'isAnagram',
    initialCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true },
      { input: ['rat', 'car'], expected: false },
      { input: ['a', 'a'], expected: true }
    ],
    referenceUrl: 'https://leetcode.com/problems/valid-anagram/'
  },
  {
    id: 'easy-3',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    functionName: 'isPalindrome',
    initialCode: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = clean.length - 1;
  while (l < r) {
    if (clean[l] !== clean[r]) return false;
    l++;
    r--;
  }
  return true;
}`,
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [' '], expected: true }
    ],
    referenceUrl: 'https://leetcode.com/problems/valid-palindrome/'
  },
  {
    id: 'easy-4',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'Sliding Window / Greedy',
    description: 'Given an array prices where prices[i] is the price of a given stock on the ith day, return the maximum profit you can achieve from this transaction. If no profit can be achieved, return 0.',
    functionName: 'maxProfit',
    initialCode: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;
    else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
  }
  return maxProfit;
}`,
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[2, 4, 1]], expected: 2 }
    ],
    referenceUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
  },
  {
    id: 'easy-5',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    functionName: 'isValid',
    initialCode: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: ['()[]{}'], expected: true },
      { input: ['(]'], expected: false },
      { input: ['{[]}'], expected: true }
    ],
    referenceUrl: 'https://leetcode.com/problems/valid-parentheses/'
  },
  {
    id: 'easy-6',
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Binary Search',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
    functionName: 'search',
    initialCode: `function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}`,
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 }
    ],
    referenceUrl: 'https://leetcode.com/problems/binary-search/'
  },
  {
    id: 'easy-7',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    topic: 'Arrays & Hashing',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    functionName: 'containsDuplicate',
    initialCode: `function containsDuplicate(nums) {
  const set = new Set(nums);
  return set.size !== nums.length;
}`,
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
    ],
    referenceUrl: 'https://leetcode.com/problems/contains-duplicate/'
  },
  {
    id: 'easy-8',
    title: 'Reverse String In-Place',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    description: 'Write a function that reverses a string represented as an array of characters. You must do this by modifying the input array in-place.',
    functionName: 'reverseString',
    initialCode: `function reverseString(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    const tmp = s[l];
    s[l] = s[r];
    s[r] = tmp;
    l++;
    r--;
  }
  return s;
}`,
    testCases: [
      { input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'] },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], expected: ['h', 'a', 'n', 'n', 'a', 'H'] }
    ],
    referenceUrl: 'https://leetcode.com/problems/reverse-string/'
  },
  {
    id: 'easy-9',
    title: 'Find Pivot Index (Prefix Sum)',
    difficulty: 'Easy',
    topic: 'Prefix Sum',
    description: 'Given an array of integers nums, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index\'s right.',
    functionName: 'pivotIndex',
    initialCode: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (leftSum === total - leftSum - nums[i]) return i;
    leftSum += nums[i];
  }
  return -1;
}`,
    testCases: [
      { input: [[1, 7, 3, 6, 5, 6]], expected: 3 },
      { input: [[1, 2, 3]], expected: -1 },
      { input: [[2, 1, -1]], expected: 0 }
    ],
    referenceUrl: 'https://leetcode.com/problems/find-pivot-index/'
  },
  {
    id: 'easy-10',
    title: 'Single Number (Bit Manipulation)',
    difficulty: 'Easy',
    topic: 'Bit Manipulation',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one using linear runtime complexity and constant space.',
    functionName: 'singleNumber',
    initialCode: `function singleNumber(nums) {
  let res = 0;
  for (const n of nums) {
    res ^= n;
  }
  return res;
}`,
    testCases: [
      { input: [[2, 2, 1]], expected: 1 },
      { input: [[4, 1, 2, 1, 2]], expected: 4 },
      { input: [[1]], expected: 1 }
    ],
    referenceUrl: 'https://leetcode.com/problems/single-number/'
  },

  // =================== 10 MEDIUM PROBLEMS ===================
  {
    id: 'med-1',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    functionName: 'lengthOfLongestSubstring',
    initialCode: `function lengthOfLongestSubstring(s) {
  let maxLen = 0;
  let l = 0;
  const set = new Set();
  for (let r = 0; r < s.length; r++) {
    while (set.has(s[r])) {
      set.delete(s[l]);
      l++;
    }
    set.add(s[r]);
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
}`,
    testCases: [
      { input: ['abcabcbb'], expected: 3 },
      { input: ['bbbbb'], expected: 1 },
      { input: ['pwwkew'], expected: 3 }
    ],
    referenceUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
  },
  {
    id: 'med-2',
    title: '3Sum',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    functionName: 'threeSum',
    initialCode: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++;
        r--;
      } else if (sum < 0) {
        l++;
      } else {
        r--;
      }
    }
  }
  return res;
}`,
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { input: [[0, 1, 1]], expected: [] },
      { input: [[0, 0, 0]], expected: [[0, 0, 0]] }
    ],
    referenceUrl: 'https://leetcode.com/problems/3sum/'
  },
  {
    id: 'med-3',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topic: 'Arrays & Hashing',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    functionName: 'groupAnagrams',
    initialCode: `function groupAnagrams(strs) {
  const map = {};
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map[key]) map[key] = [];
    map[key].push(s);
  }
  return Object.values(map);
}`,
    testCases: [
      { input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] },
      { input: [['']], expected: [['']] },
      { input: [['a']], expected: [['a']] }
    ],
    referenceUrl: 'https://leetcode.com/problems/group-anagrams/'
  },
  {
    id: 'med-4',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    topic: 'Heap / Bucket Sort',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements.',
    functionName: 'topKFrequent',
    initialCode: `function topKFrequent(nums, k) {
  const map = new Map();
  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(e => e[0]);
}`,
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: [[1], 1], expected: [1] }
    ],
    referenceUrl: 'https://leetcode.com/problems/top-k-frequent-elements/'
  },
  {
    id: 'med-5',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    topic: 'Prefix & Suffix Products',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Do it in O(n) without division.',
    functionName: 'productExceptSelf',
    initialCode: `function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
    ],
    referenceUrl: 'https://leetcode.com/problems/product-of-array-except-self/'
  },
  {
    id: 'med-6',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    description: 'Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai). Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    functionName: 'maxArea',
    initialCode: `function maxArea(height) {
  let l = 0, r = height.length - 1;
  let max = 0;
  while (l < r) {
    const area = Math.min(height[l], height[r]) * (r - l);
    max = Math.max(max, area);
    if (height[l] < height[r]) l++;
    else r--;
  }
  return max;
}`,
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { input: [[1, 1]], expected: 1 }
    ],
    referenceUrl: 'https://leetcode.com/problems/container-with-most-water/'
  },
  {
    id: 'med-7',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    topic: 'Monotonic Stack',
    description: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
    functionName: 'dailyTemperatures',
    initialCode: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const res = new Array(n).fill(0);
  const stack = []; // indices
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      res[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }
  return res;
}`,
    testCases: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { input: [[30, 60, 90]], expected: [1, 1, 0] }
    ],
    referenceUrl: 'https://leetcode.com/problems/daily-temperatures/'
  },
  {
    id: 'med-8',
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    description: 'Given an integer array coins representing coins of different denominations and an integer amount, return the fewest number of coins that you need to make up that amount. If not possible, return -1.',
    functionName: 'coinChange',
    initialCode: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 }
    ],
    referenceUrl: 'https://leetcode.com/problems/coin-change/'
  },
  {
    id: 'med-9',
    title: 'Number of Islands',
    difficulty: 'Medium',
    topic: 'Graphs & BFS/DFS',
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    functionName: 'numIslands',
    initialCode: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  let count = 0;
  const rows = grid.length, cols = grid[0].length;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
    testCases: [
      {
        input: [[
          ['1', '1', '1', '1', '0'],
          ['1', '1', '0', '1', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '0', '0', '0']
        ]],
        expected: 1
      },
      {
        input: [[
          ['1', '1', '0', '0', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1']
        ]],
        expected: 3
      }
    ],
    referenceUrl: 'https://leetcode.com/problems/number-of-islands/'
  },
  {
    id: 'med-10',
    title: 'Maximum Subarray (Kadane’s)',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    functionName: 'maxSubArray',
    initialCode: `function maxSubArray(nums) {
  let curr = nums[0];
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    max = Math.max(max, curr);
  }
  return max;
}`,
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 }
    ],
    referenceUrl: 'https://leetcode.com/problems/maximum-subarray/'
  },

  // =================== 10 HARD PROBLEMS ===================
  {
    id: 'hard-1',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Two Pointers & Monotonic',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    functionName: 'trap',
    initialCode: `function trap(height) {
  let l = 0, r = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let trapped = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= leftMax) leftMax = height[l];
      else trapped += leftMax - height[l];
      l++;
    } else {
      if (height[r] >= rightMax) rightMax = height[r];
      else trapped += rightMax - height[r];
      r--;
    }
  }
  return trapped;
}`,
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 }
    ],
    referenceUrl: 'https://leetcode.com/problems/trapping-rain-water/'
  },
  {
    id: 'hard-2',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    topic: 'Monotonic Queue / Deque',
    description: 'Given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max in each sliding window.',
    functionName: 'maxSlidingWindow',
    initialCode: `function maxSlidingWindow(nums, k) {
  const deque = []; // store indices
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
}`,
    testCases: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { input: [[1], 1], expected: [1] }
    ],
    referenceUrl: 'https://leetcode.com/problems/sliding-window-maximum/'
  },
  {
    id: 'hard-3',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    topic: 'Binary Search',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    functionName: 'findMedianSortedArrays',
    initialCode: `function findMedianSortedArrays(nums1, nums2) {
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const mid = Math.floor(merged.length / 2);
  return merged.length % 2 !== 0 ? merged[mid] : (merged[mid - 1] + merged[mid]) / 2;
}`,
    testCases: [
      { input: [[1, 3], [2]], expected: 2 },
      { input: [[1, 2], [3, 4]], expected: 2.5 }
    ],
    referenceUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
  },
  {
    id: 'hard-4',
    title: 'Longest Valid Parentheses',
    difficulty: 'Hard',
    topic: 'Dynamic Programming & Stack',
    description: 'Given a string containing just the characters \'(\' and \')\', return the length of the longest valid (well-formed) parentheses substring.',
    functionName: 'longestValidParentheses',
    initialCode: `function longestValidParentheses(s) {
  const stack = [-1];
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (!stack.length) {
        stack.push(i);
      } else {
        maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
      }
    }
  }
  return maxLen;
}`,
    testCases: [
      { input: ['(()'], expected: 2 },
      { input: [')()())'], expected: 4 },
      { input: [''], expected: 0 }
    ],
    referenceUrl: 'https://leetcode.com/problems/longest-valid-parentheses/'
  },
  {
    id: 'hard-5',
    title: 'Edit Distance (Levenshtein)',
    difficulty: 'Hard',
    topic: '2D Dynamic Programming',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, or replace character).',
    functionName: 'minDistance',
    initialCode: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    testCases: [
      { input: ['horse', 'ros'], expected: 3 },
      { input: ['intention', 'execution'], expected: 5 }
    ],
    referenceUrl: 'https://leetcode.com/problems/edit-distance/'
  },
  {
    id: 'hard-6',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    topic: 'Heap & Divide and Conquer',
    description: 'You are given an array of k sorted arrays, each sorted in ascending order. Merge all the sorted arrays into one sorted array and return it.',
    functionName: 'mergeKLists',
    initialCode: `function mergeKLists(lists) {
  const flat = [];
  for (const arr of lists) {
    flat.push(...arr);
  }
  return flat.sort((a, b) => a - b);
}`,
    testCases: [
      { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { input: [[]], expected: [] },
      { input: [[[]]], expected: [] }
    ],
    referenceUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/'
  },
  {
    id: 'hard-7',
    title: 'Word Ladder',
    difficulty: 'Hard',
    topic: 'Graph BFS & Shortest Path',
    description: 'A transformation sequence from word beginWord to word endWord is a sequence of words where each adjacent pair differs by one letter. Return the number of words in the shortest transformation sequence.',
    functionName: 'ladderLength',
    initialCode: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const queue = [[beginWord, 1]];
  while (queue.length) {
    const [word, len] = queue.shift();
    if (word === endWord) return len;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (wordSet.has(next)) {
          wordSet.delete(next);
          queue.push([next, len + 1]);
        }
      }
    }
  }
  return 0;
}`,
    testCases: [
      { input: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
      { input: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 }
    ],
    referenceUrl: 'https://leetcode.com/problems/word-ladder/'
  },
  {
    id: 'hard-8',
    title: 'First Missing Positive',
    difficulty: 'Hard',
    topic: 'Cycle Sort & Arrays',
    description: 'Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums in O(n) time and O(1) auxiliary space.',
    functionName: 'firstMissingPositive',
    initialCode: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const correctIdx = nums[i] - 1;
      const tmp = nums[i];
      nums[i] = nums[correctIdx];
      nums[correctIdx] = tmp;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
    testCases: [
      { input: [[1, 2, 0]], expected: 3 },
      { input: [[3, 4, -1, 1]], expected: 2 },
      { input: [[7, 8, 9, 11, 12]], expected: 1 }
    ],
    referenceUrl: 'https://leetcode.com/problems/first-missing-positive/'
  },
  {
    id: 'hard-9',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    topic: 'Monotonic Stack',
    description: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    functionName: 'largestRectangleArea',
    initialCode: `function largestRectangleArea(heights) {
  const stack = [];
  let maxArea = 0;
  const h = [...heights, 0];
  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[stack[stack.length - 1]] > h[i]) {
      const height = h[stack.pop()];
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
    testCases: [
      { input: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { input: [[2, 4]], expected: 4 }
    ],
    referenceUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/'
  },
  {
    id: 'hard-10',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    topic: '2D Dynamic Programming',
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
    functionName: 'isMatch',
    initialCode: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j += 2) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2] || (dp[i - 1][j] && (p[j - 2] === '.' || p[j - 2] === s[i - 1]));
      } else {
        dp[i][j] = dp[i - 1][j - 1] && (p[j - 1] === '.' || p[j - 1] === s[i - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    testCases: [
      { input: ['aa', 'a'], expected: false },
      { input: ['aa', 'a*'], expected: true },
      { input: ['ab', '.*'], expected: true }
    ],
    referenceUrl: 'https://leetcode.com/problems/regular-expression-matching/'
  }
];
