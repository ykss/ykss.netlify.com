---
title: '(번역) 미래지향적 웹사이트를 구축하는 여러분이 몰랐던 7가지 자바스크립트 웹 API 🤯'
date: 2023-07-13 01:00:00
category: 'Translation'
draft: false
---

> 원문: [7 More JavaScript Web APIs to Build Futuristic Websites you didn't Know](https://dev.to/ruppysuppy/7-more-javascript-web-apis-to-build-futuristic-websites-you-didnt-know-50bg)

미래로 돌아온 것을 환영합니다! 이번 글은 **미래지향적인 자바스크립트 웹 API**에 대한 두 번째 글이므로, 첫 번째 글을 읽지 않으셨다면 [여기](https://dev.to/ruppysuppy/7-javascript-web-apis-to-build-futuristic-websites-you-didnt-know-38bc)에서 읽어보시길 권해드립니다.

프로젝트에 매력적인 기능을 추가하여 사용자들이 돈을 쓰게 만드는 7가지 **최신 자바스크립트 웹 API**를 소개합니다.💰

![](https://res.cloudinary.com/practicaldev/image/fetch/s--8x_6QI54--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_800/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/28v8agnp8wllf311j95w.gif)

## 1. Web Speech

> **Web Speech API**를 사용하면 음성 데이터를 웹 앱에 통합할 수 있습니다. **Web Speech API**는 두 부분으로 구성됩니다. `SpeechSynthesis`(**텍스트 음성 변환**)와 `SpeechRecognition`(**비동기 음성 인식**)입니다.

```js
// Speech Synthesis
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance('Hello World');
synth.speak(utterance);

// Speech Recognition
const SpeechRecognition =
  window.SpeechRecognition ?? window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.start();
recognition.onresult = event => {
  const speechToText = event.results[0][0].transcript;
  console.log(speechToText);
};
```

### 참고 사항

1. **Speech Synthesis**는 **96%의 커버리지**로 모든 주요 브라우저에서 지원되지만, **Speech Recognition**은 아직 **86%의 커버리지**로 프로덕션에서 사용하기에는 조금 이른 단계입니다.
2. **이 API는** 사용자 상호작용(예: `click`, `keypress` 등) 없이는 사용할 수 없습니다.

## 2. Page Visibility

**Page Visibility API**를 사용하면 페이지가 사용자에게 표시되는지 여부를 확인할 수 있습니다. 동영상을 일시 정지하려는 경우에 유용합니다.

사용자에게 페이지가 표시되는지 확인하기 위한 방법에는 두 가지가 있습니다.

```js
// 방법 1
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    document.title = 'Visible';
    return;
  }
  document.title = 'Not Visible';
});

// 방법 2
window.addEventListener('blur', () => {
  document.title = 'Not Visible';
});
window.addEventListener('focus', () => {
  document.title = 'Visible';
});
```

첫 번째 방법은 **다른 탭으로 전환할 때만** 트리거되는 반면, 두 번째 방법은 **다른 앱 또는 다른 탭으로 전환**할 때 트리거된다는 점에서 차이가 있습니다.

## 3. Accelerometer

**Accelerometer API**를 사용하면 기기의 **가속도 데이터**에 액세스할 수 있습니다.

이를 사용하여 **디바이스의 모션 컨트롤**을 사용하는 게임을 만들거나 **사용자가 디바이스를 흔들면 상호작용을 추가**할 수 있는 기능 등 무궁무진한 가능성을 제공합니다!

```js
const acl = new Accelerometer({ frequency: 60 });

acl.addEventListener('reading', () => {
  const vector = [acl.x, acl.y, acl.z];
  const magnitude = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
  if (magnitude > THRESHOLD) {
    console.log('I feel dizzy!');
  }
});

acl.start();
```

다음을 사용하여 **가속도계(Accelerometer)** 권한을 요청할 수 있습니다.

```js
navigator.permissions.query({ name: 'accelerometer' }).then(result => {
  if (result.state === 'granted') {
    // 이제 accelerometer API를 사용할 수 있습니다.
  }
});
```

## 4. Geo-location

**Geolocation API**를 사용하면 사용자의 위치에 액세스할 수 있습니다.

**지도** 또는 **위치 기반 서비스**와 관련된 애플리케이션을 개발하는 경우 매우 유용할 수 있습니다.

```js
navigator.geolocation.getCurrentPosition(({ coords }) => {
  console.log(coords.latitude, coords.longitude);
});
```

다음을 사용하여 **위치 정보(Geolocation)** 권한을 요청할 수 있습니다.

```js
navigator.permissions.query({ name: 'geolocation' }).then(result => {
  if (result.state === 'granted') {
    // 이제 geolocation API를 사용할 수 있습니다.
  }
});
```

## 5. Web worker

> **웹 워커**를 사용하면 웹 애플리케이션의 메인 실행 스레드와 분리된 백그라운드 스레드에서 스크립트 작업을 실행할 수 있습니다. 이 경우 복잡한 연산을 별도의 스레드에서 수행할 수 있어 메인(보통 **UI**) 스레드가 차단되거나 속도가 느려지지 않고 실행될 수 있다는 장점이 있습니다.

```js
// main.js
const worker = new Worker('worker.js');
worker.onmessage = e => console.log(e.data);
worker.postMessage([5, 3]);

// worker.js
onmessage = e => {
  const [a, b] = e.data;
  postMessage(a + b);
};
```

## 6.Resize Observer

**Resize Observer API**를 사용하면 요소의 크기를 관찰하고 변경 사항을 쉽게 처리할 수 있습니다.

**크기 조정이 가능한 사이드바**가 있을 때 매우 유용합니다.

```js
const sidebar = document.querySelector('.sidebar');
const observer = new ResizeObserver(entries => {
  const sidebar = entries[0];
  // 변화된 요소의 크기로 무언가를 수행하세요.
});
observer.observe(sidebar);
```

## 7. Notification

**Notification API**는 **사용자를 귀찮게 하는 작은 팝업** (또는 개인의 성향에 따라 다르게 느껴질 수 있는 **도파민 거품(bubbles of dopamine)**)입니다.

> 역자 주 : 도파민 거품(bubbles of dopamine)은 사용자가 더 많은 활동을 하고 시간을 소비하도록 유도하는 요소를 나타냅니다. 일부 사람에게는 유용하지만, 일부에게는 중독을 유발할 수 있습니다.

**Notification API**는 이름 그대로 사용자에게 알림을 보낼 수 있는 기능을 제공합니다 (**Page Visibility API**와 함께 사용하면 사용자를 더 귀찮게 할 수 있습니다 😈).

```js
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('Hi there!', {
      body: 'Notification body',
      icon: 'https://tapajyoti-bose.vercel.app/img/logo.png',
    });
  }
});
```

## 추가적인 참고 사항

위에서 언급한 **API** 중 일부는 아직 실험 단계에 있으며 모든 브라우저에서 지원되지 않습니다. 따라서 프로덕션 환경에서 사용하려면 브라우저에서 지원하는지 확인해야 합니다.

예를 들어 다음과 같이 확인할 수 있습니다.

```js
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  // Speech Recognition API가 지원되는 환경입니다.
}
```

여기까지입니다! 🎉

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
