---
title: '리액트 Context API 활용하기'
date: 2021-03-03 18:00:00
category: 'React'
draft: false
---

context를 이용하면 단계마다 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에 데이터를 제공할 수 있다. 일반적으로 데이터를 넘겨주기 위해서는 props를 통해서 상위 컴포넌트에서 하위 컴포넌트로 데이터를 내리지만 그런 경우에 여러 컴포넌트에 전달되어야 하는 경우 연쇄적으로 props를 전달해야 하기 때문에 번거롭다.
![props drilling](https://media.vlpt.us/images/kimu2370/post/05768015-db56-45c7-9084-ce5ec90b12f5/image.png)
위 그림과 같이 A 컴포넌트에서 C 컴포넌트로 데이터를 전달할 때는 A와 B에서는 필요가 없어도 상위 컴포넌트에서 하위 컴포넌트로 드릴로 뚫고 들어가듯 데이터를 전달해줘야 한다. 이러한 패턴을 **Props Drilling**이라고 한다. 이러한 패턴의 사용은 컴포넌트 재활용이 어렵게 하고, 컴포넌트간에 의존성을 만든다. 이런 문제를 해결하기 위해서는 전역으로 상태를 관리하는 방식이 필요하다. 여기서 Context API를 사용하는 것이 방법이 될 수 있다.

## context를 써야하는 경우

context는 리액트 컴포넌트 트리에서 전역적(global)으로 데이터를 공유하기 위해 만들어진 방법이다. context를 사용하면 중간 엘리먼트들에 props를 넘겨주지 않아도 된다. 상위 컴포넌트에서 하위 컴포넌트에 여러 데이터를 내려줘야 할 경우, context는 훨씬 유용하고 간편하게 데이터를 전해줄 수 있는 방법이다.

## context 사용 시 고려할 점

context를 사용하면 해당 컴포넌트는 재사용하기 어려워 진다는 단점이 있다. 여러 레벨에 걸쳐 props를 넘기는 것을 대체하는 방법으로 context를 사용하는 것보다 경우에 따라서 컴포넌트 합성이 더 간단한 해결 책일 수 있다.

같은 데이터를 트리 안 여러 레벨이 있는 많은 컴포넌트에 주어야 할 때, 이런 데이터 값이 변할 때마다 모든 하위 컴포넌트에게 널리 “방송”하는 것이 context다. 선호 로케일, 테마, 데이터 캐시 등을 관리하는 데 있어서는 일반적으로 context를 사용하는 게 가장 편리하다.

## context API

### createContext()

```javascript
const MyContext = React.createContext(defaultValue)
```

Context 객체를 만든다. Context 객체를 구독하고 있는 컴포넌트를 렌더링할 때, 가장 가까이 있는 Provider로 부터 현재 값을 읽는다. `defaultValue`는 적절한 Provider를 찾지 못했을 때만 사용한다. `createContext()`는 Provider와 Consumer 컴포넌트가 포함된 객체를 리턴한다.

### Context.Provider

```javascript
<MyContext.Provider value={/* 어떤 값 */}>
```

Provider는 context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 한다. Provider은 value prop을 받아서 이 값을 하위 컴포넌트에 전달한다. 값을 전달 받을 수 있는 컴포넌트 수에는 제한이 없고, Provider아래 다른 Provider가 존재할 수 있고, 하위 Provider의 prop이 우선시된다. context를 구독하고 있는 컴포넌트의 경우 Provider의 value 값이 바뀔 때 마다 다시 렌더링 된다.

```javascript
<Provider value={color:"blue"}>
  {children} //value가 전달되는 곳.
</Provider>
```

`Provider`내에 얼마나 많은 컴포넌트가 중첩되어도 상관없이 모든 컴포넌트에서 state를 사용할 수 있게 끔 한다.

### Class.contextType

`React.createContext()`로 생성한 Context 객체를 원하는 클래스의 contextType 프로퍼티로 지정할 수 있다. 그러면 그 클래스 안에서 this.context를 이용해 해당 Context의 가장 가까운 Provider를 찾아 그 값을 읽을 수 있게된다. 이 값은 render를 포함한 모든 컴포넌트 생명주기 매서드에서 사용할 수 있다.

```javascript
class MyClass extends React.Component {
  static contextType = MyContext
  render() {
    let value = this.context
    /* context 값을 이용한 렌더링 */
  }
}
```

### Context.Consumer

```javascript
<MyContext.Consumer>
  {value => /* context 값을 이용한 렌더링 */}
</MyContext.Consumer>
```

context 변화를 구독하는 React 컴포넌트이다. 함수 컴포넌트안에서 context를 읽기 위해서 쓸 수 있다. `Context.Consumer`의 자식은 함수여야한다. 이 함수는 context의 현재값을 받고 React 노드를 반환한다. 이 함수가 받는 value 매개변수 값은 해당 context의 Provider 중 상위 트리에서 가장 가까운 Provider의 value prop과 동일하다. 상위에 Provider가 없다면 createContext()에 보냈던 defaultValue가 될 것이다.

Consumer는 Prop Drilling을 할 필요없이 Provider로부터 데이터를 소비한다.

```javascript
<Consumer>{value => <span>{value}</span>}</Consumer>
```

### Context.displayName

Context 객체는 displayName 문자열 속성을 설정할 수 있다. React 개발자 도구는 이 문자열을 사용해서 context를 어떻게 보여줄 지 결정한다.

## useContext Hook

여기서 Hooks의 useContext를 결합하여 좀 더 효과적으로 상태 관리를 할 수 있다. useContext 함수를 사용하면 인자에 context만 넣으면 컨텐츠를 Consumer로 래핑하지 않고, 변수를 통해서 state에 접근할 수 있게 한다. 결과적으로 consumer가 따로 필요 없게 된다.

```javascript
const newContext = React.createContext({ color: 'black' })

const value = useContext(newContext)

console.log(value) //this will return {color:"black"}

// 또는 이런 방식도 가능하다.

const newContext = React.createContext({ name, age })
const { name, age } = useContext(newContext)
console.log(name, age)
```

> 참고

1. [리액트 공식문서](https://ko.reactjs.org/docs/context.html#when-to-use-context)
2. [리덕스 없이 상태관리하기](https://velog.io/@kimu2370/%EB%A6%AC%EB%8D%95%EC%8A%A4%EC%97%86%EC%9D%B4-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0hookscontext)
