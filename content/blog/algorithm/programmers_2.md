---
title: '[프로그래머스] 완주하지 못한 선수 - 파이썬'
date: 2020-12-11 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명
수많은 마라톤 선수들이 마라톤에 참여하였습니다. 단 한 명의 선수를 제외하고는 모든 선수가 마라톤을 완주하였습니다.
마라톤에 참여한 선수들의 이름이 담긴 배열 participant와 완주한 선수들의 이름이 담긴 배열 completion이 주어질 때, 완주하지 못한 선수의 이름을 return 하도록 solution 함수를 작성해주세요.


### 제한사항
마라톤 경기에 참여한 선수의 수는 1명 이상 100,000명 이하입니다.
completion의 길이는 participant의 길이보다 1 작습니다.
참가자의 이름은 1개 이상 20개 이하의 알파벳 소문자로 이루어져 있습니다.
참가자 중에는 동명이인이 있을 수 있습니다.


### 입출력 예
|participant|completion|return|
|---|---|---|
|[leo, kiki, eden]|	[eden, kiki]	|leo|
|[marina, josipa, nikola, vinko, filipa]|	[josipa, filipa, marina, nikola]|	vinko|
|[mislav, stanko, mislav, ana]|	[stanko, ana, mislav]	|mislav|


---


###  내 코드
```python
def solution(participant, completion):

    participant.sort()
    completion.sort()
    for i in range(len(completion)):
        if participant[i] != completion[i]:
            return participant[i]
    return participant[i+1]
```
둘 다 정렬한 후에 참가자 리스트에는 존재하고, 완주자 목록에는 존재하지않는 참가자를 골라내 답으로 리턴했다.


---


### 다른 사람의 코드
```python
import collections

def solution(participant, completion):
    answer = collections.Counter(participant) - collections.Counter(completion)
    return list(answer.keys())[0]
```
`collections` 모듈의 `Counter`클래스를 사용했다. 단 세 줄의 코드로 풀었다. 호달달... Counter 클래스는 문자열을 주면 문자열에 포함된 문자의 개수를 체크하고, 리스트를 주면 리스트의 원소의 개수를 세준다. 위 코드에서는 앞에 참가자가 무조건 원소가 1개 더 많기 때문에 답을 구하면 딱 원소하나가 나오게 되고 그것이 답이 된다. `collections.Counter()` 꼭 기억하자.