---
title: '[BOJ] Z - 파이썬'
date: 2021-02-15 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

한수는 크기가 2N × 2N인 2차원 배열을 Z모양으로 탐색하려고 한다. 예를 들어, 2×2배열을 왼쪽 위칸, 오른쪽 위칸, 왼쪽 아래칸, 오른쪽 아래칸 순서대로 방문하면 Z모양이다.

![이미지1](https://upload.acmicpc.net/21c73b56-5a91-43aa-b71f-9b74925c0adc/-/preview/)

만약, N > 1이 라서 왼쪽 위에 있는 칸이 하나가 아니라면, 배열을 크기가 2N-1 × 2N-1로 4등분 한 후에 재귀적으로 순서대로 방문한다.

다음 예는 22 × 22 크기의 배열을 방문한 순서이다.

![이미지2](https://upload.acmicpc.net/adc7cfae-e84d-4d5c-af8e-ee011f8fff8f/-/preview/)

N이 주어졌을 때, r행 c열을 몇 번째로 방문하는지 출력하는 프로그램을 작성하시오.

다음은 N=3일 때의 예이다.

![이미지3](https://upload.acmicpc.net/d3e84bb7-9424-4764-ad3a-811e7fcbd53f/-/preview/_)

### 입력

첫째 줄에 정수 N, r, c가 주어진다.

### 출력

r행 c열을 몇 번째로 방문했는지 출력한다.

### 제한

1 ≤ N ≤ 15
0 ≤ r, c < 2N

### 예제 입출력

| 입력              | 출력        |
| ----------------- | ----------- |
| 2 3 1 </br> 3 7 7 | 11 </br> 63 |

---

### 내 코드 (참고)

```python
import sys
result = 0

def solve(n, x, y) :
    global result
    if x == targetRow and y == targetCol :
        print(int(result))
        exit(0)
        
    if n == 1 :
        result += 1
        return
    
    if not (x <= targetRow < x + n and y <= targetCol < y + n):
        result += n * n
        return
    solve(n / 2, x, y)
    solve(n / 2, x, y + n / 2)
    solve(n / 2, x + n / 2, y)
    solve(n / 2, x + n / 2, y + n/2)

N, targetRow, targetCol = map(int, sys.stdin.readline().split(' '))
solve(2 ** N, 0, 0)
```

이 문제는 제대로 혼자 힘으로 풀지는 못했다. 어떻게 풀어야할지 아이디어는 비슷하게 생각났는데, 이 부분을 어떻게 재귀적으로 구현해야 할지 고민이 되었다. 그리고 시간 제한도 걸려있어서, 하드코딩 적으로 풀기도 쉽지 않은 문제였다. 전체적으로 문제를 푸는 아이디어는 계속하여 2x2 사각형에 Z를 그릴 수 있도록 `solve()`라는 함수를 만들었다. 해당 함수는 2차원 배열 크기인 n과 위치인 x, y를 인수로 받는 함수인데, 처음에 2**N인 사이즈와 (0,0)을 먼저 인수로 전달하면서 시작된다. 해당 함수에서는 만약 x,y가 우리가 찾는 좌표일 경우에는 현재의 이동한 수인 `result`를 출력하고 종료한다. 만약 n == 1일 경우, 즉 가장 작은 한 칸을 만날 때마다 `result`를 증가시켜서 방문을 증가시킨다. `if not (x <= targetRow < x + n and y <= targetCol < y + n):` 이 부분이 시간을 단축시킬 수 있는 포인트 부분인데, 만약 사각형의 범위 내에 찾고자 하는 좌표가 없을 때는 그 범위안에 있는 모든 사각형의 개수를 `result`에 누적 시켜준다. 이게 시간을 많이 단축 시킬 수 있는 아이디어라고 할 수 있다.
