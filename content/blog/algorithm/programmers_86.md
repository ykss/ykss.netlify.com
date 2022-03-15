---
title: '[프로그래머스] 하샤드 수 - 자바스크립트'
date: 2022-03-12 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

양의 정수 x가 하샤드 수이려면 x의 자릿수의 합으로 x가 나누어져야 합니다. 예를 들어 18의 자릿수 합은 1+8=9이고, 18은 9로 나누어 떨어지므로 18은 하샤드 수입니다. 자연수 x를 입력받아 x가 하샤드 수인지 아닌지 검사하는 함수, solution을 완성해주세요.

### 제한 조건

x는 1 이상, 10000 이하인 정수입니다.

### 입출력 예

| arr | return |
| --- | ------ |
| 10  | true   |
| 12  | true   |
| 11  | false  |
| 13  | false  |

---

### 내 코드

```javascript
function solution(x) {
  var answer = true
  var num = (x + '').split('').map(x => parseInt(x))
  num = num.reduce((prev, curr) => prev + curr, 0)
  return x % num === 0 ? true : false
}
```

이번 문제는 먼저 각 자리수를 더해야하기 때문에 주어진 x를 문자열로 만들고, `split()`을 사용하여 한글자씩 나눈뒤에 다시 숫자로 변환했다. 그리고 그 나눈 자릿수들의 합을 `reduce`를 활용하여 구하고, 구한 수로 x가 나누어 떨어질 경우 하샤드 수로 판단하여 true를 리턴하고, 아닐 경우 false를 리턴하도록 했다. 이 문제는 이거 외에 눈에 띄는 풀이는 없었다.
