---
title: '[BOJ] 순열 사이클 - BFS, DFS - 파이썬'
date: 2021-04-02 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

1부터 N까지 정수 N개로 이루어진 순열을 나타내는 방법은 여러 가지가 있다. 예를 들어, 8개의 수로 이루어진 순열 (3, 2, 7, 8, 1, 4, 5, 6)을 배열을 이용해 표현하면 와 같다. 또는, Figure 1과 같이 방향 그래프로 나타낼 수도 있다.

순열을 배열을 이용해 로 나타냈다면, i에서 πi로 간선을 이어 그래프로 만들 수 있다.

Figure 1에 나와있는 것 처럼, 순열 그래프 (3, 2, 7, 8, 1, 4, 5, 6) 에는 총 3개의 사이클이 있다. 이러한 사이클을 "순열 사이클" 이라고 한다.

N개의 정수로 이루어진 순열이 주어졌을 때, 순열 사이클의 개수를 구하는 프로그램을 작성하시오.

### 입력

첫째 줄에 테스트 케이스의 개수 T가 주어진다. 각 테스트 케이스의 첫째 줄에는 순열의 크기 N (2 ≤ N ≤ 1,000)이 주어진다. 둘째 줄에는 순열이 주어지며, 각 정수는 공백으로 구분되어 있다.

### 출력

각 테스트 케이스마다, 입력으로 주어진 순열에 존재하는 순열 사이클의 개수를 출력한다.

### 예제 입출력

| 입력                                                        | 출력    |
| ----------------------------------------------------------- | ------- |
| 2</br>8</br>3 2 7 8 1 4 5 6</br>10</br>2 1 3 4 5 6 7 9 10 8 | 3</br>7 |

---

### 내 코드

```python
def dfs(idx) :
    visited[idx] = 1
    number = numbers[idx]
    if not visited[number]:
        dfs(number)

for _ in range(int(input())) :
    N = int(input())
    numbers = [0] + list(map(int, input().split()))
    visited = [True] + [False] * N
    count = 0
    for i in range(1,N+1) :
        if not visited[i]:
            dfs(i)
            count += 1
    print(count)
```

포인트는 `numbers`배열과 `visited`배열에 0번째 인덱스에는 그냥 0과 True로 채워놓은 것이다. 그리고는 dfs를 통해 방문하지 않은 노드를 만나면 dfs를 통해 탐색하도록 하였다.
