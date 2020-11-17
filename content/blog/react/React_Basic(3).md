---
title: '[리액트 튜토리얼] 게임 완성하기(1)'
date: 2020-11-15 01:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

## 게임 완성하기(1)
틱택토 게임을 완성하기 위해서는 현재의 상태처럼 X만 표시되어서는 안되고, X와 O를 번갈아 표시되게 해야한다.


## state 끌어올리기
현재는 게임의 state를 각각의 Square 컴포넌트에서 유지하고 있지만 승자 확인을 위해서는 각각의 컴포넌트가 아닌 한 곳에 state를 유지할 것이다. 각 Square에 state를 저장하는 것 보단 부모 컴포넌트인 Board 컴포넌트에 state를 저장하는 것이 바람직하다. 

여러개의 자식으로부터 데이터를 모으거나 두 개의 자식 컴포넌트가 서로 통신하게 하기 위해서는 부모 컴포넌트에 공유 state를 정의해야 한다. 부모 컴포넌트는 props를 사용해서 다시 자식 컴포넌트에 state를 전달 할 수 있다. 이러한 과정을 통해 자식과 부모 컴포넌트가 동기화 하게 할 수 있다.

지금의 코드에서 `Board` 컴포넌트에 생성자를 추가하고 나서 9개의 사각형에 해당하는 9개의 null 배열을 초기 state로 설정하자.

```javascript
class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        squares: Array(9).fill(null),
      };
    }

    renderSquare(i) {
      return <Square value={i} />;
    }
```

그리고 `renderSquare()`함수에서도 숫자를 표현하기 위해서 `value` prop을 자식으로 전달했었다. 하지만 `square`컴포넌트에서 이미 props의 value값을 사용하고 있지 않기 때문에 이번에는 `Square` 컴포넌트에게 현재의 상태 값을 전달 할 수 있도록 수정해야 한다. Board의 생성자에서 `squares` 배열을 이미 선언했기 때문에 `renderSquare` 함수를 아래처럼 수정하자.

```javascript
  renderSqaure(i) {
    return <Square value={this.state.squares[i]} />;
  }
```
위와 같이 수정하면서 이제 사각형에 표시되는 것은 숫자가 아닌 `null`, `O`, `X`이다. 다음으로는 Square를 클릭할 때 발생하는 변화가 필요하다. Board 컴포넌트는 어떤 사각형이 채워졌는지 여부를 관리하고 있기 때문에 이제는 Square 컴포넌트에서 Board 컴포넌트를 변경할 수 있도록 해야한다. 컴포넌트는 자신이 정의한 state에만 접근가능하기 때문에 Square에서는 직접 Board 컴포넌트의 state를 변경할 수 없다.

대신 Board에서 Square로 함수를 전달하고 Sqaure에서는 사각형을 클릭할 때 함수를 호출 할 수 있다.
```javascript
  renderSqaure(i) {
    return ( // ()괄호를 추가한건 return 뒤ㅔ 세미콜론(;)을 붙이지않아도 코드가 꺠지지 않게 하기 위함이다.
      <Square 
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)} 
      />
    );
  }
```
위와 같이 수정함으로써 Board에서 Square로 `value`와 `onClick` 두개의 props를 전달한다. `onClick` prop은 Square를 클릭하면 호출되는 함수이고, Square 함수를 아래와 같이 수정해야 Square에서도 state를 Board로 전달할 수 있다. 이제 Square 컴포넌트는 따로 state를 관리해줄 필요가 없기 때문에 constructor를 지워주고 state, setState 등을 수정해야 한다.

```javascript
class Square extends React.Component {
  render() {
    return (
      <button 
        className="square" 
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```
이제부터는 Square를 클릭하면 Board에서 넘어온 `onClick()`함수를 호출하게 된다. Board에서 `onClick={() => this.handleClick(i)}`를 전달했기 때문에 Square를 클릭하면 결국은 `handleClick()`을 호출하는 것이다. 이제 `handleClick()`함수를 정의해보자.

```javascript
  handleClick(i) {
    const squares = this.state.squares.slice(); // slice()를 호출하면서 기존 배열을 수정하지 않고 squares 배열의 복사본을 생성하여 수정한다. 
    squares[i] = 'X';
    this.setState({squares: squares});
  }
```

Square 컴포넌트는 이제 **제어되는 컴포넌트**이다. Board가 제어한다.

다음 포스트에서는 불변성이 왜 중요한지에 대해 알아보며 게임을 완성해가도록 하자.

출처 : [리액트 튜토리얼](https://ko.reactjs.org/tutorial/tutorial.html#setup-option-2-local-development-environment)
