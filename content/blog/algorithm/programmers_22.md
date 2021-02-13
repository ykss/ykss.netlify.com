---
title: '[프로그래머스] 시저 암호 - 파이썬'
date: 2020-12-26 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
어떤 문장의 각 알파벳을 일정한 거리만큼 밀어서 다른 알파벳으로 바꾸는 암호화 방식을 시저 암호라고 합니다. 예를 들어 AB는 1만큼 밀면 BC가 되고, 3만큼 밀면 DE가 됩니다. z는 1만큼 밀면 a가 됩니다. 문자열 s와 거리 n을 입력받아 s를 n만큼 민 암호문을 만드는 함수, solution을 완성해 보세요.


### 제한 조건
공백은 아무리 밀어도 공백입니다.
s는 알파벳 소문자, 대문자, 공백으로만 이루어져 있습니다.
s의 길이는 8000이하입니다.
n은 1 이상, 25이하인 자연수입니다.


### 입출력 예
|s	|n	|result|
|---|---|---|
|"AB"|	1|	"BC"|
|"z"	|1	|"a"|
|"a B z"|	|4|	"e F d"|
---


###  내 코드 
```python
def solution(s, n):
    answer = ''
    for i in s :
        if i.isupper() :
            answer += chr(ord(i)+n) if ord(i)+n < 91  else chr(ord(i)-26+n)
        elif i.islower() :
            answer += chr(ord(i)+n) if ord(i)+n < 123  else chr(ord(i)-26+n)
        elif i == ' ' :
            answer += i
    return answer
```
어떻게 해야할지 감이 잡히지 않아서 거의 하드코딩식으로 아스키 표를 보고 했다. 아스키표 상에서 대문자와 소문자인지 먼저 판단하고 나서 그 문자가 `z`나 `Z` 범위를 넘는지 확인한 후에 삼항연산으로 맞는 값을 리턴해서 정답 문자열에 붙여넣는 식으로 했다. 공백일 경우 그대로 붙여넣었다.


---


### 다른 사람의 코드
```python
def solution(s, n): 
    lower_list = "abcdefghijklmnopqrstuvwxyz"
    upper_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    result = []

    for i in s:
        if i is " ":
            result.append(" ")
        elif i.islower() is True:
            new_ = lower_list.find(i) + n
            result.append(lower_list[new_ % 26])
        else:
            new_ = upper_list.find(i) + n
            result.append(upper_list[new_ % 26])
    return "".join(result)
```
아예 소문자와 대문자를 리스트로 만들어 놓고 전체적인 구조는 내 방식과 비슷한 로직으로 전개했다. 문자가 소문자인지 대문자인지에 따라 참조하는 리스트에서 위치를 찾아서 그거슬 26으로 나누고 남은 나머지 번째 문자를 정답에 `append()`하여 정답 배열을 만들고, 마지막에 `''.join(result)`를 통해 문자열로 만들어 반환했다. 