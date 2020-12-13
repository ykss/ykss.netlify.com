---
title: '[프로그래머스] 문자열 내 p와 y의 개수'
date: 2020-12-14 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
대문자와 소문자가 섞여있는 문자열 s가 주어집니다. s에 'p'의 개수와 'y'의 개수를 비교해 같으면 True, 다르면 False를 return 하는 solution를 완성하세요. 'p', 'y' 모두 하나도 없는 경우는 항상 True를 리턴합니다. 단, 개수를 비교할 때 대문자와 소문자는 구별하지 않습니다.

예를 들어 s가 pPoooyY면 true를 return하고 Pyy라면 false를 return합니다.


### 제한사항
문자열 s의 길이 : 50 이하의 자연수
문자열 s는 알파벳으로만 이루어져 있습니다.


### 입출력 예
|s	|answer|
|---|---|
|pPoooyY	|true|
|Pyy	|false|


---


###  내 코드
```python
def solution(s):
    answer = True
    pCount = yCount = 0
    for i in range(len(s)):
        if s[i].lower()=='p':
            pCount += 1
        elif s[i].lower()=='y':
            yCount += 1
    if pCount != yCount:
        answer = False   
    
    return answer
```
`pCount`와 `yCount`를 만들어서 각각 문자를 셀 수 있도록 하는 변수를 만들고, 대소문자를 구문하지 않기 때문에 모두 소문자로 바꾸어 주기 위해서 `lower()`을 사용했다. 그 이후에 단순 비교를 통해서 배열의 인덱스가 p 또는 y와 일치할 경우 카운트를 늘렸고, 최종으로 개수를 비교하여 같으면 `True` 다르면 `False`가 출력되도록 작성헀다.

---


### 다른 사람의 코드
```python
def solution(s):
    return s.lower().count('p') == s.lower().count('y')
```
단 한줄로 끝내버렸다. 간결하게 작성할 수도 있고, `count()`라는 메서드를 사용하여 쉽게 코드의 의도도 파악할 수 있기 때문에 훨씬 깔끔하다고 생각한다.