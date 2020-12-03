---
title: '[리액트 주요 개념] 조건부 렌더링'
date: 2020-12-04 01:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)


React에서 원하는 동작을 캡슐화 하는 컴포넌트를 만들 수 있다. 조건부 렌더링은 JS에서의 조건처리와 같이 동작한다. `if`나 `조건부 연산자`와 같은 JS 연산자를 현재 상태를 나타내는 엘리먼트를 만드는데 사용하면 리액트는 현재 상태에 맞게 UI를 업데이트 한다. 아래 예시에서는 `isLoggedIn` prop에 따라 다른 인사말을 렌더링한다.

```javascript
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

## 엘리먼트 변수
엘리먼트를 저장하기 위해서 변수를 사용하는게 가능하다. 다른 출력부분은 변하지 않고 컴포넌트의 일부를 조건부로 렌더링 할 수 있다. 로그아웃과 로그인 버튼을 나타내는 두 컴포넌트가 있다고 해보자.
```javascript
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```
그리고 두 컴포넌트를 사용하는 `LoginControl`이라는 컴포넌트를 만들 것이다. 이 컴포넌트는 현재 상태에 맞게 로그인 또는 로그아웃 버튼을 렌더링한다. 
```javascript
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: flase});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```
변수를 선언하고 `if`로 조건부 렌더링을 하는것은 좋은 방법이지만 더 짧은 구문을 사용하고 싶을 떄는 여러 조건을 JSX안에서 인라인으로 처리할 방법이 존재한다.


## 논리 &&연산자로 if를 인라인으로 표현하기
JSX안에 중괄호를 이용해 표현식을 포함할 수 있다. 그안에 JS 논리 연산자 `&&`를 사용하면 엘리먼트를 조건부로 넣을 수 있다.
```javascript
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```
JS에서 `true && expression`은 항상 `expression`으로 평가되고 `false && expression`은 항상 `false`이다. 그래서 `&&`뒤의 엘리먼트는 앞에 조건이 `true`일때만 출력된다. 주의할 것은 false 표현식을 반환하면 `&&` 뒤의 표현식은 건너뛰어지지만 표현식이 반환된다. 아래 예시에서는 `<div>0</div>`가 render 메서드에서 반환된다.
```javascript
render() {
  const count = 0;
  return (
    <div>
      { count && <h1>Messages: {count}</h1>}
    </div>
  );
}
```


## 조건부 연산자로 If-Else 구문 인라인으로 표현하기
아니면 조건부 연산자인 삼항연산자를 사용하여 표현할 수 있다.
```javascript
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```
더 큰 표현식에도 이 구문을 사용 가능하다.
```javascript
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```


## 컴포넌트가 렌더링하는 것을 막기
컴포넌트가 다른 컴포넌트에 의해 렌더링 될 떄 컴포넌트 자체를 숨기고 싶을때는 렌더링 결과 대신 `null`을 반환하면 해결 가능하다. `<WarningBanner />`가 `warn` prop의 값에 의해서 렌더링된다. prop이 `false`면 컴포넌트는 렌더링하지 않는다.
```javascript
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```
컴포넌트의 `render` 메서드로부터 `null`을 반환하는 것은 생명주기 메서드 호출에 영향이 없다. `componentDidUpdate`는 계속 호출된다.


출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
