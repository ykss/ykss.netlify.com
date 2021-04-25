---
title: '[LeetCode] Fibonacci Number - DFS - 파이썬'
date: 2021-04-26 01:00:00
category: 'Algorithm'
draft: false
---

### Description

The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.
Given n, calculate F(n).

### Example 1:

Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.

### Example 2:

Input: n = 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.

### Example 3:

Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.

### Constraints:

0 <= n <= 30

---

### 내 코드

```python
class Solution:
    def fib(self, n: int) -> int:
        dp = collections.defaultdict(int)
        dp[0] = 0
        dp[1] = 1
        for i in range(2,n+1) :
            dp[i] = dp[i-1]+dp[i-2]
        return dp[n]
```

다이나믹 프로그래밍의 쌩 기초 문제이고, bottom-up 방식으로 타뷸레이션을 통해 풀었다. 주의할 점은 dp를 할 때, 이렇게 defaultdict 자료형을 사용해주어야 한다는 것을 기억하자.

### 다른 사람의 코드

```python
class Solution:
    def fib(self, n: int) -> int:
        x, y = 0, 1
        for i in range(0,n) :
            x, y = y, x+y
        return x
```

이렇게 하면 더 간단하게 풀 수 있고, 시간복잡도는 같지만, 공간 복잡도는 줄어드는 매우 효율적인 방식이다.
