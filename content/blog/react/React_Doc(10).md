---
title: '[리액트 주요 개념] 합성(Composition) vs 상속(Inheritance)'
date: 2020-12-05 23:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

리액트는 강력한 합성 모델을 가지고 있기 때문에 상속 대신 합성을 사용해서 컴포넌트간 코드를 재사용 하는 것이 좋다. 그렇기 때문에 이번에는 리액트 개발 시 상속으로 인해 부딫히는 문제를 어떻게 합성으로 해결하는지 살펴보자.


## 컴포넌트에서 다른 컴포넌트 담기
어떤 컴포넌트는 어떤 자식 컴포넌트가 들어올 지 미리 예상할 수 없는 경우가 있다. `Sidebar`나 `Dialog`와 같은 컴포넌트에서 그런 경우가 많다. 이런 컴포넌트에서는 특수한 `children` prop을 사용해서 자식 엘리먼트를 출력에 그대로 전달하면 좋다.
```jsx
function FancyBorder(props) {
    return (
        <div className={'FancyBorder FancyBorder-' + props.color}>
            {props.children}
        </div>
    );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```
흔하진 않아도 종종 컴포넌트에 여러 개의 `구멍`이 필요할 수 있다. 이런 경우에는 `children` 대신 자신의 고유한 방식을 적용할 수 있다.
```jsx
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```
위의 경우를 보면 `<Contacts />`와 `<Chat />` 같은 리액트 엘리먼트도 다 객체이기 때문에 다른 데이터와 같이 prop으로 전달할 수 있다. **리액트에서 prop으로 전달할 수 있는 것에는 제한이 없다.


## 특수화
어떤 컴포넌트의 '특수한 경우'인 컴포넌트를 고려해야 할 수 있다. 예를들어 `WelcomeDialog`의 `Dialog`는 특수한 경우이다. 리액트에서 이것도 합성을 통해 해결할 수 있다. 더 구체적인 컴포넌트가 일반적인 컴포넌트를 렌더링하고 props로 내용을 구성한다.
```jsx
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```
합성은 클래스로 구성된 컴포넌트에서도 동일하다.
```jsx
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```


## 그럼 상속은......?
Facebook에서 수 많은 리액트 컴포넌트를 사용하면서 상속 계층 구조로 작성할 권장 사례를 찾지 못했다. props와 합성은 명시적이고 안전한 방법으로 컴포넌트의 모양과 동작을 커스터마이징할 수 있기 때문에 모든 유연성을 제공한다. 컴포넌트가 어떻든 어떠한 props도 받을 수 있다. UI가 아닌 기능을 컴포넌트에서 재사용 하기 원한다면 별도 JS 모듈로 분리를해서 컴포넌트에서 import 해서 사용하면 된다. 상속받을 필요 없다.


출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
