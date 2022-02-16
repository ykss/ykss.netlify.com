---
title: '[프로그래머스] 평균 구하기 - 자바스크립트'
date: 2022-02-14 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

정수를 담고 있는 배열 arr의 평균값을 return하는 함수, solution을 완성해보세요.

### 제한사항

arr은 길이 1 이상, 100 이하인 배열입니다.
arr의 원소는 -10,000 이상 10,000 이하인 정수입니다.

### 입출력 예

| arr       | return |
| --------- | ------ |
| [1,2,3,4] | 2.5    |
| [5,5]     | 5      |

---

### 내 코드

```javascript
function solution(arr) {
  var answer = 0
  var sum = arr.reduce((prev, curr) => prev + curr)
  answer = sum / arr.length
  return answer
}
```

파이썬에서 당연하게 썼던 `sum()` 함수가 없어서 당황했지만, 단순히 배열의 덧셈 같은 경우는 `forEach(), map()`등을 통해서도 간단히 만들 수 있고, 특히 이럴 때 유용한 `reduce()`를 활용하여 쉽게 배열의 합을 구할 수 있었다. 그리고 길이로 나누어 쉽게 평균을 구할 수 있었다. 이 문제 같은 경우 모두 푸는 방식이 비슷했기 때문에 다른 사람의 코드에서 참고할 부분이 딱히 없었다.
