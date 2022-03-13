---
title: '[프로그래머스] x만큼 간격이 있는 n개의 숫자 - 자바스크립트'
date: 2022-03-10 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

함수 solution은 정수 x와 자연수 n을 입력 받아, x부터 시작해 x씩 증가하는 숫자를 n개 지니는 리스트를 리턴해야 합니다. 다음 제한 조건을 보고, 조건을 만족하는 함수, solution을 완성해주세요.

### 제한 조건

x는 -10000000 이상, 10000000 이하인 정수입니다.
n은 1000 이하인 자연수입니다.

### 입출력 예

| x   | n   | answer       |
| --- | --- | ------------ |
| 2   | 5   | [2,4,6,8,10] |
| 4   | 3   | [4,8,12]     |
| -4  | 2   | [-4, -8]     |

---

### 내 코드

```javascript
function solution(x, n) {
  var answer = []
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      answer.push(0 + x)
      continue
    }
    answer.push(answer[i - 1] + x)
  }
  return answer
}
```

풀면서도 복잡하고, 정말 비효율적으로 풀었다는 생각이 들었다. 단순히 정답을 얻기 위한 풀이를 했고, 어떻게 하면 좀 더 명확하고 간결하게 풀지를 고민하지 못했던 것 같다. 심지어 아래같이 곱셈을 활용하면 훨씬 쉽게 풀 수 있었는데, 좀 더 고민하고 생각해서 풀어야 겠다.

```javascript
function solution(x, n) {
  var answer = []
  for (let i = 1; i <= n; i++) {
    answer.push(x * i)
  }
  return answer
}
```

### 다른 사람의 코드

```javascript
function solution(x, n) {
  return Array(n)
    .fill(x)
    .map((v, i) => (i + 1) * v)
}
```

배열을 n 크기로 만들어 놓고 모두 x로 채운 후에 인덱스 위치에 따라 x를 곱해주는 방식이었는데, 매우 간결하고 이해하기 쉽게 풀었다는 생각이 들었다. `map()`을 잘 활용하도록 해야겠다.
