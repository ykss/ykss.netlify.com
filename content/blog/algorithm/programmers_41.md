---
title: '[프로그래머스] 실패율'
date: 2021-01-15 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

![문제그림](https://grepp-programmers.s3.amazonaws.com/files/production/bde471d8ac/48ddf1cc-c4ea-499d-b431-9727ee799191.png)

슈퍼 게임 개발자 오렐리는 큰 고민에 빠졌다. 그녀가 만든 프랜즈 오천성이 대성공을 거뒀지만, 요즘 신규 사용자의 수가 급감한 것이다. 원인은 신규 사용자와 기존 사용자 사이에 스테이지 차이가 너무 큰 것이 문제였다.

이 문제를 어떻게 할까 고민 한 그녀는 동적으로 게임 시간을 늘려서 난이도를 조절하기로 했다. 역시 슈퍼 개발자라 대부분의 로직은 쉽게 구현했지만, 실패율을 구하는 부분에서 위기에 빠지고 말았다. 오렐리를 위해 실패율을 구하는 코드를 완성하라.

- 실패율은 다음과 같이 정의한다.
  - 스테이지에 도달했으나 아직 클리어하지 못한 플레이어의 수 / 스테이지에 도달한 플레이어 수

전체 스테이지의 개수 N, 게임을 이용하는 사용자가 현재 멈춰있는 스테이지의 번호가 담긴 배열 stages가 매개변수로 주어질 때, 실패율이 높은 스테이지부터 내림차순으로 스테이지의 번호가 담겨있는 배열을 return 하도록 solution 함수를 완성하라.

### 제한사항

- 스테이지의 개수 N은 1 이상 500 이하의 자연수이다.
- stages의 길이는 1 이상 200,000 이하이다.
- stages에는 1 이상 N + 1 이하의 자연수가 담겨있다.
  - 각 자연수는 사용자가 현재 도전 중인 스테이지의 번호를 나타낸다.
  - 단, N + 1 은 마지막 스테이지(N 번째 스테이지) 까지 클리어 한 사용자를 나타낸다.
- 만약 실패율이 같은 스테이지가 있다면 작은 번호의 스테이지가 먼저 오도록 하면 된다.
- 스테이지에 도달한 유저가 없는 경우 해당 스테이지의 실패율은 0 으로 정의한다.

### 입출력 예제

| N   | stages                   | result      |
| --- | ------------------------ | ----------- |
| 5   | [2, 1, 2, 6, 2, 4, 3, 3] | [3,4,2,1,5] |
| 4   | [4,4,4,4,4]              | [4,1,2,3]   |

---

### 내 코드

```python
def solution(N, stages):
    answer = []
    fail = []
    for i in range(1,N+1) :
        if len([stage for stage in stages if stage >= i]) == 0 :
            fail.append(0)
        else :
            fail.append(len([stage for stage in stages if stage == i])/len([stage for stage in stages if stage >= i]))
    indexList = list(enumerate(fail))
    indexList.sort(key = lambda x :(-x[1],x[0]))
    for i in range(N) :
        answer.append(zipList[i][0]+1)
    return answer
```

첫 번째 `for`문을 통해 각 stage를 통과한 사람 수와 해당 stage에 머문 사람들의 수를 카운트하여 실패율을 계산한 `fail` 배열에 넣었다. 그리고 해당 실패율에 인덱스와 짝지어주기 위해 `enumerate()`를 사용하였고, 해당 리스트를 실패율 순으로 내림차순, 그리고 같을 경우 인덱스 오름차순으로 정렬하였다. 그리고 마지막으로 해당 정렬된 인덱스를 `answer`배열에 넣어 답을 구했다. 여기서 포인트는 해당 문제 같은 경우 시간 초과에 굉장히 민감했는데 처음에 리스트 표현식인 `[stage for stage in stages if stage >= i]` 대신 `list(filter(lambda x : x >= i,stages))` 처럼 `filter()`와 `lambda`식을 이용했는데, 그때는 테스트 케이스 중 3가지에서 시간 초과가 나서 통과하지 못했다. 찾아보니 `map()`,`filter()`,`lambda`식 보다는 리스트 표현식이 더 빠르다고 해서 가급적 리스트 표현식을 더 쓰도록 해야겠다는 생각이 들었다.

---

### 다른 사람의 코드

```python
def solution(N, stages):
    result = {}
    denominator = len(stages)
    for stage in range(1, N+1):
        if denominator != 0:
            count = stages.count(stage)
            result[stage] = count / denominator
            denominator -= count
        else:
            result[stage] = 0
    return sorted(result, key=lambda x : result[x], reverse=True)
```

포인트는 결과 배열을 쓰지않고, 딕셔너리로 사용한 것과 스테이지를 증가할때마다 현재 스테이지에 머물러있는 사람의 수를 뺸 것이다. 그러다가 스테이지에 도달한 사람이 0명이면 실패율 0을 넣고 아니면 실패율을 계산하여 `result` 딕셔너리에 현재 스테이지를 `key`값으로 넣고 실패율을 `value`로 넣었다. 그리고 마지막에 `result`의 `key`값을 `value`순으로 정렬하고 내림차순으로 하기 위해 `reverse` 옵션으로 뒤집었다.
