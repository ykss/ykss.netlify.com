---
title: '[LeetCode] Product of Array Except Self - 파이썬'
date: 2021-05-01 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

### Example 1:

Input: nums = [1,2,3,4]
Output: [24,12,8,6]

### Example 2:

Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]

### Constraints:

2 <= nums.length <= 105
-30 <= nums[i] <= 30
The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

---

### 내 코드(시간초과)

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        answers = []

        for num in nums :
            temp = nums[:]
            temp.remove(num)
            product = 1
            for i in range(len(temp)):
                product *= temp[i]
            answers.append(product)

        return answers
```

배열을 복사해서 해당 인덱스의 원소를 제거하고 남은 원소들의 곱을 차례대로 구했는데, 이 방법 같은 경우 O(n^2)이 나오기 때문에 시간 초과의 결과가 나와 통과하지 못했다.

### 정답 풀이

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        answers = []
        p = 1
        for i in range(0,len(nums)) :
            answers.append(p)
            p *= nums[i]

        p = 1
        for i in range(len(nums)-1,-1,-1) :
            answers[i] *= p
            p *= nums[i]

        return answers
```

이 방식은 왼쪽부터 곱셈 결과를 먼저 계산하고, 그 값에 오른쪽부터 계산한 값을 차례대로 곱하는 방식으로 시간복잡도 O(N)이다. 그리고 기존 `answer` 변수를 활용하면서 공간복잡도 O(1)에 풀 수 있다.
