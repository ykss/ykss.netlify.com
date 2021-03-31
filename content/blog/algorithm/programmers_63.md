---
title: '[프로그래머스] JadenCase 문자열 만들기 - 파이썬'
date: 2021-04-01 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

JadenCase란 모든 단어의 첫 문자가 대문자이고, 그 외의 알파벳은 소문자인 문자열입니다. 문자열 s가 주어졌을 때, s를 JadenCase로 바꾼 문자열을 리턴하는 함수, solution을 완성해주세요.

### 제한 조건

s는 길이 1 이상인 문자열입니다.
s는 알파벳과 공백문자(" ")로 이루어져 있습니다.
첫 문자가 영문이 아닐때에는 이어지는 영문은 소문자로 씁니다. ( 첫번째 입출력 예 참고 )

### 입출력 예

| s                       | return                  |
| ----------------------- | ----------------------- |
| "3people unFollowed me" | "3people Unfollowed Me" |
| "for the last week"     | "For The Last Week"     |

---

### 내 코드

```python
def solution(s):
    answer = ''
    for i, x in enumerate(s) :
        if i == 0 :
            answer = x.upper()
        elif s[i-1] == ' ' :
            answer = ''.join([answer,x.upper()])
        else :
            answer = ''.join([answer,x.lower()])
    return answer
```

처음에는 `split()`으로 단어를 나눠서 해당 단어들을 `capitalize()`를 통해서 대문자로 만들었었는데, 문제되는 부분이 공백의 개수도 그대로 유지해야 하는 경우가 있었다. 그래서 `replace()`로 해결해보려고 했지만 `aaaaa aaa` 같은 테스트 케이스의 경우에는 의도치않게 `AAaaa aaa`와 같은 결과가 나오게되면서 그 방법도 실패했다. 그래서 결국 문자열 s를 통 채로 받아서 첫번째 인덱스는 대문자로 처리하고 그 이후부터는 이전 문자가 공백일 경우 대문자로, 아닐경우 소문자로 해서 정답 문자열에 붙였다.

### 다른 사람의 풀이

```python
def solution(s):
    return ' '.join([word.capitalize() for word in s.split(" ")])
```

이렇게 하면 내가 원래 시도했던 방식으로 풀 수 있었다. 내가 실수 했던 부분은 `split()`으로 했던 건데, `split(' ')`으로 공백 부분만 구분으로 넣어도, 해당 문자열에서 공백까지 하나의 원소로 끊어준다. 그렇기 때문에 조인할 때, 자연스럽게 정답을 구할 수 있었다. `split()`함수만 해도 사소해보이는 하나로 결과가 달라지니 이 부분을 꼭 기억해야겠다.
