---
title: '[리액트 주요 개념] State와 Lifecycle'
date: 2020-12-02 23:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

 지금까지 `엘리먼트 렌더링`에서 UI를 업데이트하는 한가지만 배웠고, 렌더링된 출력값을 변경하기 위해 `ReactDOM.render()`를 호출했다. 이번 포스트에서는 `Clock` 컴포넌트를 완전히 재사용하고 캡슐화하는 방법을 살펴보자. 이 컴포넌트는 스스로 타이머를 설정하고 매초 스스로 업데이트 할 것이다. 
 ```javascript
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocalTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
 ```
여기서 누락된 중요한 것은 `Clock`이 타이머를 설정하고 매초 UI를 업데이트하는 것이 `Clock`의 구현 세부 사항이 되어야 한다. `Clock`이 스스로 업데이트하도록 만드려면 `state`를 추가해야 한다. `state`는 `props`와 유사하지만, **비공개이고 컴포넌트에 의해서 완전히 제어된다.**


## 함수에서 클래스로 변환하기
1. `React.Component`를 확장하는 동일한 이름의 `ES6 class`를 생성한다.
2. `render()`라는 빈 메서드를 추가한다.
3. 함수의 내용을 `render()` 메서드 안으로 옮긴다.
4. `render()` 내용 안에 있는 `props`를 `this.props`로 변경한다.
5. 남아있는 빈 함수 선언을 삭제한다.
```javascript
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocalTimeString()}.</h2>
      </div>
    );
  }
}
```
이렇게 바꾸면 이제 Clock은 함수가 아닌 클래스가 된다. `render`메서드는 업데이트가 발생할 때 마다 호출되지만 같은 DOM 노드로 `<Clock />`을 렌더링할 경우 `Clock` 클래스의 단일 인스턴스만 사용된다. 이렇게함으로써 로컬 `state`와 생명주기 메서드와 같은 부가 기능을 사용할 수 있게 된다.


## class에 로컬 state 추가하기
세 단계에 걸쳐서 `date`를 props에서 state로 이동할 수 있다.
1. `render()` 메서드 안에 있는 `this.props.date`를 `this.state.date`로 변경한다.
2. 초기 `this.state`를 지정하는 `class constructor`를 추가한다. 클래스 컴포넌트는 항상 `props`로 기본 constructor를 호출해야 한다.
3. `<Clock />` 요소에서 `date` prop을 삭제한다.

```javascript
class Clock extends React.Component {
  constructor(props) {
    this.super(props);
    this.state = {date : new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocalTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```


## 생명주기 메서드를 클래스에 추가
많은 컴포넌트가 있는 앱에서는 컴포넌트가 삭제될 때 리소스를 다시 확보하는 게 중요하다. `Clock`이 처음 DOM에 렌더링 될 떄마다 타이머를 설정하려는데, 이것을 React에서 "마운팅"이라고 한다. 또한 `Clock`에 의해 생성된 DOM이 삭제될 때마다 타이머를 해제해야 한다. 컴포넌트 클래스에서는 특별한 메서드를 선언해서 마운트되거나 언마운트 될 때 코드를 작동할 수 있다. 이러한 메서드들이 `생명주기 메서드`이다.

```javascript
class Clock extends React.Component {
  constructor(props) {
    this.super(props);
    this.state = {date : new Date()};
  }

  componentDidMount() { // 컴포넌트 출력물이 DOM에 렌더링 된 이후에 실행됨. 타이머 설정에 적합
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() { // 생명주기 메서드에 있는 타이머를 해제한다.
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({ // setState로 로걸 state를 업데이드한다.
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocalTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```
위와 같은 상황에서 어떻게 코드가 진행되는지 보자.
1. `<Clock />`이 `ReactDOM.render()`로 전달되었을 때 `Clock` 컴포넌트의 constructor가 호출된다. `Clock`이 현재 시각을 표시해야해서 현재 시각이 포함된 채로 `this.state`를 초기화한다.
2. React는 `Clock` 컴포넌트의 `render()` 메서드를 호출하고, 이것을 통해 리액트는 화면에 표시할 내용을 알게 된다. 그런 후에 `Clock`의 렌더링 출력값을 일치시키려고 DOM을 업데이트한다.
3. `Clock` 출력값이 DOM에 삽입된 후에 생명주기 메서드인 `componentDidMount()`를 호출하고 `Clock` 컴포넌트는 매 초마다 `tick()` 메서드를 호출하는 타이머를 설정하라고 브라우저에게 요청한다.
4. 브라우저에 타이머가 설정되고 매초마다 브라우저는 `tick()` 메서드를 호출한다. 그 안에 `setState()`에 현재 시각을 포함하는 객체를 호출해서 UI 업데이트를 진행한다. `setState()` 호출로 리액트는 state가 변경된 것을 인지하고 `render()`메소드를 다시 호출하는데, 이때 `render()`안에 `this.state.date`가 변경되어 DOM을 업데이트 한다.
5. `Clock` 컴포넌트가 DOM으로부터 한번이라도 삭제되면 타이머를 멈추기 위해 `componentWillUnmount()` 생명주기 메서드를 호출한다. 해당 메서드를 통해 브라우저의 타이머가 해제된다.


## State 올바르게 사용하기

#### 1. 직접 State를 수정하지 말자
`this.state.comment = 'Hello';`는 컴포넌트를 다시 렌더링하지 않는다. `setState()`를 사용할 때 다시 렌더링한다. **`this.state`를 지정할 수 있는 유일한 공간은 constructor이다.**

#### 2. State 업데이트는 비동기적일 수 있다.
리액트는 성능을 위해서 여러 `setState()`를 단일 업데이트로 한꺼번에 처리할 수 있다. `this.props`와 `this.state`가 비동기적으로 업데이트 될 수 있어서 해당 값에 의존해서는 안된다.
```javascript
// wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});

//correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```
이전 state를 첫 번쨰 인자로 받고, 업데이트가 적용된 시점의 props를 두 번째 인자로 받아서 작동한다.

#### 3. State 업데이트는 병합된다.
`setState()`를 호출할 때 리액트는 제공한 객체를 현재 state로 병합한다. 덮어쓰기가 아니라 추가되는 것이다.
```javascript
constructor(props) {
  super(props);
  this.state = {
    posts: [],
    comment: []
  };
}
```
`setState()`호출로 이러한 변수를 독립적으로 업데이트 가능하다. 여기서 다른 객체에 영향을 주지는 않지만 같은 이름의 객체는 완전히 대체된다.
```javascript
constructor(props) {
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

#### 4. 데이터는 아래로 흐른다.
특정 컴포넌트가 유상태인지 무상태인지 알 수는 없고, 그들이 함수인지 클래스인지도 상관없다. 그래서 state는 종종 로컬 또는 캡슐화라고 불린다. state가 소유하고 설정한 컴포넌트 외에는 어떤 컴포넌트에도 접근할 수 없다. 하지만 컴포넌트는 자신의 state를 자식 컴포넌트에는 props로 전달 가능하다. 이를 **하향식(top-down)** 또는 **단방향식** 데이터 흐름이라고 한다. 모든 state는 특정 컴포넌트가 소유하고 있고, 그 stat로부터 파생된 UI 또는 데이터는 자신의 아래 컴포넌트에만 영향을 미친다.



출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
