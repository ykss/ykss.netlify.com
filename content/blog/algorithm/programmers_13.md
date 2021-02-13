---
title: '[프로그래머스] 짝수와 홀수 - 파이썬'
date: 2020-12-17 23:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
정수 num이 짝수일 경우 Even을 반환하고 홀수인 경우 Odd를 반환하는 함수, solution을 완성해주세요.


### 제한 조건
num은 int 범위의 정수입니다.
0은 짝수입니다.


### 입출력 예
|num|	return|
|---|---|
|3|	Odd|
|4	|Even|

---


###  내 코드
```python
def solution(num):
    return 'Odd' if num % 2 else 'Even'
```
파이썬에서 삼항연산자를 쓸 때, `true_value if condition else false_value`형태로 쓴다. 삼항연산자를 써서 간단히 해결


---


### 다른 사람의 코드
```python
def evenOrOdd(num):
    return 'Odd' if num & 1 else 'Even'

```
내가 한 것과 비슷한데 비트연산자를 이용한 것이 참신했다. 