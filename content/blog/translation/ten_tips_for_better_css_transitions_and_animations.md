---
title: '(번역) 더 나은 CSS 트랜지션 및 애니매이션을 위한 10가지 팁'
date: 2023-05-04 02:00:00
category: 'Translation'
draft: false
---

> 원문: [Ten tips for better CSS transitions and animations](https://joshcollinsworth.com/blog/great-transitions)

> 이 글은 [CSS의 이징(easing) 및 큐빅 베지어(cubic-bezier) 커브 이해하기](https://joshcollinsworth.com/blog/easing-curves) 게시물에 대한 후속 글입니다.
> 
> 이 글을 보러 오셨거나 CSS `cubic-bezier` 커브에 대해 아직 잘 모르신다면 지금 바로 [해당 글을 읽어보시기 바랍니다.](https://joshcollinsworth.com/blog/easing-curves)

직감이 느껴지는 지점을 정확히 알 수 없거나 그 직감이 정확히 무엇인지 말로 표현할 수 없더라도 경험해 보면 알 수 있는 것들이 있습니다.

인테리어에 대해 아무것도 모르지만 잘 디자인된 공간에 있으면 그곳의 인테리어에 대한 느낌을 받을 수 있습니다.

마찬가지로, 어떤 앱이 다른 앱보다 더 나은 느낌을 주는 이유를 설명할 수 없더라도 좋은 앱과 나쁜 앱을 구분할 수 있습니다.

또한 사용자는 웹사이트와 앱의 트랜지션이나 애니메이션이 무엇인지 잘 모를 수도 있지만, 좋은 것과 나쁜 것의 차이를 예리하게 파악할 수 있습니다. 앱의 움직임이 좋을 때와 그렇지 않을 때를 직관적으로 알 수 있으며, 그 방법이나 이유를 설명할 수 없더라도 인상이 일반적이거나 세련되지 않다는 것을 알 수 있습니다.

따라서 이러한 느낌을 주는 요소에 대해 더 잘 이해하고, 자체 UI를 구축할 때 나쁜 느낌을 피하는 방법을 알아보기 위해 지난 10여 년 동안 웹에서 트랜지션과 애니메이션을 제작하면서 배운 내용을 정리했습니다.

> 참고 : 
>
> "트랜지션"과 "애니메이션"은 CSS에서 별개의 개념이지만 여기서는 "모든 종류의 움직임 또는 변화"라는 의미로 이 두 단어를 대부분 같은 의미로 사용하겠습니다.

<br/>
<br/>

## 1. 생각보다 짧게 작성하세요.

시간과 노력을 쏟아부어 멋진 트랜지션을 만들었다면 이를 즐기고 싶을 것입니다. 저를 비롯한 대부분의 개발자는 멋진 애니메이션을 감상하며 트랜지션이 왔다 갔다 하는 모습을 보며 즐거워할 수도 있습니다. 하지만 여기 문제가 있습니다.

잘못 개발된 움직임의 절대적인 단점 1순위는 *너무* 오래 지속된다는 점입니다.

사용자들은 여러분만큼 흥미를 느끼지 못하며, 따라서 인내심도 없습니다. 그들은 무언가를 완료하기 위해 웹사이트에 방문했으며, 아무리 멋진 기능이라도 필요 이상으로 오래 기다리는 것을 좋아하지 않습니다.

제 조언을 드리자면, 사용자가 놓칠 수 있을 정도로 짧지 않게 가능한 한 빠르게 트랜지션을 진행하세요. 경험상 대부분의 단일 트랜지션의 경우 150~400밀리초 범위(0.15~0.4초)에서 가장 잘 작동하는 것으로 나타났습니다. 예를 들어 한 요소가 사라졌다가 다른 요소가 나타나는 등 연속적인 트랜지션을 사용하는 경우에는 그 속도를 두 배로 늘리고 그 사이에 약간의 시간도 추가할 수 있습니다. (*두 개의* 개별 애니메이션이 동시에 나타나는 것은 원하지 않을 것입니다.)

*너무* 빠르다고 느껴질 때까지 계속 속도를 높인 다음 조금만 속도를 줄이세요.

하지만 항상 예외는 존재하며 페이지의 변화가 클수록 트랜지션을 더 눈에 띄게 만들어야 합니다. 예를 들어 카트에 있는 품목 수가 업데이트될 때 작은 애니메이션으로 강조하는 것과 전체 페이지가 트랜지션을 하는 것 사이에는 큰 차이가 있습니다. 큰 변화를 너무 빨리 지나치지 마세요.

마지막으로 한 가지 주의할 점은 **애니메이션의 지속 시간이 실제 지속 시간보다 짧게 느껴질 수 있다는 점**입니다. 매우 느린 이지 인(ease-in)으로 트랜지션을 시작하면 바로 시작되지 않은 것처럼 보일 수 있고, 반대로 긴 꼬리을 가진 트랜지션은 실제로는 끝나기 전에 이미 끝난 것처럼 보일 수 있습니다. 이 점을 염두에 
두세요. 인식은 현실이므로 코드의 기술적인 지속 시간보다 변화가 어떻게 느껴지는지가 더 중요합니다.

<br/>
<br/>

## 2. 커브를 동작에 맞추세요.

물론 이것은 말처럼 쉬운 일이 아닙니다. "좋아요, 하지만 주어진 상황에서 어떤 종류의 큐빅 베지어(cubic bézier) 커브를 사용해야 하는지 실제로 어떻게 *알 수 있나요?*"라고 말할 수 있습니다.

만족스럽지 못한 대답은 시행착오(경험이라고도 합니다)가 최고의 선생님이라는 것입니다.

움직임은 색상만큼이나 주관적이지만 그만큼 중요합니다. 웹사이트나 웹 앱의 느낌과 브랜딩의 핵심적인 부분이기 때문입니다.

하지만 한 가지 명심해야 할 요령이 있습니다. 실험할 때 실제 세계의 움직임을 떠올리고 이를 앱에서 작업 중인 움직임과 비교해 보세요. 이러한 트랜지션이 나타나고 제자리로 슬라이딩되는 것이 제대로 확인되나요? 그렇다면 열심히 일을 마친 보고자가 달려와 일을 끝냈다는 것을 알리는 것과 같이 빠른 속도의 인트로와 부드럽고 빠른 이지 아웃(ease-out)을 함께 사용하는 빠른 속도의 트랜지션을 사용해야 할 수도 있습니다.

화면에 실패 메시지가 표시되는 것은 어떨까요? 이 경우 약간의 주의를 끌기 위해 약간 느린 이징 커브가 필요할 수 있습니다.

즉시 알려야 하는 중요한 사항이라면 속도와 명확성을 최우선으로 고려할 수 있습니다. *매우* 중요한 내용이라면 흔들기와 같은 보다 적극적인 움직임을 통해 심각성을 전달하고 필요한 곳에 주의를 집중시킬 수도 있습니다.

따라서 제가 가장 추천하는 것은 시간을 투자하여 해당 동작이 적절한 *느낌*을 전달하는지 물어보는 것입니다. 이 움직임이 제품 또는 페이지의 브랜드와 일관성이 있나요?

만약 Pixar에서 여러분의 UI와 같은 동작을 수행하는 로봇을 애니메이션으로 제작한다면 어떻게 움직일까요?

<br/>
<br/>

## 3. 가속과 감속을 사용 하세요.

실제 세계에서는 어떤 유형의 움직임도 즉시 최대 속도로 점프하거나 순식간에 완전히 완전히 멈추는 경우는 거의 없습니다. 따라서 이러한 움직임을 만드는 커브를 피하면 UI가 좀 더 '진짜' 같고 직관적으로 보일 것입니다.

애니메이션이 뭔가 이상해 보인다면, 시작이나 끝이 부자연스럽게 갑작스럽기 때문일 가능성이 높습니다.

조금이라도, `cubic-bezier` 커브에 약간의 이지 인과 아웃을 추가하는 것이 좋습니다. 작지만 감지할 수 있는 약간의 가속 및/또는 감속이 부드러운 느낌의 트랜지션과 약간 어색한 느낌의 트랜지션의 차이를 만들 수 있습니다.

아래는 네 개의 사각형이 모두 한 바퀴 회전하지만 서로 다른 이징(easing)이 적용된 데모입니다.

<iframe height="300" style="width: 100%;" scrolling="no" title="CodePen Home Sudden animations demo" src="https://codepen.io/kurly-ksyu/embed/qBJNNBz?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/kurly-ksyu/pen/qBJNNBz">
  CodePen Home Sudden animations demo</a> by 유경상 kyeongsang.yu (<a href="https://codepen.io/kurly-ksyu">@kurly-ksyu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

위의 첫 번째와 두 번째 사각형은 너무 갑작스럽게 시작하거나 끝나는 것처럼 보입니다.

세 번째 "부드러운(smooth)" 옵션은 커스텀 커브가 부드럽게 들어오고 나가면서 가속 및 감속이 더욱 우아하게 움직이기 때문에 훨씬 더 잘 작동합니다.

실제 물리학이 적용된 듯한 애니메이션을 더 구현하고 싶다면 네 번째 '관성(inertia)' 옵션을 사용하면 마치 스프링에 의해 구동되는 것처럼 '와인드업(winds up)' 및 오버슈팅이 가능합니다. (이런 유형의 애니메이션에서는 조금만 추가해도 큰 효과를 얻을 수 있으니 참고하세요.) 

하지만 갑작스러운 시작과 멈춤에 대해 한 가지 중요한 점은 **사용자가 볼 수 없는 경우에는 괜찮다는 것**입니다. 해당 오브젝트가 페이드 인하는 경우 애니메이션의 시작을 애초에 인지할 수 없으므로 갑자기 시작해도 무방합니다.

그 반대도 마찬가지입니다. 요소가 `opacity: 0`으로 희미해지는 경우, 어차피 마지막에는 표시되지 않기 때문에 트랜지션 커브가 정확히 어떻게 끝나는지는 중요하지 않습니다.

<br/>
<br/>

## 4. 적은 것이 더 많은 것입니다.

이 팁의 대부분을 "적은 것이 더 많습니다"로 요약할 수 있습니다.

페이지의 모든 요소를 전부 애니메이션으로 만들어 넣고 싶은 유혹에 빠지기 쉽습니다. (저도 분명히 그런 적이 있습니다.) 하지만 개인 웹사이트라서 약간 과격하게 만들고 싶은 경우를 제외하고는, 너무 많은 움직임은 득보다 실이 많을 수 있습니다. CSS로 트랜지션할 때는 일반적으로 과장된 것보다는 절제된 것이 좋습니다.

애니메이션 중에 요소가 많이 바뀔수록 트랜지션이 과도하게 보일 위험이 있습니다.

`opacity`를 0에서 1로(또는 그 반대로) 애니메이션하는 경우, 0.4에서 1과 같이 더 작은 범위로 시도해 보세요. 요소가 전체 크기로 확장되는 경우, 보이지 않을 정도로 작게 만들지 말고, 시작할 때 너무 극적이지 않은 작은 변화를 시도해 보세요.

어떤 요소가 다른 자리로 이동하나요? 대부분의 경우, 이러한 움직임은 약 5~40픽셀 범위에서 이루어져야 합니다. 이보다 짧으면 움직임이 너무 미묘해서 눈치채지 못할 수 있고, 너무 길면 부드러운 슬라이드가 어색하게 느껴질 수 있습니다.

다음은 `opacity`, `translateY` 및 `scale`을 애니메이션하는 트랜지션의 예시입니다. 먼저 등장하지만 비교적 긴 애니메이션(주황색)과 조금 더 간소화하고 빠르게 표현한 애니메이션(파란색)을 비교해 보세요.

<iframe height="300" style="width: 100%;" scrolling="no" title="Big vs subtle animation" src="https://codepen.io/collinsworth/embed/abaqpRV?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/collinsworth/pen/abaqpRV">
  Big vs subtle animation</a> by Josh Collinsworth (<a href="https://codepen.io/collinsworth">@collinsworth</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

너무 많은 것을 하는 것은 아무것도 하지 않는 것보다 나쁠 수 있습니다. 따라서 트랜지션이 충분히 효과적일 수 있는 지점을 찾고, 그 이상 나아가야 한다면 신중하게 진행하세요.

<br/>
<br/>

## 5. 브라우저 기본값으로 설정하지 마세요.

브라우저에 `linear`, `ease`, `ease-in`, `ease-out`, 그리고 `ease-in-out`과 같은 몇 가지 기본으로 제공되는 이징 커브가 있다는 것을 이미 알고 계실 것입니다.

하지만 이 다섯 가지 타이밍 기능은 일부 상황에서 편리하고 유용하지만 매우 보편적이기도 합니다. (온라인 도구와 라이브러리에 내장된 애니메이션 중 상당수도 선택의 폭이 넓긴 하지만 동일한 표현방식에 빠지게 되기 쉽습니다).

움직임을 최대한 활용하고 싶다면, 가장 일반적인 기본적으로 명명된 옵션을 벗어나보는 것이 좋습니다.

[Bootstrap](https://getbootstrap.com/)이나 [Tailwind](https://tailwindcss.com/)를 기본값으로 사용하여 구축한 사이트가 일반적으로 보일 위험이 있는 것처럼, 일반적인 이징 커브는 UI를 단조롭고 획일적으로 보이게 만들 수 있습니다.

이에 대한 대안으로 VS Code에는 다양한 옵션이 있는 `cubic-bezier` 커브에 대한 놀라운 자동 완성 기능이 있습니다. CSS 컨텍스트에서 `cubic-bezier`를 입력하기 시작하면 다음과 같은 드롭다운이 표시됩니다.

![](https://joshcollinsworth.com/images/post_images/easing/vs-code.png)

이 모든 [프리셋을 살펴보고 사용해보고](https://joshcollinsworth.com/demos/easing) 싶으시다면 [제 이징 플레이그라운드](https://joshcollinsworth.com/demos/easing)에서 다루고 있습니다.

또 다른 훌륭한 옵션은 브라우저의 개발 도구를 열고 그 안에 있는 이징 커브를 사용해 보는 것입니다.

모든 주요 브라우저에는 다양한 옵션을 시도하고 조정할 수 있는 샌드박스로 사용할 수 있는 이징 패널이 있습니다. 이 패널에 액세스하려면 개발 도구를 열고 CSS 스타일 패널에서 `cubic-bezier` 값 옆에 있는 커브 아이콘을 클릭합니다. (아이콘은 다르지만 워크플로우는 기본적으로 모든 브라우저에서 동일합니다.)

![](https://joshcollinsworth.com/images/post_images/easing/firefox.png)

하지만 이징 커브를 어떻게 정의하든, 시간을 들여 미세하게 조정하는 것이 좋습니다. `cubic-bezier`를 사용하고 수정하는 것을 두려워하지 마세요.

브라우저 또는 VS Code의 프리셋을 활용하면 충분히 사용할 수 있습니다. 만약 키워드 값 대신에 `cubic-bezier`를 사용하고 있다면, 이미 게임에서 앞서가고 있는 것입니다.

여러분이 컬러 팔레트로 미리 정의된 CSS 네임드 컬러만 사용하도록 제한하길 원치 않을 것입니다. 따라서, 당신의 트랜지션 또한 소수의 미리 정의된 커브에만 제한되지 않기를 바랍니다.

<br/>
<br/>

## 6. 여러 프로퍼티와 여러 이징

이 기능이 항상 유용한 것은 아니지만, `transform`으로 항목의 크기를 조정할 때 `opacity`도 변경되는 경우처럼, 단일 요소에 한 번에 두 개 이상의 프로퍼티를 애니메이션하는 경우가 있을 수 있습니다.

다음과 같이 두 프로퍼티에 동일한 `cubic-bezier` 커브를 적용할 수 있습니다.

```css
/* ⛔ 좋지만 더 나아질 수 있습니다. */
.my-element {
  transition: all cubic-bezier(.5, 0, .5, 1) .5s;
}


/* ⛔ 이 또한 이상적이지는 않습니다. */
@keyframes scale_and_appear {
  from {
    opacity: 0;
    transform: scale(0);
  }
}

.my-element {
  animation: scale_and_appear 0.5s cubic-bezier(.5, 0, .5, 1) forwards;
}
```
경우에 따라서는 괜찮아 보일 수도 있습니다. 그러나 트랜지션되는 모든 프로퍼티에 대해 동일한 커브가 실제로 동작하지 않는 상황이 있을 수 있습니다.

`transform`에 잘 작동하는 이징 커브가 페이드에는 적합하지 않을 수 있습니다. 이럴 때는 CSS 프로퍼티별로 고유한 이징을 설정하는 것이 편리합니다.

이러한 경우 `@keyframes` 애니메이션을 속성별로 분할하거나 여러 `transition`을 지정할 수 있습니다. 그런 다음 `transition`과 `animation` 모두 여러 값을 허용할 수 있으므로 각 속성마다 다른 커브를 지정할 수 있습니다.

```css
/* 👍 각 속성에 고유한 커브가 있기 때문에 더 좋습니다. */
.my-element {
  transition: 
    opacity linear .5s,
    transform cubic-bezier(.5, 0, .5, 1) .5s;
}


/* 👍 두 개의 애니메이션을 사용하여 둘 다 적용합니다. */
@keyframes scale {
  from { transform: scale(0); }
}

@keyframes appear {
  from { opacity: 0; }		
}

.my-element {
  animation:
    scale 0.5s cubic-bezier(.5, 0, .5, 1) forwards,
    appear 0.5s linear forwards;
}
```

다음은 데모입니다. 상자가 번갈아 가며 들어오고 나갈 때 왼쪽 사각형의 `opacity`와 `scale`이 동일한 가속도를 따르는 것을 볼 수 있습니다. 그러나 오른쪽에서는 `opacity`가 고유한 선형 커브를 따릅니다.

<iframe height="300" style="width: 100%;" scrolling="no" title="Varying easings per property" src="https://codepen.io/collinsworth/embed/NWLdLGW?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/collinsworth/pen/NWLdLGW">
  Varying easings per property</a> by Josh Collinsworth (<a href="https://codepen.io/collinsworth">@collinsworth</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

어느 것이 더 낫나요? 글쎄요, 그것은 여러분이 원하는 효과가 무엇인지에 따라 다릅니다.

다시 말하지만, 이 기능은 자주 사용되지는 않지만 매우 편리하고 잊어버리기 쉽기 때문에, 이번 목록에서 한 자리를 차지했습니다.

각 프로퍼티의 지속시간을 변경할 수도 있지만, 엉뚱하게 설정하여 각 프로퍼티가 동기화되지 않도록 조심해야 합니다.

<br/>
<br/>

## 7. 엇갈린 지연(staggered delay)을 사용하세요.
---


> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(<https://kofearticle.substack.com/>)을 구독해주세요!
