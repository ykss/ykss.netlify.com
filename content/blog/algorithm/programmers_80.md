---
title: '[프로그래머스] 행렬의 덧셈 - 자바스크립트'
date: 2022-02-22 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

행렬의 덧셈은 행과 열의 크기가 같은 두 행렬의 같은 행, 같은 열의 값을 서로 더한 결과가 됩니다. 2개의 행렬 arr1과 arr2를 입력받아, 행렬 덧셈의 결과를 반환하는 함수, solution을 완성해주세요.

### 제한 조건

행렬 arr1, arr2의 행과 열의 길이는 500을 넘지 않습니다.

### 입출력 예

| arr1          | arr2          | return        |
| ------------- | ------------- | ------------- |
| [[1,2],[2,3]] | [[3,4],[5,6]] | [[4,6],[7,9]] |
| [[1],[2]]     | [[3],[4]]     | [[4],[6]]     |

---

### 내 코드

```javascript
function solution(arr1, arr2) {
  return arr1.map((x, i) => x.map((y, j) => y + arr2[i][j])
}
```

JS를 잘 활용하는 포인트 중 하나가 `map, filter, reduce`를 얼마나 잘 활용하냐도 있다고 생각한다. 그래서 이번 문제도 처음에 `map()`을 떠올렸지만 어떻게 두 배열을 연산할까 하는 생각이 먼저 들었는데, 그것은 `map()`에서 인덱스 값을 활용하여 간단히 구할 수 있었다

### 다른 사람의 코드

```javascript
function solution(arr1, arr2) {
  var answer = [[]]
  for (var i = 0; i < arr1.length; i++) {
    answer[i] = []
    for (var j = 0; j < arr1[i].length; j++) {
      answer[i].push(arr1[i][j] + arr2[i][j])
    }
  }
  return answer
}
```

가장 단순하게 문제를 푼다면 위와 같은 방법으로 풀 수 있을 것 같다. 하지만 이 방식도 은근 배열안에서 또 배열을 접근하고 더해주고 하는 과정들이 있고 push 해주는 과정에서 배열을 미리 만들어야 하는 등 은근 까다로운 점이 있어서 생각보다 있다는 생각이 들었다.
