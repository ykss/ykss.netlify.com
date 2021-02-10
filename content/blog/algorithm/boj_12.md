---
title: '[BOJ] 좌표 정렬하기'
date: 2021-02-11 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

2차원 평면 위의 점 N개가 주어진다. 좌표를 x좌표가 증가하는 순으로, x좌표가 같으면 y좌표가 증가하는 순서로 정렬한 다음 출력하는 프로그램을 작성하시오.

### 입력

첫째 줄에 점의 개수 N (1 ≤ N ≤ 100,000)이 주어진다. 둘째 줄부터 N개의 줄에는 i번점의 위치 xi와 yi가 주어진다. (-100,000 ≤ xi, yi ≤ 100,000) 좌표는 항상 정수이고, 위치가 같은 두 점은 없다.

### 출력

첫째 줄부터 N개의 줄에 점을 정렬한 결과를 출력한다.

### 예제 입출력

| 입력                                        | 출력                                 |
| ------------------------------------------- | ------------------------------------ |
| 5 <br/>3 4<br/>1 1<br/>1 -1<br/>2 2<br/>3 3 | 1 -1<br/>1 1<br/>2 2<br/>3 3<br/>3 4 |

---

### 내 코드

```python
testcase = int(input())
arr = list()
for _ in range(testcase):
    x, y = map(int,input().split(' '))
    arr.append((x,y))
arr.sort()
for x in arr:
    print(x[0], x[1])
```

내장 정렬 함수로 간단히 풀 수 있는 문제이다.