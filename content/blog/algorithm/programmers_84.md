---
title: '[프로그래머스] 이상한 문자 만들기 - 자바스크립트'
date: 2022-03-04 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

문자열 s는 한 개 이상의 단어로 구성되어 있습니다. 각 단어는 하나 이상의 공백문자로 구분되어 있습니다. 각 단어의 짝수번째 알파벳은 대문자로, 홀수번째 알파벳은 소문자로 바꾼 문자열을 리턴하는 함수, solution을 완성하세요.

### 제한 사항

문자열 전체의 짝/홀수 인덱스가 아니라, 단어(공백을 기준)별로 짝/홀수 인덱스를 판단해야합니다.
첫 번째 글자는 0번째 인덱스로 보아 짝수번째 알파벳으로 처리해야 합니다.

### 입출력 예

| s                 | return            |
| ----------------- | ----------------- |
| "try hello world" | "TrY HeLlO WoRlD" |

---

### 내 코드

```javascript
function solution(s) {
  var answer = ''
  var arr = s.split(' ')
  arr.forEach((word, idx) => {
    let tempArr = word.split('')
    for (let i = 0; i < tempArr.length; i++) {
      if (i % 2 === 0) {
        tempArr[i] = tempArr[i].toUpperCase()
      } else {
        tempArr[i] = tempArr[i].toLowerCase()
      }
    }
    answer =
      idx !== 0 ? answer + ' ' + tempArr.join('') : answer + tempArr.join('')
  })
  return answer
}
```

단순히 인덱스로 판별하여 대,소문자 변환하는 것이 아니고, 단어 별 인덱스에 맞춰서 대,소문자 변환이 필요했다. 그래서 먼저 단어 별로 공백으로 구분되어 있었기 때문에 문장을 `split()`을 통해 단어별로 나누고 단어별로 `forEach`문을 돌려서 인덱스에 따라 분기처리해서 대,소문자로 구분했다. 문제가 되는 부분은 이제 다시 문장으로 합칠 때, 공백을 넣어서 단어를 연결하는 거였는데, 처음 인덱스제외하고는 공백을 앞에 두도록 처리했다. 조금 효율적인 방법이 더 있을 수 있는데, 먼저 떠오르는 방법으로 풀게되었다.

### 다른 사람의 코드

```javascript
function solution(s) {
  s.split(' ')
    .map(i =>
      i
        .split('')
        .map((j, key) => (key % 2 === 0 ? j.toUpperCase() : j.toLowerCase()))
        .join('')
    )
    .join(' ')
}
```

정규식을 쓰는 풀이도 많았지만, 정규식은 아직 제대로 활용하기는 부족하겠다는 생각이 들었다. 위 풀이는 내가 푼 로직과 거의 동일하다고 할 수 있는데, 차이점이라고 하면 for문 대신 `map()`을 잘 활용해서 좀 더 간결하게 나타냈다는 것이다. 그리고 나는 공백을 연결할 때 일부러 공백을 넣어줬는데, `join(' ')`과 같이 각 단어들을 연결하면 어렵지 않게 연결할 수 있다는 것을 배웠다.
