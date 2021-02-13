---
title: '[프로그래머스] 수박수박수박수박수박수? - 파이썬'
date: 2020-12-20 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
길이가 n이고, 수박수박수박수....와 같은 패턴을 유지하는 문자열을 리턴하는 함수, solution을 완성하세요. 예를들어 n이 4이면 수박수박을 리턴하고 3이라면 수박수를 리턴하면 됩니다.


### 제한 조건
n은 길이 10,000이하인 자연수입니다.


### 입출력 예
|n	|return|
|---|---|
|3	|수박수|
|4	|수박수박|
---


###  내 코드
```python
def solution(n):
    answer = list()
    for i in range(n) :
        if i % 2 == 0:
            answer.extend('수')
        else:
            answer.extend('박')
    return ''.join(answer)
```
완전 하드코딩해서 문제를 푼 것 같다. `extend`라는 함수를 썼는데, `append`는 안되고 `extend`는 되는데
`append`는 그 자체를 원소로 넣고 `extend`는 가장 바깥쪽 `iterable`을 넣는다.


---


### 다른 사람의 코드
```python
def solution(n):
    return ("수박"*n)[0:n]
```
이렇게 푸는 발상 자체를 하지못했고, 문자열을 곱하기 연산할 수 있는지를 몰랐는데, 문자열 곱하기와 슬라이싱을 써서 간단하게 할 수 있다는 걸 알게되었다. 