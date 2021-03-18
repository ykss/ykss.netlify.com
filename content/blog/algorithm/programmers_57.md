---
title: '[프로그래머스] 더 맵게 - 파이썬'
date: 2021-03-18 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

매운 것을 좋아하는 Leo는 모든 음식의 스코빌 지수를 K 이상으로 만들고 싶습니다. 모든 음식의 스코빌 지수를 K 이상으로 만들기 위해 Leo는 스코빌 지수가 가장 낮은 두 개의 음식을 아래와 같이 특별한 방법으로 섞어 새로운 음식을 만듭니다.

섞은 음식의 스코빌 지수 = 가장 맵지 않은 음식의 스코빌 지수 + (두 번째로 맵지 않은 음식의 스코빌 지수 \* 2)
Leo는 모든 음식의 스코빌 지수가 K 이상이 될 때까지 반복하여 섞습니다.
Leo가 가진 음식의 스코빌 지수를 담은 배열 scoville과 원하는 스코빌 지수 K가 주어질 때, 모든 음식의 스코빌 지수를 K 이상으로 만들기 위해 섞어야 하는 최소 횟수를 return 하도록 solution 함수를 작성해주세요.

### 제한 사항

scoville의 길이는 2 이상 1,000,000 이하입니다.
K는 0 이상 1,000,000,000 이하입니다.
scoville의 원소는 각각 0 이상 1,000,000 이하입니다.
모든 음식의 스코빌 지수를 K 이상으로 만들 수 없는 경우에는 -1을 return 합니다.

### 입출력 예

| scoville             | K   | return |
| -------------------- | --- | ------ |
| [1, 2, 3, 9, 10, 12] | 7   | 2      |

---

### 내 코드 (효율성 실패)

```python
def solution(scoville, K):
    answer = 0
    scoville.sort()
    if scoville[-1] == 0 :
        return -1
    while scoville[0] < K and scoville:
        if len(scoville) < 2 :
            return -1
        first = scoville.pop(0)
        second = scoville.pop(0)
        mix = first + second * 2
        scoville.append(mix)
        scoville.sort()
        answer += 1
    return answer
```

위 코드는 배열을 정렬한 이후에, 앞의 원소 부터 빼서 섞고나서 다시 배열에 넣고, 정렬하는 식으로 구하였는데, 모든 테스트 케이스는 통과했지만, 효율성을 하나도 통과하지 못했다. 아무래도 매번 빼고 넣을 때마다 정렬을 하다보니 리스트의 크기가 클 때는 효율성이 나오지 않았던 것이 문제였을 것으로 보였다.

---

### 내 코드 (정답)

```python
import heapq

def solution(scoville, K):
    answer = 0
    heap = []
    for i in scoville :
        heapq.heappush(heap, i)
    if heap[-1] == 0 :
        return -1
    while heap[0] < K and heap:
        if len(heap) < 2 :
            return -1
        first = heapq.heappop(heap)
        second = heapq.heappop(heap)
        mix = first + second * 2
        heapq.heappush(heap,mix)
        answer += 1
    return answer
```

그래서 heapq 라는 모듈을 가져와서 썼는데, `heapq`는 이진 트리 기반의 최소 힙 자료구조를 제공하는 모듈이다. 가장 큰 특징은 원소가 추가되고 삭제될 때마다 자동으로 정렬된다는 특징이 있다. 그래서 기존 로직과 같은 상태에서 heapq로 적용만 했는데, 그대로 효율성을 모두 통과할 수 있었다.
