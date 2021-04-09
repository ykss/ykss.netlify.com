---
title: '[LeetCode] Subsets - DFS - 파이썬'
date: 2021-04-10 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an integer array nums of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.

### Example 1:

Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

### Example 2:

Input: nums = [0]
Output: [[],[0]]

### Constraints:

1 <= nums.length <= 10
-10 <= nums[i] <= 10
All the numbers of nums are unique.

---

### 내 코드

```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        results = []

        def dfs(idx, sub) :
            results.append(sub)
            for i in range(idx, len(nums)) :
                dfs(i+1,sub + [nums[i]])

        dfs(0,[])

        return results
```

빈 배열부터 시작해서 `nums` 배열의 수를 하나씩 넣어보면서 모든 경우의 수를 dfs를 통해 구하는 부분이다.
