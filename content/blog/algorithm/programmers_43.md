---
title: '[프로그래머스] 프린터'
date: 2021-01-17 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

일반적인 프린터는 인쇄 요청이 들어온 순서대로 인쇄합니다. 그렇기 때문에 중요한 문서가 나중에 인쇄될 수 있습니다. 이런 문제를 보완하기 위해 중요도가 높은 문서를 먼저 인쇄하는 프린터를 개발했습니다. 이 새롭게 개발한 프린터는 아래와 같은 방식으로 인쇄 작업을 수행합니다.

1. 인쇄 대기목록의 가장 앞에 있는 문서(J)를 대기목록에서 꺼냅니다.
2. 나머지 인쇄 대기목록에서 J보다 중요도가 높은 문서가 한 개라도 존재하면 J를 대기목록의 가장 마지막에 넣습니다.
3. 그렇지 않으면 J를 인쇄합니다.

예를 들어, 4개의 문서(A, B, C, D)가 순서대로 인쇄 대기목록에 있고 중요도가 2 1 3 2 라면 C D A B 순으로 인쇄하게 됩니다.

내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 알고 싶습니다. 위의 예에서 C는 1번째로, A는 3번째로 인쇄됩니다.

현재 대기목록에 있는 문서의 중요도가 순서대로 담긴 배열 priorities와 내가 인쇄를 요청한 문서가 현재 대기목록의 어떤 위치에 있는지를 알려주는 location이 매개변수로 주어질 때, 내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 return 하도록 solution 함수를 작성해주세요.

### 제한사항

현재 대기목록에는 1개 이상 100개 이하의 문서가 있습니다.
인쇄 작업의 중요도는 1~9로 표현하며 숫자가 클수록 중요하다는 뜻입니다.
location은 0 이상 (현재 대기목록에 있는 작업 수 - 1) 이하의 값을 가지며 대기목록의 가장 앞에 있으면 0, 두 번째에 있으면 1로 표현합니다.

### 입출력 예

| priorities         | location | return |
| ------------------ | -------- | ------ |
| [2, 1, 3, 2]       | 2        | 1      |
| [1, 1, 9, 1, 1, 1] | 0        | 5      |

---

### 내 코드

```python
def solution(priorities, location):
    printList = []
    priorities = [ (i,v) for i,v in enumerate(priorities) ]
    target = priorities[location]
    while(priorities) :
        if priorities[0] == max(priorities,key = lambda x : x[1]) :
            printList.append(priorities[0])
            priorities.remove(priorities[0])
        else :
            priorities.append(priorities[0])
            priorities.remove(priorities[0])
    return printList.index(target)+1
```

처음 문제를 봤을 떄는 되게 쉽게 풀 수 있는 문제로 생각했는데, 생각보다 까다로웠다. 먼저 우선순위 대로 출력한 결과를 담는 `printList` 배열을 만들고, 일단 주어진 우선 순위 배열을 `enumerate()` 함수를 통해 인덱스와 같이 튜플로 저장되는 형태로 했다. 그 이유는 우선 순위가 같은 경우, 어떤게 몇번째 문서였는지를 알 수 없기 때문에 `key`값으로 인덱스를 넣어줬다. 그리고 주어진 `location`을 통해서 마지막에 위치를 찾을 것을 `target`으로 저장해놓고 `while`을 통해 `priorities` 배열이 빈 배열이 될 때까지 반복시켰다. 그리고 `max()`를 통해 튜플에서 우선순위를 기준으로 최대값을 계산하여 해당 우선순위 배열에서 맨 앞의 튜플을 뽑았을 때 그 튜플이 최대 값이 튜플이라면 출력하여 출력 리스트에 넣고, 우선순위 리스트에서는 해당 튜플을 제거하였고, 만약 최대값이 아니라면 맨 앞에서 지우고 맨 뒤에 추가하였다. 이런식으로 출력 순서대로 들어가있는 `printList`를 기준으로 해당 `target`이 리스트의 어느 인덱스에 위치해있는지 `index()`함수를 통해서 구하였다.

---

### 다른 사람의 코드

```python
def solution(priorities, location):
    queue =  [(i,p) for i,p in enumerate(priorities)]
    answer = 0
    while True:
        cur = queue.pop(0)
        if any(cur[1] < q[1] for q in queue):
            queue.append(cur)
        else:
            answer += 1
            if cur[0] == location:
                return answer
```

가장 좋아요를 많이 받은 코드였고, 나와 같은 목적으로 `enumerate()` 함수를 사용했다. 그리고 `while` 문을 사용했고, 그 뒤로는 `cur`변수에 `queue.pop(0)`을 통해서 첫 번째 인덱스를 뽑아서 해당 튜플에서 `if`문에서 하나라도 더 우선순위가 더 큰게 존재하면 다시 뒤쪽에 `append()`를 사용해서 넣고, 만약 가장 큰 값이라면 `answer`을 증가시키고 만약에 해당 인덱스가 찾아야 할 `location`과 같으면 `answer`을 리턴했다. 여기서 `any()`도 포인트가 되는 부분인데, 하나라도 `True`이면 true를 반환하도록 하는 것이다. 그리고 내가 간과했던 것은 `pop()`이 맨 뒤에꺼만 뽑을 수 있다고 생각헀는데, 인덱스를 통해 뽑을 수 있다는 것을 알았고, 앞으로 더 유용하게 쓸 수 있을 것 같다. 