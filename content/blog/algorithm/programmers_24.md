---
title: '[프로그래머스] 자릿수 더하기'
date: 2020-12-28 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
자연수 N이 주어지면, N의 각 자릿수의 합을 구해서 return 하는 solution 함수를 만들어 주세요.
예를들어 N = 123이면 1 + 2 + 3 = 6을 return 하면 됩니다.


### 제한사항
N의 범위 : 100,000,000 이하의 자연수


### 입출력 예
|N|	answer|
|---|---|
|123	|6|
|987|	24|
---


###  내 코드 
```python
def solution(n):
    return sum(map(int,str(n)))
```
`n`을 문자열로 변환하여서 한문자씩 숫자로 바꾸고 `int()`함수를 적용하도록 `map()`을 사용했고, 그렇게 나온 숫자들을 `sum()`으로 더해서 값을 구했다.

---


### 다른 사람의 코드
```python
def sum_digit(number):
    return sum([int(i) for i in str(number)])
```
나와 같은 방식이지만 `map()`을 쓰지 않았기 때문에 for문을 사용했다.