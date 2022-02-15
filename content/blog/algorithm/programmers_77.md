---
title: '[프로그래머스] 자연수 뒤집어 배열로 만들기 - 자바스크립트'
date: 2022-02-12 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

자연수 n을 뒤집어 각 자리 숫자를 원소로 가지는 배열 형태로 리턴해주세요. 예를들어 n이 12345이면 [5,4,3,2,1]을 리턴합니다.

### 제한 조건

n은 10,000,000,000이하인 자연수입니다.

### 입출력 예

| n     | return      |
| ----- | ----------- |
| 12345 | [5,4,3,2,1] |

---

### 내 코드

```javascript
function solution(n) {
  var temp = (n + '').split('').reverse()
  var answer = temp.map(char => +char)
  return answer
}
```

먼저 숫자 n을 문자열로 만들고 `split()`을 통하여 배열로 만든 후에 그걸 뒤집었다. 문제는 원소들이 전부 문자열이었다는 건데, 그건 `map()`을 통해 원소 하나하나 숫자로 바꿔서 해결했다.

### 다른사람의 코드

```javascript
function solution(n) {
  var arr = []
  do {
    arr.push(n % 10)
    n = Math.floor(n / 10)
  } while (n > 0)
  return arr
}
```

이 방법은 문자열로 변환하지 않고 숫자로 풀었다는데 의미가 있었다. 훨씬 중간 과정없이 계산이 이루어지기 때문에 문자열 변환하는 것 보다 빠르다는 장점이 있었다. 이런 방법도 떠올릴 수 있게 사고의 폭을 넓혀야겠다.
