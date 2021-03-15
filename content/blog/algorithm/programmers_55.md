---
title: '[프로그래머스] 소수 만들기 - 파이썬'
date: 2021-03-16 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

주어진 숫자 중 3개의 수를 더했을 때 소수가 되는 경우의 개수를 구하려고 합니다. 숫자들이 들어있는 배열 nums가 매개변수로 주어질 때, nums에 있는 숫자들 중 서로 다른 3개를 골라 더했을 때 소수가 되는 경우의 개수를 return 하도록 solution 함수를 완성해주세요.

### 제한사항

nums에 들어있는 숫자의 개수는 3개 이상 50개 이하입니다.
nums의 각 원소는 1 이상 1,000 이하의 자연수이며, 중복된 숫자가 들어있지 않습니다.

### 입출력 예

| nums        | result |
| ----------- | ------ |
| [1,2,3,4]   | 1      |
| [1,2,7,6,4] | 4      |

---

### 내 코드

```python
from itertools import combinations

def primeNumber(num) :
    for i in range(2, num) :
        if num % i == 0 :
            return False
    return True


def solution(nums):
    case = []
    sum_case = []
    count = 0
    for i in list(combinations(nums,3)):
        case.append(sum(i))
    for i in case :
        if primeNumber(i) :
            count += 1
    return count
```

먼저, `itertools`의 `combinations()` 함수를 사용해서 주어진 배열에서 3개를 선택할 수 있는 모든 경우의 수의 합을 `case`라는 배열에 넣고 해당 배열에서 하나씩 꺼내어 소수를 판별하는 `primeNumber()` 함수를 정의하여 만약에 소수일 경우, True를 반환하여 `count`를 1 늘리어 답을 구했다. 여기서 포인트는 소수를 판별하는 것이었는데, 소수 판별하는 식을 내가 기억하고 있지 못하기 때문에, 소수의 정의대로 1과 자기 자신만으로 나누어 떨어지는 수를 구해야해서, 2부터 판별하려는 수 -1 까지로 나누어 소수를 판별하였다. 이러한 것은 어렵게 생각하지 말고 내가 아는 정의 그대로 구현해볼 필요가 있는 것 같다.

---

### 다른 사람의 코드

```python
from itertools import combinations
def prime_number(x):
    answer = 0
    for i in range(1,int(x**0.5)+1):
        if x%i==0:
            answer+=1
    return 1 if answer==1 else 0

def solution(nums):
    return sum([prime_number(sum(c)) for c in combinations(nums,3)])
```

소수를 구하는 로직에서 나와 같이하면 수가 커질수록 더 비효율적이기 때문에, `range(1, int(x**0.5)+1)`로 루트 x+1 까지 구하게 되면 더 효율적으로 판별할 수 있게 되기 때문에 이 부분을 기억하면 좋을 것 같다.
