---
title: '디바운싱(Debouncing) vs 쓰로틀링(Throttling)'
date: 2021-3-23 15:40:00
category: 'Web'
draft: false
---

이번에 공부하고 있는 프로젝트에서 API를 통해 검색한 데이터를 나타내는 부분을 구현하다가, 검색어를 입력할 때마다 네트워크 요청이 드는 문제가 발생하였다. 이 부분은 매우 비효율적인 부분이라는 생각이 들었다. 예시를 보자면 아래 움짤 검색기에서 '피자'를 검색하려고 하는데, 네트워크 요청(fetch)가 4번이나 발생한다. 내가 결국 검색하고자 하는 키워드는 '피자'인데, 'ㅍ','피','피ㅈ','피자'에 걸쳐 네 번의 요청이 가는 것이다. 이것을 불필요한 네트워크 요청을 3번이나 발생시키는 것이기 때문에, 만약 요청 응답량이 많은 API일 경우, 서비스에 큰 부하를 줄 수도 있다. 심지어 유료 API일 때는 비용의 손실이 생길 수 있기 때문에 더 큰 문제가 된다. 이러한 비효율을 막아 줄 방법에는 크게 두가지가 있는데, 그것이 바로 '디바운싱'과 '쓰로틀링'이다.

![움짤검색기](https://ifh.cc/g/5y8rMN.jpg)

## 디바운싱(Debouncing)

디바운싱은 연이어 호출되는 함수들 중에 마지막 함수만 호출하도록 하는 것이고, 간단히 이야기 하면 일부러 지연을 줘서 지연시키다가 마지막 함수 한번만 호출하는 것이다. 디바운싱은 주로 `ajax` 검색에 자주 쓰인다.

예시를 보자면 아래 코드는 아까 예시인 짤봇 생성기에서 입력받는 코드이다.

```javascript
this.$target.addEventListener('keyup', e => {
  const keyword = e.target.value
  this.onSearch(keyword)
})
```

아래 코드는 위 코드에 디바운싱을 적용한 코드이다.

```javascript
this.$target.addEventListener(
  'keyup',
  debounce(e => {
    const keyword = e.target.value
    if (keyword.length > 0) {
      this.onSearch(keyword)
    }
  }, 1000)
)
```

헤당 이벤트리스너에서는 입력받을 때마다 `onSearch()`함수를 실행시키는 것이 아니고, `debounce()`함수를 호출한다. `debounce()` 함수의 코드는 아래와 같다.

```javascript
const debounce = (callback, time) => {
  let timer
  return (...params) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      callback(...params)
    }, time)
  }
}
```

`debounce()`함수는 콜백 함수와 지연시킬 시간을 인수로 받아서, 디바운싱 된 새로운 함수를 리턴한다. 디바운싱은 `setTimeout()`으로 인자로 넘어온 시간만큼 지연시킨 후에, 인자로 넘긴 함수를 실행시키는 방식이다. 아래 결과를 보면 디바운싱을 1초 적용한 이후에는 피자라는 키워드 한번만 요청한다.

![디바운싱 적용 후](https://ifh.cc/g/zYCzGI.jpg)

## 쓰로틀링(Throttling)

쓰로틀링은 마지막 함수가 호출된 이후에 일정 시간이 지나기 전까지는 다시 호출하지 않는 것이다. 다시 말하면 특정 시점에 함수를 호출하고 나서 이후의 함수는 무시해버리는 것이다. 쓰로틀링은 주로 스크롤을 올리거나 내릴 때 자주 쓰인다. 만약 스크롤 이벤트에 함수 호출 등 작업이 걸려있다면, 스크롤을 올리고 내릴 때 엄청 많은 호출 횟수가 쌓이게 되고, 큰 부하를 줄 것이다. 그래서 이러한 상황에 쓰로틀링을 걸면 몇 초에 한번만 딱 함수를 실행하도록 하는 것이다. 마지막 함수가 호출된 후 지정한 시간이 지나기 전에는 호출되지 않는다. 위에 디바운싱을 통해 구현한 부분은 아래와 같이 쓰로틀링으로 동일한 동작으로 구현할 수 있다. 이렇게 ajax도 쓰로틀링으로 구현할 수 있으나, 경우에 따라 디바운싱에 비해 더 많이 호출될 수 있기 때문에, 이 경우에는 디바운싱이 더 적합하다.

그러나 자주 사용되는 무한 스크롤링 페이지의 경우, 디바운싱은 해당 이벤트가 멈춰야 실행되기 때문에 추가 컨텐츠가 있어도 스크롤 중엔 더 가져오지 못한다. 하지만 쓰로틀링의 경우, 일정 시간 지난 후에 실행되기 때문에 사용자가 footer에 도달하기 전에 데이터를 가져올 수 있다.

```javascript
let timer
this.$target.addEventListener('keyup', e => {
  if (!timer) {
    timer = setTimeout(() => {
      timer = null
      this.onSearch(e.target.value)
    }, 1000)
  }
})
```

## 디바운스와 쓰로틀링의 차이점

사실 이렇게 알아보고서도 디바운스와 쓰로틀링이 같은 맥락의 역할을 하기 때문에 차이를 명확하게 느끼지 못할 수 있는데, 결국 주로 쓰이는 용도가 다르기 때문에 그것에 집중해봐야 한다. 쓰로틀링은 적어도 정한 시간 이후에는 실행을 보장한다. 하지만 디바운스는 이벤트가 실행 중일 때는 실행하지 않고, 특정시간 사이에 이벤트가 발생되지 않았을 때 마지막 한번의 실행만 하는 것이다. 그래서 만약에 1초의 시간을 지정하고 그 시간동안 지속적으로 이벤트가 발생할 경우, 그 사이들의 호출은 모두 무시한다.

아까 위의 예시대로 쓰로틀링과 디바운싱을 비교해보자. 시간은 동일하게 1000ms로 하고 피자를 5번 입력할 동안 발생되는 네트워크 요청을 보자.
![쓰로틀링](https://ifh.cc/g/KSDkNI.jpg)
![디바운싱](https://ifh.cc/g/W5IhnY.jpg)
쓰로틀링의 경우, 입력하는 동안에도 호출이 되기 때문에 다섯번 입력하는 동안 총 세번의 요청이 일어난다. 반면에 디바운싱의 경우, 피자를 다섯번 입력할 동안은 요청이 일어나지 않고, 입력이 끝난 후에 1000ms 세컨드가 지나고 네트워크 요청이 한번만 일어난다.

---

> 참고 글

1. [쓰로틀링과 디바운싱](https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa)
2. [Throttle, Debounce & Difference](https://webclub.tistory.com/607)
3. [Debounce in JavaScript — Improve Your Application’s Performance](https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086)
