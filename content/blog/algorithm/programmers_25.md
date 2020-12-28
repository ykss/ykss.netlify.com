---
title: '[프로그래머스] 약수의 합'
date: 2020-12-29 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
정수 n을 입력받아 n의 약수를 모두 더한 값을 리턴하는 함수, solution을 완성해주세요.


### 제한 사항
n은 0 이상 3000이하인 정수입니다.


### 입출력 예
|n|	return|
|---|---|
|12	|28|
|5|	6|
---


###  내 코드 
```python
def solution(n):
    answer = 0
    for i in range(1,n+1) :
        if n%i == 0 :
            answer += i
    return answer
```
단순하게 생각해서 1부터 n까지 숫자로 n을 나누어서 나눠 떨어지는 숫자만 더하여 답을 구했다.

---


### 다른 사람의 코드
```python
def solution(n):
    return n + sum([i for i in range(1, (n // 2) + 1) if n % i == 0])
```
list comprehension을 사용했고, `for`문 범위에서 `(n // 2) + 1` 범위로만 돌리면서 사실상 범위의 반을 줄여서 성능을 2배로 향상시켰다. 어떻게하면 답을 그냥 구할지가 문제가 아니고 어떻게하면 효율적으로 짤 수 있을지 고민해야겠다는 생각이 들었다.