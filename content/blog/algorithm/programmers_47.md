---
title: '[프로그래머스] 큰 수 만들기 - 파이썬'
date: 2021-01-22 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

어떤 숫자에서 k개의 수를 제거했을 때 얻을 수 있는 가장 큰 숫자를 구하려 합니다.

예를 들어, 숫자 1924에서 수 두 개를 제거하면 [19, 12, 14, 92, 94, 24] 를 만들 수 있습니다. 이 중 가장 큰 숫자는 94 입니다.

문자열 형식으로 숫자 number와 제거할 수의 개수 k가 solution 함수의 매개변수로 주어집니다. number에서 k 개의 수를 제거했을 때 만들 수 있는 수 중 가장 큰 숫자를 문자열 형태로 return 하도록 solution 함수를 완성하세요.

### 제한 조건

number는 1자리 이상, 1,000,000자리 이하인 숫자입니다.
k는 1 이상 number의 자릿수 미만인 자연수입니다.

### 입출력 예

| number     | k   | return |
| ---------- | --- | ------ |
| 1924       | 2   | 94     |
| 1231234    | 3   | 3234   |
| 4177252841 | 4   | 775841 |

---

### 내 코드

```python
def solution(number, k):
    collected = []
    for i, num in enumerate(number) :
        while collected and collected[-1] < num and k > 0 : 
            collected.pop()
            k -= 1
        if k == 0 : 
            collected += number[i:]
            break
        collected.append(num)
    collected = collected[:-k] if k > 0 else collected
    return ''.join(list(map(str,collected)))
```
이 문제도 한 단계 더 생각했어야 하는 문제였다. 처음에는 가장 작은 수를 뽑거나 하는 식으로 하거나, `k`까지 잘라서 구하고 뒷부분을 또 구하는 방식을 하려고했는데, 생각보다 여러가지 케이스가 존재해서 모두 다 분기처리하기는 어려웠다. 그래서 `collected`라는 배열에 만약에 해당 배열이 비어있지 않고 맨 뒤에 들어간 숫자가 지금 주어진 `num`과 비교해서 더 작고, `k`가 0보다 크면 해당 수를 제거하고 `k`를  `-1`해줬다. 그리고 만약 `k`가 `0`이 되면 이제 더이상 뺼 수가 없기 때문에 남은 수들을 뒤에 붙여줬다. 그리고 만약에 모든 수를 지나왔는데도 `k`가 남을 경우(예를들면 87654321, k=3)에는 맨 뒤에 `k`개를 제거했다.

---

### 다른 사람의 코드

```python
def solution(number, k):
    stack = [number[0]]
    for num in number[1:]:
        while len(stack) > 0 and stack[-1] < num and k > 0:
            k -= 1
            stack.pop()
        stack.append(num)
    if k != 0:
        stack = stack[:-k]
    return ''.join(stack)
```
이 답안은 `stack`을 사용했다. 스택에 처음 맨 처음 수를 넣어놓고 시작했고, `for`문을 통해서 두번쨰 수부터 꺼내어 나와 같은 조건으로 `while`문을 돌려서 같은 처리를 해주었고, 만약 `k`가 `0`이 아니면 맨 뒤 숫자를 잘라냈다. 차이점은 나처럼 `if`문을 통해 `k`가 `0`일 때는 따로 관리해주지 않았다. 
