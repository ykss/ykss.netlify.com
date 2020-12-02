---
title: '[리액트 주요 개념] Event 처리하기'
date: 2020-12-03 01:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

리액트 엘리먼트에서 이벤트 처리는 DOM 엘리먼트에서 이벤트 처리와 유사하다. 차이점이라면 리액트에서는 소문자 대신 camelCase를 사용하고 JSX를 사용해서 문자열이 아닌 함수로 이벤트 핸들러를 전달한다.
```javascript
//HTML
<button onclick="activateLasers()">
  Activate Lasers
</button>

//React
<button onClick={activateLasers}>
  Activate Lasers
</button>
``` 
리액트에서는 `false`를 반환해도 기본 동작을 방지할 수 없고 반드시 `preventDefault`를 명시적으로 호출해야 한다. 
```javascript
//HTML
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>

//React
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
``` 

리액트에서는 DOM 엘리먼트 생성 후 리스너를 추가하기 위해 `addEventListener`를 호출할 필요없다. 엘리먼트 처음 렌더링 될 때 리스너를 제공하면 된다. 클래스를 사용하여 컴포넌트 정의 시, 일반적인 패턴은 이벤트 핸들러를 클래스의 메서드 중 하나로 만드는 것이다.
```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
    this.handleClick = this.handleClick.bind(this); //콜백에서 this 사용 시 바인딩해줘야 한다.
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
``` 
JSX 콜백에서는 `this`의 의미에 대해서 주의해야 하는데 JS에서 클래스 메서드는 **바인딩**이 되어있지 않다. `this.handleClick`을 바인딩하지 않고 `onClick`에 전달했으면 함수가 실제 호출 될 때 `this`는 `undefined`가 된다. 이것은 리액트만의 특징이 아니고 JS 함수가 동작하는 방식이다. `onClick={this.handleClick}`처럼 `()`를 사용하지 않고 메서드를 참조시에는 꼭 바인딩이 필요하다. `bind`호출하는 것이 번거로우면 두가지 방법이 있는데 클래스 필드를 이용해서 콜백을 바인딩하는 것은 **실험적**인 문법이므로 페스하고, 콜백에 화살표 함수를 사용하는 방법이 있다.
```javascript
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 이 문법은 `this`가 handleClick 내에서 바인딩되도록 합니다.
    return (
      <button onClick={() => this.handleClick()}>  
        Click me
      </button>
    );
  }
}
```
하지만 이런 방식으로 할 경우 `LoggingButton`이 렌더링 될 때 마다 다른 콜백이 생성된다. 큰 문제가 없을 수 있지만 콜백이 하위 컴포넌트에 props로서 전달되면 컴포넌트들은 추가로 다시 렌더링을 수행 할 수 있다. 이것은 성능상 이슈가 있을 수 있다.


## 이벤트 핸들러에 인자 전달하기
아래 두 줄은 동일하고 `화살표 함수`와 `Function.prototype.bind`를 사용하여 `id`를 매개변수로 전달한 것이다. 두 경우 보두 리액트 이벤트를 나타내는 `e`인자를 두번째 인자로 전달하게 되고 후자의 경우 자동으로 전달된다. 
```javascript
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```


출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
