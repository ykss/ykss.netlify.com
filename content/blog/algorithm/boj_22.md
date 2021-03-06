---
title: '[BOJ] 트로피 진열 - 파이썬'
date: 2021-02-22 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

민식이는 “오민식”이라는 팀이름으로 수없이 많은 로봇대회를 우승했다. 따라서 민식이의 집에는 트로피가 많다. 민식이는 트로피를 어떤 선반 위에 올려놨다. 이 선반은 민식이의 방문을 열고 들어가자마자 선반의 왼쪽이 보인다. 다른말로 하자면, 뒤의 트로피가 앞의 트로피에 가려져 있다는 말이다.

안타깝게도, 높이가 큰 트로피가 높이가 작은 트로피의 왼쪽에 있다면, 높이가 작은 트로피는 큰 트로피에 가려서 보이지 않게 된다. 트로피는 자기의 앞에 (보는 사람의 관점에서) 자기보다 높이가 작은 트로피가 있을 때만 보이게 된다. 민식이는 선반을 180도 회전시켜서 트로피가 보이는 개수를 변하게 할 수도 있다.

선반위에 올려져 있는 트로피의 높이가 주어졌을 때, 왼쪽에서 봤을 때 보이는 개수와, 오른쪽에서 봤을 때 보이는 개수를 출력하는 프로그램을 작성하시오.

### 입력

첫째 줄에 트로피의 개수 N (1 ≤ N ≤ 50)이 주어진다. 둘째 줄부터 N개의 줄에 왼쪽의 트로피부터 차례대로 높이가 주어진다. 트로피의 높이는 100보다 작거나 같은 자연수이다.

### 출력

첫째 줄에 왼쪽에서 봤을 때 보이는 개수, 둘째 줄에 오른쪽에서 봤을 때 보이는 개수를 출력한다.

### 예제 입출력

| 입력                                      | 출력      |
| ----------------------------------------- | --------- |
| 5 </br> 1 </br> 2 </br> 3 </br> 4 </br> 5 | 5 </br> 1 |

---

### 내 코드

```python
N = int(input())
trophies = []
for _ in range(N) :
    trophies.append(int(input()))

# 왼쪽에서 보이는 개수 오름차순
left = 0
max = 0
for trophy in trophies :
    if max < trophy :
        max = trophy
        left += 1
# 오른쪽에서 보이는 개수 뒤집어서
trophies.reverse()
right = 0
max = 0
for trophy in trophies :
    if max < trophy :
        max = trophy
        right += 1

print(str(left))
print(str(right))

```

어렵지 않게 풀 수 있었다. 문제 그대로 왼쪽에서 볼 떄와 오른쪽에서 볼 떄의 로직을 나눠서 했다. 뭔가 더 효율 적으로 짤 수도 있었을 것 같은데, 그냥 손 가는 대로 짰는데, 그냥 답은 구할 수 있었다.

### 다른사람의 코드

```python
def ascending(array):
    now = array[0]
    result = 1
    for i in range(1, len(array)):
        if now < array[i]:
            result += 1
            now = array[i]
    return result

n = int(input())
array = []

for _ in range(n):
    array.append(int(input()))

print(ascending(array))
array.reverse()
print(ascending(array))
```

아예 함수를 하나 만들어서 굳이 같은 코드를 반복할 필요 없게 끔 처리하였다. 로직적인 부분은 크게 다르지 않았지만, 반복을 줄이는 코딩은 앞으로 신경써서 연습해야겠다고 느꼈다.
