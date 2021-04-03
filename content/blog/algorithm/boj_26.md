---
title: '[BOJ] 섬의 개수 - BFS, DFS - 파이썬'
date: 2021-04-02 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

정사각형으로 이루어져 있는 섬과 바다 지도가 주어진다. 섬의 개수를 세는 프로그램을 작성하시오.

![사진1](https://www.acmicpc.net/upload/images/island.png)

한 정사각형과 가로, 세로 또는 대각선으로 연결되어 있는 사각형은 걸어갈 수 있는 사각형이다.

두 정사각형이 같은 섬에 있으려면, 한 정사각형에서 다른 정사각형으로 걸어서 갈 수 있는 경로가 있어야 한다. 지도는 바다로 둘러싸여 있으며, 지도 밖으로 나갈 수 없다.

### 입력

입력은 여러 개의 테스트 케이스로 이루어져 있다. 각 테스트 케이스의 첫째 줄에는 지도의 너비 w와 높이 h가 주어진다. w와 h는 50보다 작거나 같은 양의 정수이다.

둘째 줄부터 h개 줄에는 지도가 주어진다. 1은 땅, 0은 바다이다.

입력의 마지막 줄에는 0이 두 개 주어진다.

### 출력

각 테스트 케이스에 대해서, 섬의 개수를 출력한다.

### 예제 입출력

| 입력                                                                                                                                                                                                                                                                                 | 출력                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| 1 1 </br>0</br>2 2</br>0 1</br>1 0</br>3 2</br>1 1 1</br>1 1 1</br>5 4</br>1 0 1 0 0</br>1 0 0 0 0</br>1 0 1 0 1</br>1 0 0 1 0</br>5 4</br>1 1 1 0 1</br>1 0 1 0 1</br>1 0 1 0 1</br>1 0 1 1 1</br>5 5</br>1 0 1 0 1</br>0 0 0 0 0</br>1 0 1 0 1</br>0 0 0 0 0</br>1 0 1 0 1</br>0 0 | 0</br>1</br>1</br>3</br>1</br>9 |

---

### 문제 풀이 아이디어

섬의 개수를 확인하는 부분이라, 주어진 맵을 전부 순회하면서 체크해야되는 부분이라 DFS 또는 BFS로 풀어야하는데, 먼저 DFS로 구현해봤다.

### 내 코드(DFS)

```python
import sys
sys.setrecursionlimit(10000)

def dfs(i, j):
    if i < 0 or i >= h or j < 0 or j >= w or graph[i][j] == 0:
        return
    graph[i][j] = 0
    dfs(i+1, j)
    dfs(i-1, j)
    dfs(i, j+1)
    dfs(i, j-1)
    dfs(i+1, j+1)
    dfs(i-1, j-1)
    dfs(i+1, j-1)
    dfs(i-1, j+1)

while 1:
    w, h = map(int, input().split())
    if w == 0 and h == 0:
        break
    graph = [list(map(int, input().split())) for _ in range(h)]
    count = 0
    for i in range(h):
        for j in range(w):
            if graph[i][j] == 1:
                dfs(i, j)
                count += 1
    print(count)
```

리트코드의 섬의 개수 구하는 문제와 완전히 유사한데 방향이 대각선을 포함하는 정도만 다르다. 근데 정말 문제였던 것은 계속해서 컴파일 에러가 났었는데, 그게 결국 아래 코드를 추가해주지 않아서 그런 것이었다. 파이썬이 느려서 발생하는 문제로 재귀의 한계를 정해줘야 했다. 실제로 pypy로 제출했더니 재귀 한계를 정해주지 않아도 정답 제출이 되었다. 만약 DFS로 푼다면 스택을 사용해서 푸는 방법도 한번 시도해볼 필요가 있을 것 같고, BFS로도 풀어보는게 도움이 될 것 같았다.

### 내 코드(BFS)

```python
import collections


def bfs(x, y):
    direction = [(1, 0), (-1, 0), (0, 1), (0, -1),
                 (1, 1), (-1, 1), (1, -1), (-1, -1)]
    queue = collections.deque()
    queue.append((x, y))
    matrix[x][y] = 0
    while queue:
        now = queue.popleft()

        for i in range(8):
            dx = now[0] + direction[i][0]
            dy = now[1] + direction[i][1]
            if (0 <= dx < h) and (0 <= dy < w):
                if matrix[dx][dy] == 1:
                    matrix[dx][dy] = 0
                    queue.append((dx, dy))


while 1:
    w, h = map(int, input().split())
    if w == 0 and h == 0:
        break
    matrix = [list(map(int, input().split())) for _ in range(h)]
    count = 0
    for i in range(h):
        for j in range(w):
            if matrix[i][j] == 1:
                bfs(i, j)
                count += 1
    print(count)
```

BFS를 통한 풀이는 입력 부분까지는 DFS와 완전히 동일하고, 함수 호출 부분만 다르다. 1을 발견하면 `deque()`를 사용해서 큐에 넣고, 큐에서 하나씩 빼서 여덟방향을 탐색하고 해당 위치가 1이면 0으로 바꾸고 다시 큐에 넣는다. 이런식으로 쭉 순회하는 것이다.
