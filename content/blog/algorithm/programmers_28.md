---
title: '[프로그래머스] 핸드폰 번호 가리기'
date: 2021-01-01 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
프로그래머스 모바일은 개인정보 보호를 위해 고지서를 보낼 때 고객들의 전화번호의 일부를 가립니다.
전화번호가 문자열 phone_number로 주어졌을 때, 전화번호의 뒷 4자리를 제외한 나머지 숫자를 전부 *으로 가린 문자열을 리턴하는 함수, solution을 완성해주세요.


### 제한 조건
s는 길이 4 이상, 20이하인 문자열입니다.


### 입출력 예
|phone_number|	return|
|---|---|
|01033334444|	*******4444|
|027778888|	*****8888|
---


###  내 코드 
```python
def solution(phone_number):
    answer = ''
    for i in range(len(phone_number)-4) :
        answer += '*'
    answer += phone_number[-4:]
    return answer
```
주어진 번호의 마지막 네 자리를 제외한 만큼 별을 찍고, `slice()`를 통해 주어진 번호의 마지막 네글자를 정답에 이어 붙여서 반환했다.

---


### 다른 사람의 코드
```python
def solution(s):
    return "*"*(len(s)-4) + s[-4:]
```
문자열의 경우, 간단하게 `*`를 통해 해결할 수 있었다.