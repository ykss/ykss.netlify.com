---
title: '[프로그래머스] H-index - 파이썬'
date: 2021-03-29 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

H-Index는 과학자의 생산성과 영향력을 나타내는 지표입니다. 어느 과학자의 H-Index를 나타내는 값인 h를 구하려고 합니다. 위키백과1에 따르면, H-Index는 다음과 같이 구합니다.

어떤 과학자가 발표한 논문 n편 중, h번 이상 인용된 논문이 h편 이상이고 나머지 논문이 h번 이하 인용되었다면 h의 최댓값이 이 과학자의 H-Index입니다.

어떤 과학자가 발표한 논문의 인용 횟수를 담은 배열 citations가 매개변수로 주어질 때, 이 과학자의 H-Index를 return 하도록 solution 함수를 작성해주세요.

### 제한사항

과학자가 발표한 논문의 수는 1편 이상 1,000편 이하입니다.
논문별 인용 횟수는 0회 이상 10,000회 이하입니다.

### 입출력 예

| citations       | return |
| --------------- | ------ |
| [3, 0, 6, 1, 5] | 3      |

---

### 내 코드

```python
def solution(citations):
    answer = 0
    citations.sort(reverse = True)
    for i, v in enumerate(citations) :
        if i+1 <= v :
            answer = i+1
    return answer
```

이 문제는 먼저 H-index에 대한 정의에 대해서 알아야 하는데, 그 정의는 [여기](https://www.ibric.org/myboard/read.php?Board=news&id=270333)에서 참고하였다. 그리고 나서는 그 정하는 기준에 맞게 답을 구했다. 먼저 내림차순으로 정렬한 후에 `enumerate()`함수로 인덱스와 값을 함께 `for문`으로 돌려서 피인용 횟수가 논문 개수와 같아지거나 더 작아지기 시작하는 그 위치를 구하여 H-index를 구했다.

---

### 다른 사람의 풀이

```python
def solution(citations):
    citations.sort(reverse=True)
    answer = max(map(min, enumerate(citations, start=1)))
    return answer
```

함수와 쓰임새와 답을 구한 로직에서 참고할 부분들이 있었다. `enumerate()`에 `start`옵션이 있어서 인덱스의 시작 값을 정할 수 있다는 것을 알았고, `enumerate()`로 순서쌍을 쭉 뽑은 것들 중에서 `min()`을 통해 인덱스와 값 중에 작은 값들만 `map()`으로 뽑아냈다. 그리고 뽑힌 결과 배열에서 가장 큰 수를 뽑아내면 그게 H-index가 되었다. 그래도 비슷한 접근으로 풀어냈다는게 뿌듯했다.
