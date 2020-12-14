---
title: '[프로그래머스] 문자열 다루기 기본'
date: 2020-12-15 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
문자열 s의 길이가 4 혹은 6이고, 숫자로만 구성돼있는지 확인해주는 함수, solution을 완성하세요. 예를 들어 s가 a234이면 False를 리턴하고 1234라면 True를 리턴하면 됩니다.


### 제한 사항
s는 길이 1 이상, 길이 8 이하인 문자열입니다.


### 입출력 예
|s	|return|
|---|---|
|a234|	false|
|1234|	true|

---


###  내 코드
```python
def solution(s):
    if (len(s) == 4 or len(s) == 6) and s.isdigit()  :
        return True
    return False
```
코드를 깔끔하게 다른 방식으로 짜봤으면 좋을텐데 문제 그대로 `if`문으로 걸러서 답을 구했다. 비효율적으로 느껴지긴 한다.

---


### 다른 사람의 코드
```python
def solution(s):
    return s.isdigit() and (len(s) == 4 or len(s) == 6)

def solution(s):
    return s.isdigit() and len(s) in (4, 6)
```
나와 방법은 똑같으나 굳이 if문을 쓸 필요도 없었고 한줄로 깔끔하게 나왔다. 두번째 방법은 더 깔끔하게 보이도록 `in`을 통하여 답을 구했다. `isdigit()`이나 `isalpha()`와 같은 문자열에 숫자, 문자가 포함되어있는지 알 수 있는 메소드들이 여러개 있기때문에 숙지해두면 좋을 듯 하다.