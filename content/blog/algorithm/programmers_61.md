---
title: '[프로그래머스] 카펫 - 파이썬'
date: 2021-03-24 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

Leo는 카펫을 사러 갔다가 아래 그림과 같이 중앙에는 노란색으로 칠해져 있고 테두리 1줄은 갈색으로 칠해져 있는 격자 모양 카펫을 봤습니다.

![문제사진](https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/b1ebb809-f333-4df2-bc81-02682900dc2d/carpet.png)

Leo는 집으로 돌아와서 아까 본 카펫의 노란색과 갈색으로 색칠된 격자의 개수는 기억했지만, 전체 카펫의 크기는 기억하지 못했습니다.

Leo가 본 카펫에서 갈색 격자의 수 brown, 노란색 격자의 수 yellow가 매개변수로 주어질 때 카펫의 가로, 세로 크기를 순서대로 배열에 담아 return 하도록 solution 함수를 작성해주세요.

### 제한사항

갈색 격자의 수 brown은 8 이상 5,000 이하인 자연수입니다.
노란색 격자의 수 yellow는 1 이상 2,000,000 이하인 자연수입니다.
카펫의 가로 길이는 세로 길이와 같거나, 세로 길이보다 깁니다.

### 입출력 예

| brown | yellow | return |
| ----- | ------ | ------ |
| 10    | 2      | [4, 3] |
| 8     | 1      | [3, 3] |
| 24    | 24     | [8, 6] |

---

### 내 코드

```python
def solution(brown, yellow):
    term = ((brown+4)**2 /4 - 4 * (brown + yellow))**0.5
    w = ((brown + 4) / 2 + term) / 2
    h = ((brown + 4) / 2 - term) / 2
    return [w,h]
```

갈색은 테두리의 개수이므로, 식을 구해서 풀었는데, 사실 이 문제는 완전탐색 유형 문제였다. 하지만 완전탐색으로 풀 방법을 몰라서, 수식을 만들어 풀었다. 완전탐색에 대해서 공부하고 해야겠다.

---

### 다른 사람의 풀이

```python
def solution(brown, yellow):
    for i in range(1, yellow + 1):
        if yellow % i == 0:
            if 2 * (i + yellow//i) + 4 == brown:
                return [yellow//i + 2, i + 2]
```

노란색의 약수를 모두 구한 후에 노란색을 약수로 나눈 후에 약수를 더하고 곱하기 2한 후 4를 더한 값이 갈색의 개수와 일치하는 값을 구했다. 이 경우도 결국 테두리의 개수를 맞추는 식으로 구한 부분이다.
