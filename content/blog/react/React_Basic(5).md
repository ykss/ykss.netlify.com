---
title: '[리액트 튜토리얼] 시간여행 기능 추가(1)'
date: 2020-11-18 01:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

## 동작에 대한 기록 저장하기
이전의 코드에서 `slice()`를 사용하여 매 동작 할 때마다 `squares` 배열의 새로운 복사본을 만들어서 **불변 객체**로 취급하였다. 이를 통해 과거의 `squares` 배열의 모든 버전을 저장하고 이미 지나간 차례를 탐색할 수 있다. 과거의 `squares` 배열들을0 `history`라는 다른 배열에 저장하고 `history`배열에는 첫 동작부터 마지막 동작까지 모든 게임판의 상태가 저장될 것이다. 이제 정해야 할 것은 `history` state를 어느 컴포넌트에서 가지고 있을지다.


## 다시 State 끌어올리기
이전 동작에 대해서 리스트를 보여주기 위해서는 최상위 단계인 `Game` 컴포넌트에 `history` state를 두는게 좋다. 이제 `history` state를 `Game` 컴포넌트에 두었기 때문에 자식인 `Board` 컴포넌트에서 `squares` state를 사용하지 안하도 된다. 저번에는 Square 컴포넌트에서 Board 컴포넌트로 state를 끌어 올린 것처럼 이번에는 Board 컴포넌트에서 Game 컴포넌트로 state를 끌어올려야 한다. 이 과정을 통해 Game 컴포넌트는 Board 데이터를 완벽히 제어하고, `history`에 저장한 과거의 차례를 Board가 렌더링 할 수 있게 한다. 먼저 `Game` 컴포넌트의 생성자 안에 초기 state를 설정해야 한다.

```javascript
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares : Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```
다음 해야할 것은 Game 컴포넌트에서 Board 컴포넌트로 `squares`와 `onClick` props를 전달해야 한다. `Board`에서 여러 개의 Square에 쓰일 단일 클릭 핸들러를 가졌기 때문에 각 Square의 위치를 `onClick` 핸들러에게 넘겨주어 어떤 Square를 클릭했는지 표시할 것이다. Board 컴포넌트를 변경하는 순서는 아래와 같다.

* `constructor`를 Board에서 제거해야 한다.
* Board의 `renderSquare`안의 `this.state.squares[i]`를 `this.props.squares[i]`로 바꿔야 한다.
* Board의 `renderSquare`안의 `this.handleClick(i)`를 `this.props.onClick(i)`로 바꿔야 한다.

이제 Board 컴포넌트는 아래와 같다.

```javascript
class Board extends React.Component {

  handleClick(i) {
    const squares = this.state.squares.slice();
    if( calculateWinner(squares) || squares[i] ) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
          }],
          xIsNext: true,
      };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

```
Game 컴포넌트의 `render` 함수를 가장 최근의 상태기록을 사용하도록 업데이트하고 게임의 상태를 표시할 것이다.

```javascript
render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    let status;
    if(winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```
Game 컴포넌트가 게임의 상태를 렌더링하기 때문에 Board의 `render` 함수에서 중복되는 코드를 제거할 수 있다. 중복 코드 제거하면 Board는 아래와 같다. 
```javascript
render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```
마지막으로 `handleClick` 함수를 Board에서 Game컴포넌트로 이동하고 수정해야한다.
```javascript
 handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
          squares : squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```
현재 시점에서 Board 컴포넌트는 `renderSquare`과 `render` 함수만을 필요로 한다. 게임의 state와 `handleClick` 함수는 Game 컴포넌트가 가지고 있어야 한다. 이제 시간 여행 기능을 추가하기 위한 리팩토링을 어느 정도 마쳤다. 다음 포스트에서는 본격적인 시간 여행 기능, 즉 되돌리기 기능을 추가하도록 하겠다.



출처 : [리액트 튜토리얼](https://ko.reactjs.org/tutorial/tutorial.html#setup-option-2-local-development-environment)
