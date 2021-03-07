---
title: '자바스크립트의 동작 원리 - 어쨌든 이벤트 루프는 무엇입니까?'
date: 2021-03-08 01:00:00
category: 'Javascript'
draft: false
---

자바스크립트의 이벤트 루프와 동기, 비동기 등의 개념을 알기 위해 이 영상을 보게 되었다. 나는 자바스크립트가 싱글스레드 기반이고, 콜백 큐를 사용한다고는 알고있지만 그것에 대해 자세히 알고 있지는 못하다.

!['어쨌든 이벤트 루프는 무엇입니까? image'](https://slid-capture.s3.ap-northeast-2.amazonaws.com/public/capture_images/100622574c344959b5206c7d566b571e/f5b054cb-78db-49e6-9ba4-801cbe171913.png)

이 영상에서 스피커는 자바스크립트가 실제로 어떻게 동작하는지 알고 싶어서 공부하고 정리했고, 다른 언어들과 비교해보면서 자바스크립트가 어떤 부분이 특이하고, 어떻게 동작하는지 이해하기 위해 노력하며 정리한 내용이 있는데, 나도 또한 자바스크립트의 작동 원리에 대해서 알기 위해 이 영상을 보며 정리해보려고 한다.&nbsp;

!['어쨌든 이벤트 루프는 무엇입니까? image'](https://joshua1988.github.io/images/posts/web/translation/how-js-works/js-engine-structure.png)

위의 그림은 자바스크립트 엔진으로 대표적인 Google V8 엔진이며, 자바스크립트의 런타임을 단순화 한 것이다. 먼저 자바스크립트에서 메모리 할당이 일어나는 <b>Memory Heap</b>과 <b>Call Stack</b>이 있다.

- Memory Heap&nbsp;: 메모리 할당이 일어나는 곳
- Call Stack&nbsp;: 코드 실행에 따라 호출 스택이 쌓이는 곳

많은 자바스크립트 개발자들이 setTimeout이나 DOM, HTTP요청을 관리 하는 코드들을 사용하지만, V8 엔진에는 이러한 코드들이 존재하지 않는다.&nbsp; 비동기 코딩에서 가장 먼저 생각하는 것들 중 하나가 setTimeout임에도 불구하고 말이다.

!['어쨌든 이벤트 루프는 무엇입니까? image'](https://joshua1988.github.io/images/posts/web/translation/how-js-works/js-engine-runtime.png)

V8에서 제공하지 않는 것들은 브라우저가 제공하는 <b>Web API</b>에 존재한다. Web API는 DOM, AJAX 등 외에도 <b>이벤트 루프</b>와 <b>콜백 큐</b>를 가지고 있다.&nbsp;

## 콜 스택(Call Stack)

!['어쨌든 이벤트 루프는 무엇입니까? image'](https://slid-capture.s3.ap-northeast-2.amazonaws.com/public/capture_images/100622574c344959b5206c7d566b571e/d5945c2f-9664-4034-81db-cfac86b706c6.png)

자바스크립트는 싱글 스레드 언어이다. 한번에 하나의 싱글 콜 스택을 가지고 있다는 것이고, 쉽게 말해, 하나의 프로그램은 동시에 하나의 코드만 실행할 수 있다는 뜻이다. 아래 코드를 보자.

```javascript
function multiply(a, b) {
  return a * b
}

function square(n) {
  return multiply(n, n)
}

function printSquare(n) {
  var squared = square(n)
  console.log(squared)
}

printSquare(4)
```

![](https://slid-capture.s3.ap-northeast-2.amazonaws.com/public/capture_images/100622574c344959b5206c7d566b571e/651767f5-6787-43ac-a392-6c0911d94cf5.png '어쨌든 이벤트 루프는 무엇입니까? image')

위의 그림과 같이 스택이 쌓이고 또 순차적으로 실행되어 스택이 비게 될 것이다.&nbsp;

만약에 아래 코드와 같이 호출 스택이 최대 크기가 되면 “스택 날려 버리기” 가 일어난다.&nbsp;

```javascript
function foo() {
  return foo()
}

foo()
```

![](https://slid-capture.s3.ap-northeast-2.amazonaws.com/public/capture_images/100622574c344959b5206c7d566b571e/b7a9088a-7b1f-465e-ad4a-bbe0e0446510.png '어쨌든 이벤트 루프는 무엇입니까? image')

그럼 위와 같이 에러를 표시하게 되는 것이 그것이다.

## 블로킹 (Blocking)

![](https://slid-capture.s3.ap-northeast-2.amazonaws.com/public/capture_images/100622574c344959b5206c7d566b571e/f916e78f-665d-4e07-b58c-6fff1e2546ca.png '어쨌든 이벤트 루프는 무엇입니까? image')

싱글 스레드 기반에서는 데드락과 같이 멀티 스레드 환경에서 발생하는 복잡한 문제를 고민하지 않아도 되는 장점이 있다. 하지만 싱글 스레드는 상당히 제약이 많다. 단순히 생각해서 한 개의 호출 스택을 갖고 있는 자바스크립트의 실행이 느려지면 이러한 제약에 대해 알 수 있게 된다.

블로킹 현상은 코드가 느리게 실행되는 것을 말한다. 느린 동작이 스택에 남아있는 것을 흔히 블로킹이라고 한다. 블로킹의 형태는 여러가지가 될 수 있다. 자바스크립트는 싱글스레드 언어이기 때문에 네트워크 요청과 같은 블로킹이 발생했을 때, 마냥 끝날 때까지 기다린다. 콜 스택이 비어있기 전까지는 다른 동작을 하지 못한다. 이러한 치명적인 제약 조건이 있기 때문에 이것들을 해결할 방법이 꼭 있어야 한다. 이것을 해결할 방법으로 가장 쉬운 것은 <b>비동기 콜백</b>이다.

## 비동기 콜백(Asynchronous Callbacks)

비동기 콜백들이 실제로 어떻게 동작하는지 코드를 통해 보자.&nbsp;

```javascript
console.log('hello')

setTimeout(function() {
  console.log('there')
}, 5000)

console.log('JSConfEU')
```

여기서 결과는 "hello", 'JSConfEU', 'there' 순으로 출력이 된다. 하지만 콜 스택 관점에서 보면 main()이 실행된 이후 console.log()를 실행한 후 사라지고 setTimeout()이 스택에 추가 되었다가 5초 후에 실행 된다.&nbsp; 그리고 console.log()가 스택에 추가되지 않은 상태로 사라진다. 그리고 console.log('JSConfEU')가 먼저 실행되고 스택에서 사라진 후에 마지막에 console.log('there')이 실행된다.

어떻게 이렇게 실행 될 수 있을까? 이게 동시에 가능한 이유는 브라우저가 단순히 런타임 이상을 의미하기 때문이다.

## 동시성과 이벤트 루프(Concurrency &amp; Event Loop)

!['어쨌든 이벤트 루프는 무엇입니까? image'](https://slid-capture.s3.ap-northeast-2.amazonaws.com/public/capture_images/100622574c344959b5206c7d566b571e/c30a28c3-30e2-43b0-93ff-f09b16854c54.png)

런타임은 한번에 하나만 할 수 있지만, 브라우저가 Web API 같은 것을 제공한다. 이러한 것들은 자바스크립트의 스레드를 효과적으로 지원한다.

아까 위의 코드에 경우에는 setTimeout() 함수가 호출되었을 때는 web api에서 timer()를 실행시키고 그것이 작동이 완료되면 콜백을 테스크 큐에 밀어넣는다. 그리고<b> 이벤트 루프(Event Loop)</b>가 역할을 시작한다. 이벤트 루프는 스택이 비어있으면 큐의 첫번째 콜백을 스택에 쌓아서 효과적으로 실행할 수 있도록 한다. 그렇기 때문에 0으로 설정한 timeout도 일정 시간 후에 실행되는 것이다. 이것은 setTimeout 뿐만 아니라 AJAX 등 다른 Web API도 동일하게 적용된다. 이 과정이 비동기 함수가 호출되는 방식이다.&nbsp;&nbsp;

> 출처

- [자바스크립트의 동작원리 : 엔진, 런타임, 호출 스택](https://joshua1988.github.io/web-development/translation/javascript/how-js-works-inside-engine/)
- [어쨌든 이벤트 루프는 무엇입니까?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
