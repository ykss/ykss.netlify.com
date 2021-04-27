---
title: '[LeetCode] Two Sum - 파이썬'
date: 2021-04-27 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Output: Because nums[0] + nums[1] == 9, we return [0, 1].

### Example 2:

Input: nums = [3,2,4], target = 6
Output: [1,2]

### Example 3:

Input: nums = [3,3], target = 6
Output: [0,1]

### Constraints:

2 <= nums.length <= 103
-109 <= nums[i] <= 109
-109 <= target <= 109
Only one valid answer exists.

---

### 내 코드

```python
from itertools import combinations

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        comb = list(combinations(nums,2))
        answer = []
        for i, j in comb :
            if i+j == target :
                if i == j :
                    answer.append(nums.index(i))
                    nums.remove(i)
                    answer.append(nums.index(j)+1)
                else :
                    answer.append(nums.index(i))
                    answer.append(nums.index(j))
        return answer
```

일단 문제를 접근하는 방법 자체를 더 쉽게 풀 수 있는 문제인 것 같은데, 너무 복잡하게 접근 한 것 같다. 먼저 두 수의 합을 구하기 위해서 배열에서 모든 경우의 조합을 `itertools`의 `combinations`를 통해서 구했고, 해당 조합의 합을 구해서 `target`과 같으면 해당 수의 인덱스를 찾아서 정답배열에 넣도록 하였다. 여기서 하나 문제점이 같은 수를 더하는 경우에는 두번 다 같은 인덱스를 찾는 문제가 있어 같은 경우에만 다르게 처리하도록 했다.

### 다른 사람의 코드

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        nums_map = {}
        for i, num in enumerate(nums) :
            if target - num in nums_map :
                return [nums_map[target-num], i]
            nums_map[num] = i
```

이 방식은 딕셔너리로 저장하고, 저장하면서 조회하여 답을 찾는 방식이다. `target-num`의 값이 `nums_map` 딕셔너리 키 값 중에 존재하면 해당 인덱스를 출력하는 방식이었다. 내가 기존 풀었던 방식에 비해 속도와 메모리 효율성 모두 훨씬 좋았다. 딕셔너리를 더 활용하는 것을 연습해야겠다.
