---
title: '[BOJ] 음계'
date: 2021-01-30 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

다장조는 c d e f g a b C, 총 8개 음으로 이루어져있다. 이 문제에서 8개 음은 다음과 같이 숫자로 바꾸어 표현한다. c는 1로, d는 2로, ..., C를 8로 바꾼다.

1부터 8까지 차례대로 연주한다면 ascending, 8부터 1까지 차례대로 연주한다면 descending, 둘 다 아니라면 mixed 이다.

연주한 순서가 주어졌을 때, 이것이 ascending인지, descending인지, 아니면 mixed인지 판별하는 프로그램을 작성하시오.

### 입력

첫째 줄에 8개 숫자가 주어진다. 이 숫자는 문제 설명에서 설명한 음이며, 1부터 8까지 숫자가 한 번씩 등장한다.

### 출력

첫째 줄에 ascending, descending, mixed 중 하나를 출력한다.

### 예제 입출력

| 입력            | 출력       |
| --------------- | ---------- |
| 1 2 3 4 5 6 7 8 | ascending  |
| 8 7 6 5 4 3 2 1 | descending |
| 8 1 7 2 6 3 5 4 | mixed      |

---

### 내 코드

```python
a = list(map(int, input().split(' ')))

ascending = True
descending = True

for i in range(1,8) :
    if a[i] > a[i-1] :
        descending = False
    elif a[i] < a[i-1] :
        ascending = False

if ascending :
    print("ascending")
elif descending : 
    print("descending")
else :
    print("mixed")
```

일단 프로그래머스에 비해 BOJ는 굉장히 불친절한 느낌이었다. 인터페이스 자체도 불편해서 문제를 보면서 답안을 작성할 수 없다는 게 불편했고, 입력도 인수로 주어지는게 아니고, 직접 받아야 하는 점이 불편했고, 한번 테스트 출력을 해볼 수 없고 제출해야하는게 조금 불편했다. 문제 풀이는 일단 오름차순, 내림차순으로 플래그를 만들어서 `for`문을 통해 확인하고 `if`문을 통해 판별 후 프린트했다. 
