---
title: '[Redux] Redux Toolkit 알아보기'
date: 2021-10-21 01:00:00
category: 'React'
draft: false
---

이번에 리액트 웹은 아니지만, 리액트 네이티브로 프로젝트를 진행하면서, 상태 관리를 위해 Redux를 사용하기로 했다. 그러다가 Redux의 복잡한 설정과 구성을 피해줄 수 있는 Redux Toolkit이라는 것을 알게 되었고, 실제로 적용해보니 기존 Redux에 비해서 훨씬 간단한게 설정할 수 있었다. 이번 기회에 제대로 알고 사용해보고자 Redux Toolkit에 대해서 정리해보려고 한다.

## 1. 리덕스 툴킷(Redux Toolkit)

리덕스 툴킷은 리덕스를 사용할 때 발생하는 일반적인 문제들을 해결하기 위해서 등장한, 말 그대로 리덕스를 효율적으로 사용하기 위한 도구이다. 기존에 Redux를 쌩으로 사용한다고 하면 너무 복잡하고 결국 여러가지 라이브러리를 써야했다. 예를들어 1개의 액션을 생성할 때, actionType 정의, 액션 함수 정의, 리듀서 정의와 같은 과정을 거쳐야 생성이 가능했다. 단순한 하나의 동작을 구현하기 위해서 너무 많은 코드를 생성해야되는 것이다. 그래서 등장했던게, `redux-action`이었고, 불변성을 지키기 위해 `immer`와 같은 라이브러리를 많이 사용하였다. 뿐만 아니라, `store` 를 효율적으로 핸들링하고 불필요한 리렌더링을 막기위해 `reselect`와 같은 라이브러리를 사용하고, 비동기를 위해 대부분 `saga`나 `thunk`를 거의 필수적으로 사용하곤했다.

위와 같은 현상 때문에 Redux를 제대로 사용하기 위해서 추가로 4~5개의 라이브러라를 더 설치해서 사용하게 된 것이다. 그래서 등장한 것이 `redux-toolkit`이다. `redux-toolkit`은 redux에서 공식적으로 만든 라이브러리이고, `saga`를 제외한 `immer`, `redux-action`, `thunk` 등 여러가지 기능을 모두 지원한다. 거기에 typescript 사용자들을 위한 Type Definition도 공식지원한다. 물론 `saga`를 포함하고 있는게 아니다 뿐이지 필요할 경우, `saga`를 설치해서 사용하면 된다.

## 2. `redux-toolkit`의 여러가지 지원 기능

#### 1) redux-action

`redux-action`에서 사용하던 `createAction`을 지원한다. 사용법은 기존과 같다.

```ts
const increment = createAction('INCREMENT')
const decrement = createAction('DECREMENT')

function counter(state = 0, action) {
  switch (action.type) {
    case increment.type:
      return state + 1
    case decrement.type:
      return state - 1
    default:
      return state
  }
}

const store = configureStore({
  reducer: counter,
})

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(increment())
})
```

하지만 툴킷에서는 왠만하면 `slice`를 사용하는게 좋은데, 그건 action과 reducer의 결합체같은 것이고, 뒤에서 다루려고 한다.

#### 2) reselect

`createSelector`로 실행 가능하며 vuex의 getter과 같은 기능이라고 볼 수 있다. `reselect`를 이용하면 redux store의 값을 가져와 계산 해서, redux가 적은 양의 필요한 데이터만 가지고 있게 도와주고, 구조가 바뀌어도 컴포넌트를 바꿀 필요 없이 selector만 바꾸면 되게 해준다. 그리고 메모되어 리렌더링 방지에 효율적이다.

```ts
const listState = (state: RootState) => state.todoSlice.lists

export const getFilterLike = createSelector(listState, lists => {
  return lists.filter(({ likes }: { likes: number }) => likes > 10)
})
```

#### 3) immer의 produce

redux의 경우 객체 불변성(immutable)이 중요한데, 불변성을 쉽게 유지하도록 `immer.js`를 주로 사용한다. 툴킷에서는 `immer`의 `produce`함수를 공식적으로 제공한다. 두가지 파라미터를 받는데, 첫 번째는 수정하고 싶은 객체/배열을 두고, 두 번째는 첫번째 파라미터에 할당될 객체/배열을 바꾸는 함수를 넣으면 된다.

```ts
const initialState = [{ name: 'nkh', address: { city: 'seoul' } }]

export default function auth(state = initialState, action) {
  produce(state, draft => {
    switch (action.type) {
      case SET_INFO:
        draft[0].name = action.data.name
        draft[0].address.city = action.data.city
        break
      case ADD_INFO:
        draft.push({ name: 'hhh', address: { city: 'zzz' } })
      default:
        return draft
    }
  })
}
```

#### 4) redux-thunk

비동기 작업을 위한 라이브러인 `redux-thunk` 기능을 공식으로 지원한다. 툴킷에서는 `createAsyncThunk`를 이용해서 thunk 처럼 사용한다. 주의할 저

```ts
export const fetchTodo = createAsyncThunk(
  `${name}/fetchTodo`,
  async ({ test1, test2 }: { test1: number; test2: number }, thunkAPI) => {
    try {
      return (await getSplashImage(1)).data
    } catch (e) {
      return thunkAPI.rejectWithValue(await e.response.data)
    }
  }
)
```

