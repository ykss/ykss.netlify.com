---
title: '[프로그래머스] 타겟 넘버 - 파이썬'
date: 2021-01-25 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

n개의 음이 아닌 정수가 있습니다. 이 수를 적절히 더하거나 빼서 타겟 넘버를 만들려고 합니다. 예를 들어 [1, 1, 1, 1, 1]로 숫자 3을 만들려면 다음 다섯 방법을 쓸 수 있습니다.

```python
-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3
```

사용할 수 있는 숫자가 담긴 배열 numbers, 타겟 넘버 target이 매개변수로 주어질 때 숫자를 적절히 더하고 빼서 타겟 넘버를 만드는 방법의 수를 return 하도록 solution 함수를 작성해주세요.

### 제한사항

주어지는 숫자의 개수는 2개 이상 20개 이하입니다.
각 숫자는 1 이상 50 이하인 자연수입니다.
타겟 넘버는 1 이상 1000 이하인 자연수입니다.

### 입출력 예

| numbers         | target | return |
| --------------- | ------ | ------ |
| [1, 1, 1, 1, 1] | 3      | 5      |

---

### 내 코드

```python
def solution(numbers, target):
    answer = 0
    currList = [numbers[0],-numbers[0]]
    for i in range(1,len(numbers)) :
        nextNum = numbers[i]
        nextList = []
        for num in currList :
            nextList.append(num + nextNum)
            nextList.append(num - nextNum)
        currList = nextList
    for num in currList :
        if num == target :
            answer += 1
    return answer
```

이 방법은 브루트포스 방식에 가깝다. 모든 경우의 수를 계산하는 방법으로 `currList`배열에 같은 인덱스의 `+`와 `-`를 모두 담아서 모든 케이스를 구했다. 마이너스에 더할 경우, 플러스에 더할 경우, 마이너스에서 뺄 경우, 플러스에서 뺄 경우, 이런 식으로 모든 케이스를 `nextList`에 넣고, 그렇게 구한 `nextList`를 바탕으로 새로운 `currList`를 만들고, 그렇게 마지막 수까지 더하거나 뺴서 그것들을 모두 모아서 `currList`에 담은 후에 해당 배열에서 `target`과 같은 수를 카운트 하여 정답을 구했다.

---

### 다른 사람의 코드

```python
def solution(numbers, target):
    if not numbers and target == 0 :
        return 1
    elif not numbers:
        return 0
    else:
        return solution(numbers[1:], target-numbers[0]) + solution(numbers[1:], target+numbers[0])


from itertools import product
def solution(numbers, target):
    l = [(x, -x) for x in numbers]
    s = list(map(sum, product(*l)))
    return s.count(target)
```

매우 간단하고 짧게 구한 것 같았다. 재귀를 써서 구했는데, 쉽게 떠올릴 만한 방법은 아니었던 것 같다. 첫번째 `if`문에서 `numbers`가 빈 배열이고 `target`이 0이면 1을 리턴하도록했고, 만약에 배열이 비어있으면 0을 리턴하도록 했고 두 경우가 아니라면 재귀적으로 `solution`함수를 호출하도록 했다. 하나는 마이너스한 것으로 하나는 플러스한것으로 재귀적 호출을 해서 더했다. 사실 완전히 잘 이해가 되는 코드는 아니었다. 재귀는 이해하더라도 내가 실제로 이렇게 풀긴 어려울 것 같았다...

두번째 코드는 `itertools` 모듈에서 `product()`함수를 썼는데, `cartesian product`을 구해주는 함수이다. 그리고 `map()`을 통해 모든 케이스를 더한 것을 리스트로 만들고 해당 리스트에서 `target`을 카운트했다.
