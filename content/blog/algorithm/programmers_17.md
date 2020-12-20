---
title: '[프로그래머스] 평균구하기'
date: 2020-12-21 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
정수를 담고 있는 배열 arr의 평균값을 return하는 함수, solution을 완성해보세요.


### 제한사항
arr은 길이 1 이상, 100 이하인 배열입니다.
arr의 원소는 -10,000 이상 10,000 이하인 정수입니다.


### 입출력 예
|arr	|return|
|---|---|
|[1,2,3,4]|	2.5|
|[5,5]|	5|
---


###  내 코드
```python
def solution(arr):
    sum = 0.0
    for i in range(len(arr)):
        sum+=arr[i]
    return sum/len(arr)
```
sum에 배열의 모든 요소를 더해서 배열의 길이(=원소 개수)로 나누어 평균을 구했다.

---


### 다른 사람의 코드
```python
def solution(arr):
    return sum(arr)/len(arr)
```
합계의 경우는 굳이 `for문` 돌릴 필요가 없다. 단순히 `sum()`함수쓰면되는걸 기억하자.