---
title: '[BOJ] 단지번호붙이기 - BFS - 파이썬'
date: 2021-04-15 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

<그림 1>과 같이 정사각형 모양의 지도가 있다. 1은 집이 있는 곳을, 0은 집이 없는 곳을 나타낸다. 철수는 이 지도를 가지고 연결된 집의 모임인 단지를 정의하고, 단지에 번호를 붙이려 한다. 여기서 연결되었다는 것은 어떤 집이 좌우, 혹은 아래위로 다른 집이 있는 경우를 말한다. 대각선상에 집이 있는 경우는 연결된 것이 아니다. <그림 2>는 <그림 1>을 단지별로 번호를 붙인 것이다. 지도를 입력하여 단지수를 출력하고, 각 단지에 속하는 집의 수를 오름차순으로 정렬하여 출력하는 프로그램을 작성하시오.
![그림](https://www.acmicpc.net/upload/images/ITVH9w1Gf6eCRdThfkegBUSOKd.png)

### 입력

첫 번째 줄에는 지도의 크기 N(정사각형이므로 가로와 세로의 크기는 같으며 5≤N≤25)이 입력되고, 그 다음 N줄에는 각각 N개의 자료(0혹은 1)가 입력된다.

### 출력

첫 번째 줄에는 총 단지수를 출력하시오. 그리고 각 단지내 집의 수를 오름차순으로 정렬하여 한 줄에 하나씩 출력하시오.

### 예제 입출력

| 입력                                                                                  | 출력                 |
| ------------------------------------------------------------------------------------- | -------------------- |
| 7</br>0110100</br>0110101</br>1110101</br>0000111</br>0100000</br>0111110</br>0111000 | 3</br> 7</br>8</br>9 |

---

### 내 코드

```python
from collections import deque


def bfs(i, j):
    direction = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    queue = deque()
    queue.append([i, j])
    visited[i][j] = 1
    count = 0

    while queue:
        count += 1
        x, y = queue.popleft()
        for i in range(4):
            dx = x + direction[i][0]
            dy = y + direction[i][1]
            if 0 <= dx < N and 0 <= dy < N and visited[dx][dy] == 0 and matrix[dx][dy] == 1:
                matrix[dx][dy] = matrix[x][y] + 1
                visited[dx][dy] = 1
                queue.append([dx, dy])

    results.append(count)


N = int(input())

matrix = [list(map(int, input())) for _ in range(N)]
visited = [[0]*N for _ in range(N)]
results = []

for i in range(N):
    for j in range(N):
        if matrix[i][j] == 1 and visited[i][j] == 0:
            bfs(i, j)

print(len(results))
results.sort()
for x in results:
    print(x)
```

이 문제도 다른 문제들이랑 크게 다를만한 특이한 점은 없었다. 단지 계속 결과는 맞게나오는 것 같은데, 답이 틀렸어서 문제가 있었는데, 마지막에 정렬하여 출력하는 부분을 정렬하지 않고 출력해서 문제가 있었는데, 정렬한 후에 출력하여 답을 맞게 구할 수 있었다.
