---
title: '[프로그래머스] k번째 수'
date: 2020-12-11 19:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명
배열 array의 i번째 숫자부터 j번째 숫자까지 자르고 정렬했을 때, k번째에 있는 수를 구하려 합니다.

예를 들어 array가 [1, 5, 2, 6, 3, 7, 4], i = 2, j = 5, k = 3이라면

1. array의 2번째부터 5번째까지 자르면 [5, 2, 6, 3]입니다.
2. 1에서 나온 배열을 정렬하면 [2, 3, 5, 6]입니다.
3. 2에서 나온 배열의 3번째 숫자는 5입니다.

배열 array, [i, j, k]를 원소로 가진 2차원 배열 commands가 매개변수로 주어질 때, commands의 모든 원소에 대해 앞서 설명한 연산을 적용했을 때 나온 결과를 배열에 담아 return 하도록 solution 함수를 작성해주세요.


### 제한사항
array의 길이는 1 이상 100 이하입니다.
array의 각 원소는 1 이상 100 이하입니다.
commands의 길이는 1 이상 50 이하입니다.
commands의 각 원소는 길이가 3입니다.


### 입출력 예
|array	|commands	|return|
|---|---|---|
|[1, 5, 2, 6, 3, 7, 4]|	[[2, 5, 3], [4, 4, 1], [1, 7, 3]]	|[5, 6, 3]|

---


###  내 코드
```python
def solution(array, commands):
    answer = []
    
    for command in commands:
        arr = array[command[0]-1:command[1]]
        arr.sort()
        answer.append(arr[command[2]-1])    
    return answer
```
배열 `slice` 기능을 이용하여 풀었다. 주어진 배열을 slice로 잘라서 `arr` 배열에 넣은 후 `arr`배열을 정렬한 후에 요구하는 인덱스를 `answer` 배열에 `append()`하여서 답을 구하였다.


---


### 다른 사람의 코드
```python
def solution(array, commands):
    return list(map(lambda x:sorted(array[x[0]-1:x[1]])[x[2]-1], commands))
```
다른 모듈을 import하지 않고도 `lambda`와 `map`을 통해 매우 간단하게 한 줄로 정답을 구했다. 이게 Pythonic한 코드라고 생각된다. 이러한 코드를 짜기 위해서는 `lambda`에 대해 잘 이해하고 쓸 수 있어야 한다. `lambda` 표현식은 함수를 간편하게 작성할 수 있어서 많이 쓰인다. 위의 경우 `commands` 리스트를 매개변수 `x`로 받아서 `:`뒤의 표현식을 적용하는 것인데, 결국은 `slice`처리한 `array`를 정렬한 것을 인덱스로 참조한 것을 반환하는 것인데 `map`을 통해서 리스트의 요소를 각각 처리하고 `map`객체를 볼 수 있도록 `list`로 변환하여 반환한 것이다. `lambda`의 경우 `map`외에도 `reduce`,`filter`와 자주 유용하게 쓰이니 제대로 활용할 수 있도록 연습해두자. 