---
title: '[프로그래머스] 기능개발'
date: 2021-01-20 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

프로그래머스 팀에서는 기능 개선 작업을 수행 중입니다. 각 기능은 진도가 100%일 때 서비스에 반영할 수 있습니다.

또, 각 기능의 개발속도는 모두 다르기 때문에 뒤에 있는 기능이 앞에 있는 기능보다 먼저 개발될 수 있고, 이때 뒤에 있는 기능은 앞에 있는 기능이 배포될 때 함께 배포됩니다.

먼저 배포되어야 하는 순서대로 작업의 진도가 적힌 정수 배열 progresses와 각 작업의 개발 속도가 적힌 정수 배열 speeds가 주어질 때 각 배포마다 몇 개의 기능이 배포되는지를 return 하도록 solution 함수를 완성하세요.

### 제한 사항

작업의 개수(progresses, speeds배열의 길이)는 100개 이하입니다.
작업 진도는 100 미만의 자연수입니다.
작업 속도는 100 이하의 자연수입니다.
배포는 하루에 한 번만 할 수 있으며, 하루의 끝에 이루어진다고 가정합니다. 예를 들어 진도율이 95%인 작업의 개발 속도가 하루에 4%라면 배포는 2일 뒤에 이루어집니다.

### 입출력 예

| progresses               | speeds             | return    |
| ------------------------ | ------------------ | --------- |
| [93, 30, 55]             | [1, 30, 5]         | [2, 1]    |
| [95, 90, 99, 99, 80, 99] | [1, 1, 1, 1, 1, 1] | [1, 3, 2] |

---

### 내 코드

```python
def solution(progresses, speeds):
    answer = []
    days = []
    deploy = 1
    for i in range(len(progresses)) :
        day = 0
        while(1) :
            progresses[i] += speeds[i]
            day += 1
            if progresses[i] >= 100 :
                break
        days.append(day)
    n = days.pop(0) 
    while(1) : 
        if n >= days[0] : 
            days.pop(0)
            deploy += 1
        else :
            answer.append(deploy) 
            n = days.pop(0) 
            deploy = 1          
        if len(days) == 0 :
            answer.append(deploy) 
            break
    return answer
```
문제는 매우 단순해 보였으나, 뭔가 쉽게 풀 수 있는 것을 어렵게 푼 것 같은 생각이 들었다. 처음에는 각 기능 개발 하는데 드는 날 수를 계산해서 배열에 넣었고, 그리고 나서는 그 날 수를 기준으로 해서 같이 배포될 수 있는 개수를 구하였다. 하지만 효율성도 매우 좋지 않고 `if`문을 남발하고 하드코딩에 가깝게 문제를 푼 것 같아서 아쉬웠다.

---

### 다른 사람의 코드

```python
def solution(progresses, speeds):
    answer = []
    time = 0
    count = 0
    while len(progresses)> 0:
        if (progresses[0] + time*speeds[0]) >= 100:
            progresses.pop(0)
            speeds.pop(0)
            count += 1
        else:
            if count > 0:
                answer.append(count)
                count = 0
            time += 1
    answer.append(count)
    return answer
```

`time`이라는 변수를 활용한 답안이었다. 먼저 `while`문을 돌리고 `if`와 `else`문으로 분기했는데, 첫번째 `if`문에서는 진행도가 100이 넘는지 체크하고, 100이 넘을 경우에 `pop()`을 통해서 제외하고 카운트를 늘렸다. 그리고 또 100이 안넘을 경우에는 카운트가 0보다 크면 정답배열에 넣고, 다시 카운트를 초기화해주었다. 그리고 카운트가 0일 경우에는 시간만 증가시켜주고, 또 위 과정을 반복하고 마지막에 카운트를 정답 배열에 넣고 마무리했다.
