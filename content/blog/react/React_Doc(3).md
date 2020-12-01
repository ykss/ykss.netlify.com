---
title: '[리액트 주요 개념] Components와 Props'
date: 2020-12-02 01:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

컴포넌트를 통해서 UI를 재사용 가능한 여러 조각으로 나누고 사용할 수 있다. [컴포넌트 API 레퍼런스](https://ko.reactjs.org/docs/react-component.html)에서는 자세한 API 레퍼런스를 확인할 수 있고, 이번 포스트에서는 주요 개념만 알아볼 것이다. 개념적으로 컴포넌트는 JavaScript 함수와 유사하다. "props"라는 임의의 입력을 받아서 화면에 어떻게 표시되는지 기술하는 React 엘리먼트를 반환한다.


## 함수 컴포넌트와 클래스 컴포넌트

컴포넌트를 정의하는 가장 간단한 방법은 JavaScript 함수를 작성하는 것이다.
```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
위 함수는 데이터를 가진 하나의 `props` 객체 인자를 받아서 React 엘리먼트를 반환하는 React 컴포넌트이다. 여기서 `props`는 속성을 나타내는 데이터이다. 이런 컴포넌트는 JavaScript 함수이기 때문에 말 그대로 "함수 컴포넌트"라고 한다. 또는 `ES6 class`를 사용해서 컴포넌트를 정의할 수 있다.
```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {props.name}</h1>;
  }
}
```
React의 관점에서 볼 때 위에 두 유형 모두 동일하다. 함수 컴포넌트와 클래스 컴포넌트 둘다 몇 가지 추가 기능이 있고, 가시성으로 볼 때는 함수 컴포넌트가 더 간결하다.


## 컴포넌트 렌더링
이전까지는 React 엘리먼트를 DOM 태그로만 나타냈지만, 이제 사용자 정의 컴포넌트로도 나타낼 수 있다.
```javascript
//컴포넌트 이름은 항상 대문자로 시작한다.
const element = <Greeting name="kante" />;
```
React가 사용자 정의 컴포넌트로 작성한 엘리먼트를 발견하면 JSX 어트리뷰트와 자식을 해당 컴포넌트에 단일 객체로 넘기는데 이 객체가 "props"이다. 아래 예시는 "Hello, kante"를 렌더링하는 예시이다.
```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}
//컴포넌트 이름은 항상 대문자로 시작한다.
const element = <Greeting name="kante" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```
위 코드에서 발생하는 일은 다음과 같다.
1. `<Greeting name="kante" / >` 엘리먼트로 `ReactDOM.render()`를 호출한다.
2. React는 `{name: 'kante'}`를 props로 해서 `Greeting` 컴포넌트를 호출한다.
3. `Greeting` 컴포넌트는 결과적으로 `<h1>Hello, kante</h1>`엘리먼트를 반환한다.
4. ReactDOM은 `<h1>Hello, kante</h1>`과 일치하게 DOM을 **효율적으로** 업데이트한다.


## 컴포넌트 합성
컴포넌트는 자신의 출력에 다른 컴포넌트를 참조하게 할 수 도 있다. 이것은 모든 세부 단계에서 동일한 추상 컴포넌트를 사용할 수 있음을 의미한다. React 앱에서는 버튼, 폼, 다이얼로그, 화면 등 모든 것들이 컴포넌트로 표현된다. 예를 들어서 `Greeting`을 여러 번 렌더링하는 `App` 컴포넌트 생성이 가능하다.

```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Greeting name="kante" />
      <Greeting name="mount" />
      <Greeting name="werner" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```
일반적으로 새 React 앱은 최상위에 `App` 컴포넌트를 가지고 있다. 하지만 기존 앱에서 React를 통합하는 경우에는 `Button`과 같은 작은 컴포넌트에서부터 뷰 계층의 상단으로 점진적으로 작업해야 한다.


## 컴포넌트 추출
리액트에서 컴포넌트를 여러개의 작은 컴포넌트로 나누는 것을 두려워해서는 안된다. 아래 `Comment` 컴포넌트를 살펴보자.
```javascript
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}      
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```
이 컴포넌트는 `author`(객체), `text`(문자열), `date`(날짜)를 props로 받은 후에 소셜 미디어 웹 사이트의 코멘트를 나타낸다. 이 컴포넌트는 구성요소들이 모두 중첩 구조로 이루어져 변경하기 어려울 수 있고, 각 구성요소를 개별적으로 재사용하기 어렵다. 여기서 몇가지 컴포넌트를 추출해보자.

```javascript
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}  
    >
  );
}
```
`Avatar`는 자신이 `Comment`내에서 렌더링 된다는것을 알 필요가 없는 별개의 컴포넌트이다. 그렇기 때문에 props의 이름을 `author`에서 일반화된 `user`로 변경하는 것이 좋다. props의 이름은 사용될 context가 아닌 컴포넌트 자체의 관점에서 짓는 것이 좋다.

```javascript
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}      
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```
다음에는 `UserInfo` 컴포넌트를 추출해보자.
```javascript
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```
`Comment`는 더욱 단순해진다.
```javascript
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```
컴포넌트를 추출하는 작업은 귀찮고 지루할 수 있지만 재사용 가능한 컴포넌트를 만들어 놓는 것이 추후에 앱이 커질수록 그 효과는 배가된다. UI 일부로 여러번 사용되는 `Button`,`Panel`,`Avatar`등의 컴포넌트나 UI 일부가 복잡한 `App`,`Comment` 컴포넌트 같은 경우는 별도 컴포넌트로 만드는 것이 바람직하다.


## props는 읽기 전용이다.
함수 컴포넌트나 클래스 컴포넌트 모두 컴포넌트의 자체 props를 수정하는 것은 안된다.
```javascript
function sum(a, b) {
  return a + b;
}
```
`sum`같은 함수는 순수 함수이다. 입력값을 바꾸지 않고 항상 동일한 입력값에 대해 동일한 결과를 반환하기 때문이다. 하지만 아래 함수는 자신의 입력 값을 변경하기 때문에 순수 함수가 아니다.
```javascript
function withdraw(account, amount) {
  account.total -= amount;
}
```
> React는 매우 유연하나 한 가지 엄격한 규칙이 있다.
> ** 모든 React 컴포넌트는 자신의 props를 다룰 때 반드시 순수 함수처럼 동작해야 한다.**

React 컴포넌트는 state를 통해 위 규칙을 위반하지 않고도 사용자 액션, 네트워크 응답 및 다른 요소에 대한 응답으로 시간에 따라 출력값 변경이 가능하다. 다음 포스트는 state에 대해 알아보자.


출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
