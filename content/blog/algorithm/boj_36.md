---
title: '[BOJ] 영역구하기 - BFS - 파이썬'
date: 2021-04-14 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

눈금의 간격이 1인 M×N(M,N≤100)크기의 모눈종이가 있다. 이 모눈종이 위에 눈금에 맞추어 K개의 직사각형을 그릴 때, 이들 K개의 직사각형의 내부를 제외한 나머지 부분이 몇 개의 분리된 영역으로 나누어진다.

예를 들어 M=5, N=7 인 모눈종이 위에 <그림 1>과 같이 직사각형 3개를 그렸다면, 그 나머지 영역은 <그림 2>와 같이 3개의 분리된 영역으로 나누어지게 된다.

![그림](https://www.acmicpc.net/upload/images/zzJD2aQyF5Rm4IlOt.png)

<그림 2>와 같이 분리된 세 영역의 넓이는 각각 1, 7, 13이 된다.

M, N과 K 그리고 K개의 직사각형의 좌표가 주어질 때, K개의 직사각형 내부를 제외한 나머지 부분이 몇 개의 분리된 영역으로 나누어지는지, 그리고 분리된 각 영역의 넓이가 얼마인지를 구하여 이를 출력하는 프로그램을 작성하시오.

### 입력

첫째 줄에 M과 N, 그리고 K가 빈칸을 사이에 두고 차례로 주어진다. M, N, K는 모두 100 이하의 자연수이다. 둘째 줄부터 K개의 줄에는 한 줄에 하나씩 직사각형의 왼쪽 아래 꼭짓점의 x, y좌표값과 오른쪽 위 꼭짓점의 x, y좌표값이 빈칸을 사이에 두고 차례로 주어진다. 모눈종이의 왼쪽 아래 꼭짓점의 좌표는 (0,0)이고, 오른쪽 위 꼭짓점의 좌표는(N,M)이다. 입력되는 K개의 직사각형들이 모눈종이 전체를 채우는 경우는 없다.

### 출력

첫째 줄에 분리되어 나누어지는 영역의 개수를 출력한다. 둘째 줄에는 각 영역의 넓이를 오름차순으로 정렬하여 빈칸을 사이에 두고 출력한다.

### 예제 입출력

| 입력                                      | 출력         |
| ----------------------------------------- | ------------ |
| 5 7 3</br>0 2 4 4</br>1 1 2 5</br>4 0 6 2 | 3</br>1 7 13 |

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
            if 0 <= nx < M and 0 <= ny < N and visited[nx][ny] == 0 and board[nx][ny] == 0:
                visited[nx][ny] = 1
                queue.append([nx, ny])
                count += 1
    results.append(count)


M, N, K = map(int, input().split())

board = [[0] * N for _ in range(M)]
visited = [[0] * N for _ in range(M)]
results = []

for i in range(K):
    x1, y1, x2, y2 = map(int, input().split())
    for i in range(x1, x2):
        for j in range(y1, y2):
            board[j][i] = 1

for i in range(M):
    for j in range(N):
        if board[i][j] == 0 and visited[i][j] == 0:
            bfs(i, j)

print(len(results))
results.sort()
for result in results:
    print(result, end=' ')

```

이번 문제의 특이한 점은 보통은 칠해진 부분의 넓이를 구하는데, 이번에는 칠해지지 않은 부분의 개수와 넓이를 구하는 것이었다. 그래서 bfs시 1을 찾는 것이 아니라 0을 찾고, 문제에서 좌표로 되어있어서 헷갈릴 수 있는데, 단순히 그냥 매트릭스의 넓이 구하는 것으로 생각하면 똑같이 풀 수 있다.
