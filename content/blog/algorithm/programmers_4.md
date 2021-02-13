---
title: '[프로그래머스] 가운데 글자 가져오기 - 파이썬'
date: 2020-12-12 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
단어 s의 가운데 글자를 반환하는 함수, solution을 만들어 보세요. 단어의 길이가 짝수라면 가운데 두글자를 반환하면 됩니다.


### 제한사항
s는 길이가 1 이상, 100이하인 스트링입니다.


### 입출력 예
|s	|return|
|---|---|
|"abcde"|	"c"|
|"qwer" |"we"|
---


###  내 코드
```python
def solution(s):
    answer = ''
    if len(s) % 2 == 0:
        answer = s[len(s)//2-1 : len(s)//2+1]
    else :
        answer = s[len(s)//2]
    return answer
```
문제 그대로 주어진 문자열이 홀수인지 짝수인지에 따라 분기하여 처리하였다.


---


### 다른 사람의 코드
```python
def solution(s)::
    return s[(len(s)-1)//2:len(s)//2+1]
```
변수를 사용하지 않고 받아온 인자를 그대로 이용하고 `slice`를 통해 바로 적용하였다. 매우 간결하지만 가독성으로 볼 때 더 낫게 작성했다고 생각이 들지는 않는다. 분기를 하지않고도 작성한 로직은 참고해보면 좋을 것 같다.