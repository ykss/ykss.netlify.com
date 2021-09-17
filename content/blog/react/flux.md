---
title: '[디자인패턴] Flux 패턴은 무엇일까'
date: 2021-09-15 01:00:00
category: 'React'
draft: true
---

Flux는 페이스북에서 MVC의 단점을 보완하기 위해 발표한 디자인 패턴으로 React.js의 Redux 디자인 패턴으로 유명하다. 저번에 알아본 MVC 패턴하고 자주 비교되곤 한다.

## 1. 기존 MVC 패턴의 문제점

MVC 패턴의 가장 큰 단점이라고 불리는 것은 양방향 데이터 흐름이었다.

![MVC](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FALrHe%2FbtqBTMSuHfN%2FZlW9i9ET34e90APgCRChk1%2Fimg.png)

Controller가 Model의 데이터를 조회하거나 업데이트 하는 역할을 하는데 Model이 업데이트 되면 View는 화면에 반영한다. 그리고 반대로 View가 Model을 업데이트할 수도 있다. Model이 업데이트되어서 View에 반영되고, 업데이트된 View가 다시 다른 Model을 업데이트하면 또다른 View가 또 업데이트된다.

복잡한 어플리케이션에서 이처럼 양방향 데이터 흐름은 새로운 기능이 추가 될 때마다 복잡도를 증대시킬 수도 있다. 그래서 예측하지 못한 버그들이 많이 생겨날 수 있게 된다.

---

### 출처

1. [Recoil 공식 도큐멘테이션](https://recoiljs.org/)
2. [리액트개발자가 겪게되는일](https://repo.yona.io/doortts/blog/post/297)
3. [React에서 Mobx 경험기 (Redux와 비교기)](https://techblog.woowahan.com/2599/)

4. [React에서 Redux가 왜 필요할까?](https://devlog-h.tistory.com/26)
