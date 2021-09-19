---
title: '[디자인패턴] Flux 패턴은 무엇일까'
date: 2021-09-18 01:00:00
category: 'React'
draft: false
---

Flux는 페이스북에서 MVC의 단점을 보완하기 위해 발표한 디자인 패턴으로 React.js의 Redux 디자인 패턴으로 유명하다. 저번에 알아본 MVC 패턴하고 자주 비교되곤 한다. 지금은 Redux가 당연한 것 처럼 쓰고 있지만 이전에 Flux 패턴이 먼저 발표되고, Flux 패턴을 적용한 패키지인 Redux가 등장하게 된 것이다.

## 1. 기존 MVC 패턴의 문제점

MVC 패턴의 가장 큰 단점이라고 불리는 것은 양방향 데이터 흐름이었다.

![MVC](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FALrHe%2FbtqBTMSuHfN%2FZlW9i9ET34e90APgCRChk1%2Fimg.png)

Controller가 Model의 데이터를 조회하거나 업데이트 하는 역할을 하는데 Model이 업데이트 되면 View는 화면에 반영한다. 그리고 반대로 View가 Model을 업데이트할 수도 있다. Model이 업데이트되어서 View에 반영되고, 업데이트된 View가 다시 다른 Model을 업데이트하면 또다른 View가 또 업데이트된다.

복잡한 어플리케이션에서 이처럼 양방향 데이터 흐름은 새로운 기능이 추가 될 때마다 복잡도를 증대시킬 수도 있다. 그래서 예측하지 못한 버그들이 많이 생겨날 수 있게 된다. 그리고 데이터의 변경 사항이 신속하게 전파되기도 어렵다.

이러한 이유때문에 단방향 데이터 흐름이라는 방법이 고안되게 되었고, 단방향 데이터 흐름을 통해 어플리케이션이 예측가능하도록 하고자 했다.

## 2. Flux의 등장

![Flux](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FlmfPW%2FbtqBQnTPgIs%2FZ1jmHHdNcOTNiu93kQ9gMk%2Fimg.png)

Flux는 단방향 데이터 흐름을 특징으로 한다. 데이터는 항상 Dispatcher에서 Store로, Store에서 View로, View는 다시 Action을 통해 Dispatcher로 데이터가 흐르게 한다.

## 3. Flux이 구조

### Dispatcher

Dispatcher는 Flux의 모든 데이터 흐름을 관리하는 허브 역할이다. Action이 발생되면 전달받아서 등록된 콜백 함수를 이용해 각 Store에 데이터를 전달한다. 등록되어 있는 모든 스토어로 페이로드를 전달할 수 있다. Dispatcher는 전체 어플리케이션에서 한 개의 인스턴스만 사용된다.

### Store (Model)

스토어는 어플리케이션의 상태와, 상태를 변경할 수 있는 메서드를 가지고 있다. 모든 상태 변경은 Store에 의해 결정된다. 어떤 타입의 액션이 왔느냐에 따라 메서드를 다르게 적용하여 상태를 변경한다. Dispatcher로부터 메시지를 수신 받기 위해서 Dispatcher에 콜백 함수를 등록해야 한다. Store가 변경되면 View에 변경된 사실을 알려주고 Store는 싱글톤으로 관리된다.

### View

React에 해당하는 부분이다. Flux의 View는 화면에 나타내기도 하지만, 자식 View로 데이터를 흘려 보내는 View Controller의 역할도 한다. 데이터를 넘겨받은 자식 뷰는 화면을 리렌더링 한다.

### Action / Action Creator

Dispatcher에서 콜백 함수가 실행되면 Store가 업데이트되는데, 이 콜백 함수를 실행 할 때 데이터가 담겨있는 객체가 인수로 전달되어야 한다. 이 전달되는 객체가 Action이다. Action은 대체로 Action Creator에서 만들어진다. Action Creator는 새로 발생한 액션의 타입과 데이터 페이로드를 액션 메시지로 묶어 Dispatcher로 전달한다.

## 정리

사실상 Flux 패턴을 정리하면서 느낀 것은 Flux 자체가 Redux라는 생각이 들었지만 엄격히 말하면 그것은 아니다. Redux가 Flux패턴의 대표적인 패키지로 쓰이는 것은 맞지만 최근은 Redux가 기능에 비해서 너무 많은 코드가 필요하다는 의견도 있다. 그리고 React에서도 자체적으로 Context API를 제공한다. Redux 자체로는 디스패처 개념이 존재하지 않는다. 리듀서가 디스패처+스토어의 기능을 한다. 그리고 리듀서가 모든 상태를 immutable하도록 설정하고, 업데이트된 값은 새로운 객체로 복사되어 리턴된다. Flux의 스토어가 각자의 상태만 간직했던 것과 다르게 Redux의 상태는 역할을 리듀서로 넘긴 뒤에 모든 리듀서가 하나의 스토어에 묶이게 설계했다. 각 뷰가 자신이 필요한 스토어만 각각 접근할 수 있던 Flux와 다르게 Redux는 무조건 싱글 스토어로 각 리듀서에 접근할 수 있다. 아직은 Flux와 Redux에 대해 완전히 이해하지는 못했지만, 이러한 패턴의 등장과 Redux의 등장에 대해서 알아갈 수 있는 좋은 기회였다. 특히 Flux에 대한 이해가 어렵다면, [Flux로의 카툰 안내서](https://bestalign.github.io/translation/cartoon-guide-to-flux/) 이 글이 이해하는데 매우 효과적이었다고 생각하여 추천한다.

---

### 출처

1. [[디자인패턴] Flux, MVC 비교](https://beomy.tistory.com/44)

2. ['데이터가 폭포수처럼 흘러내려' React의 flux 패턴](https://www.huskyhoochu.com/flux-architecture/)

3. [Flux로의 카툰 안내서](https://bestalign.github.io/translation/cartoon-guide-to-flux/)
