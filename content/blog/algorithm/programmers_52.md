---
title: '[프로그래머스] 다음 큰 숫자'
date: 2021-01-29 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

자연수 n이 주어졌을 때, n의 다음 큰 숫자는 다음과 같이 정의 합니다.

조건 1. n의 다음 큰 숫자는 n보다 큰 자연수 입니다.
조건 2. n의 다음 큰 숫자와 n은 2진수로 변환했을 때 1의 갯수가 같습니다.
조건 3. n의 다음 큰 숫자는 조건 1, 2를 만족하는 수 중 가장 작은 수 입니다.
예를 들어서 78(1001110)의 다음 큰 숫자는 83(1010011)입니다.

자연수 n이 매개변수로 주어질 때, n의 다음 큰 숫자를 return 하는 solution 함수를 완성해주세요.

### 제한 사항

n은 1,000,000 이하의 자연수 입니다.

### 입출력 예

| n   | result |
| --- | ------ |
| 78  | 83     |
| 15  | 23     |

---

### 내 코드

```python
def solution(n):
    x = n+1
    while True :
        if bin(x).count('1') == bin(n).count('1') :
            break
        x += 1
    return x
```

파이썬 내장 함수 중 `bin()`함수를 쓰면 간단한 문제였다. 앞으로도 이진법이 나오면 `bin()`함수를 기억하면 유용하게 쓸 수 있기 때문에 꼭 기억해둬야 할 것 같다. 일단 `x`라는 수는 `n`보다 커야하므로 `n+1`을 시작 값으로 정하고 `x`를 `1`씩 증가시키면서 `bin()`함수로 이진 수 변환해서 `count()`함수로 `1`의 개수를 세어 같으면 그 수를 찾아서 리턴하는 식으로 작성 하였다.

---

### 다른 사람의 코드

```python
def solution(n):
    binFactor=[n & 1<<i for i in range(0,20)]
    count = 0 # non zero count until zero
    point = 0 # first non-zero -> zero index
    for i in range(0,20):
        if binFactor[i] > 0:
            count+=1
        elif count > 0:
            point = i
            break
    newBinFactor = [1<<i for i in range(0,count-1)] + [ 1 << point ] + binFactor[point+1:]
    return sum(newBinFactor)
```

`bin()` 함수를 안 쓴 경우는 어떻게 풀었을지 찾아보다가 찾은 답안이다. 비트연산자를 이용해서 푼 답안이다.