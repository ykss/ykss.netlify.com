---
title: '[BOJ] 그림 - BFS - 파이썬'
date: 2021-04-11 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

어떤 큰 도화지에 그림이 그려져 있을 때, 그 그림의 개수와, 그 그림 중 넓이가 가장 넓은 것의 넓이를 출력하여라. 단, 그림이라는 것은 1로 연결된 것을 한 그림이라고 정의하자. 가로나 세로로 연결된 것은 연결이 된 것이고 대각선으로 연결이 된 것은 떨어진 그림이다. 그림의 넓이란 그림에 포함된 1의 개수이다.

### 입력

첫째 줄에 도화지의 세로 크기 n(1 ≤ n ≤ 500)과 가로 크기 m(1 ≤ m ≤ 500)이 차례로 주어진다. 두 번째 줄부터 n+1 줄 까지 그림의 정보가 주어진다. (단 그림의 정보는 0과 1이 공백을 두고 주어지며, 0은 색칠이 안된 부분, 1은 색칠이 된 부분을 의미한다)

### 출력

첫째 줄에는 그림의 개수, 둘째 줄에는 그 중 가장 넓은 그림의 넓이를 출력하여라. 단, 그림이 하나도 없는 경우에는 가장 넓은 그림의 넓이는 0이다.

### 예제 입출력

| 입력                                                                                    | 출력    |
| --------------------------------------------------------------------------------------- | ------- |
| 6 5</br>1 1 0 1 1</br>0 1 1 0 0</br>0 0 0 0 0</br>1 0 1 1 1</br>0 0 1 1 1</br>0 0 1 1 1 | 4</br>9 |

---

### 내 코드

```python
from collections import deque


def bfs(i, j):
    direction = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    queue = deque()
    queue.append([i, j])
    visited[i][j] = 1
    count = 1

    while queue:
        x, y = queue.popleft()
        for i in range(4):
            nx = x + direction[i][0]
            ny = y + direction[i][1]
            if 0 <= nx < h and 0 <= ny < w:
                if board[nx][ny] == 1 and visited[nx][ny] == 0:
                    queue.append([nx, ny])
                    board[nx][ny] = board[x][y] + 1
                    visited[nx][ny] = 1
                    count += 1
    results.append(count)


h, w = map(int, input().split())

board = [list(map(int, input().split())) for _ in range(h)]
visited = [[0]*w for _ in range(h)]

results = []

for i in range(h):
    for j in range(w):
        if board[i][j] == 1:
            bfs(i, j)

print(len(results))
if len(results) == 0:
    results.append(0)
print(max(results))
```

일반적인 BFS대로 하면되었고, `count`변수를 두어서 그림이 몇개 있고, 넓이가 얼마인지를 구할 수 있었다. 마지막 부분에서만 그림의 개수가 0인 경우 넓이도 0으로 출력하도록 처리했다.
