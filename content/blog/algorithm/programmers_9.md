---
title: '[프로그래머스] 두 정수 사이의 합 - 파이썬'
date: 2020-12-15 23:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
두 정수 a, b가 주어졌을 때 a와 b 사이에 속한 모든 정수의 합을 리턴하는 함수, solution을 완성하세요.
예를 들어 a = 3, b = 5인 경우, 3 + 4 + 5 = 12이므로 12를 리턴합니다.


### 제한 조건
a와 b가 같은 경우는 둘 중 아무 수나 리턴하세요.
a와 b는 -10,000,000 이상 10,000,000 이하인 정수입니다.
a와 b의 대소관계는 정해져있지 않습니다.


### 입출력 예
|a|	b	|return|
|---|---|---|
|3	|5	|12|
|3|	3|	3|
|5|	3|	12|
---


###  내 코드
```python
def solution(a, b):
    answer = 0
    if a > b :
        start = b
        end = a+1
    else :
        start = a
        end = b+1
    for i in range(start,end) :
        answer += i
    return answer
```
매우 초보적으로 구했는데 훨씬 깔끔하게 구할 수 있을 것 같다.

---


### 다른 사람의 코드
```python
def solution(a, b):
    return sum(range(min(a,b),max(a,b)+1))

def solution(a, b):
    if a > b: a, b = b, a
    return sum(range(a,b+1))
```
두 방법 모두 간결하게 작성할 수 있다. `sum()`함수를 쓰면 간단히 합을 계산할 수 있었고, `min()`과 `max()`처럼 기본 적인 함수로도 쉽게 구할 수 있었다. 아래 방법 또한 `a`가 더 클 경우 `a`와 `b`의 값을 바꾸어 간단히 해결 할 수 있었다.