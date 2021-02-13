---
title: '[프로그래머스] 내적 - 파이썬'
date: 2021-01-11 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

길이가 같은 두 1차원 정수 배열 a, b가 매개변수로 주어집니다. a와 b의 내적을 return 하도록 solution 함수를 완성해주세요.

이때, a와 b의 내적은 a[0]*b[0] + a[1]*b[1] + ... + a[n-1]\*b[n-1] 입니다. (n은 a, b의 길이)

### 제한사항

a, b의 길이는 1 이상 1,000 이하입니다.
a, b의 모든 수는 -1,000 이상 1,000 이하입니다.

### 입출력 예

| a         | b           | result |
| --------- | ----------- | ------ |
| [1,2,3,4] | [-3,-1,0,2] | 3      |
| [-1,0,1]  | [1,0,-1]    | -2     |

---

### 내 코드

```python
def solution(a, b):
    answer = 0

    for i in range(len(a)) :
        answer += a[i]*b[i]

    return answer
```

거의 문제 읽자마자 풀 수 있는 쉬운 문제였다. 좀 더 간결하게 짤 수 있었을 것 같긴하다.

---

### 다른 사람의 코드

```python
def solution(a, b):
    return sum([x*y for x, y in zip(a,b)])

def solution(a, b):
    return sum(map(lambda i: a[i]*b[i], range(len(a))))
```

두 가지 모두 한 줄 코드였는데, 둘 다 배우면 좋을 것 같았다. 첫번째는 `zip()`과 `sum()`을 활용했는데, `a`와 `b`의 원소를 하나씩 꺼내어 곱한것을 리스트로 저장하고 그것을 마지막에 모두 더해서 구했다. 인자가 두가지가 주어지고 두 인자를 활용해야 하는 경우에는 `zip()`함수가 유용할 것 같다.

두 번째는 `sum()`과 `map()`과 `lambda식`을 사용한 풀이인데, 0부터 `len(a)`까지 i를 적용했고, 마지막에 `sum()`을 통해 더해줬다. `lambda`는 익숙해지면 익숙해질 수록 유용하게 쓰일 수 있을 것 같다.
