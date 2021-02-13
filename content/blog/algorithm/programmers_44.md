---
title: '[프로그래머스] 주식가격 - 파이썬'
date: 2021-01-19 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

초 단위로 기록된 주식가격이 담긴 배열 prices가 매개변수로 주어질 때, 가격이 떨어지지 않은 기간은 몇 초인지를 return 하도록 solution 함수를 완성하세요.

### 제한사항

prices의 각 가격은 1 이상 10,000 이하인 자연수입니다.
prices의 길이는 2 이상 100,000 이하입니다.

### 입출력 예

| prices          | return          |
| --------------- | --------------- |
| [1, 2, 3, 2, 3] | [4, 3, 1, 1, 0] |

---

### 내 코드

```python
def solution(prices):
    answer = []
    for index, price in enumerate(prices) : 
        count = 0 
        for i in range(index+1,len(prices)) :
            count += 1
            if price > prices[i] :
                break
        answer.append(count)
    return answer
```

이건 다른 것 보다 문제 이해가 어려웠다. 무슨 말인지 이해가 잘 안갔다. 계속 테스트 케이스를 보며 이해했고, 주어진 가격 배열에서 하나씩 뽑아서 그 뒤의 배열 인덱스들의 값을 비교할 떄마다 `count` 변수를 1씩 늘려주고 만약에 지금 비교하는 가격보다 더 낮은 가격을 발견하면 `break`를 통해 카운트를 멈췄다.

---

### 다른 사람의 코드

```python
def solution(prices):
    answer = [0] * len(prices)
    for i in range(len(prices)):
        for j in range(i+1, len(prices)):
            if prices[i] <= prices[j]:
                answer[i] += 1
            else:
                answer[i] += 1
                break
    return answer

```

먼저 정답 배열을 0으로 초기화 하고나서 `for`문을 주어진 가격 배열의 길이 만큼 반복하고, 지금 가격과 다음 시간들의 가격을 비교해서 지금 가격과 같거나 더 큰 수를 만나면 `+1`을 해줬고, 만약 지금 가격보다 작은 수를 만나면 `+1`을 하고 `break`를 통해 반복문을 탈출시켰다.