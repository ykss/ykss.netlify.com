---
title: '리액트 다루는 기술 정리 (2) - 라이프사이클 메서드'
date: 2021-06-08 18:00:00
category: 'React'
draft: false
---

# 7. 컴포넌트의 라이프사이클 메서드

모든 리액트 컴포넌트에는 라이프사이클이 존재한다. 컴포넌트의 라이프 사이클은 페이지 렌더링 되기 전부터 페리지에서 사라질 때 끝난다. 컴포넌트 라이프사이클은 컴포넌트를 처음으로 렌더링할 때 어떤 작업을 해야하거나, 컴포넌트 업데이트 전후로 어떤 작업을 해야할 때 사용한다. 라이프사이클 메서드는 클래스형 컴포넌트에서만 사용이 가능하다. 함수형 컴포넌트에서는 Hooks 기능을 통해 비슷하게 처리 가능하다.

## 7.1 라이프사이클 메서드 이해

- Will - 어떤 작업을 작동하기 전에 실행되는 메서드
- Did - 어떤 작업을 작동한 후 실행 되는 메서드

- 마운트 - 페이지가 컴포넌트에 나타남

  DOM이 생성되고 브라우저상에 나타나는 것을 마운트라고 한다. 아래 순서로 메서드가 호출된다.

  - constructor - 클래스 생성자 메서드
  - getDerivedStateFromProps - props에 있는 값을 state에 넣을 때 사용하는 메서드
  - render - UI를 렌더링하는 메서드
  - componentDidMount - 컴포넌트가 브라우저 상 나타난 후에 호출하는 메서드

- 업데이트 - 컴포넌트 정보를 업데이트(리렌더링)

  업데이트가 일어나는 경우는 props가 바뀔 때, state가 바뀔 때, 부모 컴포넌트가 리렌더링될 때, `this.forceUpdate` 로 강제로 렌더링을 트리거 할 때이다. 업데이트할 때는 아래 순서로 메서드가 호출된다.

  - getDerivedStateFromProps - props의 변화에 따라 state값에도 변화를 주고싶을 때 사용
  - shouldComponentUpdate - 컴포넌트가 리렌더링 해야할지 말아야할지를 결정한다. true면 다음 라이프사이클 메서드를 실행하고 false면 작업을 중지한다. 만약 `this.forceUpdate()` 함수를 호출하면 바로 render을 호출한다.
  - render - 컴포넌트를 리렌더링하는 메서드
  - getSnapshotBeforeUpdate - 컴포넌트 변화를 DOM에 반영하기전에 호출하는 메서드이다.
  - componentDidUpdate - 컴포넌트의 업데이트 작업이 끝난 후 호출하는 메서드이다.

- 언마운트 - 페이지에서 컴포넌트가 사라짐
  - componentWillUnmount - 컴포넌트가 웹 브라우저상에서 사라지기 전에 호출하는 메서드이다.

## 7.2 라이프사이클 메서드 살펴보기

- render()

  컴포넌트의 모양새를 정의 하는 메서드로 필수 메서드이다. 이 메서드 안에서 this.props와 this.state에 접근할 수 있다. 아무것도 보여주지 않으려면 null이나 false를 반환하면 된다. **이 메서드 안에서는 setState를 사용하면 안되고 브라우저의 DOM에 접근해서도 안된다. DOM 정보를 가져오거나 state의 변화를 줄 때는 componentDidMount에서 처리해야 한다.**

- getDerivedStateFromProps()

  props로 받아 온 값을 state에 동기화 시키기 위해 사용하고, 컴포넌트가 마운트 될 때와 업데이트 될 때 호출된다.

  ```jsx
  static getDerivedStateFromProps(nextProps, prevState) {
  	if(nextProps.value !== prevState.value) {
  		return { value : nextProps.value };
  	}
  	return null;
  }
  ```

- componentDidMount()

  컴포넌트를 만들고 나서 첫 렌더링을 마치고 나서 실행하는 메서드이다. 이벤트 등록, setTimeout, setInterval, 네트워크 요청과 같은 비동기 작업을 처리할 때 사용한다.

- shouldComponentUpdate()

  props 또는 state를 변경했을 때, 리렌더링을 시작할지 여부를 결정한다. 해당 메서드에서 false를 리턴하면 업데이트 과정이 여기서 중지된다. 현재 props와 state는 this.props와 this.state로 접근할 수 있고, 새로 설정될 props와 state는 nextProps와 nextState로 접근 가능하다.

- getSnapshotBeforeUpdate()

  render에서 만들어진 결과물이 브라우저에 실제 반영되기 전에 호출되는 메서드이다. 주로 업데이트 하기 직전의 값을 참고해야할 때 활용된다. (스크롤바 위치 유지 등)

- componentDidUpdate()

  리렌더링 이후에 실행되는 메서드이다. 업데이트 이후에 실행되므로 DOM 관련 처리를 해도 무방하다. prevProps와 prevState를 사용해서 컴포넌트가 이전에 가졌던 데이터를 접근할 수 있다.

- componentWillUnmount()

  컴포넌트를 DOM에서 제거할 때 실행한다. componentDidMount에서 등록한 이벤트, 타이머나 DOM 등이 있다면 여기서 제거 작업을 해야한다.

- componentDidCatch()

  리액트 v16에서 도입되었으며, 렌더링 도중에 에러가 발생했을 때 오류 UI를 보여줄 수 있도록 해준다. error는 어떤 에러인지 알려주고, info는 어떤 코드에서 발생했는지 알려준다.

  ```jsx
  componentDidCatch(error, info) {
  	this.setState({
  		error: true
  	});
  	console.log({error, info});
  }
  ```

![라이프사이클 메서드](https://media.vlpt.us/images/whdvkf92/post/745af11e-6b8c-454e-ae70-7c0f1c089d60/%EB%A6%AC%EC%95%A1%ED%8A%B8%20%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4%20%EB%A9%94%EC%84%9C%EB%93%9C.JPG)

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
