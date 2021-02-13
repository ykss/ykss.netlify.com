---
title: '[프로그래머스] 서울에서 김서방 찾기 - 파이썬'
date: 2020-12-17 23:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
String형 배열 seoul의 element중 Kim의 위치 x를 찾아, 김서방은 x에 있다는 String을 반환하는 함수, solution을 완성하세요. seoul에 Kim은 오직 한 번만 나타나며 잘못된 값이 입력되는 경우는 없습니다.


### 제한 사항
seoul은 길이 1 이상, 1000 이하인 배열입니다.
seoul의 원소는 길이 1 이상, 20 이하인 문자열입니다.
Kim은 반드시 seoul 안에 포함되어 있습니다.


### 입출력 예
|seoul|	return|
|---|---|
|["Jane", "Kim"]|	"김서방은 1에 있다"|

---


###  내 코드
```python
def solution(seoul):
    return "김서방은 " + str(seoul.index('Kim')) +"에 있다"
```
단순히 결과값을 구하기 위해서 배열에서 `'kim'`이라는 값의 인덱스를 찾아 스트링으로 변환하여 문자열과 붙혔다.


---


### 다른 사람의 코드
```python
def findKim(seoul):
    return "김서방은 {}에 있다".format(seoul.index('Kim'))

def solution(seoul):
    answer = ''
    return ('김서방은 %d에 있다' %seoul.index('Kim'))

```
일단 `for`문을 안쓰고 `index()`를 통해 처리하는 것이 깔끔한것은 맞는데, 나는 문자열을 너무 인위적으로 합성하였고, 첫번째 방법과 같이 `{}`를 쓰고 `.format()`을 통해 깔끔히 나타내는 것이 바람직하다고 생각된다. 기본적인 문법들은 익혀두자.