#### 5) Flux Standard Action 강제화

툴킷에서는 FSA 방식을 사용하지 않으면 무조건 에러를 띄운다. 즉, `action.payload`를 통해 접근해야한다.

```ts
export interface Action<Payload> extends AnyAction {
  type: string
  payload: Payload
  error?: boolean
  meta?: Meta
}
```

#### 6) Type Definition

reducer의 `RootState`에 대한 타입 action 함수, payload에 대한 타입을 신경써줘야 하는 번거로움이 있었지만 툴킷에서는 이 부분을 해결해서 내장 타입으로 지원한다.

## 3. `redux-toolkit` 사용법

먼저 프로젝트에 `redux-toolkit` 라이브러리를 설치한다.

```bash
//npm
npm install @reduxjs/toolkit

//yarn
yarn add @reduxjs/toolkit
```

#### configureStore

기존 Redux에서는 `createStore`를 사용해서 store를 생성했어야 하지만, 툴킷에서는 `configureStore`를 통해 코드량을 상당 부분 줄일 수 있다.

```ts
// 기존 createStore 방식
import { createStore } from 'redux'
import rootReducer from './module/rootReducer'

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(rootReducer, devTools)

// configureStore 방식
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: rootReducer })
```

위에서 `configureStore`는 Redux의 createStore를 활용한 API로 reducer 필드를 필수적으로 넣어주어야 한다.

#### `createSlice`

Redux Tools에서는 action, reducer 대신에 slice를 사용한다. `createSlice`가 `createAction`과 `createReducer`를 합친 개념이라고 볼 수 있다. 물론 slice를 안쓰고, 기존과 같이 개발해도 되지만 굳이 불편하게 그렇게 할 필요가 없다.

```ts
createSlice({
  name: 'reducerName',
  initialState: [],
  reducers: {
    action1(state, payload) {
      //action1 logic
    },
    action2(state, payload) {
      //action2 logic
    },
    action3(state, payload) {
      //action3 logic
    },
  },
})
```

## 4. Typescript 환경에서 Redux-toolkit

#### slice

slice에서 initialState에 타입을 지정해줄 수 있다.

```ts
interface Todo {
  id: number
  text: string
  isDone: boolean
}

const initialState: Todo[] = []

const todosSlice = createSlice({
  initialState: [],
  // ...
})
```

리듀서의 리턴 타입으로 payload에 어떤 데이터를 넣을지 지정할 수 있는데, 이 때 `PayloadAction` 타입을 사용하면 된다.

```ts
const todosSlice = createSlice({
  reducers: {
    removeTodo: (state, { payload }: PayloadAction<{ id: number }>) => {
      // ...
    },
  },
  // ...
})
```

#### root reducer

전체 상태 트리 타입을 가져올 수 있다. 타입스크립트 유틸리티 타입 `ReturnType`을 사용한다.

```ts
import todosSlices from 'features/todo/todoSlice'

const rootReducer = combineReducers({
  todo: todosSlices.reducer,
})

declare global {
  type RootState = ReturnType<typeof rootReducer>
}

export default rootReducer
```

#### `TypedUseSelectHook`

Redux state를 가져오는 `useSelector` 훅의 파라미터는 state인데, 여기서 일일이 타고 들어가도 되지만 react-redux에서 제공하는 헬퍼 타입을 통해 그렇게 하지 않을 수도 있다.

```ts
import { TypedUseSelectorHook, useSelector } from 'react-redux'

// useSelector hook 대신 사용. useSelector 함수의 파라미터에 타입을 지정하지 않아도 된다.
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
```

## 정리

프로젝트에 리덕스를 사용해야하는 상황이라면, 리덕스 툴킷은 무조건 사용하는게 좋다는 생각이 들었다. 리덕스의 단점인 많은 코드량을 상쇄할 수도 있고, 특히 리덕스는 보편적으로 많이 사용하고 있는 상태관리 라이브러리이기 때문에, 리덕스를 사용해본 사람이라면, 리덕스의 특징을 유지하면서도 단점을 상쇄하고, 쉽게 적응할 수 있기 때문에 더 적합할 것이라는 생각이 들었다. 최근 리덕스 자체의 복잡성 때문에 recoil등의 다른 상태관리 라이브러리도 많이 쓰이는데, 리덕스 툴킷을 사용한다면 그 중간 어디쯤의 포지션을 하는 것 같다. 아직 리덕스 툴킷의 다양한 기능들을 다 사용해보지는 않았지만, 가능하면 프로젝트에 최대한 적용할 수 있는 부분은 적용해보도록 노력해야겠다.

참고로 내가 지금 진행하고 있는 프로젝트의 환경은 ReactNative + Expo + typescript 이기 때문에, 혹시 RN에 Redux-Toolkit을 고려하고 있다면 사용가능하니 지체없이 도입해도 좋을 것 같다.

---

출처

1. [redux-toolkit](https://kyounghwan01.github.io/blog/React/redux/redux-toolkit/#%E1%84%89%E1%85%A1%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%92%E1%85%A1%E1%84%82%E1%85%B3%E1%86%AB-%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%B2)

2. [[ React ] 리액트 리덕스 툴킷 redux-toolkit](https://mjn5027.tistory.com/36)

3. [Redux Toolkit을 활용한 React 상태 관리](https://blog.rhostem.com/posts/2020-03-04-redux-toolkits)
