---
title: '[리액트 튜토리얼] 시간여행 기능 추가(2)'
date: 2020-11-18 23:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

## 과거의 이동 표시 하기
게임의 이동 정보를 기록하고 있기 때문에 플레이어에게 과거의 이동을 목록으로 표시할 수 있다. React 엘리먼트 배열을 사용하면 여러 아이템 렌더링이 가능하다. Javascript에서 배열은 데이터를 다른 데이터와 매핑할 때 사용하는 `map()` 함수가 있다. `map` 함수를 활용하여 이동 기록을 화면에 표시되는 React 버튼 엘리먼트로 맵핑할 수 있고 과거의 이동으로 돌아가는 버튼 목록을 표시할 수 있다. 게임의 `render` 함수에서 `history`를 `map`해보자

```javascript
render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```
이렇게 변경하면 게임 기록의 각각 이동마다 버튼 `<button>`을 포함하는 리스트 아이템 `<li>`를 생성한다. 버튼은 `this.jumpTo()` 함수를 호출하는 `onClick` 핸들러를 가지고 있다. 아직 `jumpTo()` 함수는 구현되지 않았다. 


## Key 선택하기
리스트를 렌더링할 때 React는 렌더링하는 리스트 아이템에 대한 정보를 저장한다. 리스트를 업데이트할 때 React는 무엇이 변했는 지 결정해야 한다. 리스트의 아이템들은 추가, 제거, 재배열, 업데이트 될 수 있다. 키를 설정하면 React는 각 리스트 아이템의 키를 가져가고 이전 리스트 아이템에서 일치하는 키를 탐색한다. 현재 리스트에서 이전에는 없었던 키를 가지고 있으면 React는 새로운 컴포넌트를 생성한다. 만약에 현재 리스트가 이전 리스트에 존재했던 키를 가지고 있지 않으면 React는 키를 가진 컴포넌트를 제거한다. 두 키가 일치하면 구성요소는 이동한다. 키는 각 컴포넌트를 구별할 수 있도록 하여 React에게 다시 렌더링할 때 state를 유지할 수 있게 한다. 만약 컴포넌트의 키가 변경되면 컴포넌트는 제거되고 새로운 state와 함께 다시 생성된다.

```javascript
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

React에서 `key`는 심화 기능인 `ref`와 동일하게 특별한 prop이다. 엘리먼트가 생성되면 React는 `key`속성을 추출하여 반환하는 엘리먼트에 직접 키를 저장한다. `key`가 `props`에 속하는 것처럼 보이지만 `this.props.key`로 참조할 수 없다. React는 자동으로 `key`를 어떤 컴포넌트 업데이트할 지 판단할 때 사용한다. `key`는 조회되지는 않는다.

동적인 리스트를 만들 때마다 적절한 키를 할당하는 것이 좋다. 키가 지정되지 않으면 React는 경고를 표시하며 배열의 인덱스를 기본 키로 사용한다. 배열의 인덱스를 키로 사용하면 리스트 아이템 순서를 바꾸거나 아이템 추가/제거 시 문제가 된다. 명시적으로 `key={i}`를 전달하면 경고는 안나오더라도 동일한 문제가 생긴다. 키는 전역에서 고유할 필요는 없지만 컴포넌트와 관련 아이템 사이에서는 고유한 값을 가져야 한다.


## 시간 여행 구현하기
게임의 기록에서 과거의 이동 정보는 이동의 순차적인 숫자를 고유한 ID로 가졌다. 이동은 순서가 바뀌거나 삭제되거나 중간 삽입이 불가하므로 이동의 인덱스를 키로 사용해도 된다. Game 컴포넌트의 `render` 함수 안에서 `<li key={move}>`로 키를 추가하면 React 키에 대한 경고가 사라진다.

```javascript
const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

Game 컴포넌트의 state에 `stepNumber`를 추가해서 현재 진행 단계를 표시하자. 먼저 Game의 `constructor` 초기 state로 `stepNumber: 0`을 추가하자.
```javascript
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

`stepNumber`를 업데이트 하기 위해 `jumpTo`를 정의하자. `stepNumber`가 짝수 일 때 `xIsNext`를 true로 설정하자.
```javascript
jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
      });
  }
```

이제는 `handleClick` 함수에 몇가지 변화를 주어야 한다. `stepNumber` state는 현재 사용자에게 표시되는 이동을 반영한다. 새로운 이동을 만든 후에 `this.setState`의 인자로 `stepNumber: history.length`를 추가해서 `stepNumber`를 업데이트해야 한다. 또한 `this.state.history`를 `this.state.history.slice(0,
this.state.stepNumber + 1)`로 교체할 것이다. 
```javascript
 const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
```
마지막으로 Game 컴포넌트의 `render` 함수를 수정하여 마지막 이동을 렌더링하는 대신 `stepNumber`에 맞는 현재 선택된 이동을 렌더링 할 것이다.
```javascript
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

```

이제 완성이다!


출처 : [리액트 튜토리얼](https://ko.reactjs.org/tutorial/tutorial.html#setup-option-2-local-development-environment)
