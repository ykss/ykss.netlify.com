---
title: '웹 워커(Web Worker) : 자바스크립트를 멀티쓰레드로 사용하는 방법'
date: 2021-06-02 01:00:00
category: 'Javascript'
draft: false
---

자바스크립트를 사용하는 사람들이 대부분 알고 있듯이 자바스크립트는 싱글 쓰레드언어이다. 그렇기 때문에 HTML 페이지에서 스크립트를 실행할 때, 스크립트를 실행하는 동안 스크립트가 완료될 때 까지 응답하지 않는다. 이것을 해결하기 위한 것이 웹 워커(Web Worker)이다. 웹 워커를 사용하면 로드하고 있는 페이지에 영향을 주지 않으면서 독립적으로 스크립트를 실행시킬 수 있다. 웹 워커가 등장하기 전까지는 멀티쓰레드가 불가하여 작업이 끝나기 전까지는 UI가 멈춰있는 경우가 발생했지만, 웹 워커를 통해 멀티쓰레딩이 가능해지면서 이와 같은 상황의 해결이 가능해졌다.

먼저, 브라우저 별로, 또는 버전에 따라서 웹 워커를 지원하지 못할 수도 있다. 그렇기 때문에 웹 워커를 사용할 때는 코드에서 웹 워커를 사용가능한지 체크하는 로직을 꼭 넣어줘야 한다. 실제로 IE7이나 IE8과 같은 환경에서는 사용이 불가하다.

```javascript
if (window.Worker) {
  //웹 워커를 사용가능 할 때의 부분
} else {
  //웹 워커 사용이 불 가능 할 때의 부분
}
```

## 웹 워커 사용 예시

웹 워커는 주로 매우 큰 문자열의 암/복호화시에 사용되거나, 복잡한 수학 계산, 매우 큰 배열의 정렬 등 시간이나 계산이 많이 소요되는 부분에 쓰인다. 즉, 로딩과 실행이 오래 걸리는 자바스크립트 파일에 쓰인다고 할 수 있다.

웹 워커를 테스트 해보기 위한 코드는 아래와 같다. 일단 웹 워커를 생성하여 사용할 html은 아래와 같다. 시작을 누르면 웹 워커를 생성하여 동작을 시작하고, 종료를 누르면 웹 워커를 종료하고 제거하는 간단한 코드이다.

```html
<body>
  <h1>웹 워커 테스트</h1>
  <div id="container"></div>
  <script>
    var w

    function startWorker() {
      if (window.Worker) {
        w = new Worker('example_workers.js')
        w.onmessage = function(res) {
          document.getElementById('container').innerHTML = res.data
        }
      } else {
        alert('Web worker를 지원하지 않는 브라우저 입니다!')
      }
    }

    function endWorker() {
      w.terminate()
      w = undefined
    }
  </script>
  <button type="button" onclick="startWorker()">시작</button>
  <button type="button" onclick="endWorker()">종료</button>
</body>
```

그리고 위에서 웹 워커로 생성하여 쓰는 코드는 `example_workers.js`이며 아래와 같다.

```javascript
function timedCount() {
  postMessage(new Date().toLocaleString())
  setTimeout('timedCount()', 1000)
}

timedCount()
```

위 코드와 같이 웹 워커가 쓰이는 방식은 워커를 생성하여 메시지를 기다리거나 받을 수 있고, 해당 메시지에 따라 워커가 동작을 수행하고 수행 결과를 전달하게도 할 수 있으며, 워커의 응답을 가지고 동작을 수행할 수도 있다. `onMessege` 같은 경우 이벤트 핸들러라고 볼 수 있고, 코드에서 웹워커에 응답을 보내는 `postMessage()`의 경우, 말그대로 작업을 처리한 후에 작업 결과를 보내는 메서드로 String, Integer, Boolean, null, undefined, Object, Array 타입을 메시지로 전달 할 수 있다. 그리고 워커 사용을 마치고 종료할떼는 `terminate()`를 통해 종료해야 한다.

![웹워커](https://ifh.cc/g/dwMER6.png)
위 코드를 실행한 결과, 1초마다 웹 워커의 실행응답에 따라 현재 시간을 출력한다. 만약에 웹 워커를 사용하지 않을 경우, 브라우저는 1초단위로 멈추지만 웹 워커를 사용하면 멈춤 없이 사용할 수 있다.

## 웹 워커의 스코프(Scope)

웹 워커의 경우, main thread와 다른 별도의 worker thread를 가지기 때문에 다른 스코프를 가진다. main 쓰레드에서는 window가 글로벌 스코프이지만, 워커 쓰레드에서는 `WorkerGlobalScope`를 가진다. 그렇기 때문에 워커 쓰레드에서는 window나 DOM 조작이 불가하다. `WorkerGlobalScope`에 접근하기 위해서는 `self`를 통해 접근 가능하다.

```javascript
self.onmessage = () => {}
```

## 결론

웹 워커에 대해서 간단히 알아봤지만, 정말 간단히 사용하는 법만 알아본 것이고, 실제로는 더 복잡하고 딥하게 사용되는 경우가 많다고 한다. 내가 웹 워커를 쓸 경우는 아직 없었지만, 웹 워커에 대해 알고있으니, 혹시 자바스크립트에서 많은 계산이 필요한 경우나 멀티쓰레딩이 필요한 경우에는 활용할 수 있을 것 같다.

---

> 출처

- [웹워커:멀티쓰레드](https://realmojo.tistory.com/109)
- [웹에서 멀티쓰레드 구현하기](https://boxfoxs.tistory.com/294)
- [웹 워커 간단하게 정리하기](https://pks2974.medium.com/web-worker-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-4ec90055aa4d)
