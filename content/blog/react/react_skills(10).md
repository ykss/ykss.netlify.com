---
title: '리액트 다루는 기술 정리 (10) - 미들웨어를 통한 비동기 작업 관리'
date: 2021-07-05 18:00:00
category: 'React'
draft: false
---

리액트 웹 애플리케이션에서 API 서버와 연동하여 많이 사용하는데, 그때 API 요청에 대한 상태를 잘 관리해야 한다. 요청이 시작되었을 때는 로딩 중인 것을, 요청이 성공하거나 실패하면 로딩이 끝난것을 명시해야 한다. 리덕스를 사용하고 있고 이러한 비동기 작업을 관리한다면 **미들웨어**를 사용하여 효율적으로 상태 관리 할 수 있다.

## 18.1 미들웨어란?

리덕스 미들웨어는 액션을 디스패치했을 때 리듀서에서 처리하기에 앞서 사전에 지정된 작업들을 처리한다. 미들웨어는 액션과 리듀서 사이의 중간자이다. 리듀서가 액션을 처리하기 전 미들웨어가 할 수 있는 것을 여러가지이다. 액션을 콘솔에 기록할 수도 있고, 액션 정보를 기반으로 액션을 취소하거나, 다른 종류의 액션을 추가로 디스패치하는 것도 가능하다.

