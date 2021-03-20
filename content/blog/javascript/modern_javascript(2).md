---
title: '[책]모던 자바스크립트 입문 정리 (2)'
date: 2021-02-17 23:00:00
category: 'Javascript'
draft: true
---

## 웹 브라우저의 객체

기존 자바스크립트의 실행 속도는 매우 느렸지만, 크롬과 파이어폭스가 실행 중 자바스크립트 코드를 컴파일하는 JIT 컴파일러를 도입하면서 빠른 실행 속도를 가지게 되었다.

### 웹 브라우저에서 자바스크립트 실행 순서

1. 웹 페이지를 열면 가장 먼저 `Window` 객체가 생성된다. `Window` 객체는 전역 객체로 웹페이지 탭마다 하나 씩 생성된다.
2. `Document` 객체는 `Window` 객체의 프로퍼티로 생성되어 웹 페이지를 DOM 트리로 구축한다. `Document` 객체는 `readyState` 프로퍼티를 가지고 있고, 기본 값은 `loading`이다.
3. HTML 문서는 작성 순서에 따라 분석해서 `Document` 객체 요소와 텍스트 노드를 추가해간다.
4. HTMl 문서 내부에 `script` 요소가 있으면, 코드 분석을 하며, 오류가 발생하지 않을 경우 코드를 실행한다. 이때 해당 요소는 동기적으로 실행되어, script 구문이 분석될 동안에는 HTML 구문 분석이 일시 중지된다.
5. DOM 트리 구축이 완료되면 `readyState` 값이 `interactive`로 바뀐다.
6. 웹 브라우저는 `Document` 객체에 DOM 트리 구축 완료를 알리기 위해 `DOMContentLoaded` 이벤트를 발생시킨다.
7. img 등의 요소가 이미지 파일 등은 이 시점에서 읽어 들인다.
8. 모든 리소스를 읽어들인 후, `document.readyState` 프로퍼티 값이 `complete`로 바뀐다. 마지막으로 브라우저는 `Window` 객체를 상대로 `load` 이벤트를 발생시킨다.
9. 이 시점부터 다양한 이벤트를 수신하고, 이벤트 처리기가 비동기로 호출된다.

HTML문서가 다 로드되지 않은 상태에서 자바스크립트 코드가 동작하면 의도대로 동작하지 않을 수 있기 때문에 `window.onload` 이벤트 처리기에 초기화 스크립트를 등록하면 된다. 이미지 파일을 로드하기 전에 초기화 작업을 진행할 때는 아래와 같이 진행해도 된다.

```javascript
document.addEventListener(
  'DOMContentLoaded',
  function(e) {
    //초기화 코드
  },
  false
)
```
