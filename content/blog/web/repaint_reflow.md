---
title: 'Repaint, Reflow란?'
date: 2021-5-11 15:40:00
category: 'Web'
draft: false
---

웹 프론트엔트를 학습하다보면 Repaint와 Reflow라는 개념을 자주 접하게 된다. 그냥 단어를 보면 막연하게 뭔가 다시 그리고, 다시 흐르게 하는? 그런 어감인데 이것이 무엇이고, 프론트엔드 개념에서 왜 자주 등장하는지에 대해 알아보자.

## Reflow

리플로우(reflow)는 생성된 DOM 노드의 레이아웃 수치(위치, 높이, 너비 등)가 변경되었을 때, 발생하는 재배치라고 할 수 있다. 변경시 영향 받은 모든 노드의 수치를 계산해서 렌더 트리를 재 생성하는 것이다. 이 Reflow 과정을 마친 후에 재 생성된 렌더 트리를 다시 그리는데 그것이 리페인트(Repaint)이다.

리플로우가 발생하는 코드는 아래와 같다.

```javascript
function reflowExample() {
  document.querySelector('.box').style.width = '300px'
  return false
}
```

위와 같은 코드를 실행하면 처음에 발생한 이벤트에서 한번 더 수치 계산 - 레이아웃 재배치(Reflow) - Paint(repaint)가 일어난다.

## Repaint

위에서 본 것과 같이 Reflow가 발생할 때, 렌더 트리를 다시 그리는 Repaint가 일어난다고 했는데, 그렇다고 해서 Reflow가 발생할 때만 Repaint가 발생하는 것은 아니다. 레이아웃 수치에 영향을 주는 작업은 아니지만 `background-color`, `visibility` 등의 변경 시에는 레이아웃 수치가 변경되지 않았기 때문에 Reflow는 일어나지 않지만, Repaint는 발생한다.

```javascript
function repaintExample() {
  document.querySelector('.box').style.backgroundColor = 'blue'
  return false
}
```

위와 같은 코드를 이벤트로 실행시키게 되면 변경된 스타일 수치를 계산하는 재 계산 작업 - 렌더트리를 다시 그리는 Repaint 작업이 수행되게 된다.

## Reflow 개선점 찾기

Reflow가 일어나게 되면, 단순히 레이아웃 재배치만 일어나는 것이 아니라 Repaint의 작업까지 수행되기 때문에 반복적으로 발생되면 비효율을 초래하는 원인이 될 수 있다. 그렇기 때문에 Reflow 작업이 발생하는 코드는 최대한 마지막쯤에 배치해야 수행 비용을 최소화 할 수 있다. DOM 구조 상 끝단에 위치한 노드에 주도록 해야한다. 이러한 Reflow가 발생하는 경우는 대략 다음과 같다.

- 노드의 추가 또는 제거
- 요소의 위치 변경
- 요소의 크기 변경(margin, padding, border, width, height등)
- 폰트 변경 또는 이미지 크기 변경
- 페이지 초기 렌더링
- 윈도우 리사이징

효율성을 높이기 위해서는 애니매이션이 포함된 노드는 가급적이면 `position:fixed`와 `position:absolute`로 지정해서 전체 노드에서 분리 시켜야 한다. 이렇게 분리하게 되면 전체 노드에 거쳐서 Reflow 수행 비용이 드는 것이 아니고, 노드의 Repaint 부분만 발생하게 되기 때문에 더 효율적이라고 할 수 있다.

### 퀄리티와 성능은 Trade-Off 관계

결국은 애니매이션 효과들이 많아지면 퀄리티는 오를 수 있으나 퍼포먼스는 떨어질 수 밖에 없다. trade-off 관계라고 보면 된다. 그렇기 때문에 애니메이션 효과를 많이넣어서 무작정 이쁘고 현란하게 만드는 것이 꼭 좋은 것은 아니다.

### Reflow 줄이기

```javascript
const body = document.body
body.style.width = '50px'
body.style.height = '100px'

const body = document.body
body.style.cssText = 'width: 50px; heigh: 100px;'
```

위와 같은 코드를 아래와 같이 cssText 요소로 하면 reflow가 한번만 실행되게 된다.

사용하지 않는 노드에는 `visibility:invisible`보다 `display:none`을 사용하면 아예 레이아웃의 공간을 차지하지 않기 때문에 Reflow의 대상이 되지 않고 렌더 트리에서 제외된다.

이러한 Reflow와 Repaint를 일일히 줄이는 작업이 사실 번거롭고 쉽지 않기 때문에 그래서 요즘은 Virtual DOM을 많이 적용한다. 대표적으로 React가 그렇다. React를 이용하면 Virtual DOM에서 Reflow와 Repaint 필요한 것들을 묶어서 DOM에 전달하여 수행 횟수를 줄여서 성능을 개선시킬 수 있다. 이러한 부분은 추후 Virtual DOM에 대해서 더 심도있게 공부하면서 정리해야겠다.

---

> 참고 글

1. [Reflow or Repaint(or ReDraw)과정 설명 및 최적화 방법](https://webclub.tistory.com/346)
2. [브라우저 렌더링 과정 - Reflow Repaint, 그리고 성능 최적화](https://boxfoxs.tistory.com/408)
