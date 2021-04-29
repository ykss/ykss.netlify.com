---
title: '[LeetCode] Array Partition I - 파이썬'
date: 2021-04-30 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an integer array nums of 2n integers, group these integers into n pairs (a1, b1), (a2, b2), ..., (an, bn) such that the sum of min(ai, bi) for all i is maximized. Return the maximized sum.

### Example 1:

Input: nums = [1,4,3,2]
Output: 4
Explanation: All possible pairings (ignoring the ordering of elements) are:

1. (1, 4), (2, 3) -> min(1, 4) + min(2, 3) = 1 + 2 = 3
2. (1, 3), (2, 4) -> min(1, 3) + min(2, 4) = 1 + 2 = 3
3. (1, 2), (3, 4) -> min(1, 2) + min(3, 4) = 1 + 3 = 4
   So the maximum possible sum is 4.

### Example 2:

Input: nums = [6,2,6,5,1,2]
Output: 9
Explanation: The optimal pairing is (2, 1), (2, 5), (6, 6). min(2, 1) + min(2, 5) + min(6, 6) = 1 + 2 + 6 = 9.

### Constraints:

1 <= n <= 104
nums.length == 2 \* n
-104 <= nums[i] <= 104

---

### 내 코드

```python
class Solution:
    def arrayPairSum(self, nums: List[int]) -> int:
        answers = []
        nums.sort()
        sum = 0

        for num in nums :
            answers.append(num)
            if len(answers) == 2 :
                sum += min(answers)
                answers = []

        return sum

```

이 풀이 방법은 주어진 배열을 오름차 순으로 정리하여서 순서대로 페어를 만들고 그 페어들의 최솟값을 더하여 `sum`을 구하는 방식이다. 이렇게 하기 위해서는 먼저 오름차순일 경우(또는 내림차순), 순서대로 페어를 만든 결과가 가장 클 것이라는 패턴을 발견해야 한다. 단순히 문제를 푸는 방법에만 집중할 것이 아니라 문제를 보고 그 문제의 패턴을 발견하는 것이 매우 중요하다는 생각이 들었다.

### 다른 풀이

```python
class Solution:
    def arrayPairSum(self, nums: List[int]) -> int:
        return sum(sorted(nums)[::2])
```

이 방법은 매우 파이써닉한 방법이었다. 그리고 아이디어 자체도 좋은게 정렬한 후에 페어를 만들어 최솟값을 구하여 더할 필요 없이 이미 정렬 된 값들이기 때문에 짝수 인덱스의 값들의 합이 정답이기 때문이다. 이 부분에서 짝수 인덱스만 더하기 위해서 슬라이싱을 써서 풀이한게 매우 파이썬스러운 풀이라고 느껴졌다. 문제를 보고 이렇게까지 생각하도록 많이 풀어보고 사고의 유연함을 늘려야겠다.
