---
title: '[BOJ] 상범 빌딩 - BFS - 파이썬'
date: 2021-04-10 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

당신은 상범 빌딩에 갇히고 말았다. 여기서 탈출하는 가장 빠른 길은 무엇일까? 상범 빌딩은 각 변의 길이가 1인 정육면체(단위 정육면체)로 이루어져있다. 각 정육면체는 금으로 이루어져 있어 지나갈 수 없거나, 비어있어서 지나갈 수 있게 되어있다. 당신은 각 칸에서 인접한 6개의 칸(동,서,남,북,상,하)으로 1분의 시간을 들여 이동할 수 있다. 즉, 대각선으로 이동하는 것은 불가능하다. 그리고 상범 빌딩의 바깥면도 모두 금으로 막혀있어 출구를 통해서만 탈출할 수 있다.

당신은 상범 빌딩을 탈출할 수 있을까? 만약 그렇다면 얼마나 걸릴까?

### 입력

입력은 여러 개의 테스트 케이스로 이루어지며, 각 테스트 케이스는 세 개의 정수 L, R, C로 시작한다. L(1 ≤ L ≤ 30)은 상범 빌딩의 층 수이다. R(1 ≤ R ≤ 30)과 C(1 ≤ C ≤ 30)는 상범 빌딩의 한 층의 행과 열의 개수를 나타낸다.

그 다음 각 줄이 C개의 문자로 이루어진 R개의 행이 L번 주어진다. 각 문자는 상범 빌딩의 한 칸을 나타낸다. 금으로 막혀있어 지나갈 수 없는 칸은 '#'으로 표현되고, 비어있는 칸은 '.'으로 표현된다. 당신의 시작 지점은 'S'로 표현되고, 탈출할 수 있는 출구는 'E'로 표현된다. 각 층 사이에는 빈 줄이 있으며, 입력의 끝은 L, R, C가 모두 0으로 표현된다. 시작 지점과 출구는 항상 하나만 있다.

### 출력

각 빌딩에 대해 한 줄씩 답을 출력한다. 만약 당신이 탈출할 수 있다면 다음과 같이 출력한다.

```
Escaped in x minute(s).
```

여기서 x는 상범 빌딩을 탈출하는 데에 필요한 최단 시간이다.

만일 탈출이 불가능하다면, 다음과 같이 출력한다.

```
Trapped!
```

### 예제 입출력

| 입력                                                                                                                                                                                           | 출력                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 3 4 5</br>S....</br>.###.</br>.##..</br>###.#</br></br>#####</br>#####</br>##.##</br>##...</br></br> #####</br>#####</br>#.###</br>####E</br></br>1 3 3</br>S##</br>#E#</br>###</br></br>0 0 0 | Escaped in 11 minute(s). Trapped! |

---

### 내 코드

```python
from collections import deque

def bfs(x, y, z):
    direction = [[1, 0, 0], [-1, 0, 0], [0, 1, 0],
                 [0, -1, 0], [0, 0, 1], [0, 0, -1]]
    queue = deque()
    queue.append([x, y, z])
    visited[x][y][z] = 1
    while queue:
        x, y, z = queue.popleft()
        for i in range(6):
            nx = x + direction[i][0]
            ny = y + direction[i][1]
            nz = z + direction[i][2]
            if 0 <= nx < l and 0 <= ny < r and 0 <= nz < c:
                if building[nx][ny][nz] == 'E':
                    print(f'Escaped in {visited[x][y][z]} minute(s).')
                    return
                if building[nx][ny][nz] == '.' and visited[nx][ny][nz] == 0:
                    visited[nx][ny][nz] = visited[x][y][z] + 1
                    queue.append([nx, ny, nz])
    print('Trapped!')


while True:
    l, r, c = map(int, input().split())
    if l == 0 and r == 0 and c == 0:
        break
    building = []
    visited = [[[0] * c for _ in range(r)] for _ in range(l)]

    # 층마다의 배열 크기 받기
    for _ in range(l):
        floor = [list(input()) for _ in range(r)]
        input()
        building.append(floor)

    for i in range(l):
        for j in range(r):
            for k in range(c):
                if building[i][j][k] == 'S':
                    bfs(i, j, k)

    print(result)
```

이 문제는 BFS 문제이면서 특이한 점은 3차원 배열을 써야한다는 부분이었다. 하지만 막상 풀면 크게 다를 점은 없었지만, 가장 어려웠던 점은 초기에 입력값 받고 `board`를 세팅하는 부분에서 잘못하면 결국은 계속 에러가 나기 때문에 그 부분에서 체크를 해야했다.
