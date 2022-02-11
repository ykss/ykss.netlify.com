---
title: '[프로그래머스] 두 개 뽑아서 더하기 - 자바스크립트'
date: 2022-02-11 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

정수 배열 numbers가 주어집니다. numbers에서 서로 다른 인덱스에 있는 두 개의 수를 뽑아 더해서 만들 수 있는 모든 수를 배열에 오름차순으로 담아 return 하도록 solution 함수를 완성해주세요.

### 제한사항

numbers의 길이는 2 이상 100 이하입니다.
numbers의 모든 수는 0 이상 100 이하입니다.

### 입출력 예

| numbers     | result        |
| ----------- | ------------- |
| [2,1,3,4,1] | [2,3,4,5,6,7] |
| [5,0,2,7]   | [2,5,7,9,12]  |

---

### 내 코드

```javascript
function solution(numbers) {
  var sumArr = []
  for (var i = 0; i < numbers.length; i++) {
    for (var j = i + 1; j < numbers.length; j++) {
      sumArr.push(numbers[i] + numbers[j])
    }
  }
  var answer = [...new Set(sumArr)]
  return answer.sort((a, b) => a - b)
}
```

주어진 배열에서 첫 인덱스부터 순회하면서 다른 모든 인덱스와 더해가면서 그 값을 sumArr 배열을 만들어서 넣어주고, 그렇게되면 모든 합계의 경우의 수가 포함된 sumArr 배열이 완성된다. 여기서 중복된 값들이 존재할 수 있기 때문에, 파이썬의 `Set`를 떠올렸는데, JS에서도 동일한 기능을 하는 `Set`객체가 있어서 해당 객체를 이용해서 중복을 제거했다. 다만 주의 할 점은 집합 객체를 배열로 변환하기 위해서는 배열 괄호 안에 `...`(spread operation)을 꼭 써줘야 온전한 배열로 나타 낼 수 있다.(spread operation 쓰면 그냥 해당 객체나 결과값을 펼쳐서 쓸 수 있다.) 그리고 나서 중복제거한 answer 배열에서 오름차 순으로 정리만 하면된다. 만약 그냥 `sort()` 함수를 쓰면 12라고 할지라도 1로 시작하는 숫자들이 계속 먼저오기 때문에 오름차순 배열이 제대로 될 수 없기 때문에 파라미터에 compare 함수를 포함시켜서 간단히 답을 구할 수 있었다. 실제로 사람들이 가장 많이 푼 방식과 일치했다.

### 다른사람의 코드

```javascript
function solution(numbers) {
  var answer = []
  numbers = numbers.sort()
  for (var i = 0; i < numbers.length; i++) {
    for (var k = i + 1; k < numbers.length; k++) {
      if (!answer.includes(numbers[i] + numbers[k])) {
        answer.push(numbers[i] + numbers[k])
      }
    }
  }
  answer = answer.sort(function(a, b) {
    return a - b
  })
  return answer
}
```

이 방식은 애초에 중복이 발생하지 않도록 if문과 `includes()`를 활용하였다. 그리고 그 뒤에는 정렬은 똑같이 했다. 순서의 차이이지만 이렇게 하는 방법도 있다 정도로 생각하면 될 것 같다.
