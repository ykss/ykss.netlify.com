---
title: '[LeetCode] Combination Sum - DFS - 파이썬'
date: 2021-04-09 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

It is guaranteed that the number of unique combinations that sum up to target is less than 150 combinations for the given input.

### Example 1:

Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.

### Example 2:

Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]

### Example 3:

Input: candidates = [2], target = 1
Output: []

### Example 4:

Input: candidates = [1], target = 1
Output: [[1]]

### Example 5:

Input: candidates = [1], target = 2
Output: [[1,1]]

### Constraints:

1 <= candidates.length <= 30
1 <= candidates[i] <= 200
All elements of candidates are distinct.
1 <= target <= 500

---

### 내 코드

```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        results = []

        def dfs(csum, idx, path) :
            if csum < 0 :
                return
            if csum == 0 :
                results.append(path)
                return

            for i in range(idx, len(candidates)) :
                dfs(csum - candidates[i], i, path + [candidates[i]] )

        dfs(target, 0, [])

        return results
```

dfs를 통해서 처음에 타겟 넘버를 넣고, 그 다음 계속해서 타겟에서 해당 수를 빼고 배열에 수를 채워넣으면서 타겟넘버가 되는 경우를 만나면 결과 배열에 추가하여 답을 구했다.
