---
title: '자바스크립트 map, reduce, filter 정리'
date: 2021-02-20 13:00:00
category: 'Javascript'
draft: false
---

Javascript의 배열에서 자주 사용하는 메서드인 map, reduce, filter에 대해서 정리하면서 비슷하면서도 다른 세가지 메서드를 알아보려고 한다. 세 메서드 모두 ES6에서 추가된 메서드이고, 배열(Array) 타입에 사용되고, 요소들을 파라미터로 받아서 작동한다. 하지만 세 메서드는 결과적으로 다른 메서드이고 그 쓰임새도 다르기 때문에 각각 메서드에 대해서 알아보자. 그리고 해당 메서드들을 직접 구현해보면서 그 동작을 이해해보자.

## map()

`map()`은 배열의 요소에 대해서 주어진 함수를 수행한 결과를 모아 새로운 배열을 반환하는 메서드이다. 매개변수로 배열의 인자를 받고, 해당 인자를 식에 적용시켜 반환하는 식이다. 원래 기본 형태는 `map(callback)`이며, callback은 value, index, array를 인자로 갖는데 index와 array는 필수 입력 값은 아니다.

```javascript
const num = [1, 2, 3, 4, 5]
const numMap = num.map(x => x * 2)

console.log(numMap) // [2,4,6,8,10]
```

### map 직접 구현하기

```javascript
const customMap = (array, callback) => {
  returnArray = []

  array.forEach((element, index, [...array]) =>
    returnArray.push(callback(element, index))
  )

  return returnArray
}
```

배열과 콜백 함수를 받아서 빈 배열을 생성한 후에 주어진 배열의 원소 하나씩 callback 함수 적용한 결과를 새로운 배열에 넣어서 반환한다.

## filter()

`filter()`는 배열 각 요소에 대해서 주어진 함수의 결과 값이 true인 것만 반환하는 메서드이다. map은 리턴 값이 숫자, 배열, 문자 등이 모두 가능하지만, filter는 `boolean`값만 반환한다는 특징이 있다. filter도 기본형은 `filter(callback)`이고, callback은 value, index, array를 인수로 갖고, 마찬가지로 index와 array는 필수가 아니다.

```javascript
const player = ['kante', 'mount', 'werner']
const playerFilter = player.filter(x => x.length > 5)

console.log(playerFilter) // ['werner']
```

### filter 직접 구현하기

```javascript
const customFilter = (array, callback) => {
  returnArray = []

  array.forEach(
    (element, index, [...array]) =>
      callback(element) && returnArray.push(element)
  )

  return returnArray
}
```

`filter()` 또한 빈 배열을 만들고 콜백 함수에 배열원소를 하나씩 보내서 반환 값이 `true`인 것만 빈 배열에 넣어서 반환한다.

## reduce()

`reduce()`는 배열의 각 요소에 대해 reducer 함수를 실행하고, `map()`과 `filter()`와 다르게 배열이 아닌 하나의 결과 값만 반환한다. reduce의 인자 값은 `callback [, initivalValue]`로 callback의 경우는 reducer라고 불리며 accumulator, currentValue, currentIndex, array와 같은 인자를 받는다. `accumulator`은 값을 누적하는 누산기이고, `currentValue`는 현재 요소의 값을 말한다. currentIndex와 array는 필수 입력 값은 아니다. `reduce()`는 매우 다양한 케이스로 활용될 수 있다.

### reduce 직접 구현하기

```javascript
const customReduce = (array, callback, initialValue) => {
  accumulator = initialValue
  if (accumulator === undefined) {
    accumulator = array[0]
    for (let i = 1; i < array.length; i++) {
      accumulator = callback(accumulator, array[i])
    }
  } else {
    for (let i = 0; i < array.length; i++) {
      accumulator = callback(accumulator, array[i])
    }
  }

  return accumulator
}
```

array와 적용할 callback 함수, initialValue를 받아서 initialValue 제공 여부에 따라 분기하여 처리했다. initialValue를 제공하지 않으면, reduce()는 인덱스 1부터 시작해 콜백 함수를 실행하고 첫 번째 인덱스는 건너 뛴다. initialValue를 제공하면 인덱스 0에서 시작한다. 그리고 연산의 결과를 계속 `accumultor` 변수에 누적 저장해서 반환한다. reduce 함수는 다양한 목적을 위해 다양한 형태로 사용되기 때문에, 특히 객체를 다루고 조작할 때 많이 쓰인다고 하니, 계속 공부해야할 것 같다.

## 결론

직접 메서드를 구현해보면서 `map()`,`filter()`,`reduce()`의 동작 방식에 더 이해할 수 있어서 좋았다. 하지만 아직 `reduce()`에 대한 부분은 더 깊은 이해와 쓰임새를 배워나가야 할 것 같다. 그리고 직접 구현한 메서드도 리팩토링 과정을 거쳐 더 효율적인 코드를 짤 수 있도록 해야겠다.

> 참고

1. [MDN 도큐멘트](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
