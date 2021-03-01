---
title: '리액트 Hook(훅)이란?'
date: 2021-03-01 18:00:00
category: 'React'
draft: false
---

Hook은 리액트 16.8 버전 이후 추가된 기능이며, Hook이 등장하면서 더 이상 상태를 관리하기 위해 Class를 쓸 필요가 없어졌다. 기존에는 Class형 컴포넌트에서만 상태를 관리 할 수 있었고, 함수형 컴포넌트에서는 상태를 관리할 수 없었지만, Hook을 통해 상태 관리를 할 수 있게 되었고, 상태 관리 뿐만 아니라 기존 클래스형 컴포넌트에서만 가능하던 여러 기능을 사용할 수 있게 되었다.

Hook이 등장하기 전 리액트에는 여러 문제들이 있었다.

1. 컴포넌트 사이에서 상태와 관련된 로직을 재사용하기 어려웠다. Hook은 계층 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와준다.
2. 생명주기 컴포넌트로 인한 복잡한 컴포넌트는 이해하기 어려웠다. 상태관련 로직이 모두 같은 공간에 있기 때문이었다. Hook을 통해 로직에 기반을 둔 작은 함수로 컴포넌트를 나눌 수 있다.

## useState

`useState`는 state hook이다. `useState`는 `state`와 `setState()`로 나뉘며 초기에 `initialValue`를 받고, 해당 초기값은 처음 렌더링시에만 사용한다. Hook은 간단히 말하면 **함수 컴포넌트에서 React state와 생명주기 기능(lifecycle features)을 “연동(hook into)“할 수 있게 해주는 함수다.** Hook을 통해 class 없이 리액트를 사용할 수 있다.

기존 클래스를 통해 구현한 예시를 보자.

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
    }
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    )
  }
}
```

이것을 Hook을 통해서 표현하면 다음과 같다.

```javascript
import React, { useState } from 'react'
function Example() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

## useEffect

`useEffect`는 effect hook으로, React class의 `componentDidMount`나 `componentDidUpdate`, `componentWillUnmount`와 같은 목적으로 제공되지만, 하나의 API로 통합된 것이다. 리액트는 기본적으로 렌더링 이후에 effect를 실행한다. 그리고 effect 함수는 컴포넌트 내에 있기 떄문에 props와 state에 접근할 수 있다. 첫번쨰 렌더링과 이후 업데이트 시 마다 effect가 수행된다.

## Custom Hook

Custom Hook은 `higher-order components`와 `render props`과는 달리 컴포넌트 트리에 새 컴포넌트를 추가하지 않고도 상태 관련 로직을 컴포넌트 간에 재사용할 수 있게 해준다. Custom Hook을 만들어서 여러 컴포넌트에서 사용하더라도, 각 컴포넌트에서 사용하는 state는 독립적이다. Custom Hook은 기능이라기보다는 컨벤션(convention)에 가깝다. 이름이 ”use“로 시작하고, 안에서 다른 Hook을 호출한다면 그 함수를 custom Hook으로 볼 수 있다.

## 다른 내장 Hook

`useState`나 `useEffect`말고도 `useContext`와 `useReducer`이라는 Hook도 존재한다. `useContext`는 컴포넌트를 중첩하지 않고 react context를 구독할 수 있다. 그리고 `useReducer`는 복잡한 컴포넌트의 상태들을 reducer로 관리할 수 있게 해준다.

이 밖에도 `useMemo`와 `useCallback`, `useRef`등 다양한 hook이 존재한다.

`useCallback`은 메모이제이션된 콜백을 반환한다. 그렇기 때문에 불필요한 렌더링을 줄일 수 있다. `useCallback(fn, deps)`은 `useMemo(() => fn, deps)`와 같다. `useMemo`는 메모이제이션된 값을 반환한다.

> 참고

1. [리액트 공식문서](https://ko.reactjs.org/docs/hooks-intro.html)
