---
title: '[프로그래머스] 직사각형 별찍기'
date: 2020-12-31 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
이 문제에는 표준 입력으로 두 개의 정수 n과 m이 주어집니다.
별(*) 문자를 이용해 가로의 길이가 n, 세로의 길이가 m인 직사각형 형태를 출력해보세요.


### 제한 조건
n과 m은 각각 1000 이하인 자연수입니다.


### 예시
입력
```
5 3
```

출력
```
*****
*****
*****
```
---


###  내 코드 
```python
a, b = map(int, input().strip().split(' '))
for i in range(b) :
    for j in range(a) :
        print("*",end="")
    print("")
```
주어진 별의 개수와 줄의 개수를 `for`문을 통해 했고, `print()`가 개행되지 않도록 `end`를 썼다.

---


### 다른 사람의 코드
```python
a, b = map(int, input().strip().split(' '))
answer = ('*'*a +'\n')*b
print(answer)
```
문자열의 경우 `*`연산이 가능하여, 엄청 쉽게 간단하고 쉽게 풀이하는 방법이 있었다.