---
title: '[BOJ] 미로 탐색 - BFS - 파이썬'
date: 2021-04-05 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

N×M크기의 배열로 표현되는 미로가 있다.

```
1 0 1 1 1 1
1 0 1 0 1 0
1 0 1 0 1 1
1 1 1 0 1 1
```

미로에서 1은 이동할 수 있는 칸을 나타내고, 0은 이동할 수 없는 칸을 나타낸다. 이러한 미로가 주어졌을 때, (1, 1)에서 출발하여 (N, M)의 위치로 이동할 때 지나야 하는 최소의 칸 수를 구하는 프로그램을 작성하시오. 한 칸에서 다른 칸으로 이동할 때, 서로 인접한 칸으로만 이동할 수 있다.

위의 예에서는 15칸을 지나야 (N, M)의 위치로 이동할 수 있다. 칸을 셀 때에는 시작 위치와 도착 위치도 포함한다.

### 입력

첫째 줄에 두 정수 N, M(2 ≤ N, M ≤ 100)이 주어진다. 다음 N개의 줄에는 M개의 정수로 미로가 주어진다. 각각의 수들은 붙어서 입력으로 주어진다.

### 출력

첫째 줄에 지나야 하는 최소의 칸 수를 출력한다. 항상 도착위치로 이동할 수 있는 경우만 입력으로 주어진다.

### 예제 입출력

| 입력                                            | 출력 |
| ----------------------------------------------- | ---- |
| 4 6</br>101111</br>101010</br>101011</br>111011 | 15   |

---

### 내 코드

```python
import collections

h, w = map(int, input().split())

maze = [list(map(int, list(input()))) for _ in range(h)]
visited = [[0] * w for _ in range(h)]

direction = [(1, 0), (-1, 0), (0, 1), (0, -1)]

queue = collections.deque()
queue.append((0, 0))
visited[0][0] = 1

while queue:
    x, y = queue.popleft()

    if (x == h-1) and (y == w-1):
        print(visited[x][y])
        break

    for i in range(4):
        nx = x + direction[i][0]
        ny = y + direction[i][1]
        if (0 <= nx < h) and (0 <= ny < w) and visited[nx][ny] == 0 and maze[nx][ny] == 1:
            visited[nx][ny] = visited[x][y]+1
            queue.append((nx, ny))
```

BFS로 따로 함수를 구현할 필요없이 `deque`를 활용하여 만들었다. 그리고 최단 거리를 구하는 문제이기 때문에 `visited` 배열을 만들어서 1씩 더해서 답을 구했다.
