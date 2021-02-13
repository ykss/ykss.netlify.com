---
title: '[프로그래머스] 최대공약수와 최소공배수 - 파이썬'
date: 2021-01-04 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
두 수를 입력받아 두 수의 최대공약수와 최소공배수를 반환하는 함수, solution을 완성해 보세요. 배열의 맨 앞에 최대공약수, 그다음 최소공배수를 넣어 반환하면 됩니다. 예를 들어 두 수 3, 12의 최대공약수는 3, 최소공배수는 12이므로 solution(3, 12)는 [3, 12]를 반환해야 합니다.


### 제한 사항
두 수는 1이상 1000000이하의 자연수입니다.


### 입출력 예
|n	|m	|return|
|---|---|---|
|3	|12	|[3, 12]|
|2	|5	|[1, 10]|
---


###  내 코드 
```python
def solution(n, m):
    answer = []
    # 최대 공약수 구하기
    for i in range(1,m if m >= n else n) :
        if n % i == 0 and m % i == 0 :
            max = i
    answer.append(max)
    # 최소 공배수 구하기
    min = (m * n) // max
    answer.append(min)
    return answer
```
최대 공약수를 `for문`과 `if문`을 통해서 구한 후에 두 수의 곱에서 최대 공약수로 나누어서 최소 공배수를 구했다. 하지만 이 방법은 최대 공약수를 구할 때의 효율이 너무 떨어진다고 생각했다. 


---


### 다른 사람의 코드
```python
def solution(n, m):
    gcd = lambda a,b : b if not a%b else gcd(b, a%b)
    lcm = lambda a,b : a*b//gcd(a,b)
    return [gcd(n, m), lcm(n, m)]

def solution(a, b):
    c, d = max(a, b), min(a, b)
    t = 1
    while t > 0:
        t = c % d
        c, d = d, t
    answer = [c, int(a*b/c)]
    return answer
```
두가지 예가 있는데, 첫번째 코드는 `lambda`를 사용하여 `n%m`이 0일 때 `m`을, 0이 아니면 나머지를 다시 한번 반복시켜서 최대공약수를 구했고, 최소공배수 또한 `lambda`로 두수를 곱한 값에서 최대공약수를 나눠서 간결하게 구하였다. 두번째 방법에서는 `max`와 `min`으로 어느 수가 더 큰지를 판별하고 나서 두 수가 나누어 떨어질 때까지 반복해서 나누어 최대공약수를 구했다. 그리고 최소공배수는 같은 방식으로 구하였다. 이 부분은 코딩적인 스킬도 있지만, 수리적인 알고리즘을 생각해내는 것이 중요하다는 생각이 들었다.(문송합니다....)