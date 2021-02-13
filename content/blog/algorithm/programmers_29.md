---
title: '[프로그래머스] 하샤드 수 - 파이썬'
date: 2021-01-02 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
양의 정수 x가 하샤드 수이려면 x의 자릿수의 합으로 x가 나누어져야 합니다. 예를 들어 18의 자릿수 합은 1+8=9이고, 18은 9로 나누어 떨어지므로 18은 하샤드 수입니다. 자연수 x를 입력받아 x가 하샤드 수인지 아닌지 검사하는 함수, solution을 완성해주세요.


### 제한 조건
x는 1 이상, 10000 이하인 정수입니다.


### 입출력 예
|arr|	return|
|---|---|
|10	|true|
|12	|true|
|11	|false|
|13	|false|
---


###  내 코드 
```python
def solution(x):
    return True if x % sum(map(int,list((str(x))))) == 0 else False
```
주어진 `x`를 배열에 넣고 자릿수 별로 `map()`과 `sum()`을 통해 합을 계산한 후에 주어진 `x`를 계산한 합으로 나누어 떨어질 경우 `True`, 아닐 경우 `False`를 리턴하도록 했다.

---


### 다른 사람의 코드
```python
def solution(x)):
    return x % sum([int(c) for c in str(x)]) == 0
```
비슷한 방식으로 했지만 `map()`대신 포문을 썼고, `True`,`False`는 따로 표시할 필요가 없었다.