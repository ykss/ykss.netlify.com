---
title: '[BOJ] 수 정렬하기2 - 파이썬'
date: 2021-02-17 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

N개의 수가 주어졌을 때, 이를 오름차순으로 정렬하는 프로그램을 작성하시오.

### 입력

첫째 줄에 수의 개수 N(1 ≤ N ≤ 1,000,000)이 주어진다. 둘째 줄부터 N개의 줄에는 숫자가 주어진다. 이 수는 절댓값이 1,000,000보다 작거나 같은 정수이다. 수는 중복되지 않는다.

### 출력

첫째 줄부터 N개의 줄에 오름차순으로 정렬한 결과를 한 줄에 하나씩 출력한다.

### 예제 입출력

| 입력                            | 출력                       |
| ------------------------------- | -------------------------- |
| 5</br>5</br>4</br>3</br>2</br>1 | 1 </br>2</br>3</br>4</br>5 |

---

### 내 코드

```python
N = int(input())
arr = [int(input()) for _ in range(N)]
arr.sort()
for x in arr :
    print(x)
```

이 문제는 단순 내장 정렬 함수로 하면 시간 초과가 난다. 그래서 고급 정렬을 이용해야 한다. 보통 고급 정렬은 병합 정렬(Merge Sort)와 퀵 정렬(Quick Sort)를 말한다. 두 정렬을 제대로 알고 활용하는 게 정렬 관련 문제를 풀 때는 매우 유용하다. 일단 나는 이 문제를 기본 정렬 함수로 풀었는데, 파이썬으로는 시간초과가 나지만 pypy3 언어로 제출했을 때는 1604ms로 통과했다. 이 방법 말고 효율적인 병합 정렬의 방법도 생각해보자. 병합 정렬은 분할 정복(Divide-Conquer) 방식과 재귀 방식을 통한 정렬이다.

### 다른 코드 (병합 정렬)

```python
def mergeSort(array) :
    if len(array) <= 1 :
        return array
    mid = len(array) // 2
    left = array[:mid]
    right = array[mid:]
    i, j, k = 0, 0, 0
    while i < len(left) and j < len(right) :
        if left[i] > right[j] :
            array[k] = right[j]
            j += 1
        else :
            array[k] = left[i]
            i += 1
        k += 1
    if i == len(left) :
        while j < len(right) :
            array[k] = right[j]
            j += 1
            k += 1
    elif j == len(right) :
        while i < len(left) :
            array[k] = left[i]
            i += 1
            k += 1
    return array

N = int(input())
arr = [int(input()) for _ in range(N)]
arr = mergeSort(arr)
for x in arr :
    print(x)
```

위와 같이 병합 정렬을 통해서도 풀 수 있는데, 오히려 시간을 보면 내장 정렬 함수보다 빠르지 않거나 비슷한 것을 볼 수 있다. 해당 알고리즘은 알고만 있으면 될 것이고, 가능하면 내장 정렬 함수를 잘 활용하는게 관건이라고 할 수 있다. 정렬 함수를 일부러 만들기엔 시간이 많이 소요될 수 있고, 실수할 수도 있기 때문이다. 결론적으로 파이썬 내장 정렬 함수는 nlogn의 효율을 충분히 낼 수 있다. 고급 정렬 함수가 필요한 부분도 충분히 커버 가능한 것이다.
