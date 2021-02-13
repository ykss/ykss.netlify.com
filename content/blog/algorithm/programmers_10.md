---
title: '[프로그래머스] 문자열 내 마음대로 정렬하기 - 파이썬'
date: 2020-12-16 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
문자열로 구성된 리스트 strings와, 정수 n이 주어졌을 때, 각 문자열의 인덱스 n번째 글자를 기준으로 오름차순 정렬하려 합니다. 예를 들어 strings가 [sun, bed, car]이고 n이 1이면 각 단어의 인덱스 1의 문자 u, e, a로 strings를 정렬합니다.


### 제한 조건
strings는 길이 1 이상, 50이하인 배열입니다.
strings의 원소는 소문자 알파벳으로 이루어져 있습니다.
strings의 원소는 길이 1 이상, 100이하인 문자열입니다.
모든 strings의 원소의 길이는 n보다 큽니다.
인덱스 1의 문자가 같은 문자열이 여럿 일 경우, 사전순으로 앞선 문자열이 앞쪽에 위치합니다.


### 입출력 예
|strings|	n|	return|
|---|---|---|
|[sun, bed, car]|	1|	[car, bed, sun]|
|[abce, abcd, cdx]|	2	|[abcd, abce, cdx]|
---


###  내 코드
```python
def solution(strings, n):
    return sorted(strings, key = lambda str : (str[n],str))
```
이번에는 조금 배운 것을 활용하여 Pythonic 하게 코드를 짜고 싶었는데, 그래서 `lambda`를 활용하여 작성하였고, 여기서 포인트는 맨 뒤의 `(str[n], str)`는 정렬의 첫번째 기준과 두번째 기준을 지정한 것이다. 이것을 잘 응용하면 정렬 관련 부분은 쉽게 적용할 수 있을 것 같다. 

---


### 다른 사람의 코드
```python
from operator import itemgetter, attrgetter, methodcaller

def solution(strings, n):
    return sorted(sorted(strings), key=itemgetter(n))
```
굳이 다른 모듈을 import 하여 처리하지는 않아도 될 것 같은데, 정렬을 두번 하는 방식은 나름 참신했다. 