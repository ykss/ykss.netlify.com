---
title: '(번역) 자바스크립트에서 긴 작업을 분할하는 다양한 방법'
date: 2025-03-04 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [There are a lot of ways to break up long tasks in JavaScript](https://macarthur.me/posts/long-tasks/)

> 이벤트 루프의 여러 틱에 걸쳐 길고 비용이 많이 드는 작업을 의도적으로 분할하는 것은 매우 일반적입니다. 하지만 선택할 수 있는 접근 방식은 매우 다양합니다. 몇 가지 방법을 살펴보겠습니다.

메인 스레드에서 길고 부하가 큰 작업을 실행하도록 두면 웹사이트의 사용자 경험을 쉽게 망칠 수 있습니다. 애플리케이션이 아무리 복잡하더라도 이벤트 루프는 한 번에 하나의 작업만 수행할 수 있습니다. 만약 코드가 메인 스레드에서 너무 오랫동안 실행되면 다른 모든 작업이 대기 상태가 되며, 사용자는 이를 금방 체감하게 됩니다.

예를 들어보겠습니다. 화면에 숫자를 증가시키는 버튼이 있고, 동시에 무거운 연산을 수행하는 커다란 반복문이 있다고 가정해 보겠습니다. 여기서는 단순히 동기적으로 대기하는 코드지만, 어떤 이유로든 반드시 메인 스레드에서 순차적으로 처리해야 하는 중요한 작업이라고 생각해 보겠습니다.

```jsx
<button id="button">count</button>
<div>Click count: <span id="clickCount">0</span></div>
<div>Loop count: <span id="loopCount">0</span></div>

<script>
  function waitSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  }

  button.addEventListener("click", () => {
    clickCount.innerText = Number(clickCount.innerText) + 1;
  });

  const items = new Array(100).fill(null);

  for (const i of items) {
    loopCount.innerText = Number(loopCount.innerText) + 1;
    waitSync(50);
  }
</script>
```

이 코드를 실행하면 화면에 아무런 변화도 나타나지 않습니다. 심지어 반복문이 몇 번 실행되었는지도 표시되지 않습니다. 이는 브라우저가 화면을 갱신할 기회를 얻지 못하기 때문입니다. 사용자가 버튼을 아무리 빠르게 클릭해도 반응이 없으며, 오직 반복문이 완전히 끝난 후에야 피드백을 받을 수 있습니다.

![카운트 버튼을 연타했을 때, 뒤늦게 나타나는 현상](https://picperf.io/https://cms.macarthur.me/content/images/2025/01/frozen-click.gif?sitemap_path=/posts/long-tasks)

개발자 도구의 플레임 차트(flame chart)를 보면 이러한 문제를 확인할 수 있습니다. 이벤트 루프에서 하나의 작업이 무려 5초 동안 실행되고 있습니다. 매우 심각한 문제입니다.

![개발자도구의 플레임 차트에서 확인할 수 있는 문제](https://picperf.io/https://cms.macarthur.me/content/images/2025/01/CleanShot-2025-01-31-at-01.55.04@2x.png?sitemap_path=/posts/long-tasks)

비슷한 상황을 경험해 본 사람이라면 큰 작업을 이벤트 루프의 여러 틱에 걸쳐 주기적으로 분할하는 것이 해결 방법임을 알고 있을 것입니다. 이렇게 하면 메인 스레드가 다른 중요한 작업(예: 버튼 클릭 처리, 화면 갱신 등)을 수행할 기회를 가질 수 있습니다. 우리는 현재 아래와 같은 긴 작업을 가지고 있습니다.

![이전의 상태](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/long-task.png?sitemap_path=/posts/long-tasks)

그리고 이 상태를 아래와 같은 상태로 바꾸기를 원합니다.

![이후의 상태](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/shorter-tasks.png?sitemap_path=/posts/long-tasks)

이를 해결할 방법은 의외로 다양합니다. 먼저, 가장 클래식한 방법인 재귀 호출을 활용하는 방식부터 시작하여 하나씩 살펴보겠습니다.

## #1. setTimeout() + 재귀 호출

네이티브 프로미스가 등장하기 전, 자바스크립트를 다뤄 본 사람이라면 아마 다음과 같은 코드를 본 적이 있을 것입니다. timeout 콜백을 이용해 함수가 스스로를 재귀적으로 호출하는 방식입니다.

```js
function processItems(items, index) {
  index = index || 0;
  var currentItem = items[index];

  console.log('processing item:', currentItem);

  if (index + 1 < items.length) {
    setTimeout(function() {
      processItems(items, index + 1);
    }, 0);
  }
}

processItems(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
```

이 방법은 지금도 여전히 유효합니다. 핵심 목표인 "각 항목을 다른 틱에서 처리하여 작업을 분산하는 것"이 제대로 수행되기 때문입니다. 다음은 400ms 동안의 플레임 차트입니다. 긴 작업 하나 대신, 여러 개의 작은 작업으로 분산된 것을 볼 수 있습니다.

![플레임 차트의 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/01/CleanShot-2025-01-31-at-02.06.48@2x.png?sitemap_path=/posts/long-tasks)

이렇게 하면 UI가 원활하게 반응할 수 있습니다. 클릭 이벤트 핸들러가 즉시 실행되고, 브라우저도 화면을 정상적으로 갱신할 수 있습니다.

![방법을 적용한 후의 예시](https://picperf.io/https://cms.macarthur.me/content/images/2025/01/responsive.gif?sitemap_path=/posts/long-tasks)

하지만 ES6가 등장한 지 10년이 지난 지금, 브라우저는 동일한 작업을 더 잘 수행할 수 있는 다양한 방법을 제공하며, 프로미스를 활용하면 코드도 훨씬 깔끔해집니다.

## #2. Async/Await & 타임아웃

이 조합을 사용하면 재귀 호출 없이 더 간결하게 처리할 수 있습니다.

```jsx
<button id="button">count</button>
<div>Click count: <span id="clickCount">0</span></div>
<div>Loop count: <span id="loopCount">0</span></div>

<script>
  function waitSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  }

  button.addEventListener("click", () => {
    clickCount.innerText = Number(clickCount.innerText) + 1;
  });

  (async () => {
    const items = new Array(100).fill(null);

    for (const i of items) {
      loopCount.innerText = Number(loopCount.innerText) + 1;

      await new Promise((resolve) => setTimeout(resolve, 0));

      waitSync(50);
    }
  })();
</script>
```

훨씬 깔끔합니다. 단순한 `for` 루프와 프로미스가 해결되길 기다릴 뿐입니다. 이벤트 루프에서의 실행 흐름도 기존 방식과 유사하지만, 빨간색 윤곽선으로 표시된 한 가지 중요한 차이점이 있습니다.

![플레임 차트의 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-01-at-19.57.46@2x.png?sitemap_path=/posts/long-tasks)

프로미스의 `.then()` 메서드는 항상 [마이크로태스크 큐(microtask queue)에서 실행](https://macarthur.me/posts/navigating-the-event-loop/?ref=cms.macarthur.me#the-microtask-queue)되며, 이는 호출 스택의 모든 작업이 끝난 후에 실행됩니다. 대부분의 경우 큰 차이를 만들지는 않지만, 차이를 알고 있는 것이 중요합니다.

## #3. scheduler.postTask()

[Scheduler 인터페이스](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler)는 비교적 새로운 기능으로, Chromium 브라우저에서 사용할 수 있으며, 더 정교하고 효율적으로 작업을 예약(scheduling)할 수 있도록 설계되었습니다. 기본적으로 우리가 수십 년 동안 `setTimeout()`에 의존해 왔던 것을 보다 개선한 버전이라고 볼 수 있습니다.

```js
const items = new Array(100).fill(null);

for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  await new Promise(resolve => scheduler.postTask(resolve));

  waitSync(50);
}
```

`postTask()`를 이용해 반복문을 실행하면 개별 작업 사이의 간격이 달라지는 점이 흥미롭습니다. 다시 400ms 동안의 플레임 차트를 살펴보겠습니다. 이전보다 훨씬 밀집된 형태로 실행되는 것을 확인할 수 있습니다.

![플레임 차트의 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-01-at-19.55.49@2x.png?sitemap_path=/posts/long-tasks)

`postTask()`의 기본 우선순위(priority)는 "user-visible"이며, 이는 `setTimeout(() => {}, 0)`과 유사한 우선순위를 가집니다. 아래 코드에서 실행된 순서를 그대로 반영하는 모습을 볼 수 있습니다.

```js
setTimeout(() => console.log('setTimeout'));
scheduler.postTask(() => console.log('postTask'));

// setTimeout
// postTask
```

```js
scheduler.postTask(() => console.log('postTask'));
setTimeout(() => console.log('setTimeout'));

// postTask
// setTimeout
```

하지만 `setTimeout()`과는 다르게, `postTask()`는 스케줄링을 위해 **만들어**졌기 때문에 타임아웃의 제약을 받지 않습니다. 게다가, 예약된 모든 작업은 항상 [태스크 큐(task queue)의 _가장 앞_](https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial?ref=cms.macarthur.me&hl=ko#enter_scheduleryield)에 배치되므로, 다른 항목이 먼저 실행되거나 실행이 지연되는 상황을 방지할 수 있습니다. 특히 빠르게 큐에 추가되는 작업에서 이러한 이점이 더욱 두드러집니다.

확신할 수는 없지만, `postTask()`가 단 하나의 목적을 위해 최적화된 기능이기 때문에 플레임 차트에서도 그 점이 반영되는 것 같습니다. 즉, `postTask()`로 예약된 [작업의 우선순위를 더욱 극대화하는 것](https://wicg.github.io/scheduling-apis/?ref=cms.macarthur.me#dom-taskpriority-user-blocking)도 가능합니다.

```js
scheduler.postTask(
  () => {
    console.log('postTask');
  },
  { priority: 'user-blocking' }
);
```

"user-blocking" 우선순위는 사용자 입력 처리와 같이 페이지에서 사용자의 경험에 중요한 작업을 위해 설계되었습니다. 따라서, 단순히 큰 작업을 나누는 용도로 사용하기에는 적절하지 않을 수 있습니다. 우리의 목표는 이벤트 루프에 적절히 제어권을 넘겨줘서 다른 작업이 실행될 수 있도록 하는 것입니다. 결국, 오히려 "background"를 사용하여 우선순위를 더욱 낮추는 것이 나을 수도 있습니다.

```js
scheduler.postTask(
  () => {
    console.log('postTask - background');
  },
  { priority: 'background' }
);

setTimeout(() => console.log('setTimeout'));

scheduler.postTask(() => console.log('postTask - default'));

// setTimeout
// postTask - default
// postTask - background
```

하지만 Scheduler 인터페이스에는 한 가지 단점이 있습니다. 아직 모든 브라우저에서 [널리 지원되지 않는다는 점](https://caniuse.com/mdn-api_scheduler)입니다. 다행히 기존의 비동기 API를 활용해 [폴리필(polyfill)을 제공하는 것도 가능](https://github.com/GoogleChromeLabs/scheduler-polyfill?ref=cms.macarthur.me)하므로, 최소한 일부 사용자들에게는 이점을 제공할 수 있을 것입니다.

### `requestIdleCallback()`는 어떤가요?

우선순위를 양보하는 것이 좋다면, `requestIdleCallback()`이 떠올랐을 수도 있습니다. 이 API는 브라우저가 "유휴(idle)" 상태일 때 콜백을 실행하도록 설계되었습니다. 문제는, 이 콜백이 언제 실행될지, 또는 실행될지조차 보장되지 않는다는 점입니다. 이를 해결하기 위해 호출될 때 `timeout`을 설정*할* 수도 있지만, 그럼에도 불구하고 [사파리는 이 API를 전혀 지원하지 않는다는 점](https://caniuse.com/requestidlecallback)을 감안해야 합니다.

게다가, MDN에서는 필수적인 작업의 경우 `requestIdleCallback()`보다 [timeout을 사용할 것을 권장](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)하고 있기 때문에, 개인적으로는 이 방법을 아예 피하는 것이 좋다고 생각합니다.

## #4. scheduler.yield()

Scheduler 인터페이스의 `yield()` 메서드는 지금까지 살펴본 다른 방법들보다 더 특별한 기능을 합니다. 바로 이런 시나리오를 위해 만들어졌기 때문입니다. [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield?ref=cms.macarthur.me)를 보면 다음과 같이 설명하고 있습니다.

> `Scheduler` 인터페이스의 `**yield()**` 메서드는 작업 도중 메인 스레드에 제어권을 넘기고, 이후에 우선순위가 지정된 작업으로 다시 실행을 계속하도록 합니다... 이를 통해 장시간 실행되는 작업을 나누어 브라우저의 반응성을 유지할 수 있습니다.

이 API를 처음 사용해 보면, 그 목적이 더욱 분명해집니다. 더 이상 직접 프로미스를 반환하고 해결할 필요가 없습니다. 제공된 프로미스를 await 하기만 하면 됩니다.

```js
const items = new Array(100).fill(null);

for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  await scheduler.yield();

  waitSync(50);
}
```

이 방법을 사용하면 플레임 차트도 더욱 깔끔해집니다. 실행 스택에서 불필요한 항목이 하나 줄어든 것을 볼 수 있습니다.

![플레임 차트의 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-01-at-23.16.01@2x.png?sitemap_path=/posts/long-tasks)

이 멋진 API는 다양한 상황에서 활용할 수 있을 것입니다. 예를 들어, `change`될 때 무거운 작업을 실행하는 체크박스를 생각해 보겠습니다.

```js
document
  .querySelector('input[type="checkbox"]')
  .addEventListener('change', function(e) {
    waitSync(1000);
  });
```

현재 상태에서는 체크박스를 클릭하면 UI가 1초 동안 멈추게 됩니다.

![체크박스 클릭 예시](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-02-at-16.44.42.gif?sitemap_path=/posts/long-tasks)

하지만 이제 클릭 후 즉시 제어권을 브라우저에 넘기면, UI가 클릭에 반응할 기회를 얻을 수 있습니다.

```diff
document
  .querySelector('input[type="checkbox"]')
  .addEventListener("change", async function (e) {
+    await scheduler.yield();

    waitSync(1000);
});
```

결과를 보면 알 수 있듯이, 훨씬 더 부드럽고 빠르게 반응합니다.

![적용 후 체크박스 클릭 예시](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-02-at-16.50.39.gif?sitemap_path=/posts/long-tasks)

다만, Scheduler 인터페이스의 다른 메서드와 마찬가지로 브라우저 지원이 부족한 것이 단점이지만, 간단한 폴리필로 해결할 수 있습니다.

```js
globalThis.scheduler = globalThis.scheduler || {};
globalThis.scheduler.yield =
  globalThis.scheduler.yield || (() => new Promise(r => setTimeout(r, 0)));
```

## #5. requestAnimationFrame()

`requestAnimationFrame()` API는 브라우저의 화면 갱신 주기와 동기화하여 작업을 예약하도록 설계되었습니다. 그렇기 때문에 콜백 실행 타이밍이 매우 정밀합니다. 콜백은 항상 다음 화면이 렌더링 되기 직전에 실행되므로, 아래 플레임 차트에서 볼 수 있듯이 개별 작업이 매우 밀집되어 실행됩니다. 애니메이션 프레임 콜백은 사실상 렌더링 단계의 특정 시점에 실행되는 [별도의 "큐"를 가지고 있기 때문에](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html?ref=cms.macarthur.me#list-of-animation-frame-callbacks), 다른 작업이 이를 방해하거나 순서를 바꾸는 것이 어렵습니다.

![플레임 차트 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-02-at-19.31.16@2x.png?sitemap_path=/posts/long-tasks)

그러나 화면 갱신 주기에 맞춰 무거운 작업을 실행하면 렌더링 성능이 저하될 수도 있습니다. 동일한 시간 동안의 프레임을 살펴보면, 노란색 줄무늬가 있는 섹션이 보입니다. 이는 "부분적으로 렌더링 된 프레임"을 나타냅니다.

![플레임 차트 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-02-at-19.32.39@2x.png?sitemap_path=/posts/long-tasks)

이런 현상은 이전의 다른 작업 분할 방법에서는 발생하지 않았습니다. 또한, 애니메이션 프레임 콜백은 탭이 활성 상태가 아니면 [보통 실행되지 않으므로](https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame?ref=cms.macarthur.me), 개인적으로는 이 방법을 피하는 것이 좋다고 생각합니다.

## #6. MessageChannel()

이 방법은 자주 사용되지는 않지만, 사용할 경우 보통 지연이 없는 timeout보다 가벼운 대안으로 선택됩니다. 브라우저에 타이머를 대기열에 넣고 콜백을 예약하도록 요청하는 대신, 채널을 인스턴스화하고 즉시 메시지를 게시하는 방식입니다.

```js
for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  await new Promise(resolve => {
    const channel = new MessageChannel();
    channel.port1.onmessage = resolve();
    channel.port2.postMessage(null);
  });

  waitSync(50);
}
```

플레임 차트를 보면, 성능 면에서 이 방법이 의미가 있을 수도 있습니다. 개별 작업 간의 지연 시간이 거의 없습니다.

![플레임 차트 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/CleanShot-2025-02-02-at-19.46.04@2x.png?sitemap_path=/posts/long-tasks)

하지만 이 방법의 (주관적인) 단점은 연결이 다소 복잡하다는 점입니다. 이를 위해 설계된 API가 아닌 것이 명확하기 때문에, 개인적으로는 선호하지 않는 방법입니다.

## #7. 웹 워커(Web Workers)

앞서 다른 방법들을 살펴보았지만, 메인 스레드에서 작업을 실행할 필요가 없다면, 웹 워커를 가장 먼저 고려해야 합니다. 기술적으로는 웹 워커 코드를 별도의 파일로 분리할 필요조차 없습니다.

```js
const items = new Array(100).fill(null);

const workerScript = `
  function waitSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  }

  self.onmessage = function(e) {
    waitSync(50);
    self.postMessage('Process complete!');
  }
`;

const blob = new Blob([workerScript], { type: 'text/javascipt' });
const worker = new Worker(window.URL.createObjectURL(blob));

for (const i of items) {
  worker.postMessage(items);

  await new Promise(resolve => {
    worker.onmessage = function(e) {
      loopCount.innerText = Number(loopCount.innerText) + 1;
      resolve();
    };
  });
}
```

개별 항목의 작업이 메인 스레드가 아닌 곳에서 실행될 때, 메인 스레드가 얼마나 깨끗하게 유지되는지 확인해 보세요. 모든 작업이 아래 "Worker" 섹션으로 이동하면서, 메인 스레드에는 다른 [작업을 수행할 여유](https://www.youtube.com/watch?v=ulwUkaKjgY0&ab_channel=Movieclips)가 충분히 생깁니다.

![플레임 차트 결과](https://picperf.io/https://cms.macarthur.me/content/images/2025/02/image.png?sitemap_path=/posts/long-tasks)

지금까지의 예제에서는 UI에서 진행 상황을 반영해야 했기 때문에 개별 항목을 워커로 보내고 응답을 기다리는 방식이었습니다. 하지만 전체 목록을 한 번에 워커로 전달할 수 있다면, 그렇게 하는 것이 더 효율적일 것입니다. 그러면 오버헤드도 더욱 줄일 수 있습니다.

## 어떻게 선택해야 할까요?

여기서 다룬 접근 방식이 전부는 아니지만, 긴 작업을 나눌 때 고려해야 할 다양한 트레이드오프를 잘 표현하고 있다고 생각합니다. 다만, 실제 필요에 따라 저라면 이 중 일부 방법만 선택해서 사용할 것 같습니다.

**메인 스레드가 아닌 곳에서 작업을 수행할 수 있다면,** 단연 웹 워커를 선택할 것입니다. 웹 워커는 브라우저 전반에서 매우 잘 지원되며, 메인 스레드의 작업을 분산시키는 것이 주된 목적입니다. 유일한 단점은 다소 불편한 API이지만, Workerize나 [Vite의 내장 워커 가져오기 기능](https://vite.dev/guide/features.html?ref=cms.macarthur.me#import-with-query-suffixes) 같은 도구를 사용하면 이를 쉽게 해결할 수 있습니다.

**작업을 간단하게 나누는 것이 목표라면,** `scheduler.yield()`를 사용할 것입니다. Chromium이 아닌 브라우저에서는 폴리필이 필요하다는 점이 아쉽긴 하지만, [대부분의 사용자](https://gs.statcounter.com/browser-market-share?ref=cms.macarthur.me)가 혜택을 받을 수 있기 때문에 그 정도 추가 작업은 감수할 수 있습니다.

**세밀한 작업 우선순위 제어가 필요하다면,** `scheduler.postTask()`를 선택할 것입니다. [원하는 만큼 최적화](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask?ref=cms.macarthur.me)할 수 있다는 점에서 인상적입니다. 이 API는 작업의 우선순위 조정, 지연 실행, 작업 취소 등 다양한 기능을 제공하지만, `.yield()`와 마찬가지로 현재로서는 폴리필이 필요합니다.

**브라우저 지원과 신뢰성이 최우선이라면,** `setTimeout()`을 선택할 것입니다. 새로운 대체 기술들이 등장하더라도, 사라질 일이 없는 전설적인 API이기 때문입니다.

## 제가 놓친 부분이 있을까요?

솔직히 말해, 여기서 다룬 방법 중 일부는 실제 애플리케이션에서 사용해 본 적이 없습니다. 따라서 어떤 부분은 놓쳤을 가능성도 있습니다. 이 주제에 대해 더 이야기할 수 있다면, 또는 특정 방법에 대한 추가적인 인사이트가 있다면, 자유롭게 의견을 나눠 주세요.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
