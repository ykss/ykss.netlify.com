---
title: '리액트 다루는 기술 정리 (3) - Hooks'
date: 2021-06-09 18:00:00
category: 'React'
draft: false
---

## 8.1 useState

가장 기본 적인 Hook으로 함수형 컴포넌트에서도 상태를 사용할 수 있게 해준다. useState 함수는 하나의 상태 값만 관리 할 수 있기 때문에 여러 상태를 관리하기 위해서는 useState를 여러 번 사용해야 한다.

## 8.2 useEffect

useEffect는 리액트 컴포넌트가 렌더링 될 때마다 특정 작업을 수행하도록 설정하도록 하는 Hook이다. 클래스형 컴포넌트에서 componentDidMount와 componentDidUpdate를 합친 형태로 생각하면 된다. 만약 마운트될 때만 실행하고, 업데이트 될 때는 실행하지 않으려면 함수의 두 번째 파라미터로 비어 있는 배열을 넣어주면 된다.

```jsx
useEffect(() => {
  console.log('executed!')
}, [])
```

반대로 업데이트 될 때만 실행하고 싶을 때는 두 번째 파라미터로 전달되는 배열에 검사하고 싶은 값을 넣어주면 된다. 배열 안에는 useState를 통해 관리하고 있는 상태를 넣어줘도 되고 props로 전달받은 값을 넣어줘도 된다.

```jsx
useEffect(() => {
  console.log(test)
}, [test])
```

컴포넌트가 언마운트 되기 전이나 업데이트 되기 직전에 어떤 작업을 수행하고 싶다면 useEffect에서 뒷정리(cleanup) 함수를 반환해야 한다.

```jsx
useEffect(() => {
  console.log('effect')
  console.log(name)
  return () => {
    console.log('cleanup')
  }
})
```

## 8.3 useReducer

useReducer는 useState보다 더 다양한 컴포넌트 상황에 따라 상태를 다른 값으로 업데이트 해줘야 할 때 사용하는 Hook이다. 리듀서는 현재 상태와 업데이트를 위해 필요한 정보를 담은 액션(Action) 값을 전달받아 새로운 상태를 반환하는 함수이다. 리듀서 함수에서 새로운 상태를 만들 때는 반드시 불변성을 지켜주어야 한다.

```jsx
//리듀서
function reducer(state, action) {
	return { ... }; //불변성을 지키면서 업데이트한 새로운 상태 반환
}

//액션
{
	type : 'INCREMENT',
	// 다른 값들이 필요하면 추가
}
```

리덕스에서는 액션 객체에 type 필드가 꼭 필요하지만, useReducer에서 사용하는 액션 객체는 반드시 type을 지니고 있을 필요가 없다. 그리고 객체가 아닌 문자열이나 숫자도 상관 없다.

```jsx
import React, { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 }
    case 'DECREMENT':
      return { value: state.value - 1 }
    default:
      return state
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { value: 0 })

  return (
    <div>
      <p>
        현재 카운터의 값은 <b>{state.value}</b>입니다.
      </p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
    </div>
  )
}

export default Counter
```

useReducer의 첫 번째 파라미터에는 리듀서 함수를 넣고 두번째에는 리듀서의 초기 값을 넣어 준다. 여기서 state 값과 dispatch를 받아오는데, state는 현재 상태이고, dispatch는 액션을 발생시키는 함수이다. useReducer를 사용했을 때 가장 큰 장점은 컴포넌트 업데이트 로직을 컴포넌트 바깥으로 빼낼 수 있다는 것이다.

인풋 상태가 여러가지일 경우에는 아래와 같이 바꿀 수 있다.

```jsx
import React, { useReducer } from 'react'

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  }
}

const Info = () => {
  const [state, dispatch] = useReducer(reducer, {
    name: '',
    nickname: '',
  })
  const { name, nickname } = state
  const onChange = e => {
    dispatch(e.target)
  }

  return <div>...</div>
}

export default Info
```

액션은 그 어떤 값도 사용가능하다. 위 코드에서는 이벤트 객체가 지니고 있는 `[e.target](http://e.target)` 값 자체를 액션 값으로 정했다. 이렇게 인풋을 관리하면 인풋 개수가 많아져도 짧고 간결하게 유지할 수 있다.

## 8.4 useMemo

