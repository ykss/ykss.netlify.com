---
title: '[LeetCode] Permutations - DFS - 파이썬'
date: 2021-04-07 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

### Example 1:

Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

### Example 2:

Input: nums = [0,1]
Output: [[0,1],[1,0]]

### Example 3:

Input: nums = [1]
Output: [[1]]

### Constraints:

1 <= nums.length <= 6
-10 <= nums[i] <= 10
All the integers of nums are unique.

---

### 내 코드

```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        if not nums :
            return []

        results = []
        prev_elements = []

        def dfs(elements) :
            if len(elements) == 0 :
                results.append(prev_elements[:])

            for element in elements :
                next_elements = elements[:]
                next_elements.remove(element)
                prev_elements.append(element)
                dfs(next_elements)
                prev_elements.pop()

        dfs(nums)
        return results
```

해당 부분은 dfs로 구현했는데, 가능한 모든 경우를 구하면 되는 것이다. 포인트는 `prev_elements[:]`와 같이 직접 배열 자체를 넘겨서 참조 관계가 갖지 않도록 복사하여 넘기는 형태로 하는 것이다. 이렇게 하지 않으면 참조된 값이 변경 될 때 같이 변경될 수 있기 때문에 원하는 결과를 얻지 못할 수 있다.

### 다른 사람의 코드

```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        return list(map(list,itertools.permutations(nums)))
```

해당 문제는 `itertools` 모듈의 `permutations()`를 이용하면 간단히 풀 수 있는 문제이다. 실제로 위 코드보다 효율성과 성능 면에서 훨씬 낫다고 할 수 있다.
