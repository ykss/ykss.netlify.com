---
title: '[BOJ] 숨바꼭질 - BFS - 파이썬'
date: 2021-04-12 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

수빈이는 동생과 숨바꼭질을 하고 있다. 수빈이는 현재 점 N(0 ≤ N ≤ 100,000)에 있고, 동생은 점 K(0 ≤ K ≤ 100,000)에 있다. 수빈이는 걷거나 순간이동을 할 수 있다. 만약, 수빈이의 위치가 X일 때 걷는다면 1초 후에 X-1 또는 X+1로 이동하게 된다. 순간이동을 하는 경우에는 1초 후에 2\*X의 위치로 이동하게 된다.

수빈이와 동생의 위치가 주어졌을 때, 수빈이가 동생을 찾을 수 있는 가장 빠른 시간이 몇 초 후인지 구하는 프로그램을 작성하시오.

### 입력

첫 번째 줄에 수빈이가 있는 위치 N과 동생이 있는 위치 K가 주어진다. N과 K는 정수이다.

### 출력

수빈이가 동생을 찾는 가장 빠른 시간을 출력한다.

### 예제 입출력

| 입력 | 출력 |
| ---- | ---- |
| 5 17 | 4    |

---

### 내 코드

```python
from collections import deque


def bfs():
    queue = deque()
    queue.append(N)
    while queue:
        cur = queue.popleft()
        if cur == K:
            print(line[cur])
            return
        for i in [cur+1, cur-1, cur*2]:
            if 0 <= i < MAX and line[i] == 0:
                line[i] = line[cur]+1
                queue.append(i)


MAX = 100001
line = [0] * MAX

N, K = map(int, input().split())
bfs()
```

이 문제에서 일반적인 bfs 문제와 큰 차이는 오히려 1차원 배열이었다. 그래서 일직선을 만들고 하나의 배열로 진행하면 되었다. 대신 배열을 최대 크기 만큼 선언 해준 후에 첫 위치를 큐에 넣어서 시작하는데, 특이점은 그냥 이동도 있고, 순간이동도 있었다. 이것을 `for`문을 통해서 할 수 있었다. 이런식으로 `K`를 찾을때까지 bfs를 돌려 답을 구했다.
