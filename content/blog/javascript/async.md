---
title: '자바스크립트의 비동기 처리 - callback, promise, async ~ await'
date: 2021-03-12 01:00:00
category: 'Javascript'
draft: false
---

저번 [자바스크립트의 동작 원리 - 어쨌든 이벤트 루프는 무엇입니까?](https://ykss.netlify.app/javascript/what_is_event_loop/)에서 작동 순서를 정리하며, 비동기 처리에 대해서도 잠시 다루었었다. 동기 함수와 비동기 함수를 헷갈릴 수도 있는데, 간단히 말해서 동기 함수는 호출한 후에 결과 값을 기다려야 하는 함수이고, 비동기 함수는 호출 후에 결과 값을 기다리지 않고 다음 호출을 할 수 있는 함수이다. 자바스크립트는 싱글 쓰레드이기 때문에 비동기 처리없이는 블로킹으로 인해 심각한 성능 저하를 겪을 수 있기 때문에 non-blocking인 비동기 함수를 적절히 사용해줘야 한다. 이번 포스트에서는 자바스크립트의 대표적인 비동기 처리 방법인 `callback`과 `promise`, `async~await`에 대해서 정리해보려고 한다.

### callback

먼저 `callback`은 자바스크립트에서는 흔히 쓰이는 함수이다. 일반적인 함수라고 하면 파라미터를 인자로 받아서 출력값을 return 하는데, 자바스크립트에서는 return 값 없이 콜백 함수를 인자로 넘겨 실행되는 방식으로도 자주 사용된다.

```javascript
function printPlayerInfo(id, callback) {
  const player = {
    name: 'mason mount',
    age: 22,
    number: id,
    position: 'midfielder',
  }
  callback(player)
}

printPlayerInfo(19, function(player) {
  console.log('player:', player)
})
```

- 결과

```javascript
player: { name: 'mason mount', age: 22, number: id, position: 'midfielder' }
```

아래는 `setTimeout()`을 적용하여 WEB API의 비동기처리를 사용한 것이다.

```javascript
function printPlayerInfo(id, callback) {
  setTimeout(() => {
    const player = {
      name: 'mason mount',
      age: 22,
      number: id,
      position: 'midfielder',
    }
    callback(player)
  }, 100)
}

printPlayerInfo(19, function(player) {
  console.log('player:', player)
})
```

자바스크립트에서는 비동기 처리를 위해 `setTimeout()`을 자주 사용하는데, 해당 함수의 첫번째 인자 또한 콜백 함수이고, 두번째 인자만큼 후에 콜백 함수를 실행한다. 하지만 콜백 함수를 잘 못 쓸 경우, 의도와 다른 순서로 코드가 실행될 수 있기 때문에 조심해야 한다. 그리고 최근에는 비동기 처리를 위해 콜백 함수를 잘 쓰지 않는 추세인데, 콜백 함수의 경우, 계속 중첩되면 가독성이 현저하게 떨어지기도 하고, 그것을 심지어 콜백 지옥이라고 부르기까지 한다. 그렇기 때문에 비동기 처리를 위해서는 주로 콜백 함수보다는 가독성이 나은 `promise`나 `async~await`로 처리한다.

### promise

`Promise` 개념은 ES6부터 도입되었다. 그 개념은 지금 당장 없을 수는 없지만 가까운 미래에 얻을 수 있는 데이터를 접근하기 위한 방벙을 제공하는 것이다. 당장 데이터를 얻을 수 없다는 것은 데이터를 얻을 떄까지 일정 시간 딜레이가 발생하는 경우를 말한다. 주로 I/O나 네트워크를 통해 요청하는 경우가 대표적인 경우라고 볼 수 있다. 반복해서 말하지만 자바스크립트는 싱글 스레드 언어이기 떄문에 딜레이가 발생하여 blocking 역할을 하는 것은 자바스크립트에게는 막대한 영향을 주기 때문에 비동기 처리가 필수적인 부분이라고 할 수 있다. (자바는 잘 모르겠지만 `Future`의 역할이라고 한다.)

위의 콜백 함수 부분에서 했던 코드를 `Promise`를 통해 바꾸면 아래와 같다.

```javascript
function printPlayerInfo(id, callback) {
  return new Promise(resolve => {
    setTimeout(() => {
      const player = {
        name: 'mason mount',
        age: 22,
        number: id,
        position: 'midfielder',
      }
      resolve(player)
    }, 100)
  })
}

printPlayerInfo(19).then(function(player) {
  console.log('player:', player)
})
```

- 결과

```javascript
player: { name: 'mason mount', age: 22, number: id, position: 'midfielder' }
```

위 코드를 보면 이전처럼 콜백 함수를 함수 호출 시 넘기지 않고, `Promise` 객체를 생성하여 리턴 받은 것을 `then`을 통해서 결과 값을 가지고 실행할 로직을 넘겨준다. 그래서 기존 콜백 함수 스타일보다는 비동기 코드이지만 마치 동기 코드인 것처럼 읽을 수 있어서 더 직관적이라고 할 수 있다. 변수에 할당하는 방법으로도 생성해서 사용할 수도 있지만 주로 화살표 함수와 함께 아래와 같은 형태로 사용된다.

```javascript
function returnPromise() {
  return new Promise((resolve, reject) => { ... } );
}
```

위의 형태에서 `resolve()`는 정상 처리 시, 가져올 결과 값을 넘겨주고, `reject()`의 경우는 예외 처리시 가져올 결과 값을 처리한다. 아래와 같이 쓸 수 있다.

```javascript
function divide(A, B) {
  return new Promise((resolve, reject) => {
    if (B === 0) reject(new Error('Unable to devide by 0.'))
    else resolve(A / B)
  })
}

devide(3, 0)
  .then(result => console.log('성공:', result))
  .catch(error => console.log('실패:', error))
```

- 결과

```javascript
실패: Error: Unable to devide by 0.
    at Promise (<anonymous>:4:20)
    at new Promise (<anonymous>)
    at devide (<anonymous>:2:12)
    at <anonymous>:1:1
```

위와 같이 `then()`과 `catch()`를 통해서 `try~catch`와 유사하게 예외처리도 할 수 있다. 그리고 `Promise`는 주로 직접 생성해서 쓰기 보다는 다른 함수를 호출해서 결과 값으로 받아서 많이 사용한다. 대표적으로 `fetch()` 함수를 API를 사용하기 위해서 자주 쓰는데, 해당 함수를 사용할 때도 `Promise` 객체가 리턴된다. 아래와 같은 형태로 사용될 수 있다.

```javascript
fetch(url)
  .then(response => console.log('response:', response))
  .catch(error => console.log('error:', error))
```

`then()`과 `catch()`메서드는 또 다른 `Promise` 객체를 리턴하기 때문에 리턴 값을 또 `then()`과 `catch()`메서드를 이용하여 접근할 수 있다. 그렇기 때문에 계속 연결되어 늘어날 수 있는데, 이것을 `Promise`의 **메서드 체이닝**이라고 부른다. 아래와 같은 형태를 보일 수 있다.

```javascript
fetch(url)
  .then(response => response.json())
  .then(player => post.userId)
  .then(userId => url + userId)
  .then(url => fetch(url))
  .then(response => response.json())
  .then(user => console.log('user:', user))
  .catch(error => console.log('error:', error))
```

`Promise` 방식이 이런식으로 메서드 체이닝 형태로 코딩되기도 하고, `then()`이 중첩된 경우, 디버깅에서 어떤 `then()`에서 에러가 일어난지 찾기 어려운 경우도 발생할 수 있기 때문에, 요즘 `async ~ await`가 많이 쓰이는 추세이다.

### async ~ await

`Promise`의 여러가지 불편한 점이 있었기 떄문에 ES7부터는 `async/await`가 추가되었다. 아래 코드를 통해 어떻게 쓰이는지 살펴보자

```javascript
async function fetchPlayerName(player) {
  const playerResponse = await fetch(`${url}/players/${player}`)
  const player = await playerResponse.json()
  const userId = player.userId
  const userResponse = await fetch(`${url}/users/${userId}`)
  const user = await userResponse.json()
  return user.name
}
fetchPlayerName(1).then(name => console.log('name:', name))
```

먼저 형태를 보면 함수 앞에 `async`가 붙어있다. 그리고 `Promise`를 리턴하는 비동기 함수를 호출할 때는 모두 `await`가 붙어있다. 이 둘은 같이 쓰여야 하는 키워드 이다. `await`키워드를 사용하면 바로 다음을 처리하는게 아니고 결과 값을 얻을 때까지 기다려줬다가 다음 단게를 실행한다. 그렇기 떄문에 일반적인 동기 코드와 동일한 형태로 쓰일 수 있다. 코드의 가독성 면에서 비동기 처리 방식 중 가장 뛰어나다고 할 수 있다.

하지만 주의 할 것은 `await` 키워드를 붙히게 되면 명시적으로 `Promise`객체를 생성하지 않아도 `Promise` 객체가 리턴된다. 그리고 호출부에서는 여전히 `then()` 메서드를 통해서 결과 값을 처리한다.

`async/await`의 가장 큰 장점 중 하나가 예외 처리 부분인데, 동기 코드와 비동기 코드 구분 없이 `try/catch` 구문을 통해 예외를 처리할 수 있다.

### 결론

비동기 처리 방식인 `callback`,`promise`,`async/await`에 대해서 알아봤는데, 시간적인 순서로 등장한 만큼 앞 부분의 비동기 처리에 대한 방법에 대해서 불편한 점이나 단점을 개선하여 다른 방식이 추가로 나오는 과정을 살펴볼 수 있었다. 그렇기 때문에 지금 코딩을 할 떄 비동기 처리를 위해서는 `async/await`를 능숙하게 사용할 수 있다면 좀 더 깔끔한 코딩을 할 수 있을 것으로 생각한다.

> 출처

- [자바스크립트 비동기 처리 시리즈](https://www.daleseo.com/js-async-callback/)
