---
title: '[리액트 주요 개념] 리스트와 Key'
date: 2020-12-04 23:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

JS에서 리스트를 변환하는 방법을 살펴보자. 아래는 `map()`함수를 이용하여 `numbers`배열의 값을 두배로 만들어서 `map()`에서 반환하는 새 배열을 `doubled` 변수에 저장해서 할당 후에 로그를 확인하는 코드이다.
```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled); // [2, 4, 6, 8, 10] 출력
```
리액트에서 배열을 엘리먼트 리스트로 만드는 방식도 동일하다.


## 여러 컴포넌트 렌더링 하기
엘리먼트 모음을 만들어서 중괄호 `{}`를 이용해서 JSX에 포함시킬 수 있다. JS `map()` 함수를 사용해서 `numbers` 배열을 반복 실행 한다. `<li>` 엘리먼트를 반환하고 엘리먼트 배열의 결과를 `listItems`에 저장된다. 
```javascript
const numbers = [1, 2, 3, 4 ,5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```
`listItems` 배열을 `<ul>` 엘리먼트 안에 포함하고 DOM에 렌더링한다.
```javascript
ReactDOM.render(
  <ul>{listItems}</ul>,
  doucument.getElementById('root')
);
```
이 코드는 1부터 5까지 리스트를 출력한다.


## 기본 리스트 컴포넌트

일반적으로는 컴포넌트에서 리스트를 생성한다. 이전 코드를 `numbers` 배열을 받아서 리스트를 출력하는 컴포넌트로 리팩토링 할 수 있다. 
```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers = {numbers} />,
  document.getElementById('root');
);
```
위 코드를 실행하면 key를 넣으라는 경고 문구가 발생하는데, key는 엘리먼트 리스트를 만들 때 포함해야 하는 특수한 문자열 어트리뷰트이다. `numbers.map()`안에서 리스트의 각 항목에 `key`를 할당하는 것을 보자.
```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```


## Key
key는 리액트가 어떤 항목을 추가, 변경하는지 알려준다. 고유성을 부여하기 위해 배열 내부의 엘리먼트에 지정해야 한다. key를 선택하는 가장 좋은 방법은 리스트의 다른 항목들 사이에서 고유하게 식별 가능한 문자열을 사용하는 것이다. 대부분 데이터의 ID를 key로 사용한다. 만약 안정적인 ID가 없으면 인덱스를 key로 사용한다. 하지만 순서가 바뀔 수 있는 경우 인덱스는 권장되지 않는다. 만약 명시적으로 key를 지정하지 않으면 리액트는 기본적으로 인덱스를 key로 사용한다.
```javascript
const todoItems = todos.map((todo) => 
  <li key={todo.id}>
    {todo.text}
  </li>
);

const todoItems = todos.map((todo, index) =>
  // 권장되는 방법이 아님.
  <li key={index}>
    {todo.text}
  </li>
);
```


## Key로 컴포넌트 추출하기
키는 주변 배열의 context에서만 의미가 있다. 만약 `ListItem` 컴포넌트를 추출한 경우 `ListItem`안에 있는 `<li>` 엘리먼트가 아니라 배열의 `<ListItem />`엘리먼트가 key를 가져야 한다. `map()`함수가 쓰이는 곳에 key를 지정해야 한다.
```javascript
function ListItem(props) {
  // 맞습니다! 여기에는 key를 지정할 필요가 없습니다.
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 맞습니다! 배열 안에 key를 지정해야 합니다.
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```


## Key는 형제 사이에서만 고유한 값이어야 한다.
Key는 배열 안에서 형제 사이에서만 고유하면 되고 전체 범위에서는 고유할 필요가 없다. 두 개의 다른 배열을 만들 때는 동일한 key를 사용할 수 있다. 리액트에서 key는 힌트를 제공하지만 컴포넌트로 전달하지는 않는다. 컴포넌트에서 key와 동일한 값이 필요하면 다른 이름의 prop으로 명시적으로 전달한다.
```javascript
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```
위의 `Post` 컴포넌트는 `props.id`는 읽을 수 있으나 `props.key`는 읽을 수 없다.


## JSX에 map() 포함시키기
```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => 
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
// 아래와 같이 바로 중괄호 {} 안으로 넣을 수 있다.
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```
위 같이 바로 `{}`를 사용하는 방식은 코드 자체는 깔끔해 지지만 가독성에 좋지 않다. 만약 `map()`이 중첩되어야 하는 경우라면 컴포넌트로 추출하는 것이 좋다.


출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
