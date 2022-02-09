---
title: '[프로그래머스] 자릿수 더하기 - 자바스크립트'
date: 2022-02-10 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

자연수 N이 주어지면, N의 각 자릿수의 합을 구해서 return 하는 solution 함수를 만들어 주세요.
예를들어 N = 123이면 1 + 2 + 3 = 6을 return 하면 됩니다.

### 제한사항

N의 범위 : 100,000,000 이하의 자연수

### 입출력 예

| N   | answer |
| --- | ------ |
| 123 | 6      |
| 987 | 24     |

---

### 내 코드

```javascript
function solution(n) {
  var answer = 0
  var numberStr = n.toString()

  for (var i = 0; i < numberStr.length; i++) {
    answer += Number(numberStr[i])
  }

  return answer
}
```

자릿수를 더하는 문제라 처음에는 천의 자리, 백의자리 이렇게 나누어서 따로 구할까도 했지만, 숫자의 길이가 100,000,000까지 가기때문에 그냥 스트링으로 바꾸고 자릿수를 인덱스로 조회하여 숫자로 변환하여 더하는 편이 나을 것 같아서, string으로 바꾼 후에 string 길이만큼 도는 for문을 통해 해당 자리 문자를 숫자로 바꾸어서 정답 변수에 더해주는 방식으로 간단히 풀었다. 너무 쉬운 문제였기 때문에 계속 쉬운 문제부터 자바스크립트로 풀어가면서 자바스크립트 문제풀이가 익숙해지도록 해야겠다.

### 다른사람의 코드

```javascript
function solution(n) {
  var arr = n.toString().split('')
  var sum = 0
  arr.forEach(element => {
    sum += parseInt(element)
  })
  return sum
}
```

위 코드에서 내 풀이와 동일하게 `toString()`을 통해서 스트링으로 만들었고 그것을 배열로 만들기 위해 `split('')`함수를 사용했다. 파이썬과 동일한 방식으로 스트링을 나누어 배열로 만들 수 있다는 것을 기억하다. 그리고 배열일 경우에는 for문으로 할 필요 없이 forEach문을 사용하면 배열의 원소들을 하나씩 더할 수 있기 때문에 그렇게 하는 방식으로 하는 것도 좋은 방법이다. 그리고 숫자로 변환할 때는 `Number()`객체가 아닌 `parseInt()`함수를 사용하자.

### 다른사람의 코드2

```javascript
function solution(n) {
  var a = (n + '').split('')
  var b = 0
  for (var i = 0; i < a.length; ++i) {
    b += parseInt(a[i])
  }
  return b
}
```

일단 `toString()`이 아니더라도 자바스크립트의 특성을 이용하여 `(n + '')`로 숫자를 문자열로 만들 수 있다. (문자열 + 숫자 = 문자열) 그리고 그 이후에는 동일한 방식으로 진행했다.

### 다른사람의 코드3

```javascript
function solution(n) {
  // 쉬운방법
  return (n + '').split('').reduce((acc, curr) => acc + parseInt(curr), 0)
}
```

자바스크립트에서 map, filter, reduce만 잘 활용해도 정말 여러가지를 다할 수 있는데, 여기서 `reduce()`를 활용하여 풀이헀다. 그리고 JS지만 마치 파이썬처럼 Pythonic하게 짧게 풀이했는데, 여기서 초기값에 0을 넣어주면서 처음에 문자열+숫자=문자열 공식이 성립되지 않도록 숫자로 지정해주기 위해서 0으로 할 수 있었다. reduce를 가장 쉽게 이해할 수 있는 풀이 중 하나였고, 이렇게 잘 활용할 수 있도록 해야곘다.
