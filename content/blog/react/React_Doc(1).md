---
title: '[리액트 주요 개념] JSX 소개'
date: 2020-12-01 01:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

## JSX 소개

```javascript
const element = <h1>Hello, World!</h1>
```
위 문법은 문자열도 아니고, HTML도 아닌 **JSX**라 불리는 Javascript를 확장한 문법이다. JSX를 템플릿 언어로만 생각할 수 있지만, Javascript의 모든 기능을 포함하고 있다. JSX는 React 엘리먼트를 생성한다.

React에서는 이벤트가 처리되는 방식과 시간에 따라 `state`가 변하는 방식과 화면에 표시하기 위해서 데이터가 준비되는 방식 등 **렌더링 로직**이 다른 UI 로직과 연결된다.

React는 마크업과 로직을 따로 분리하지 않고, 둘 다 포함하는 `컴포넌트`를 이용한다. 처음에는 JS에 마크업을 넣는 것이 익숙하지 않을 수도 있고 JSX를 사용하는 것이 필수는 아니지만 JavaScript 코드 내에서 UI 작업을 하는 것이 결과적으로는 시각적으로 더 도움이 된다.


## JSX에 표현식 포함하기 

```javascript
const name = 'Ngolo Kante';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```
JSX의 중괄호 안에는 모든 JavaScript 표현식을 넣을 수 있다. 일반적인 수식 부터 변수, 함수 호출 등도 가능하다. 아래와 같은 예시처럼 엘리먼트 안에 함수 호출 결과를 포함할 수도 있다.

```javascript
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName : 'Ngolo',
  lastName : 'Kante'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDom.render(
  element,
  document.getElementById('root')
);

```

컴파일이 끝나면, JSX 표현식이 정규 JavaScript 함수 호출이 되고 Javascript 객체로 인식된다. 즉, JSX를 `if` 구문 및 `for` loop안에 사용하고, 변수에 할당하고, 인자로 받아들이고, 함수로부터 반환할 수 있다.


## JSX 속성 정의

속성에 따옴표를 이용해 문자열 리터러를 정의할 수도 있고, 중괄호를 사용하여 어트리뷰트에 JavaScript 표현식을 삽입할 수도 있다. 주의할 점은 중괄호와 따옴표 중에 하나만 사용해야 한다. 동일한 어트리뷰트에 두가지를 동시에 사용할 수는 없다.

```javascript
const element = <div tabIndex="0"></div>;
const element_ex2 = <img src={user.avatarUrl}></img>; 
```
태그가 비어 있을 경우에는 `const element = <img src={user.avatarUrl} />`과 같이 바로 닫아줘야 하며 JSX 태그는 자식을 포함할 수 있다.

```javascript
const element = (
  <div>
    <h1>Hello</h1>
    <h2>Nice to meet you</h2>
  </div>
);
```

## JSX는 주입 공격을 방지한다.
```javascript
const title = response.potentiallyMaliciousInput;
const element = <h1>{title}</h1>;
```
ReactDom은 JSX에 삽입된 모든 값을 렌더링하기 전에 이스케이프하기 때문에, 애플리케이션에서 명시적으로 작성되지 않은 내용은 주입되지 않는다. 모든 항목은 렌더링 되기 전에 문자열로 반환된다. 그렇기 때문에 `XSS(cross-site-scripting)`과 같은 공격을 방지 할 수 있다.


## JSX는 객체를 표현한다.
`Babel`은 JSX를 `React.createElement()` 호출로 컴파일한다. 아래 두 예시는 동일하다.

```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```javascript
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```
`React.createElement()`는 버그가 없는 코드를 작성하기 위해 몇가지 검사를 수행하고 아래 처럼 객체를 생성한다. 
```javascript
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```
이런 객체가 React엘리먼트 이며, 화면에 표시하려는 항목에 대한 설명이기도 하다. React는 이런 객체들을 읽은 후에 DOM을 구성하고 최신으로 유지하면서 이런 객체를 사용한다. 다음 섹션에서 DOM에 React 엘리먼트를 렌더링하는 방법에 대해 알아보자.


출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
