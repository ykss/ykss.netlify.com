---
title: '[프로그래머스] 음양더하기 - 파이썬'
date: 2021-04-19 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

어떤 정수들이 있습니다. 이 정수들의 절댓값을 차례대로 담은 정수 배열 absolutes와 이 정수들의 부호를 차례대로 담은 불리언 배열 signs가 매개변수로 주어집니다. 실제 정수들의 합을 구하여 return 하도록 solution 함수를 완성해주세요.

### 제한사항

absolutes의 길이는 1 이상 1,000 이하입니다.
absolutes의 모든 수는 각각 1 이상 1,000 이하입니다.
signs의 길이는 absolutes의 길이와 같습니다.
signs[i] 가 참이면 absolutes[i] 의 실제 정수가 양수임을, 그렇지 않으면 음수임을 의미합니다.

### 입출력 예

| absolutes | signs              | result |
| --------- | ------------------ | ------ |
| [4,7,12]  | [true,false,true]  | 9      |
| [1,2,3]   | [false,false,true] | 0      |

---

### 내 코드

```python
def solution(absolutes, signs):
    results = []
    for i in zip(absolutes, signs) :
        if i[1] == False :
            results.append(i[0] * -1)
        else :
            results.append(i[0])
    return sum(results)
```

절대값 배열과 부호 배열을 받아서, `zip()`을 써서 하나의 튜플로 만들고 해당 튜플에서 부호가 마이너스일 경우 해당 값을 마이너스로 만들어서 배열에 넣고, 아닐경우 그대로 넣은 후에 마지막에 해당 배열의 값을 `sum()`을 통해 모두 더한 값을 답으로 구했다.

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
