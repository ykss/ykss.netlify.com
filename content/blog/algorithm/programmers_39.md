---
title: '[프로그래머스] 예산'
date: 2021-01-13 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

S사에서는 각 부서에 필요한 물품을 지원해 주기 위해 부서별로 물품을 구매하는데 필요한 금액을 조사했습니다. 그러나, 전체 예산이 정해져 있기 때문에 모든 부서의 물품을 구매해 줄 수는 없습니다. 그래서 최대한 많은 부서의 물품을 구매해 줄 수 있도록 하려고 합니다.

물품을 구매해 줄 때는 각 부서가 신청한 금액만큼을 모두 지원해 줘야 합니다. 예를 들어 1,000원을 신청한 부서에는 정확히 1,000원을 지원해야 하며, 1,000원보다 적은 금액을 지원해 줄 수는 없습니다.

부서별로 신청한 금액이 들어있는 배열 d와 예산 budget이 매개변수로 주어질 때, 최대 몇 개의 부서에 물품을 지원할 수 있는지 return 하도록 solution 함수를 완성해주세요.

### 제한사항

d는 부서별로 신청한 금액이 들어있는 배열이며, 길이(전체 부서의 개수)는 1 이상 100 이하입니다.
d의 각 원소는 부서별로 신청한 금액을 나타내며, 부서별 신청 금액은 1 이상 100,000 이하의 자연수입니다.
budget은 예산을 나타내며, 1 이상 10,000,000 이하의 자연수입니다.

### 입출력 예

| d           | budget | result |
| ----------- | ------ | ------ |
| [1,3,2,5,4] | 9      | 3      |
| [2,2,3,3]   | 10     | 4      |

---

### 내 코드

```python
def solution(d, budget):
    answer = 0
    sum = 0
    d.sort()
    for i in d:
        if sum + i <= budget :
            answer += 1
            sum += i
    return answer
```

주어진 배열 `d`를 작은 것부터 정렬해서 예산보다 적거나 같은 수준에서 가장 많이 넣을 수 있도록 `sum`에 더해서 구했다.

---

### 다른 사람의 코드

```python
def solution(d, budget):
    d.sort()
    while budget < sum(d):
        d.pop()
    return len(d)
```

유사하게 풀었지만 `while`문을 사용해서 `d`배열의 합계가 예산보다 작을 때까지 `d`배열의 가장 큰 수부터 하나씩 `pop()`하는 방식으로 한 후에 마지막에 남은 배열의 원소 개수를 `len(d)`를 통해 반환하여 구했다.