---
title: '[프로그래머스] 정수 내림차순으로 배치하기 - 파이썬'
date: 2020-12-18 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
함수 solution은 정수 n을 매개변수로 입력받습니다. n의 각 자릿수를 큰것부터 작은 순으로 정렬한 새로운 정수를 리턴해주세요. 예를들어 n이 118372면 873211을 리턴하면 됩니다.


### 제한 조건
n은 1이상 8000000000 이하인 자연수입니다.


### 입출력 예
|n	|return|
|---|---|
|118372|	873211|

---


###  내 코드
```python
def solution(n):
    return int(''.join(sorted(str(n),reverse=True)))
```
`n`을 문자열로 만든 후에 내림차순으로 정렬하고 그것을 다시 문자열로 만들고 마지막에 `int()`로 정수로 변환한 것을 반환했다.


---


### 다른 사람의 코드
```python
def solution(n):
    ls = list(str(n))
    ls.sort(reverse = True)
    return int("".join(ls))

```
거의 비슷한 방식인데, 리스트로 만들어 `sort()`함수를 썼다는 것만 차이가 있다.