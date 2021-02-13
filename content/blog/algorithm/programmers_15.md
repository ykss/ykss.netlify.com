---
title: '[프로그래머스] 나누어 떨어지는 숫자 배열 - 파이썬'
date: 2020-12-19 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
array의 각 element 중 divisor로 나누어 떨어지는 값을 오름차순으로 정렬한 배열을 반환하는 함수, solution을 작성해주세요.
divisor로 나누어 떨어지는 element가 하나도 없다면 배열에 -1을 담아 반환하세요.


### 제한사항
arr은 자연수를 담은 배열입니다.
정수 i, j에 대해 i ≠ j 이면 arr[i] ≠ arr[j] 입니다.
divisor는 자연수입니다.
array는 길이 1 이상인 배열입니다.


### 입출력 예
|arr|	divisor|	return|
|---|---|---|
|[5, 9, 7, 10]|	5	|[5, 10]|
|[2, 36, 1, 3]|	1	|[1, 2, 3, 36]|
|[3,2,6]	|10|	[-1]|
---


###  내 코드
```python
def solution(arr, divisor):
    answer = list()
    for i in range(len(arr)) :
        if arr[i] % divisor == 0 :
            answer.append(arr[i])
    answer.sort()
    if len(answer) == 0 :
        answer.append(-1)
    return answer
```
주어진 `divisor`로 나누었을 때 나머지가 `0`인 배열의 원소만 골라서 정답 배열에 담아 정렬하였고, 만약 정답 배열의 길이가 `0`이라면 `-1`을 넣도록 하여 리턴하였다. 


---


### 다른 사람의 코드
```python
def solution(arr, divisor): return sorted([n for n in arr if n%divisor == 0]) or [-1]
```
위 문법은 `or` 앞이 참일 경우 앞부분을 리턴하고 거짓일 경우 뒤에걸 리턴하는 것을 이용한 것이다. 내 코드에서도 마지막에 `-1`을 넣는 부분은 삼항연산자로 바꾸면 더 깔끔할 것 같다.