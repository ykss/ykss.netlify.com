---
title: '[BOJ] 수 정렬하기'
date: 2021-02-08 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

N개의 수가 주어졌을 때, 이를 오름차순으로 정렬하는 프로그램을 작성하시오.

### 입력

첫째 줄에 수의 개수 N(1 ≤ N ≤ 1,000)이 주어진다. 둘째 줄부터 N개의 줄에는 숫자가 주어진다. 이 수는 절댓값이 1,000보다 작거나 같은 정수이다. 수는 중복되지 않는다.

### 출력

첫째 줄부터 N개의 줄에 오름차순으로 정렬한 결과를 한 줄에 하나씩 출력한다.

### 예제 입출력

| 입력                                      | 출력                              |
| ----------------------------------------- | --------------------------------- |
| 5 <br/> 5 <br/> 2 <br/> 3 <br/> 4 <br/> 1 | 1 <br/> 2 <br/> 3 <br/> 4 <br/> 5 |

---

### 내 코드

```python
N = int(input())
numbers = []
for _ in range(N) :
    numbers.append(int(input()))
numbers.sort()
for x in numbers :
    print(str(x))

```

완전 정렬의 기본 문제이다. 그냥 배열을 `sort()`하면 된다.

### 다른 사람의 코드

```python
n = int(input())
array = list()
for _ in range(n):
    array.append(int(input()))

for i in range(n):
    min_index = i # 가장 작은 원소의 인덱스
    for j in range(i + 1, n):
        if array[min_index] > array[j]:
        min_index = j
    array[i], array[min_index] = array[min_index], array[i] # 스와프

for i in array:
    print(i)
```

위 코드는 선택 정렬 알고리즘을 통해 푼 것이다. 인덱스의 원소를 비교해서 가장 작은 값부터 앞에 정렬하는 것이다. 이렇게 풀면 O(n^2)인데, 기본 내장 `sort()`함수로 풀면 O(nlogn)이 나오기 때문에 코드만 짧은게 아니라 더 빠르기까지해서 그게 낫다.
