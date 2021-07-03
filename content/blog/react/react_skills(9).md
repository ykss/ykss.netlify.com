---
title: '리액트 다루는 기술 정리 (9) - 리덕스로 상태 관리'
date: 2021-06-28 18:00:00
category: 'React'
draft: false
---

# 17. 리덕스를 사용하여 리액트 애플리케이션 상태 관리하기

리액트 앱에서 리덕스를 사용하면 상태 업데이트에 관한 로직을 모듈로 따로 분리하여 컴포넌트 파일과 별개로 관리 할 수 있다. 그렇기 때문에 유지 보수성이 향상된다. 또 여러 컴포넌트에서 동일한 상태를 공유해야 할 때 매우 유용하다고 할 수 있다. 그리고 실제 업데이트가 필요한 컴포넌트만 리렌더링되도록 최적화 할 수도 있다.

## 17.2 UI 준비

리액트에서 리덕스 사용시 주로 쓰이는 패턴이 프레젠테이셔널 컴포넌트와 컨테이너 컴포넌트를 분리하는 것이다. 프레젠테이션 컴포넌트는 상태 관리가 이루어지지 않고 props를 받아서 화면에 UI로 보여주기만 하는 컴포넌트이다. 컨테이너 컴포넌트는 리덕스와 연동되어 있는 컴포넌트로 리덕스로부터 상태를 받기도하고 리덕스 스토어에 액션을 디스패치하기도 한다. 다만 이 패턴이 필수적인 것은 아니다.

