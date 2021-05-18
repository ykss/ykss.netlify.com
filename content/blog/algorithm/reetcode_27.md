---
title: '[LeetCode] Daily Temperatures - 파이썬'
date: 2021-05-18 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given a list of daily temperatures temperatures, return a list such that, for each day in the input, tells you how many days you would have to wait until a warmer temperature. If there is no future day for which this is possible, put 0 instead.

For example, given the list of temperatures temperatures = [73, 74, 75, 71, 69, 72, 76, 73], your output should be [1, 1, 4, 2, 1, 1, 0, 0].

### Note

The length of temperatures will be in the range [1, 30000]. Each temperature will be an integer in the range [30, 100].

### 내 코드

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:

        answer = [0] * len(temperatures)
        stack = []

        for i, cur in enumerate(temperatures) :
            while stack and cur > temperatures[stack[-1]] :
                last = stack.pop()
                answer[last] = i - last
            stack.append(i)

        return answer
```

스택과 인덱스를 이용해서 푼 방법이다. 일단 스택에 인덱스를 저장한 후에, 해당 스택에 저장된 인덱스보다 현재 값이 클 경우에는 현재의 인덱스에서 해당 인덱스를 뺴서 일수를 계산하는 방식으로 하였다. 그렇게하면 따뜻해지기 위해 기다린 날의 계산이 가능하다.
