---
title: '[프로그래머스] 행렬의 덧셈 - 파이썬'
date: 2020-12-23 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
행렬의 덧셈은 행과 열의 크기가 같은 두 행렬의 같은 행, 같은 열의 값을 서로 더한 결과가 됩니다. 2개의 행렬 arr1과 arr2를 입력받아, 행렬 덧셈의 결과를 반환하는 함수, solution을 완성해주세요.


### 제한 조건
행렬 arr1, arr2의 행과 열의 길이는 500을 넘지 않습니다.


### 입출력 예
|arr1|	arr2|	return|
|---|---|---|
|[[1,2],[2,3]]|	[[3,4],[5,6]]|	[[4,6],[7,9]]|
|[[1],[2]]|	[[3],[4]]|	[[4],[6]]|
---


###  내 코드 
```python
def solution(arr1, arr2):
    for i in range(len(arr1)) :
        for j in range(len(arr1[i])) :
            arr1[i][j]+=arr2[i][j]
    return arr1
```
첫 번째 배열에 두 번째 배열을 더해서 첫 번째 배열을 리턴하여 답을 구했다.


---


### 다른 사람의 코드
```python
def solution(arr1, arr2):
    answer = [[c + d for c, d in zip(a, b)] for a, b in zip(arr1,arr2)]
    return answer
```
`zip()`함수는 처음 보았는데, `zip()`은 동일한 개수로 이루어진 자료형을 묶어주는 역할을 하는 함수이다. 다시말해 같은 길이의 리스트를 같은 인덱스끼리 잘라서 리스트로 변환해주는 것이다. 아직 `zip()` 함수는 정확히 이해하지는 못하겠어서 활용하기 까진 무리일 듯하다.