---
title: '[프로그래머스] 제일 작은 수 제거하기 - 자바스크립트'
date: 2022-03-02 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

정수를 저장한 배열, arr 에서 가장 작은 수를 제거한 배열을 리턴하는 함수, solution을 완성해주세요. 단, 리턴하려는 배열이 빈 배열인 경우엔 배열에 -1을 채워 리턴하세요. 예를들어 arr이 [4,3,2,1]인 경우는 [4,3,2]를 리턴 하고, [10]면 [-1]을 리턴 합니다.

### 제한 조건

arr은 길이 1 이상인 배열입니다.
인덱스 i, j에 대해 i ≠ j이면 arr[i] ≠ arr[j] 입니다.

### 입출력 예

| arr       | return  |
| --------- | ------- |
| [4,3,2,1] | [4,3,2] |
| [10]      | [-1]    |

---

### 내 코드

```javascript
function solution(arr) {
  var target = [...arr].sort((a, b) => a - b)[0]
  arr = arr.filter(item => item !== target)
  return arr.length !== 0 ? arr : [-1]
}
```

나는 일단 `Math`의 함수를 써도 되는지에 대해서 확실히 몰라서, 최솟값을 `sort()`로 정렬한 후에 첫 번째 인덱스로 찾았다. 그리고나서 `filter()`를 통해 기존 배열에서 최소 값을 제거한 배열을 돌려받은 후, 비어있을 경우만 `[-1]`을 리턴하도록 처리했다. 여기서 포인트는 처음에 `arr`배열을 `sort()`하면 원본 배열의 순서가 바뀔 수 있으니 `[...arr]`과 같이 배열을 복사하여 정렬하는게 디테일이다.

### 다른 사람의 코드

```javascript
function solution(arr) {
  arr.splice(arr.indexOf(Math.min(...arr)), 1)
  if (arr.length < 1) return [-1]
  return arr
}
```

사실 `Math`를 써도되면 이 문제는 훨씬 쉬워진다. `splice()`함수를 통해서 배열에서 최소 값의 인덱스를 찾아서 지워주면 간단히 풀 수 있었다. `Math`는 기본적으로 사용할 수 있는 것으로 확인되는데 `min()` 뿐만 아니라, `pow, abs, sqrt, ceil, floor`같은 여러가지 함수들도 알아두면 좋을 것 같다.
