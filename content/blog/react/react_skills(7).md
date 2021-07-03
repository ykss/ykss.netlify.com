---
title: '리액트 다루는 기술 정리 (7) - Context API'
date: 2021-06-25 18:00:00
category: 'React'
draft: false
---

리액트에서 전역적으로 사용할 데이터가 있을 때 유용하게 쓰이는 기능이다. 사용자의 로그인 정보나 환경 설정, 테마 등에 많이 쓰인다. 리덕스나 리액트 라우터, styled-component등의 라이브러리도 Context API 기반으로 구현되어 있다.

## 15.1 Context API를 사용한 전역 상태 관리 흐름 이해

App 컴포넌트에서 state를 관리하고 props를 통해서 전달하는 방식으로 했을 때, 컴포넌트가 많아지면 여러 컴포넌트를 거쳐야 하는 props drilling 현상이 일어나기도 하고 이러한 방식은 유지 보수성이 낮아질 가능성이 있다. 그래서 Redux나 Mobx 같은 상태 관리 라이브러리 등을 사용하여 전역 상태 관리 작업을 처리하기도 한다. 하지만 Context API로도 전역 상태를 손쉽게 관리할 수 있다.

![일반적인 흐름](https://media.vlpt.us/images/choidy180/post/0890b599-8e49-4226-99d8-24c9bf311eea/image.png)

![Context API 흐름](https://media.vlpt.us/images/choidy180/post/0ec72aab-06a7-4ff8-9f05-a414a70a9cb6/image.png)

기존에는 최상위 컴포넌트를 거쳐서 props로 전달했었다면 Context API를 사용하면 Context를 만들어서 원하는 값을 한번에 받아와서 사용할 수 있다.

## 15.2 Context API 사용법

```jsx
import { createContext } from 'react'

const ColorContext = createContext({ color: 'black' })

export default ColorContext
```

새 컨텍스트를 만들 때는 `createContext()`를 사용한다. 파라미터에는 해당 Context의 기본 상태를 지정한다.

### 15.2.1 Consumer 사용하기

Consumer를 통해서 Context에 있는 상태를 가져올 수 있다.

```jsx
const ColorBox = () => {
  return (
    <ColorContext.Consumer>
      {value => (
        <div
          style={{
            width: '64px',
            height: '64px',
            background: value.color,
          }}
        />
      )}
    </ColorContext.Consumer>
  )
}
```

이렇게 Consumer 사이에 중괄호를 열어서 함수를 넣어주는 패턴을 Function a child나 Render Props라고 한다.

### 15.2.2 Provider

Provider를 활용하면 Context의 value를 변경할 수 있다. createContext에 파라미터로 지정한 기본 값은 Provider를 사용하지 않았을 때만 사용된다. 주의할 점은 Provider를 사용할 때 value를 명시하지 않으면 오류가 발생한다.

```jsx
const App = () => {
  return (
    <ColorContext.Provider value={{ color: 'red' }}>
      <div>
        <ColorBox />
      </div>
    </ColorContext.Provider>
  )
}
```

## 15.3 동적 Context 사용하기

Context에는 상태 값만 있어야 하는건 아니고 함수를 전달해줄 수도 있다.

```jsx
const ColorContext = createContext({
	state : { color : 'black', subcolor : 'red'},
	actions : {
		setColor: () => {...}
		setSubcolor: () => {...}
	}
})
```

## 15.4 Consumer 대신 Hook 또는 static contextType 사용

리액트 내장 Hooks 중에서 useContext를 사용하면 함수형 컴포넌트에서 Context를 편하게 사용 가능하다. children에 함수를 전달하는 Render Props 패턴이 불편하다면 useContext를 쓰는게 훨씬 편하다. (나도 useContext를 쓰는게 훨씬 편했다.)

만약 함수형 컴포넌트가 아닌 클래스형 컴포넌트에서 Context를 좀 더 쉽게 사용하고 싶으면 static contextType을 정의하면 된다. `static contextType = ColorContext;` 와 같이 사용하는 것이다. 이렇게 해줬을 때 `this.context` 조회를 통해 현재 Context의 value를 조회할 수 있다. 하지만 한 클래스에서 하나의 Context밖에 사용하지 못하는 단점이 있다. 일단은 요즘엔 주로 함수형으로 쓰이기 때문에 함수형으로 useContext를 활용하는게 좋다.

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
