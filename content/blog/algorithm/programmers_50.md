---
title: '[프로그래머스] 다리를 지나는 트럭 - 파이썬'
date: 2021-01-26 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

트럭 여러 대가 강을 가로지르는 일 차선 다리를 정해진 순으로 건너려 합니다. 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 알아내야 합니다. 트럭은 1초에 1만큼 움직이며, 다리 길이는 bridge_length이고 다리는 무게 weight까지 견딥니다.
※ 트럭이 다리에 완전히 오르지 않은 경우, 이 트럭의 무게는 고려하지 않습니다.

예를 들어, 길이가 2이고 10kg 무게를 견디는 다리가 있습니다. 무게가 [7, 4, 5, 6]kg인 트럭이 순서대로 최단 시간 안에 다리를 건너려면 다음과 같이 건너야 합니다.

| 경과 시간 | 다리를 지난 트럭 | 다리를 건너는 트럭 | 대기 트럭 |
| --------- | ---------------- | ------------------ | --------- |
| 0         | []               | []                 | [7,4,5,6] |
| 1~2       | []               | [7]                | [4,5,6]   |
| 3         | [7]              | [4]                | [5,6]     |
| 4         | [7]              | [4,5]              | [6]       |
| 5         | [7,4]            | [5]                | [6]       |
| 6~7       | [7,4,5]          | [6]                | []        |
| 8         | [7,4,5,6]        | []                 | []        |

따라서, 모든 트럭이 다리를 지나려면 최소 8초가 걸립니다.

solution 함수의 매개변수로 다리 길이 bridge_length, 다리가 견딜 수 있는 무게 weight, 트럭별 무게 truck_weights가 주어집니다. 이때 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 return 하도록 solution 함수를 완성하세요.

### 제한 조건

bridge_length는 1 이상 10,000 이하입니다.
weight는 1 이상 10,000 이하입니다.
truck_weights의 길이는 1 이상 10,000 이하입니다.
모든 트럭의 무게는 1 이상 weight 이하입니다.

### 입출력 예

| bridge_length | weight | truck_weights                   | return |
| ------------- | ------ | ------------------------------- | ------ |
| 2             | 10     | [7,4,5,6]                       | 8      |
| 100           | 100    | [10]                            | 101    |
| 100           | 100    | [10,10,10,10,10,10,10,10,10,10] | 110    |

---

### 내 코드

```python
def solution(bridge_length, weight, truck_weights):
    answer = 0
    bridge = [0] * bridge_length
    while bridge :
        answer += 1
        bridge.pop(0)
        if truck_weights :
            if sum(bridge) + truck_weights[0] <= weight :
                bridge.append(truck_weights.pop(0))
            else :
                bridge.append(0)
    return answer
```

`bridge`라는 변수를 큐로 사용했다. 포인트는 `0`을 채워 넣어주는 것이다. 처음 큐에 다리의 길이 만큼 `0`을 넣어주고, `bridge`라는 큐가 비어있지 않으면 계속 `while`문이 돌도록 하였다. 그리고 돌떄마다 시간을 의미하는 `answer`은 계속 1씩 증가시켰고, 시간이 지나면서 `pop()`을 통해 큐에서 하나를 뺐다. 그리고 대기하고 있는 트럭이 있을 때는 다리를 건널 수 있는 무게보다 현재 다리를 건너고 있는 트럭의 무게 + 대기열의 트럭의 무게가 작거나 같으면 다리에 다음 트럭을 올리도록 하였다. 만약에 다음 트럭을 올릴 수 없는 무게라면 트럭이 안올라갔다는 뜻으로 `0`을 `append()`해주면서 큐의 길이를 유지했다. 이런식으로 더이상 대기하는 트럭이 없을 때는 계속 `pop()`되어 큐가 비도록하였다.

---

### 다른 사람의 코드

```python
def solution(bridge_length, weight, truck_weights):
    bridgeStatus = [0] * bridge_length
    totalWeight = 0
    totalTime = 0
    while True:
        totalWeight -= bridgeStatus.pop(0)
        totalTime += 1
        try:
            if totalWeight + truck_weights[0] <= weight:
                newWeight = truck_weights.pop(0)
                bridgeStatus.append(newWeight)
                totalWeight += newWeight
            else:
                bridgeStatus.append(0)
        except:
            bridgeStatus.append(0)
            if totalWeight == 0:
                break
    return totalTime
```

풀이는 전체적으로는 똑같고, `while`문 조건 대신 `try ~ except`문을 사용해서 처리하고 `break`로 무한 루프를 탈출하는 식으로 했다. 가끔 에러를 어떻게 안나게 할지를 고민하다가 시간을 많이 잡아먹힐 때가 있는데, 이런식으로 에러를 처리하는 방식도 괜찮을 것 같다는 생각이 든다.
