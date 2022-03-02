---
title: '[프로그래머스] 핸드폰 번호 가리기 - 자바스크립트'
date: 2022-03-01 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

프로그래머스 모바일은 개인정보 보호를 위해 고지서를 보낼 때 고객들의 전화번호의 일부를 가립니다.
전화번호가 문자열 phone_number로 주어졌을 때, 전화번호의 뒷 4자리를 제외한 나머지 숫자를 전부 \*으로 가린 문자열을 리턴하는 함수, solution을 완성해주세요.

### 제한 조건

s는 길이 4 이상, 20이하인 문자열입니다.

### 입출력 예

| phone_number  | return           |
| ------------- | ---------------- |
| "01033334444" | "**\*\*\***4444" |
| "027778888"   | "**\***8888"     |

---

### 내 코드

```javascript
function solution(phone_number) {
  var answer = ''
  var num = phone_number.split('')
  for (let i = 0; i < phone_number.length - 4; i++) {
    num[i] = '*'
  }
  return num.join('')
}
```

조금 세련된 방식으로 풀고 싶었는데, 더 깊게 생각하지 않고 답을 구할 수 있는 풀이로 먼저 풀었다. 먼저 주어진 스트링을 배열로 만든 후에, 맨 뒷자리 4자리만 제외하고 전부 \*로 바꾸었다. 그리고 다시 조인하여 문자열로 만들어 반환하는 식으로 정답을 구했다. 더 나은 풀이는 맨 뒤의 네 자리를 제외한 부분을 `replace()`함수나 `splice()`함수 같은 부분을 잘 써보면 어떨까 하는 생각은 들었다.

### 다른 사람의 코드1

```javascript
function solution(phone_number) {
  return phone_number.replace(/\d(?=\d{4})/g, '*')
}
```

정규식을 사용하여 맨 뒤의 4자리를 제외한 부분을 \*로 바꿔주는 식으로 하였다. 지금까지는 정규식이 필요한 경우에만 구글링을 통해 그때 그때 필요한 정규식을 사용했었는데, 정규식을 잘 이해하고 마스터한다면 여러가지 문자열 문제에서 생각보다 간단하게 풀 수 있겠다는 생각이 들어서 다음에 정규표현식을 좀 더 공부해야겠다는 생각이 들었다.

### 다른 사람의 코드2

```javascript
function solution(phone_number) {
  var result = '*'.repeat(phone_number.length - 4) + phone_number.slice(-4)
  return result
}
```

위 방식은 `*`를 `repeat()`함수를 통해 주어진 문자열의 길이-4 까지 찍어줬고, 그 뒤에 `slice()`함수를 통해 뒤에서 네 번째자리까지 자른 부분을 붙혔다. 어떻게 보면 이 방식이 내가 생각했던 풀이라는 생각이 들었다. `slice()`함수의 경우, 파이썬의 슬라이싱과 동일하게 뒤에서 부터 자를때 음수 표현이 가능하다는 것을 꼭 기억하자.

### 다른 사람의 코드3

```javascript
function solution(phone_number) {
  return [...phone_number].fill('*', 0, phone_number.length - 4).join('')
}
```

주어진 문자열을 배열로 형태로 만들고 \*을 인덱스 0부터 length-4까지 채웠다. 그리고 나서 배열을 다시 스트링으로 만들어 반환했는데, 정말 간단하게 풀이해서 간결하게 푼 좋은 예시라고 할 수 있다.
