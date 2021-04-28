---
title: '[LeetCode] 3Sum - 파이썬'
date: 2021-04-29 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

### Example 1:

Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]

### Example 2:

Input: nums = []
Output: []

### Example 3:

Input: nums = [0]
Output: []

### Constraints:

0 <= nums.length <= 3000
-105 <= nums[i] <= 105

---

### 내 코드 (시간초과 풀이)

```python
from itertools import combinations

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        comb = list(combinations(nums, 3))
        answer = []
        for x, y, z in comb :
            if x+y+z == 0 :
                temp = [x,y,z]
                temp.sort()
                if temp not in answer :
                    answer.append(temp)
        answer.sort(key = lambda x : (x[0],x[1],x[2]))
        return answer

```

`combinations()`로 모든 조합을 구해서 세 수의 합이 0이고, 중복인 경우 제거해서 정답배열에 추가한 후에 또 정렬을 하였는데, 풀면서도 시간 초과가 날거라고 생각했는데 역시 테스트 케이스는 통과했지만 제출 결과 시간초과가 나서 실패했다.

### 맞은 코드(투포인터)

```python
from itertools import combinations

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        answer = []
        nums.sort()

        for i in range(len(nums)-2) :
            if i > 0 and nums[i] == nums[i-1] :
                continue
            left, right = i+1, len(nums)-1
            while left < right :
                sum = nums[i] + nums[left] + nums[right]
                if sum < 0 :
                    left += 1
                elif sum > 0 :
                    right -= 1
                else :
                    answer.append([nums[i],nums[left],nums[right]])
                    while left < right and nums[left] == nums[left+1] :
                        left += 1
                    while left < right and nums[right] == nums[right-1]:
                        right -= 1
                    left += 1
                    right -= 1
        return answer
```

먼저 주어진 배열을 정리 한 후에 투 포인터를 쓰기 위해서 `len(num)-2`까지 for문을 돌린다. 그리고 연속된 중복된 숫자가 나오게되면 continue문으로 i를 증가시키고, 아닐경우엔 투 포인터를 사용한다. i와 두개의 포인터를 더한 값이 0보다 적으면 왼쪽 포인터를 하나 전진시키고 0보다 크면 오른쪽포인터를 왼쪽으로 이동시킨다. 그리고 만약 합이 0이 나오면 정답 배열에 추가하고, 포인터를 다시 이동시키는 과정을 반복한다. 이렇게 풀면 시간초과가 뜨지 않는다.
