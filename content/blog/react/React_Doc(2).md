---
title: '[리액트 주요 개념] 엘리먼트 렌더링'
date: 2020-12-01 22:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

## 엘리먼트 렌더링

> 엘리먼트는 React 앱의 가장 작은 단위.

엘리먼트는 화면에 표시할 내용을 기술한다.
```javascript
const element = <h1>Hello, world</h1>;
```
일반적인 DOM 엘리먼트와 다르게 React 엘리먼트는 일반 객체이고 쉽게 생성할 수 있다. React DOM은 React 엘리먼트와 일치하도록 DOM을 업데이트 한다. 컴포넌트와 엘리먼트를 헷갈릴 수 있는데, 엘리먼트는 컴포넌트의 `구성 요소`이다.


## DOM에 엘리먼트 렌더링하기
HTML 파일에 `<div>`가 있다고 생각해보자.
```javascript
<div id="root"></div>
```
여기에 들어가는 모든 엘리먼트를 React DOM에서 관리하며, 이것을 "root" DOM 노드라고 부른다. React로 구현된 애플리케이션에는 일반적으로 하나의 루트 DOM 노드가 존재한다. 하지만 많은 수의 독립된 노드 DOM 노드가 있을 수도 있다. React 엘리먼트를 루트 DOM 노드에 렌더링하기 위해서는 둘 다 `ReactDOM.render()`로 전달하면 된다.

```javascript
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

## 렌더링된 엘리먼트 업데이트하기
기본적으로 React 엘리먼트는 `불변객체`이다. **엘리먼트 생성 이후 해당 엘리먼트의 자식이나 속성을 변경할 수 없다.** 지금까지 내용을 바탕으로는 UI를 업데이트하려면 새로운 엘리먼트를 생성해서 `ReactDOM.render()`에 전달하는 것이다.

```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```
위 코드는 `setInterval()` 콜백을 이용해 초마다 `ReactDOM.render()`를 호출하는 것이다. 하지만 실제로 대부분의 React 앱은 `ReactDOM.render()`를 한 번만 호출한다.


## 변경된 부분만 업데이트하기
**React DOM은 해당 엘리먼트와 자식 엘리먼트를 이전 엘리먼트와 비교한 후에 DOM을 원하는 상태로 만드는데 필요한 경우에만 DOM을 업데이트**한다. 매초 전체 UI를 다시 그릴것 같았지만 React DOM은 내용이 변경된 텍스트 노드만 업데이트하여 변경한다.



출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
