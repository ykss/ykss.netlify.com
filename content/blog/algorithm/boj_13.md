---
title: '[BOJ] 수 정렬하기3 - 파이썬'
date: 2021-02-12 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

N개의 수가 주어졌을 때, 이를 오름차순으로 정렬하는 프로그램을 작성하시오.

### 입력

첫째 줄에 수의 개수 N(1 ≤ N ≤ 10,000,000)이 주어진다. 둘째 줄부터 N개의 줄에는 숫자가 주어진다. 이 수는 10,000보다 작거나 같은 자연수이다.

### 출력

첫째 줄부터 N개의 줄에 오름차순으로 정렬한 결과를 한 줄에 하나씩 출력한다.

### 예제 입출력

| 입력                                                                     | 출력                                                             |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 10 <br/>5 <br/>2 <br/>3 <br/>1 <br/>4 <br/>2 <br/>3 <br/>5 <br/>1 <br/>7 | 1 <br/> 1 <br/>2 <br/>2 <br/>3 <br/>3 <br/>4 <br/>5 <br>5 <br/>7 |

---

### 내 코드 (오답)

```python
N = int(input())
numbers = []
for _ in range(N) :
    numbers.append(int(input()))
numbers.sort()
for x in numbers :
    print(x)
```

N의 개수 범위가 10,000,000까지 이기 때문에 위 코드처럼 일반적인 방법으로 풀때는 메모리 초과 오류가 떠버린다. 개수는 많지만 뒤의 제약사항이 이 수는 10,000보다 작거나 같은 자연수이다. 이기 때문에 범위는 적다고 할 수 있다. 이러한 경우에는 그냥 내장 정렬함수로는 불가하고, 계수 정렬(Counting Sort)를 쓰는 방법이 있다. 범위가 제한적일 때 쓰면 좋은 방법이다. 그리고 또 하나의 포인트는 들어오는 입력 값이 많을 경우에는 `input()`함수 대신 `sys.stdin.readline()`함수를 사용하는 것이 더 빠르다.

### 내 코드 (정답)

```python
import sys
N = int(sys.stdin.readline())
numbers = [0]*10001
for _ in range(N) :
    num = int(sys.stdin.readline())
    numbers[num] += 1
for x in range(10001) :
    if numbers[x] != 0 :
        for _ in range(numbers[x]) :
            print(x)
```

위 코드와 같이 `input()`대신 `sys.stdin.readline()`을 사용하고, 주의할 점은 `sys` 모듈을 `import`해줘야 한다. 범위가 적을 때는 Counting Sort를 쓸 수 있는 것을 꼭 기억하다.
