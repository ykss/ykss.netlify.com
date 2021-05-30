---
title: '[프로그래머스] 동굴 탐험 - 파이썬'
date: 2021-04-24 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

오지 탐험가인 프로도는 탐험 도중 n개의 방으로 이루어진 지하 동굴을 탐험하게 되었습니다. 모든 방에는 0부터 n - 1 까지 번호가 붙어있고, 이 동굴에 들어갈 수 있는 유일한 입구는 0번 방과 연결되어 있습니다. 각 방들은 양방향으로 통행이 가능한 통로로 서로 연결되어 있는데, 서로 다른 두 방을 직접 연결하는 통로는 오직 하나입니다. 임의의 서로 다른 두 방 사이의 최단경로는 딱 한 가지만 있으며, 또한 임의의 두 방 사이에 이동이 불가능한 경우는 없습니다.

탐험에 앞서 이 지하 동굴의 지도를 손에 넣은 프로도는 다음과 같이 탐험 계획을 세웠습니다.

모든 방을 적어도 한 번은 방문해야 합니다.
특정 방은 방문하기 전에 반드시 먼저 방문할 방이 정해져 있습니다.

```
2-1. 이는 A번 방은 방문하기 전에 반드시 B번 방을 먼저 방문해야 한다는 의미입니다.
2-2. 어떤 방을 방문하기 위해 반드시 먼저 방문해야 하는 방은 없거나 또는 1개 입니다.
2-3. 서로 다른 두 개 이상의 방에 대해 먼저 방문해야 하는 방이 같은 경우는 없습니다.
2-4. 어떤 방이 먼저 방문해야 하는 방이면서 동시에 나중에 방문해야 되는 방인 경우는 없습니다.
```

위 계획 중 2-2, 2-3, 2-4는 순서를 지켜 방문해야 하는 두 방의 쌍이 A → B(A를 먼저 방문하고 B를 방문함) 형태로 유일함을 의미합니다. 즉, 프로도는 아래와 같은 형태로 방문순서가 잡히지 않도록 방문 계획을 세웠습니다.

A → B, A → C (방문순서 배열 order = [...,[A,B],...,[A,C],...]) 형태로 A를 방문 후에 방문해야 할 방이 B와 C로 두 개 또는 그 이상인 경우
X → A, Z → A (방문순서 배열 order = [...,[X,A],...,[Z,A],...]) 형태로 A를 방문하기 전에 방문해야 할 방이 X와 Z로 두 개 또는 그 이상인 경우
A → B → C (방문순서 배열 order = [...,[A,B],...,[B,C],...) 형태로 B처럼 A 방문 후이면서 동시에 C 방문 전인 경우
그리고 먼저 방문해야 할 방과 나중에 방문할 방을 반드시 연속해서 방문해야 할 필요는 없어 A방을 방문한 후 다른 방을 방문한 후 B방을 방문해도 좋습니다.

방 개수 n, 동굴의 각 통로들이 연결하는 두 방의 번호가 담긴 2차원 배열 path, 프로도가 정한 방문 순서가 담긴 2차원 배열 order가 매개변수로 주어질 때, 프로도가 규칙에 맞게 모든 방을 탐험할 수 있을 지 return 하도록 solution 함수를 완성해주세요.

### [제한사항]

n은 2 이상 200,000 이하입니다.
path 배열의 세로(행) 길이는 n - 1 입니다.
path 배열의 원소는 [방 번호 A, 방 번호 B] 형태입니다.
두 방 A, B사이를 연결하는 통로를 나타냅니다.
통로가 연결하는 두 방 번호가 순서없이 들어있음에 주의하세요.
order 배열의 세로(행) 길이는 1 이상 (n / 2) 이하입니다.
order 배열의 원소는 [방 번호 A, 방 번호 B] 형태입니다.
A번 방을 먼저 방문한 후 B번 방을 방문해야 함을 나타냅니다.

### 입출력 예

| n   | path                                              | order               | result |
| --- | ------------------------------------------------- | ------------------- | ------ |
| 9   | [[0,1],[0,3],[0,7],[8,1],[3,6],[1,2],[4,7],[7,5]] | [[8,5],[6,7],[4,1]] | true   |
| 9   | [[8,1],[0,1],[1,2],[0,7],[4,7],[0,3],[7,5],[3,6]] | [[4,1],[5,2]]       | true   |
| 9   | [[0,1],[0,3],[0,7],[8,1],[3,6],[1,2],[4,7],[7,5]] | [[4,1],[8,7],[6,5]] | false  |

---

### 내 코드

```python
from collections import defaultdict, deque

def solution(n, path, order):
    graph = defaultdict(list)
    visited = [0 for _ in range(n) ]
    visited[0] = 1

    for u, v in path :
        graph[u].append(v)
        graph[v].append(u)

    order1, order2 = {}, {}
    for u, v in order :
        order1[u] = v
        order2[v] = u
        if v == 0:
            return False
        if u == 0:
            order1[0] = 0

    queue = deque()
    queue.append(0)

    while queue :
        cur = queue.popleft()
        if cur == order1.get(order2.get(cur)) :
            visited[cur] = 2
        else :
            for node in graph[cur] :
                if visited[node] == 0 :
                    queue.append(node)
                    visited[node] = 1
                    if order1.get(node) :
                        if visited[order1[node]] == 2 :
                            queue.append(order1[node])
                            visited[order1[node]] == 1
                        order1[node] = 0
    for i in visited :
        if not i :
            return False
    return True
```

그래프를 나타내는 경우에는 인접행렬로 주로 나타내는데, 그때 `defaultdict`를 써서 나타낼 수 있다. 그리고 이 문제에는 순서가 있어서 선행노드와 후행노드를 나타내는 두 딕셔너리를 써서 선행노드는 `order1`에, 후행노드는 `order2`에 두었다. 그리고 출발점인 0이 후행노드에 있는 경우에는 불가하므로 False를 리턴하고, 선행노드가 0인 경우는 첫 출발점이 0이기 때문에 0을 넣는다. 그리고 나서는 bfs 방식으로 큐를 사용하여 그래프를 순회하는데, 먼저 현재 순회하는 노드가 다른 노드의 후행노드이면 방문을 2로 해놓는데, 2의 상태는 선행노드가 아직 방문되지 않아서 대기하는 경우이다. 그게 아닐 경우에는 그래프에서 해당 노드를 순회하고 해당 노드가 아직 방문되지 않았을 경우 큐에 넣고, 그리고 해당 노드의 후행노드가 있고, 해당 노드가 선행노드에 방문하지 않아서 대기상태인 경우, 방문하고 큐에 넣는다. 그리고 선행노드는 0으로 바꿔준다. 이 과정을 반복하고 나서 만약에 방문을 나타내는 `visited`배열에 아직 방문하지 않은 0이 존재한다면 False를 존재하지않으면 모두 순회한 것이므로 True로 반환하여 답을 구한다.