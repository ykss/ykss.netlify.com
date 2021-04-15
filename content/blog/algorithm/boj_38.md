---
title: '[BOJ] 안전영역 - BFS - 파이썬'
date: 2021-04-16 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

재난방재청에서는 많은 비가 내리는 장마철에 대비해서 다음과 같은 일을 계획하고 있다. 먼저 어떤 지역의 높이 정보를 파악한다. 그 다음에 그 지역에 많은 비가 내렸을 때 물에 잠기지 않는 안전한 영역이 최대로 몇 개가 만들어 지는 지를 조사하려고 한다. 이때, 문제를 간단하게 하기 위하여, 장마철에 내리는 비의 양에 따라 일정한 높이 이하의 모든 지점은 물에 잠긴다고 가정한다.

어떤 지역의 높이 정보는 행과 열의 크기가 각각 N인 2차원 배열 형태로 주어지며 배열의 각 원소는 해당 지점의 높이를 표시하는 자연수이다. 예를 들어, 다음은 N=5인 지역의 높이 정보이다.

![그림1](https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/upload/images/w1.png)

이제 위와 같은 지역에 많은 비가 내려서 높이가 4 이하인 모든 지점이 물에 잠겼다고 하자. 이 경우에 물에 잠기는 지점을 회색으로 표시하면 다음과 같다.

![그림2](https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/upload/images/w2.png)

물에 잠기지 않는 안전한 영역이라 함은 물에 잠기지 않는 지점들이 위, 아래, 오른쪽 혹은 왼쪽으로 인접해 있으며 그 크기가 최대인 영역을 말한다. 위의 경우에서 물에 잠기지 않는 안전한 영역은 5개가 된다(꼭짓점으로만 붙어 있는 두 지점은 인접하지 않는다고 취급한다).

또한 위와 같은 지역에서 높이가 6이하인 지점을 모두 잠기게 만드는 많은 비가 내리면 물에 잠기지 않는 안전한 영역은 아래 그림에서와 같이 네 개가 됨을 확인할 수 있다.

![그림3](https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/upload/images/w4.png)

이와 같이 장마철에 내리는 비의 양에 따라서 물에 잠기지 않는 안전한 영역의 개수는 다르게 된다. 위의 예와 같은 지역에서 내리는 비의 양에 따른 모든 경우를 다 조사해 보면 물에 잠기지 않는 안전한 영역의 개수 중에서 최대인 경우는 5임을 알 수 있다.

어떤 지역의 높이 정보가 주어졌을 때, 장마철에 물에 잠기지 않는 안전한 영역의 최대 개수를 계산하는 프로그램을 작성하시오.

### 입력

첫째 줄에는 어떤 지역을 나타내는 2차원 배열의 행과 열의 개수를 나타내는 수 N이 입력된다. N은 2 이상 100 이하의 정수이다. 둘째 줄부터 N개의 각 줄에는 2차원 배열의 첫 번째 행부터 N번째 행까지 순서대로 한 행씩 높이 정보가 입력된다. 각 줄에는 각 행의 첫 번째 열부터 N번째 열까지 N개의 높이 정보를 나타내는 자연수가 빈 칸을 사이에 두고 입력된다. 높이는 1이상 100 이하의 정수이다.

### 출력

첫째 줄에 장마철에 물에 잠기지 않는 안전한 영역의 최대 개수를 출력한다.

### 예제 입출력

| 입력                                                                    | 출력 |
| ----------------------------------------------------------------------- | ---- |
| 5</br>6 8 2 6 2</br>3 2 3 4 6</br>6 7 3 3 2</br>7 2 5 3 6</br>8 9 5 2 7 | 5    |

---

### 내 코드

```python
from collections import deque


def bfs(i, j, h):
    direction = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    queue = deque()
    queue.append([i, j])
    visited[i][j] = 1

    while queue:
        x, y = queue.popleft()
        for i in range(4):
            nx = x + direction[i][0]
            ny = y + direction[i][1]
            if 0 <= nx < N and 0 <= ny < N:
                if board[nx][ny] > h and visited[nx][ny] == 0:
                    visited[nx][ny] = 1
                    queue.append([nx, ny])


N = int(input())
results = []
max_value = 0
board = [list(map(int, input().split())) for _ in range(N)]
for i in range(N):
    for j in range(N):
        if board[i][j] > max_value:
            max_value = board[i][j]

max = 0
for h in range(max_value):
    visited = [[0]*N for _ in range(N)]
    answer = 0
    for i in range(N):
        for j in range(N):
            if board[i][j] > h and visited[i][j] == 0:
                bfs(i, j, h)
                answer += 1
    if max < answer:
        max = answer
print(max)

```

이번 문제는 특이한 점이라면 비의 양에 따라 안전지역의 넓이를 구하는 거라서 비의 양에 따라 계속 구해야헀다. 그리고 비의 양은 현재 지역의 최대 높이 만큼 해봐야 해서 먼저 주어진 지역정보의 가장 높은 높이를 구하고 그 높이까지 매 비의 양마다 bfs를 통해 구해서 최대값을 출력했다.
