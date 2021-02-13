---
title: '[프로그래머스] 소수 찾기 - 파이썬'
date: 2021-01-05 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
1부터 입력받은 숫자 n 사이에 있는 소수의 개수를 반환하는 함수, solution을 만들어 보세요.

소수는 1과 자기 자신으로만 나누어지는 수를 의미합니다.
(1은 소수가 아닙니다.)


### 제한 조건
n은 2이상 1000000이하의 자연수입니다.


### 입출력 예
|n	|result|
|---|---|
|10	|4|
|5	|3|
---


###  내 코드 
```python
def solution(n):
    num = set(range(2,n+1))
    for i in range(2,n+1) :
        if i in num :
            num -= set(range(2*i, n+1, i))
    return len(num)
```
이 문제의 경우, 소수를 판별하는 것에 대해 수리적인 접근이 꼭 필요한 문제였고, 에라토스테네스의 체를 구현해서 푸는 문제였다. 여러가지 방법이 있었지만 내가 가장 이해되기 쉬운 방법으로 풀었다. 2부터 n까지의 수의 집합을 모두 구하고 해당 집합에 i가 포함되어 있다면 `2*i`부터 `n`까지 `i`씩 증가하는 범위의 부분 집합을 구하여 아까 구한 집합에서 제외시켰다. 그리고 마지막까지 남은 집합들의 개수가 결국 정답이다.

---


### 다른 사람의 코드
```python
def solution(n):
    sieve = [True] * (n+1)
    # n의 최대 약수가 sqrt(n) 이하이므로 i=sqrt(n)까지 검사
    m = int(n ** 0.5)
    for i in range(2, m + 1):
        if sieve[i] == True:           # i가 소수인 경우
            for j in range(i+i, n+1, i): # i이후 i의 배수 False
                sieve[j] = False
    # 소수 목록 산출
    return len([i for i in range(2, n+1) if sieve[i] == True])
```
위 방식의 경우에는 효율성도 통과하고, 답도 구해지긴 하지만 로직을 이해하기 쉽지 않은 코드라고 생각이 든다.   