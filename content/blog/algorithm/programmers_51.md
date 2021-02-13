---
title: '[프로그래머스] 올바른 괄호 - 파이썬'
date: 2021-01-27 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

괄호가 바르게 짝지어졌다는 것은 '(' 문자로 열렸으면 반드시 짝지어서 ')' 문자로 닫혀야 한다는 뜻입니다. 예를 들어

()() 또는 (())() 는 올바른 괄호입니다.
)()( 또는 (()( 는 올바르지 않은 괄호입니다.
'(' 또는 ')' 로만 이루어진 문자열 s가 주어졌을 때, 문자열 s가 올바른 괄호이면 true를 return 하고, 올바르지 않은 괄호이면 false를 return 하는 solution 함수를 완성해 주세요.

### 제한사항

문자열 s의 길이 : 100,000 이하의 자연수
문자열 s는 '(' 또는 ')' 로만 이루어져 있습니다.

### 입출력 예

| s      | answer |
| ------ | ------ |
| ()()   | true   |
| (())() | true   |
| )()(   | false  |
| (()(   | false  |

---

### 내 코드

```python
def solution(s):
    answer = True
    flag = 0
    for n in s :
        if flag < 0 :
            return False
        if n == '(' :
            flag += 1
        else :
            flag -= 1
    return True if flag == 0 else False
```

`flag` 용도로 쓸 변수를 선언하고 해당 변수를 이용하여 괄호가 올바른지를 체크했다. 만약에 `flag`가 음수가 되는 경우는 `)`가 먼저 나오는 경우라서 바로 올바르지 않기 때문에 `False`를 리턴했고, `(`이 나오는 경우는 `flag`를 증가시키고 `)`이 나오는 경우 `flag`를 감소시켜서 만약에 `0`이 되면 괄호가 열린만큼 닫힌거라 `True`를 리턴했고 `0`보다 크면 `(`가 더 많이 떴다는 뜻으로 `False`를 리턴했다.

---

### 다른 사람의 코드

```python
def solution(s):
    x = 0
    for w in s:
        if x < 0:
            break
        x = x+1 if w=="(" else x-1 if w==")" else x
    return x==0
```

세세한 부분만 다르고 푼 로직은 대부분 비슷한 코드였다. 레벨 2이지만 레벨 1같은 간단한 문제였다.