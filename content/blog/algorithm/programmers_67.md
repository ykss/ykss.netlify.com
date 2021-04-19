---
title: '[프로그래머스] 괄호 회전하기 - 파이썬'
date: 2021-04-20 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

다음 규칙을 지키는 문자열을 올바른 괄호 문자열이라고 정의합니다.

(), [], {} 는 모두 올바른 괄호 문자열입니다.
만약 A가 올바른 괄호 문자열이라면, (A), [A], {A} 도 올바른 괄호 문자열입니다. 예를 들어, [] 가 올바른 괄호 문자열이므로, ([]) 도 올바른 괄호 문자열입니다.
만약 A, B가 올바른 괄호 문자열이라면, AB 도 올바른 괄호 문자열입니다. 예를 들어, {} 와 ([]) 가 올바른 괄호 문자열이므로, {}([]) 도 올바른 괄호 문자열입니다.
대괄호, 중괄호, 그리고 소괄호로 이루어진 문자열 s가 매개변수로 주어집니다. 이 s를 왼쪽으로 x (0 ≤ x < (s의 길이)) 칸만큼 회전시켰을 때 s가 올바른 괄호 문자열이 되게 하는 x의 개수를 return 하도록 solution 함수를 완성해주세요.

### 제한사항

s의 길이는 1 이상 1,000 이하입니다.

### 입출력 예

| s        | result |
| -------- | ------ |
| "[](){}" | 3      |
| "}]()[{" | 2      |
| "[)(]"   | 0      |
| "}}}"    | 0      |

---

### 내 코드

```python
def get_pair(x) :
    if x == ']' :
        return '['
    elif x == '}' :
        return '{'
    else :
        return '('
# [(])
def is_correct(s) :
    if s[0] in ['}',')',']'] :
        return False
    stack = []
    recent = []
    for i in s :
        if i in ('(','[','{') :
            recent.append(i)
            stack.append(i)
        else :
            if recent :
                if get_pair(i) == recent.pop() :
                    stack.append(i)
                else :
                    return False
            else : return False
    if len(stack) % 2 != 0 :
        return False
    return True

def solution(s):
    answer = 0
    s = list(s)
    if is_correct(s):
        answer += 1
    for i in range(len(s)-1) :
        temp = s.pop(0)
        s.append(temp)
        if is_correct(s) :
            answer += 1
    return answer
```

어떻게 답을 구해야 할지에 대해서 큼직한 로직은 금방 생각해냈는데, 생각보다 해당 괄호 문자열이 옳은지 판별하는 로직 처리가 까다로웠던 것 같다. 코드 챌린지 할 때는 다 맞았는데, 실제로 문제로 제출하니 마지막 케이스에서 오답이 발생했는데, 보니까 `[(])` 이런 경우에 잘못된 결과를 출력 하고 있었다. 그래서 그 부분에 대해서 `result` 스택에서 `pop()`한 것을 비교하는 로직을 추가하였더니 풀 수 있었다. 다만 로직이 충분히 정리되지 않아서 코드를 매우 복잡하게 짠 것 같다.

### 다른 사람의 풀이

```python
def solution(absolutes, signs):
    answer=0
    for absolute,sign in zip(absolutes,signs):
        if sign:
            answer+=absolute
        else:
            answer-=absolute
    return answer

```

문제 자체가 어려운 문제가 아니기때문에 로직도 다 비슷한 것 같았다. 그리고 `zip()`을 쓸 때는 튜플 형태로 쓰지 않고, 위와 같이 그냥 변수로 쓰면 더 깔끔하다는 생각이 들었다. 그리고 -1을 곱해주거나 할 필요 없이 더하기, 빼기로 더 단순하게 구할 수 있었던 것 같다.
