---
title: '[BOJ] 소트인사이드'
date: 2021-02-09 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

배열을 정렬하는 것은 쉽다. 수가 주어지면, 그 수의 각 자리수를 내림차순으로 정렬해보자.

### 입력

첫째 줄에 정렬하고자하는 수 N이 주어진다. N은 1,000,000,000보다 작거나 같은 자연수이다.

### 출력

첫째 줄에 자리수를 내림차순으로 정렬한 수를 출력한다.

### 예제 입출력

| 입력 | 출력 |
| ---- | ---- |
| 2143 | 4321 |

---

### 내 코드

```python
numbers = input()
string = []
for x in numbers :
    string.append(int(x))
string.sort(reverse = True)
string = list(map(str,string))
print(''.join(string))
```

처음에 문자열을 그대로 받은 후에 해당 문자열에서 하나씩 꺼내어 int로 변환해서 배열에 넣는다. 그리고 해당 배열을 내림차순으로 정렬했다. 그리고 나서 다시 배열의 원소들을 `map()`을 통해 문자로 변경하고 그 배열을 다시 문자열로 만들어 출력했다.

### 다른 사람의 코드

```python
array = input()
for i in range(9, -1, -1):
    for j in array:
        if int(j) == i:
        print(i, end='')
```

숫자 9부터 0까지 있는지 체크한 후에 해당 숫자가 있으면 한 글자씩 출력하는 방식으로 풀었다.
