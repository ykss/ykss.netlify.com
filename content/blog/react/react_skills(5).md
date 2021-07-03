---
title: '리액트 다루는 기술 정리 (5) - 컴포넌트 성능 최적화'
date: 2021-06-15 18:00:00
category: 'React'
draft: false
---

- onSubmit 이벤트는 브라우저를 새로고침 시킨다. → `e.preventDefault()` 함수를 호출하면서 새로 고침을 방지 할 수 있다.
- onSubmit 이벤트의 경우 인풋에서 `Enter` 키를 입력했을 때도 발생한다. 하지만 버튼에 onClick 이벤트의 경우에는 따로 엔터키를 감지하여 처리하는 로직을 작성해야 한다.

# 11. 컴포넌트 성능 최적화

## 11.1 많은 데이터 렌더링하기

useState의 기본 값에 함수를 넣어줄 때, `useState(functionName())`과 같이 작성하면 리렌더링마다 함수가 호출되지만 `useState(functionName)`과 같이 하면 처음 랜더링될때만 함수가 실행된다.

## 11.2 크롬 개발자 도구를 통한 성능 모니터링

개발자 도구 performance 항목에서 녹화를 통해 작업 처리시간을 확인 할 수 있다.

## 11.3 느려지는 원인 분석

컴포넌트는 아래 상황에서 리렌더링을 발생한다.

1. 전달받은 props가 변경될 때
2. 자신의 state가 바뀔 때
3. 부모 컴포넌트가 리렌더링될 때
4. forceUpdate 함수가 실행 될 때

컴포넌트 리렌더링이 느려지는 원인일 가능성이 매우 많다. 그렇기 때문에 리렌더링이 발생할 때, 꼭 필요한 컴포넌트만 리렌더링하도록 최적화 해주어야 성능 개선이 일어난다. 즉, 불필요한 리렌더링이 일어나지 않도록 방지해주어야 한다.

## 11.4 React.memo를 사용하여 컴포넌트 성능 최적화

함수형 컴포넌트에서는 `React.memo` 를 사용하여 컴포넌트의 props가 바뀌지 않으면 리렌더링 하지 않도록 설정할 수 있다. 사용법은 매우 간단하다. 컴포넌트를 만들고 감싸주기만 하면된다.

```jsx
import React from 'react';

const Component = (props) => {
	...
};

export default React.memo(Component);
```

## 11.5 컴포넌트 내 함수 최적화 하기

### 11.5.1 useState의 함수형 업데이트

```jsx
const onIncrease = useCallback(
  () => setNumber(prevNumber => prevNumber + 1),
  []
)
```

`setNumber(number+1)` 과 같이 하지 않고 위처럼 하면 `useCallback` 을 사용할 때 두 번째 파라미터에 number을 넣지 않아도 된다. 이렇게 하면 성능이 훨씬 향상 된다.

### 11.5.2 useReducer 사용하기

```jsx
function stateReducer(states, action) {
	switch (action.type) {
		case 'INSERT' :
			return states.concat(action.state);
		case 'REMOVE' :
			return states.filter(state => state.id !== action.id);
		case 'TOGGLE' :
			return states.map(state =>
				state.id === action.id ? { ...state, checked: !state.checked } : todo,
			}
		default :
			return states;
	}
}

const App = () => {
	const [states, dispatch] = useReducer(stateReducer, undefined, createInitialState);
}
```

useReducer을 사용할 때 두 번째 파라미터에 초기 상태를 넣어줘야하는데, 여기서는 두번째 파라미터에 undefined를 넣고 세 번째 파라미터에 초기 상태를 만들어 주는 함수를 넣는다. 이렇게하면 컴포넌트가 맨 처음 렌더링 될 때만 함수가 호출된다. 리듀서를 쓰는 것은 기존 코드를 많이 고쳐야 한다는 단점이 있지만 상태를 업데이트하는 로직을 모아서 컴포넌트 바깥에 둘 수 있다는 장점이 있다.

## 11.6 불변성의 중요성

불변성을 지킨다는 것은 기존의 값을 수정하지 않으면서 새로운 값을 만들어 내는 것이다. 불변성이 지켜지지 않으면 객체 내부의 값이 새로워져도 바뀐 것을 감지하지 못한다. 그러면 React.memo에서 서로 비교하여 최적화 하는 것이 불가능 해진다. 보통 전개 연산자(...)를 사용하여 얕은 복사를 해서 처리한다. 배열 혹은 객체 구조가 복잡해지면 불변성을 유지하면서 업데이트하기가 까다로워진다. 이럴 때는 `immer` 라이브러리를 이용하면 효과적으로 작업할 수 있다.

## 11.7 react-virtualized를 사용한 렌더링 최적화

화면에 표시할 내용이 많을 경우에 react-virtualized를 사용하면 리스트 컴포넌트에서 스크롤 되기 전에 보이지 않는 컴포넌트를 렌더링하지 않고 크기만 차지하게 할 수 있다. 이 라이브러리를 사용하기만 해도 낭비되는 자원을 쉽게 절약할 수 있다.

## 11.8 정리

리액트의 컴포넌트 렌더링은 기본적으로 빠르기 때문에 최적화에 너무 크게 신경쓸 필요는 없다. 하지만 보여줄 항목이 많거나 업데이트가 자주 일어난다면 이렇게 컴포넌트 최적화를 해주면 좋다.

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
