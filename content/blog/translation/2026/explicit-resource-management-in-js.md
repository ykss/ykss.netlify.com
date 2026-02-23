---
title: '(번역) 자바스크립트의 명시적 리소스 관리'
date: 2026-02-26 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [Explicit resource management in JavaScript](https://allthingssmitty.com/2026/02/02/explicit-resource-management-in-javascript/)

자바스크립트에서 무언가(파일, 스트림, 락, 데이터베이스 연결 등)를 열 때는, 반드시 정리(cleanup)하는 것도 기억해야 합니다. 솔직히 말해서, 그 정리는 항상 이루어지지는 않습니다. 저 역시 한두 번이 아니라 여러 번 놓친 적이 있습니다.

자바스크립트는 항상 이 문제를 개발자의 책임으로 남겨두었습니다. 우리는 `try / finally`에 의존하고, 스스로 조심하겠다고 다짐하며, 혹시라도 예외 케이스를 놓치지 않았기를 바랄 뿐입니다. 대개는 동작하지만, 코드가 장황해지고 미묘하게 틀리기 쉬우며, 하나 이상의 리소스를 다루기 시작하면 확장성도 급격히 나빠집니다.

이제야 그 상황이 바뀌기 시작했습니다. 명시적 리소스 관리는 "이것은 반드시 정리되어야 하며, 런타임이 그걸 보장한다"라고 선언할 수 있는 1급(first-class) 언어 수준의 방법을 자바스크립트에 제공합니다.

관례나 패턴이 아니라, 언어 자체의 일부로 말이죠.

## 우리는 정리를 잘 못합니다 (그리고 언어도 돕지 않습니다)

아래 패턴은 익숙하게 느껴질 겁니다.

```js
const file = await openFile("data.txt");

try {
  // 파일로 무언가를 수행합니다.
} finally {
  await file.close();
}
```

이 코드는 괜찮습니다. 하지만 동시에 아래와 같은 특징을 가지고 있습니다.

- 장황합니다

- 반복적입니다

- 복잡도가 커질수록, 특히 리팩터링 중에, 쉽게 실수할 수 있습니다

이제 리소스를 *하나 더* 추가해 봅시다.

```js
const file = await openFile("data.txt");
const lock = await acquireLock();

try {
  // file과 lock으로 작업
} finally {
  await lock.release();
  await file.close();
}
```

이제 정리 순서가 중요해졌습니다. 에러 경로도 중요해졌습니다. 이 모든 것을 논리적으로 추론할 수는 있지만, 그에 따른 인지적 부담은 계속 쌓입니다. 그리고 그 부담이 커질수록, 버그도 따라오기 마련입니다.

다른 언어들은 이 문제를 수년 전에 해결했습니다. 자바스크립트는 (아주 천천히) 따라잡고 있는 중입니다.

> 📌 비동기를 더 깊이 파보기
> 루프 안에서의 `await`는 생각한 것과 다르게 동작하는 경우가 많습니다. [여기서부터 문제가 복잡해지기 시작합니다.](https://allthingssmitty.com/2025/10/20/rethinking-async-loops-in-javascript/)

## `using`: 정리하되, 런타임의 책임으로

개념적으로, `using`은 **스코프를 벗어날 때 자동으로 정리될 리소스를 선언합니다.**

코드로 보면 다음과 같습니다.

```js
using file = await openFile("data.txt");

// 파일로 무언가를 수행

// 파일은 이 스코프의 끝에서 자동으로 닫힙니다
```

`try`도 없고, `finally`도 없으며, “닫는 걸 잊지 않았나?”라는 걱정도 없습니다.

핵심적인 변화는 정리가 제어 흐름이 아니라 변수의 수명에 묶인다는 점입니다.

## 정리는 실제로 어떻게 동작할까요

리소스는 잘 알려진 심볼을 구현하는 방식으로 이 기능을 활성화(opt-in)합니다.

- `Symbol.dispose` — 동기식 정리

- `Symbol.asyncDispose` — 비동기식 정리

예를 들면 다음과 같습니다.

```js
class FileHandle {
  async write(data) {
    /* ... */
  }

  async [Symbol.asyncDispose]() {
    await this.close();
  }
}
```

값이 이 메서드 중 하나를 가지고 있으면 `using`과 함께 사용할 수 있습니다.

중요한 점은, `using`이 **파일을 “마법처럼” 닫아주는 것이 아니라,** 각 라이브러리가 제각각 구현하던 정리 방식을 표준화한다는 점입니다.

## `await using`이 필요한 경우

정리 작업이 비동기적인 경우, 일반적으로 `await using`을 아래와 같이 사용합니다.

```js
await using file = await openFile("data.txt");

// 파일로 비동기 작업
```

스코프가 끝나면 자바스크립트는 정리가 끝날 때까지 *기다린* 뒤 다음으로 진행합니다.

동기식 리소스(락, 메모리 내 구조체 등)는 일반 `using`을 사용할 수 있습니다. 처음에는 어색하게 느껴질 수 있지만, 이는 자바스크립트가 다른 곳에서도 동기와 비동기의 경계를 구분해 온 방식과 일치합니다. 중요한 건, 스코프 종료 시점에 정리가 보장된다는 것입니다.

> 📌 비동기를 고려한 설계
> `Array.fromAsync()`는 자바스크립트가 마침내 비동기를 1급 개념으로 다루기 시작했다는 신호 중 하나입니다. [현대적인 비동기 반복 처리 방식](https://allthingssmitty.com/2025/07/14/modern-async-iteration-in-javascript-with-array-fromasync/)에 대한 글을 참고하세요.

## 머리 아플 일 없이 리소스 쌓기

여기서부터 진짜 개선이 체감되기 시작합니다.

기존에는 이렇게 작성했습니다.

```js
const file = await openFile("data.txt");
const lock = await acquireLock();

try {
  // 작업 수행
} finally {
  await lock.release();
  await file.close();
}
```

이제는 이렇게 작성할 수 있습니다.

```js
await using file = await openFile("data.txt");
using lock = await acquireLock();

// 작업 수행
```

정리는 자동으로 수행되며, 스택처럼 *역순으로* 이루어집니다.

1. `lock`이 해제되고

2. `file`이 닫힙니다

추가적인 구문도 없고, 에러가 발생해도 정리가 중단되지 않으며, 정리 순서도 명확히 정의되어 있습니다.

## 핵심은 스코프입니다

`using` 선언은 `const`나 `let`과 마찬가지로 스코프를 가집니다.

```js
{
  await using file = await openFile("data.txt");
  // 파일은 여기서 유효합니다
}

// 파일은 여기서 정리됩니다
```

이는 자연스럽게 더 좁은 스코프로 유도하고, 자바스크립트가 역사적으로 표현하기 어려웠던 리소스의 수명을 코드 자체에 드러내도록 만듭니다. 코드에서 수명이 한 번 보이기 시작하면, 다시는 안 보이던 시절로 돌아가기 어렵습니다.

## `using`으로 부족할 때

모든 리소스가 블록에 깔끔하게 들어맞는 것은 아닙니다. 때로는 획득이 조건부이거나, 기존 코드를 리팩터링 하는 과정에서 새로운 스코프를 여기저기 추가하고 싶지 않을 수도 있습니다.

그럴 때를 위해 `DisposableStack`과 `AsyncDisposableStack`이 있습니다.

```js
const stack = new AsyncDisposableStack();

const file = stack.use(await openFile("data.txt"));
const lock = stack.use(await acquireLock());

// 파일과 락으로 작업

await stack.disposeAsync();
```

`using`과 동일한 안전성을 제공하면서 더 많은 유연성을 줍니다. `using`이 깔끔한 선언적 케이스라면, 스택은 탈출구에 해당합니다.

## 이것은 백엔드 전용 기능이 아닙니다

처음 보면 서버 사이드 기능처럼 느껴질 수 있지만, 프런트엔드나 플랫폼 코드에도 그대로 적용됩니다.

- Web Streams

- `navigator.locks`

- 옵저버와 구독

- IndexedDB 트랜잭션

`subscribe()` / `unsubscribe()` 또는 `open()` / `close()`를 써본 적이 있다면, 이 기능은 한 번쯤 눈여겨볼 만합니다.

이건 단순히 정확성의 문제가 아닙니다. 리소스의 수명을 관례나 주석에 숨기는 대신, **코드에서 드러내는 것에 관한 이야기**입니다.

## 한계는 무엇일까요?

2026년 초 기준으로, Chrome 123+, Firefox 119+, Node.js 20.9+에서 이 기능들이 모두 지원됩니다. **사파리 지원은 아직이지만,** 이미 로드맵에는 올라가 있습니다.

지금 당장 전면 도입하기보다는, 실험해 보거나, 특히 라이브러리나 플랫폼 수준의 추상화를 유지보수한다면 API 설계 단계에서부터 염두에 둘 만한 기능입니다. 당장 `using`을 쓰지 않더라도, 이 모델 자체는 충분히 주목할 가치가 있습니다.

## 정리를 위한 더 나은 기본값

명시적 리소스 관리는 `try / finally`를 대체하지 않습니다. 여전히 세밀한 제어가 필요할 때는 사용할 것입니다.

하지만 이 기능이 제공하는 것은 더 나은 기본값입니다. 보일러플레이트는 줄어들고, 누수는 줄어들며, 의도는 더 명확해지고, 코드 가독성도 훨씬 좋아집니다. 자바스크립트가 점점 더 시스템 수준의 책임을 떠안게 되는 지금, 이런 기능들은 있으면 좋은 것(nice-to-have)이 아니라 필수 요소(table stakes)처럼 느껴집니다.


<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
