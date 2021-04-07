---
title: '[LeetCode] Combinations - DFS - 파이썬'
date: 2021-04-08 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given two integers n and k, return all possible combinations of k numbers out of the range [1, n].

You may return the answer in any order.

### Example 1:

Input: n = 4, k = 2
Output:
[
[2,4],
[3,4],
[2,3],
[1,2],
[1,3],
[1,4],
]

### Example 2:

Input: n = 1, k = 1
Output: [[1]]

### Constraints:

1 <= n <= 20
1 <= k <= n

---

### 내 코드

```python
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        return list(itertools.combinations(range(1,n+1),k))
```

`itertools` 모듈의 `combinations()`를 써서 쉽게 한줄로 구할 수 있었다.

### 다른 사람의 코드

```python
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        results = []

        def dfs(elements, start, k):
            if k == 0 :
                results.append(elements[:])

            for i in range(start,n+1) :
                elements.append(i)
                dfs(elements,i+1,k-1)
                elements.pop()

        dfs([],1,k)
        return results
```

dfs를 통해 풀었고, 재귀 방식의 dfs로 하였다. 이전의 순열문제와 유사하게 `elements[:]`로 값만 복사하여 결과 배열에 추가하였다. 이렇게 푸는 방법도 있지만, dfs를 이용하는 경우보다 itertools의 조합을 이용하는게 성능이 훨씬 좋다.
