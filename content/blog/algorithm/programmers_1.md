---
title: '[프로그래머스] 두 개 뽑아서 더하기 - 파이썬'
date: 2020-12-10 23:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명
  
정수 배열 numbers가 주어집니다. numbers에서 서로 다른 인덱스에 있는 두 개의 수를 뽑아 더해서 만들 수 있는 모든 수를 배열에 오름차순으로 담아 return 하도록 solution 함수를 완성해주세요.


### 제한사항
numbers의 길이는 2 이상 100 이하입니다.
numbers의 모든 수는 0 이상 100 이하입니다.


### 입출력 예

|numbers|	result|
|---|---|
|[2,1,3,4,1]|	[2,3,4,5,6,7]|
|[5,0,2,7]|	[2,5,7,9,12]|


---


###  내 코드
```python
def solution(numbers):
    answer = [] 
    for i in range(len(numbers)): # 매개변수로 받은 배열의 길이 만큼 반복한다.
        for j in range(i+1,len(numbers)): 
            if numbers[i]+numbers[j] not in answer: # 두 수를 더한 결과가 answer배열에 있는지 확인한 후에 없을 경우에만 추가
                answer.append(numbers[i]+numbers[j]) 
    answer.sort() # 결과를 정렬한다.
    return answer
```
알고리즘 문제 푸는 것도 오랜만이고, 파이썬도 익숙치 않아서 아직 전혀 Pythonic하지 못하게 작성하고 있다. 기본적인 메서드들을 사용하면서 익숙해 져야 할 것 같다.

---


### 다른 사람의 코드
```python
from itertools import combinations

def solution(numbers):
    answer = []
    l = list(combinations(numbers, 2)) # numbers 리스트의 내용을 2개씩 묶는 모든 조합을 구하고 배열 l에 넣는다.

    for i in l:
        answer.append(i[0]+i[1])
    answer = list(set(answer))
    answer.sort()

    return answer
```
콤비네이션을 import 하여 사용했다. `combinations()`함수는 리스트에 있는 모든 조합을 구할 때 사용한다. 두 개의 인자를 받는데, 첫번째 인자는 리스트를 받고 두번째 인자에서는 리스트의 숫자들을 몇개씩 묶을지 지정하는 인자이다. 위 코드에서는 가능한 모든 조합을 배열로 만들고 그 배열들을 모두 더해서 `answer` 배열에 넣고 `set()`을 통해 중복을 제거한 후에 `sort()`정렬을 통해 정답을 구했다. itertools 의 combinations는 기억해두면 조합이 필요한 문제에 요긴하게 쓸 수 있을 듯 하다.