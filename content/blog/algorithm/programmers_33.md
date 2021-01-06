---
title: '[프로그래머스] 모의고사'
date: 2021-01-06 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

수포자는 수학을 포기한 사람의 준말입니다. 수포자 삼인방은 모의고사에 수학 문제를 전부 찍으려 합니다. 수포자는 1번 문제부터 마지막 문제까지 다음과 같이 찍습니다.

1번 수포자가 찍는 방식: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...
2번 수포자가 찍는 방식: 2, 1, 2, 3, 2, 4, 2, 5, 2, 1, 2, 3, 2, 4, 2, 5, ...
3번 수포자가 찍는 방식: 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, ...

1번 문제부터 마지막 문제까지의 정답이 순서대로 들은 배열 answers가 주어졌을 때, 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 return 하도록 solution 함수를 작성해주세요.

### 제한 조건

시험은 최대 10,000 문제로 구성되어있습니다.
문제의 정답은 1, 2, 3, 4, 5중 하나입니다.
가장 높은 점수를 받은 사람이 여럿일 경우, return하는 값을 오름차순 정렬해주세요.

### 입출력 예

| answers     | return  |
| ----------- | ------- |
| [1,2,3,4,5] | [1]     |
| [1,3,2,4,2] | [1,2,3] |

---

### 내 코드

```python
def solution(answers):
    answer = []
    #1번수포자 : 12345 반복 [1,2,3,4,5]
    first = []
    first_rule = [1,2,3,4,5]
    firstCount = 0
    #2번수포자 : 21,23,24,25 반복 [2,1,2,3,2,4,2,5]
    second = []
    second_rule = [2,1,2,3,2,4,2,5]
    secondCount = 0
    #3번수포자 : 33,11,22,44,55 반복 [3,3,1,1,2,2,4,4,5,5]
    third = []
    third_rule = [3,3,1,1,2,2,4,4,5,5]
    thirdCount = 0

    #일단 주어진 문제 수만큼 반복하며 각 사람 정답 채워주기
    for i in range(len(answers)) :
        first.append(first_rule[i%5])
        second.append(second_rule[i%8])
        third.append(third_rule[i%10])

    #정답 수 카운트
    for i,v in enumerate(answers) :
        if v == first[i%5] :
            firstCount+=1
        if v == second[i%8] :
            secondCount+=1
        if v == third[i%10] :
            thirdCount+=1

    # 가장 높은 점수인 사람 정답 배열에 넣기
    if firstCount == max(firstCount,secondCount,thirdCount):
        answer.append(1)
    if secondCount == max(firstCount,secondCount,thirdCount):
        answer.append(2)
    if thirdCount == max(firstCount,secondCount,thirdCount):
        answer.append(3)

    return answer
```

너무 어질어질하게 작성했다. 효율적인 방법으로는 떠오르지 않고, 하드코딩과 같은 방법으로만 떠올랐는데, 충분히 효율적으로 할 수 있는 방법이 많았어서 다른 사람의 코드를 보면서 많이 배웠다.

---

### 다른 사람의 코드(1)

```python
def solution(answers):
    pattern1 = [1,2,3,4,5]
    pattern2 = [2,1,2,3,2,4,2,5]
    pattern3 = [3,3,1,1,2,2,4,4,5,5]
    score = [0, 0, 0]
    result = []

    for idx, answer in enumerate(answers):
        if answer == pattern1[idx%len(pattern1)]:
            score[0] += 1
        if answer == pattern2[idx%len(pattern2)]:
            score[1] += 1
        if answer == pattern3[idx%len(pattern3)]:
            score[2] += 1

    for idx, s in enumerate(score):
        if s == max(score):
            result.append(idx+1)

    return result
```

내가 짠 코드와 전체적인 로직은 동일하지만 하드코딩이 확연하게 줄은 코드라고 생각이 들었고, 변수명부터 잘못 지었다는 생각이 들었다. `pattern`을 세가지로 저장하고 `score`를 변수하나씩 만들 필요 없이 배열로 한번에 선언할 수 있었고, 내가 짰던 것 같이 정답을 넣어주는 과정은 아예 필요가 없었고 바로 패턴과 비교하여 점수를 늘려나가는 방식으로 가능했다. 여기서 `enumerate()`함수를 사용했는데, 해당 함수는 `index`와 `value`를 모두 반복문에서 이용할 수 있는 함수이고 정답과 패턴의 `idx%len(pattern)`의 인덱스 값을 비교하여 점수를 늘렸다. 그리고 마지막 반복문에서도 `enumerate()`함수를 사용하여 세 사람의 점수와 최고점수를 비교해서 최고점을 기록한 사람만 정답 배열에 넣어서 정답을 구했다.

> 1.변수명 제대로 2.효율적으로 배열 사용 3.enumerate()함수 사용

### 다른 사람의 코드(2)

```python
from itertools import cycle

def solution(answers):
    giveups = [
        cycle([1,2,3,4,5]),
        cycle([2,1,2,3,2,4,2,5]),
        cycle([3,3,1,1,2,2,4,4,5,5]),
    ]
    scores = [0, 0, 0]
    for num in answers:
        for i in range(3):
            if next(giveups[i]) == num:
                scores[i] += 1
    highest = max(scores)

    return [i + 1 for i, v in enumerate(scores) if v == highest]
```

위 방식은 `itertools` 모듈에서 `cycle()`이라는 함수를 사용했는데, 배열 인자를 반복하는 것이다. 그리고 반복문 두개를 중첩해서 정답과 `next()`함수로 `giveups`배열의 답들을 비교하여 정답일 경우 점수 배열의 점수를 업데이트했다. 그리고 마지막엔 이전의 코드와 같게 답을 구하고 리스트로 감쌌다.
