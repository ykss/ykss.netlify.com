---
title: '[BOJ] 새 - 파이썬'
date: 2021-02-20 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

N마리의 새가 나무에 앉아있고, 자연수를 배우기 원한다. 새들은 1부터 모든 자연수를 오름차순으로 노래한다. 어떤 숫자 K를 노래할 때, K마리의 새가 나무에서 하늘을 향해 날아간다. 만약, 현재 나무에 앉아있는 새의 수가 지금 불러야 하는 수 보다 작을 때는, 1부터 게임을 다시 시작한다.

나무에 앉아 있는 새의 수 N이 주어질 때, 하나의 수를 노래하는데 1초가 걸린다고 하면, 모든 새가 날아가기까지 총 몇 초가 걸리는지 출력하는 프로그램을 작성하시오.

### 입력

첫째 줄에 새의 수 N이 주어진다. 이 값은 109보다 작거나 같다.

### 출력

첫째 줄에 정답을 출력한다.

### 예제 입출력

| 입력 | 출력 |
| ---- | ---- |
| 14   | 7    |

---

### 내 코드

```python
N = int(input())
cur = 1
time = 0
while True :
    time += 1
    if N - cur >= 0 :
        N -= cur
        cur += 1
    else : 
        cur = 1
        N -= cur
        cur += 1
    if N == 0 :
        print(time)
        exit(0)
```

`while`문을 계속 돌려서 커서를 계속 증가시켜서 새가 점점 많이 날아가게끔 했다. 그리고 만약 커서보다 새 마리 수가 적으면 커서를 다시 1로 만들고 다시 날아가게 하고 이어갔다. 만약 새의 수가 0이 되면 시간을 출력하고 프로그램을 종료시켰다.