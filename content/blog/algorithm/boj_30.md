---
title: '[BOJ] 적록색약 - BFS - 파이썬'
date: 2021-04-08 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

적록색약은 빨간색과 초록색의 차이를 거의 느끼지 못한다. 따라서, 적록색약인 사람이 보는 그림은 아닌 사람이 보는 그림과는 좀 다를 수 있다.

크기가 N×N인 그리드의 각 칸에 R(빨강), G(초록), B(파랑) 중 하나를 색칠한 그림이 있다. 그림은 몇 개의 구역으로 나뉘어져 있는데, 구역은 같은 색으로 이루어져 있다. 또, 같은 색상이 상하좌우로 인접해 있는 경우에 두 글자는 같은 구역에 속한다. (색상의 차이를 거의 느끼지 못하는 경우도 같은 색상이라 한다)

예를 들어, 그림이 아래와 같은 경우에

```
RRRBB
GGBBB
BBBRR
BBRRR
RRRRR
```

적록색약이 아닌 사람이 봤을 때 구역의 수는 총 4개이다. (빨강 2, 파랑 1, 초록 1) 하지만, 적록색약인 사람은 구역을 3개 볼 수 있다. (빨강-초록 2, 파랑 1)

그림이 입력으로 주어졌을 때, 적록색약인 사람이 봤을 때와 아닌 사람이 봤을 때 구역의 수를 구하는 프로그램을 작성하시오.

### 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 100)

둘째 줄부터 N개 줄에는 그림이 주어진다.

### 출력

적록색약이 아닌 사람이 봤을 때의 구역의 개수와 적록색약인 사람이 봤을 때의 구역의 수를 공백으로 구분해 출력한다.

### 예제 입출력

| 입력                                                | 출력 |
| --------------------------------------------------- | ---- |
| 5</br>RRRBB</br>GGBBB</br>BBBRR</br>BBRRR</br>RRRRR | 4 3  |

---

### 내 코드

```python
import collections

def bfs(i, j):
    direction = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    queue = collections.deque()
    queue.append([i, j])
    visited[i][j] = 1

    while queue:
        x, y = queue.popleft()
        for i in range(4):
            dx = x + direction[i][0]
            dy = y + direction[i][1]
            if (0 <= dx < N) and (0 <= dy < N) and visited[dx][dy] == 0 and board[dx][dy] == board[x][y]:
                queue.append([dx, dy])
                visited[dx][dy] = 1


N = int(input())
count = 0
board = [list(input()) for _ in range(N)]
visited = [[0] * N for _ in range(N)]
for i in range(N):
    for j in range(N):
        if visited[i][j] == 0:
            bfs(i, j)
            count += 1

for i in range(N):
    for j in range(N):
        if board[i][j] == 'G':
            board[i][j] = 'R'

count_two = 0
visited = [[0] * N for _ in range(N)]
for i in range(N):
    for j in range(N):
        if visited[i][j] == 0:
            bfs(i, j)
            count_two += 1
print(count, count_two)
```

먼저 주어진 `input`을 `board`로 받은 후에, 방문 여부를 표시하는 같은 크기의 배열인 `visited`를 만들었다. 그리고 (0,0)부터 아직 방문하지 않은 좌표에 대해 bfs를 통해 구했다. 그리고 네 방향에 대해서 탐색하면서 같은 색깔일 경우, 큐에 넣고 계속 탐색하게 하여 총 구역의 개수를 구했고, 그 이후에는 적록색약의 개수를 구해야해서 단순하게 기존 `board`의 녹색을 빨간색으로 바꾼 후에 다시 한번 bfs를 돌려서 구했다.
