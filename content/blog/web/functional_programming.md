---
title: '함수형프로그래밍(Functional Programming)이란?'
date: 2020-5-8 16:45:00
category: 'Web'
draft: false
---

#### 함수형 프로그래밍

**함수형 프로그래밍**은 프로그래밍의 여러가지 패러다임 중 하나로, 최근 많은 개발자들로부터 각광받고 있다. **함수형 프로그래밍**은 함수의 조합으로 작업을 수행하는 것이다. 그리고 가장 큰 특징은 **작업이 이루어지는 동안 필요한 데이터와 상태가 변하지 않는 것**이다.

함수형 프로그래밍에 두가지 중요한 함수 개념이 있는데, 먼저 **순수 함수(Pure Function)**은 함수의 수행이 외부에 아무런 영향도 미치지 않는 함수이다. 다른 영향이 없으므로 한번 작성된 순수 함수는 다른 작업에 또 활용해도 문제가 없다. 두번째 함수는 **고계 함수(Higher-order Function)**이다. 이 함수는 함수를 하나의 값으로 간주하여 함수의 인자 혹은 반환값으로 활용하는 함수를 말한다. 이 두 함수를 잘 활용하여야 함수형 프로그래밍을 구현할 수 있다. 그리고 함수형 프로그래밍을 통해 높은 수준의 모듈화를 구현할 수 있다.

#### 자바스크립트에서의 함수형 프로그래밍

자바스크립트 함수형 프로그래밍의 가장 중요한 두 개념은 **일급 객체로서의 함수**와 **클로저** 개념이라고 할 수 있겠다. 함수가 일급 객체이기 때문에 함수의 인자나 함수의 리턴값으로 함수를 포함할 수 있다. 그리고 클로저를 활용함을 통해서 클로저에서 접근하는 변수가 외부에서 접근할 수 없도록 한다.

함수형 프로그래밍으로 구현된 여러가지 예시를 통해 함수형 프로그래밍에 대한 감을 잡을 수 있다. 먼저 **배열 각 원소의 총합을 구하는 기능**을 명령형 프로그래밍으로 구현한 예시를 보자.

```javascript
function sum(arr) {
  var len = arr.length
  var i = 0,
    sum = 0

  for (; i < len; i++) {
    sum += arr[i]
  }

  return sum
}

var arr = [1, 2, 3, 4]
console.log(sum(arr)) // (출력 값) 10
```

함수형 프로그래밍을 이용하면 어떻게 할 수 있을지 살펴보자.

```javascript
function reduce(func, arr, memo) {
  var len = arr.length,
    i = 0,
    accum = memo

  for (; i < len; i++) {
    accum = func(accum, arr[i])
  }

  return accum
}
```

위 코드의 `reduce()` 함수는 함수와 배열을 인자로 넘겨받아서 루프를 돌면서 함수를 실행시키는 함수이다. 그리고 함수를 통해 얻은 결과 값을 `accum`에 계속 저장한다. 그리고 마지막에 `accum`을 리턴한다. 여기서 우리는 `func`에 들어갈 함수만 정의하면 된다. 아까 명령형 프로그래밍을 통해 구현했던, 배열의 모든 요소를 더하는 함수를 만들어서 `reduce()`에 적용해보자.

```javascript
var arr = [1, 2, 3, 4]

var sum = function(x, y) {
  return x + y
}

console.log(reduce(sum, arr, 0)) // (출력 값) 10
```

이렇게 적용하는 것이 가능하고, `sum()`이라는 함수 외에도 다른 기능을 수행하는 함수를 만들어서 `reduce()`함수에 적용하여 활용하는 것이 가능하다. (단, `reduce()`함수는 각 배열의 요소를 처음부터 하나씩 연산하는 경우에 활용 가능하다.)

다음 살펴본 예시는 **팩토리얼** 기능이다. 명령형으로 구현한다면 아래와 같이 단순하게 구현 가능하다.

```javascript
function fact(num) {
  if (num == 0) return 1
  else return num * fact(num - 1)
}

console.log(fact(100))
```

하지만 함수를 구현하는 것은 기능 뿐만 아니라 성능도 매우 중요하다. 이대로 팩토리얼을 계산한다면 10!을 계산하고 나서 20!을 계산하면 10!은 중복하여 다시 계산하게 된다. 만약에 캐시와 같은 개념으로 이미 계산했던 값을 알고 있다면 훨씬 절약할 수 있고 성능을 향상시킬 수 있다.

```javascript
var fact = (function() {
  var cache = { '0': 1 }
  var func = function(n) {
    var result = 0

    if (typeof cache[n] === 'number') {
      result = cache[n]
    } else {
      result = cache[n] = n * func(n - 1)
    }

    return result
  }
  return func
})()

console.log(fact(10))
console.log(fact(20))
```

위 코드에서 `fact`는 `cache`에 접근할 수 있는 클로저를 반환받는다. 클로저는 `cache`에 팩토리얼을 연산한 값을 저장하고 캐시에 저장된 값이 있으면 곧바로 그 값을 반환한다. 이렇게 하면 중복 연산을 피하여 성능을 향상시킬 수 있다.

함수형 프로그래밍은 쉽게 할 수 있는 것은 아니고 여러번의 경험과 내공이 쌓여야 비로소 할 수 있는 것이기 때문에 이번 포스트에서는 맛보기 정도만 해두고 좀 더 실력을 쌓고 활용하면서 감을 잡도록 하자.

> 참고
>
> 1. 인사이트 자바스크립트