![컨테이너프레젠테이셔널](https://media.vlpt.us/images/jo_love/post/3cdac1f4-b513-4c80-bcb2-502dcfd81a30/container-and-presentational.jpg)

UI에 관련된 프레젠테이셔널 컴포넌트는 `src/components` 경로에 저장하고, 리덕스 연동과 관련된 컨테이너 컴포넌트는 `src/containers` 컴포넌트에 작성한다.

## 17.3 리덕스 관련 코드 작성

리덕스에서 사용할 액션 타입, 액션 생성 함수, 리듀서 코드를 작성할 때 방법이 여러가지가 있다. 일반적인 구조는 actions, constants, reducers로 구성된 세 디렉터리를 만들어서 기능별로 파일을 하나씩 만드는 것이다. 하지만 새로운 액션을 만들 때마다 세 종류 파일을 모두 수정해야 해서 불편할 수 있다.

Ducks 패턴은 액션 타입, 액션 생성 함수, 리듀서 함수를 기능별로 파일 하나에 몰아서 작성하는 방식이다. 일반적인 패턴보다는 좀 더 편리하다.

## 17.4 리액트 애플리케이션에 리덕스 적용하기

![리덕스 적용 디렉토리 구조](https://ifh.cc/g/l9Yqrq.jpg)

## 17.5 리덕스 편하게 사용하기

액션 생성 함수와 리듀서를 작성할 때 redux-actions 라이브러리와 immer 라이브러리를 사용하면 리덕스를 더 편하게 사용 가능하다.

### 17.5.1 redux-actions

redux-actions를 사용하면 액션 생성 함수를 더 간결하게 작성할 수 있다. 리듀서 작성 시에도 switch/case 문이 아닌 handleActions라는 함수를 사용해서 각 액션마다 업데이트 함수를 설정하여 작성할 수 있다. 해당 라이브러리를 사용하는 것은 가독성과 편리함을 위해 사용하는 것이기 때문에 꼭 사용할 필요는 없다.

```jsx
//액션 생성 함수
export const increase = createAction(INCREASE)

export const decrease = createAction(DECREASE)

//초기상태 및 리듀서 함수 만들기
const initialState = {
  number: 0,
}

const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 }),
    [DECREASE]: (state, action) => ({ number: state.number - 1 }),
  },
  initialState
)
```

전달할 파라미터나 객체를 통해 전달해야 할 경우 아래와 같이 `createAction` 을 사용하여 적용할 수 있다. insert의 경우 todo 객체를 액션 객체 안에 넣어주어야 하기 때문에 두 번째 파라미터에 text를 넣으면 todo 객체가 반환될 수 있도록 작성했다. 다른 케이스에서는 `input => input` 과 같이 넣어줬는데 이 부분은 필수적이지 않으나 코드를 보고 이해를 돕기 위해 작성해주면 가독성 부분에서 더 낫다. 리듀서의 경우는 `handleActions` 을 사용하여 작성할 수 있는데, `createAction` 으로 만든 액션 생성 함수는 파라미터로 받아온 값을 원하는 이름이 아닌 action.payload라는 이름으로 공통적으로 넣어주게 된다. 그렇기 때문에 코드상에서 어떤 파라미터가 전달되는지 헷갈리 수 있기 때문에 `(state, { payload : input })` 와 같이 객체 비구조화 할당으로 어떤 값을 의미하는 지 명시할 수 있다.

```jsx
export const changeInput = createAction(CHANGE_INPUT, input => input);

let id = 3;

export const insert = createAction(INSERT, text => ({
    id: id++,
    text,
    done: false
}))

export const toggle = createAction(TOGGLE, id => id)

export const remove = createAction(REMOVE, id => id)

{...}
const todos = handleActions(
    {
        [CHANGE_INPUT]: (state, {payload: input}) => ({
            ...state,
            input
        }),
        [INSERT]: (state, {payload:todo}) => ({
            ...state,
            todos: state.todos.concat(todo),
        }),
        [TOGGLE]: (state, {payload:id}) => ({
            ...state,
            todos: state.todos.map(todo =>
                todo.id === id ? {...todo, done: !todo.done } : todo),
        }),
        [REMOVE]: (state, {payload:id}) => ({
            ...state,
            todos: state.todos.filter(todo => todo.id !== id)
        })
    },
    initialState

```

### 17.5.2 immer

리듀서에서 상태 업데이트를 할 때, 불변성을 지키기 위해 보통 spread 연산자(...)와 배열의 내장 함수를 사용한다. 하지만 모듈이 복잡해지면, 불변성 유지가 어려워 진다. 특히 객체의 깊이가 깊어질 경우 더 그렇다. 이 때 immer를 사용하면 훨씬 편리하게 불변성을 유지할 수 있다. 하지만 간단한 모듈일 경우에는 immer를 사용하면 오히려 코드가 더 길어질 수 있다.

```jsx
const todos = handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: input }) =>
      produce(state, draft => {
        draft.input = input
      }),
    [INSERT]: (state, { payload: todo }) =>
      produce(state, draft => {
        draft.todos.push(todo)
      }),
    [TOGGLE]: (state, { payload: id }) =>
      produce(state, draft => {
        const todo = draft.todos.find(todo => todo.id === id)
        todo.done = !todo.done
      }),
    [REMOVE]: (state, { payload: id }) =>
      produce(state, draft => {
        const index = draft.todos.findIndex(todo => todo.id === id)
        draft.todos.splice(index, 1)
      }),
  },
  initialState
)
```

## 17.6 Hooks를 사용하여 컨테이너 컴포넌트 만들기

리덕스 스토어와 연동된 컨테이너 컴포넌트를 만들 때 connect 함수 대신 react-redux에서 제공하는 Hooks를 사용할 수도 있다.

### 17.6.1 useSelector로 상태 조회하기

useSelector를 사용하면 connect 함수를 사용하지 않고도 리덕스 상태를 조회할 수 있다.

`const 결과 = useSelector(상태 선택 함수);`

useDispatch를 통해 컴포넌트 내부에서 스토어 내장 함수 dispatch를 사용할 수 있게 해준다. 컨테이너 컴포넌트에서 액션을 디스패치 해야할 때는 이 Hook을 사용하면 된다.

```jsx
const CounterContainers = () => {
  const number = useSelector(state => state.counter.number)
  const dispatch = useDispatch()
  return (
    <Counter
      number={number}
      onIncrease={() => dispatch(increase())}
      onDecrease={() => dispatch(decrease())}
    />
  )
}
```

컴포넌트 성능 최적화를 위해서는 useCallback까지 적용해주어야 함수가 계속 리렌더링되지 않는다. 그렇기 때문에 useDispatch를 사용할 때는 useCallback과 함꼐 사용하는 습관을 가져야 한다.

```jsx
const onIncrease = useCallback(() => dispatch(increase()), [dispatch])
    const onDecrease = useCallback(() => dispatch(decrease()), [dispatch])
    return <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />;
};
```

### 17.6.2 useStore 사용하여 리덕스 스토어 사용하기

useStore Hooks 사용 시 컴포넌트 내부에서 리덕스 스토어 객체를 직접 사용할 수 있다.

```jsx
const store = useStore()
store.dispatch({ type: 'SAMPLE_ACTION' })
store.getState()
```

```jsx
const TodosContainers = () => {
  const { input, todos } = useSelector(({ todos }) => ({
    input: todos.input,
    todos: todos.todos,
  }))
  const dispatch = useDispatch()
  const onChangeInput = useCallback(input => dispatch(changeInput(input)), [
    dispatch,
  ])
  const onInsert = useCallback(text => dispatch(insert(text)), [dispatch])
  const onToggle = useCallback(id => dispatch(toggle(id)), [dispatch])
  const onRemove = useCallback(id => dispatch(remove(id)), [dispatch])

  return (
    <Todos
      input={input}
      todos={todos}
      onChangeInput={onChangeInput}
      onInsert={onInsert}
      onToggle={onToggle}
      onRemove={onRemove}
    />
  )
}
```

connect 함수와 주요 차이점은 앞으로 컨테이너 컴포넌트를 만들 당시에 connect를 사용하거나 useSelector과 useDispatch를 사용해도 된다. Hook이 있다고해서 기존 connect 함수르 사라지는 것은 아니라 편한것이 중요하다. useSelector를 제대로 사용하고 성능 최적화를 위해서는 React.memo를 사용해야 한다.

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