useMemo는 함수형 컴포넌트 내부에서 발생하는 연산을 최적화 할 수 있도록 하는 Hook이다. 예를 들어 아래와 같이 평균 값을 구하는 컴포넌트가 있다고 하자.

```jsx
const getAverage = numbers => {
	console.log("계산 중");
	if (numbers.length === 0) return 0;
	const sum = numbers.reduce((a,b) => a+b);
	return sum / numbers.length;
}

const Average = () => {
	const [list, setList] = useState([]);
	const [number, setNumber] = useState('');

	const onChange = e => {
		setNumber(e.target.value);
	};
	const onInsert = e => {
		const nextList = list.concat(parseInt(number));
		setList(nextList);
		setNumber('');
	};

	return (
		...
	)
}
```

위와 같이 작성했을 때는 인풋 내용이 수정될 때도 `getAverage()` 함수가 호출되어 굳이 필요없는 계산을 하게 된다. 이 때, useMemo를 사용하면 최적화가 가능하다. 렌더링 과정에서 특정 값이 바뀌었을 때만 연산하고, 원하는 값이 바뀌지 않으면 이전에 연산 결과를 기억했다가 다시 사용하는 방법이다. 위 코드에서 아래와 같이 추가하면 `getAverage()` 함수는 list 배열의 내용이 바뀔 때만 호출된다.

```jsx
const avg = useMemo(() => getAverage(list), [list])
```

## 8.5 useCallback

useCallback은 useMemo랑 비슷한 함수인데, 주로 렌더링 성능을 최적화해야 하는 상황에서 사용한다. 이 Hook을 사용하면 만들어 놨던 함수를 재사용할 수 있다.

```jsx
const getAverage = numbers => {
	console.log("계산 중");
	if (numbers.length === 0) return 0;
	const sum = numbers.reduce((a,b) => a+b);
	return sum / numbers.length;
}

const Average = () => {
	const [list, setList] = useState([]);
	const [number, setNumber] = useState('');

	const onChange = e => {
		setNumber(e.target.value);
	};
	const onInsert = e => {
		const nextList = list.concat(parseInt(number));
		setList(nextList);
		setNumber('');
	};

	return (
		...
	)
}
```

아까 useMemo를 정리할 때 작성한 코드를 보면, `onChange()`나 `onInsert()` 와 같은 함수가 있는데, 위와 같이 선언할 경우 컴포넌트가 리렌더링 될 때마다 새로 만들어진 함수를 사용하게 된다. 이렇게되면 컴포넌트 렌더링이 자주 발생할 경우나 렌더링할 컴포넌트가 많아지게되면 이 부분을 `useCallback` 을 사용하여 최적화 해야한다.

```jsx
const onChange = useCallback(e => {
  setNumber(e.target.value)
}, []) //컴포넌트가 처음 렌더링 될때만 함수 생성

const onInsert = useCallback(
  e => {
    const nextList = list.concat(parseInt(number))
    setList(nextList)
    setNumber('')
  },
  [number, list]
) // number 혹은 list가 바뀌었을 때만 함수 생성
```

useCallback의 첫 번째 파라미터에 생성하고 싶은 함수를 넣고, 두 번째 파라미터에는 배열을 넣으면 되는데 이 배열에는 어떤 값이 바뀌었을 때 함수를 새로 생성할 지 명시한다. 비어있는 배열을 넣게되면 컴포넌트가 렌더링 될 때 생성된 함수를 계속해서 사용하게 된다. 함수 내부에서 상태 값에 의존해야 할 때는 반드시 그 값을 두 번째 파라미터 배열에 포함해야 한다.

## 8.6 useRef

함수형 컴포넌트에서 ref를 쉽게 사용할 수 있도록 하는 Hook이다. useRef를 사용하여 ref를 설정하면 useRef를 통해 만든 객체안의 current 값이 실제 엘리먼트를 가르킨다.

```jsx
const Average = () => {
	const [list, setList] = useState([]);
	const [number, setNumber] = useState('');
	const inputEl = useRef(null);

	const onChange = e => {
		setNumber(e.target.value);
	};
	const onInsert = e => {
		const nextList = list.concat(parseInt(number));
		setList(nextList);
		setNumber('');
		inputEl.current.focus();
	};

	return (
		...
		<input value = {number} onChange = {onChange} ref = {inputEl} />
	)
}
```

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