![리덕스 미들웨어](https://miro.medium.com/max/1400/1*BHUKvOmqPjJHpRY1wp1YFw.png)

```jsx
const loggerMiddleware = store => next => action => {}
```

리덕스 미들웨어의 기본 구조는 위와 같다. 미들웨어는 결국 함수를 반환하는 함수를 반환하는 함수이다. 여기서 next 파라미터는 함수 형태이고 store.dispatch와 비슷한 역할을 한다. 큰 차이는 next(action)을 호출하면 그 다음 처리할 미들웨어에게 action을 넘겨주고, 그 다음 미들웨어가 없으면 리듀서에게 액션을 넘겨준다. 미들웨어 내부에서 store.dispatch를 실행하면 첫 번째 미들웨어부터 다시 처리하고 next를 사용하지 않으면 액션이 리듀서에 전달되지 않는다.

![로깅 미들웨어](https://ifh.cc/g/fWXT9d.jpg)

## 18.2 redux-logger 사용하기

redux-logger 설치 후 적용하면 직접 만든 미들웨어보다 훨씬 쉽고 깔끔하게 적용할 수 있다. 다른 기능의 미들웨어도 이미 완성되어 있는 라이브러리를 설치해서 사용하는게 좋다.

```jsx
const logger = createLogger()
const store = createStore(rootReducer, applyMiddleware(logger))
```

![redux-logger적용](https://ifh.cc/g/reOXek.jpg)

## 18.3 비동기 작업을 처리하는 미들웨어 사용

- redux-thunk : 비동기 작업을 처리할 때 가장 많이 사용되는 미들웨어로 객체가 아닌 함수 형태의 액션을 디스패치 할 수 있도록 해준다.
- redux-saga : redux-thunk 다음으로 많이 사용되는 비동기 작업 관련 미들웨어 라이브러리로 특정 액션이 디스패치 되었을 때 정해진 로직에 따라 다른 액션을 디스패치 시키는 규칙을 작성하여 비동기 작업을 처리할 수 있게 해준다.

### 18.3.1 Thunk란?

Thunk는 특정 작업을 나중에 할 수 있게 함수 형태로 감싼 것을 의미한다. redux-thunk 라이브러리를 사용하면 thunk 함수를 만들어 디스패치할 수 있다. 아래의 형태가 예시 thunk 함수이다.

```jsx
const sampleThunk = () => (dispatch, getState) => {
  //현재 상태 참조 및 새 액션 디스패치 가능
}
```

### 18.3.2 redux-saga

redux-thunk는 함수 형태의 액션을 디스패치하여 미들웨어에서 해당 함수에 스토어의 dispatch와 getState를 파라미터로 넣어서 사용하는 원리이다. 그래서 구현한 thunk 함수 내부에서 API 요청도 하고, 다른 액션을 디스패치하거나 현재 상태를 조회한다. redux-saga는 좀 더 까다로운 상황에서 유용하다.

- 기존 요청을 취소 처리해야 할 때(불필요한 중복 요청 방지)
- 특정 액션이 발생했을 때 다른 액션을 발생시키거나, API 요청 등 리덕스와 관계없는 코드를 실행할 때
- 웹소켓을 사용할 때
- API 요청 실패 시 재요청 해야 할 때

### 18.3.2.1 제너레이터 함수 이해하기

redux-saga에서는 ES6의 제너레이터 함수라는 문법을 사용한다. 흔히 쓰이지 않는 문법이기 때문에 진입장벽이 있을 수 있다. 제너레이터 함수 문법의 핵심 기능은 함수 작성 시 특정 구간에 멈춰놓을 수도 있고, 원할 때 다시 돌아가게도 할 수 있는 것이다.

```jsx
function* generatorFunction() {
  console.log('hi')
  yield 1
  console.log('generator')
  yield 2
  console.log('function*')
  yield 3
  return 4
}

const generator = generatorFunction()

generator.next()
// hi
// {value:1, done:false}
generator.next()
// generator
// {value:2, done:false}
generator.next()
// function*
// {value:3, done:false}
generator.next()
// {value:4, done:true}
generator.next()
// {value:undefined, done:true}
```

next()가 호출되면 다음 yield가 있는 곳까지 호출하고 다시 함수가 멈춘다. 제너레이터 함수를 사용하면 함수를 도중에 멈추거나 여러 값을 순차적으로 반환할 수 있다. next 함수에 파라미터를 넣으면 제너레이터 함수에서 yield를 사용해서 해당 값 조회가 가능하다.

redux-saga는 제너레이터 문법을 기반으로 비동기 작업을 관리해준다. 우리가 디스패치하는 액션을 모니터링해서 그에 따라 필요한 작업을 따로 수행할 수 있는 미들웨어이다.

### 18.3.2.2 비동기 카운터 만들기

```jsx
//counter module

const INCREASE_ASYNC = 'counter/INCREASE_ASYNC'
const DECREASE_ASYNC = 'counter/DECREASE_ASYNC'

//액션 생성 함수
export const increase = createAction(INCREASE)
export const decrease = createAction(DECREASE)

export const increaseAsync = createAction(INCREASE_ASYNC, () => undefined)
export const decreaseAsync = createAction(DECREASE_ASYNC, () => undefined)

function* increaseSaga() {
  yield delay(1000)
  yield put(increase())
}
function* decreaseSaga() {
  yield delay(1000)
  yield put(decrease())
}
export function* counterSaga() {
  // 들어오는 모든 액션에 대한 처리
  yield takeEvery(INCREASE_ASYNC, increaseSaga)
  // 가장 마지막으로 실행된 작업만 수행
  yield takeLatest(DECREASE_ASYNC, decreaseSaga)
}
```

여기서 제네레이터 함수처럼 만들어주고 module의 인덱스에서 루트 리듀서처럼 루트 사가를 만들어주어야 한다.

```jsx
export function* rootSaga() {
  //여러 사가를 합쳐주는 역할
  yield all([counterSaga()])
}
```

여기까지 마치고 작성한 saga 미들웨어를 스토어에 적용시켜주기만 하면 된다.

```jsx
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, ReduxThunk, sagaMiddleware))
)

sagaMiddleware.run(rootSaga)
```

이렇게 작성했을 때, increase 같은 경우는 여러번 누르면 1초간격으로 누른 횟수 만큼 카운터가 반영된다. INCREASE_ASYNC 액션이 누른 횟수만큼 디스패치 되고 이에 따라 INCREASE 액션도 누른 횟수만큼 디스패치 되기 때문이다. 이것은 `takeEvery`를 사용해서 `increaseSaga`를 등록했기 때문에 그런것이다. 하지만 decrease같은 경우는 여러번 누르면 -1만 일어난다. 그것은 DECREASE_ASYNC 액션은 누른 횟수 만큼 디스패치 될 수 있지만 DECREASE 액션은 한번만 디스패치 되기 때문이다. 이것은 `decreaseSaga`를 등록할 때, `takLatest` 를 사용했기 때문이다. 여러 액션이 중첩되었을 경우 가장 마지막 액션만 처리한다.

### 18.3.2.3 API 요청 상태 관리하기

과정은 카운터 컴포넌트에 적용하는 과정과 같고, redux-saga를 사용할 때 액션에 payload를 넣으려면 API 호출하는 함수의 인수로 넣어주어야 한다. 사가 내부에서 직접 호출하지 않고 `call` 함수를 사용한다. 이 함수의 첫 번째 파라미터는 호출하고 싶은 함수이고, 두번째부터 해당 함수의 인수이다.

```jsx
function* getPostSaga(action) {
  yield put(startLoading(GET_POST))
  try {
    //call을 사용할 경우 Promise를 반환하는 함수를 호출하고 기다릴수 있다.
    const post = yield call(api.getPost, action.payload)
    yield put({
      type: GET_POST_SUCCESS,
      payload: post.data,
    })
  } catch (e) {
    yield put({
      type: GET_POST_FAILURE,
      payload: e,
      error: true,
    })
  }
  yield put(finishLoading(GET_POST))
}
```

### 18.3.2.4 리팩토링

반복되는 코드를 줄이기 위해 아래와 같이 함수화 할 수 있다.

```jsx
import { call, put } from 'redux-saga/effects'
import { finishLoading, startLoading } from '../modules/loading'

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`
  const FAILURE = `${type}_FAILURE`

  return function*(action) {
    yield put(startLoading(type))
    try {
      const response = yield call(request, action.payload)
      yield put({
        type: SUCCESS,
        payload: response.data,
      })
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      })
    }
    yield put(finishLoading(type))
  }
}

////////////////////////////////
// 길었던 함수가 아래와 같이 짧아진다.//
///////////////////////////////
const getPostSaga = createRequestSaga(GET_POST, api.getPost)
const getUsersSaga = createRequestSaga(GET_USERS, api.getUsers)
```

### 18.3.2.5 알아둘 유용한 saga의 기능들

1. 사가 내부에서 현재 상태를 조회하는 방법

```jsx
function* increaseSaga() {
  yield delay(1000)
  yield put(increase())
  const number = yield select(state => state.counter)
  console.log(`현재 값은 ${number}입니다.`)
}
```

2. 사가 실행 주기를 제한하는 방법

```jsx
yield throttle(3000, INCREASE_ASYNC, increaseSaga);
```

이렇게 설정해주면 3초에 한번씩만 사가가 호출되도록 실행할 수 있다. 이전에 디바운싱과 쓰로틀링에 대해 배웠을 때의 쓰로틀링을 쉽게 사용할 수 있는 것이다.

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
