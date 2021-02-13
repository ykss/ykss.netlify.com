---
title: '[프로그래머스] 제일 작은 수 제거하기 - 파이썬'
date: 2020-12-13 21:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
정수를 저장한 배열, arr 에서 가장 작은 수를 제거한 배열을 리턴하는 함수, solution을 완성해주세요. 단, 리턴하려는 배열이 빈 배열인 경우엔 배열에 -1을 채워 리턴하세요. 예를들어 arr이 [4,3,2,1]인 경우는 [4,3,2]를 리턴 하고, [10]면 [-1]을 리턴 합니다.


### 제한 조건
arr은 길이 1 이상인 배열입니다.
인덱스 i, j에 대해 i ≠ j이면 arr[i] ≠ arr[j] 입니다.


### 입출력 예
|arr	|return|
|---|---|
|[4,3,2,1]|	[4,3,2]|
|[10]|	[-1]|

---


###  내 코드
```python
def solution(arr):
    answer = []
    del arr[arr.index(min(arr))]
    answer = arr
    if len(answer) == 0 :
        answer.append(-1)
    return answer
```
배열에서 `min()`을 통해 가장 작은 수의 index를 알아내서 해당 배열을 지운 후에 `answer`배열에 넣고, 만약에 빈 배열일 경우 `-1`을 넣어주어 리턴하도록 했다.


---


### 다른 사람의 코드
```python
def solution(s)::
    arr.remove(min(arr))
    return [-1] if not len(arr) else arr
```
이 문제는 뭔가 참신하고 깔끔하게 푼 코드는 눈에 띄지 않았다. `remove()`함수를 쓰는 것이랑 `return`문에 `if not`문을 사용하는 부분을 참고하여 이런식으로 할 수도 있다는 참고만 하면 좋을 것 같다.