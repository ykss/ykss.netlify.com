---
title: '(번역) CSS에서의 인라인 조건문?'
date: 2024-08-01 01:00:00
category: 'Translation'
draft: false
---

> 원문 : [Inline conditionals in CSS?](https://lea.verou.me/blog/2024/css-conditionals/)

#### 지난주, CSS WG는 CSS에 인라인 `if()`를 추가하기로 결의했습니다. 그렇다면 이게 무슨 의미이며, 왜 흥미로운 걸까요?

지난주 우리는 스페인 A Coruña에서 CSS WG 대면 회의를 가졌습니다. 그 회의에서 나온 결의 중 제가 특히 흥분한 것은 **CSS에 인라인 `if()`를 추가하기로 한 합의**입니다. 비록 제가 인라인 조건부 문법을 처음 제안한 것은 아니지만, 여러 가지 끝나지 않는 논의를 실제로 신속하게 구현할 수 있는 MVP로 범위를 좁히려고 노력했고, 구현자들과 아이디어를 논의한 끝에 [구체적인 제안](https://github.com/w3c/csswg-drafts/issues/10064)을 발표하고 그룹 결의를 추진했습니다. 관련 논의가 제 생일에 이루어져서, 어찌보면 가장 독특한 생일 선물로 `if()`를 받은 셈이라고 할 수 있습니다. 😀

이는 제안이 거부된다고 해서 해당 기능이 끝나는 것이 아님을 보여줍니다. 실제로 기능이 여러 번 거부되었다가 승인되는 경우는 사실 매우 흔합니다. CSS 중첩,
`:has()`, 컨테이너 쿼리는 모두 수없이 거부되었던 제안 중 마침내 채택된 제안일 뿐이었습니다. `if()` 자체도 2018년에 매우 유사한 문법으로 [거부된 바](https://github.com/w3c/csswg-drafts/issues/34550) 있습니다. 차이점은 무엇이었을까요? 스타일 쿼리가 이미 출시되었고, 우리는 조건에 동일한 문법을 참조할 수 있었습니다(또한 [Tab의 `@when` 제안](https://drafts.csswg.org/css-conditional/)에서 `media()` 및 `supports()`도 포함). 반면 2018년 제안에서는 조건이 어떻게 작동할지에 대해 대부분 정의되지 않았습니다.

저는 이 소식을 다양한 소셜 미디어에 게시했으며, 개발자들의 반응은 압도적으로 긍정적이었습니다.

- [트위터(X)](https://x.com/LeaVerou/status/1801192208025940200)
- [링크드인](https://www.linkedin.com/posts/leaverou_css-values-what-is-the-mvp-for-inline-activity-7206968267087745024-1Fns)
- [마스토돈](https://front-end.social/@leaverou/112608705600433866)

심지어 대기업에서 근무하는 친구들도 내부 슬랙이 난리가 났다고 저에게 말해주었습니다. 이것은 제가 항상 의심해왔고, CSS WG에 제기한 사례의 일부였던 **이 기능이 페인 포인트 였다는 것**을 증명합니다. 긍정적인 반응의 양과 강도가 브라우저가 이 기능을 우선순위에 두고 더 빨리 로드맵에 추가하는 데 도움이 되기를 바랍니다.

모든 플랫폼에서 *"이 기능이 출시되기가 너무 기다려져요!"*라는 의견이 가장 많았지만, 그 외에도 몇 가지 반복되는 질문과 혼란이 있어 다뤄보면 좋을 것 같습니다.

# FAQ

## `if()`는 무엇을 위한 것인가요? 스타일 쿼리를 대체하나요?

전혀 그렇지 않습니다. `if()`는 [스타일 쿼리](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries#container_style_queries_2)를 보완합니다. 스타일 쿼리로 할 수 있다면, 당연히 스타일 쿼리를 사용하세요. 스타일 쿼리가 확실히 더 나은 해결책일 것입니다. 하지만 스타일 쿼리로는 할 수 없는 일들도 있습니다. 제가 설명해 드리겠습니다.

대표적인 사례는 컴포넌트가(광범위한 의미에서) 종종 *더 높은 추상화 수준의 사용자 정의 속성*을 정의할 필요가 있다는 것입니다. 이러한 속성의 값은 선언에서 그대로 사용되지 않고, 다양한 선언에서 다른 값들을 설정하는 데 사용됩니다.

예를 들어, `--variant` 사용자 정의 속성([Shoelace의 `variant` 속성](https://shoelace.style/components/alert#variants)에서 영감을 받음)을 고려해보세요. 아래와 같습니다.

```scss
--variant: success | danger | warning | primary | none;
```

이 속성은 배경 색상, 테두리 색상, 텍스트 색상, 아이콘 등을 설정해야 합니다. 실제로 이 값은 어디에서도 그대로 사용되지 않고, 다른 값을 설정하는 _데만_ 사용됩니다.

스타일 쿼리를 사용하면 목표의 절반은 달성합니다.

```scss
.callout {
  /* 또는 쉐도우 DOM 내부라면 :host */
  @container (style(--variant: success)) {
    &::before {
      content: var(--icon-success);
      color: var(--color-success);
    }
  }

  /* (다른 variants) */
}
```

하지만 스타일 쿼리는 하위 요소에서만 작동합니다. 우리는 아래와 같이 할 수 없습니다.

```scss
.callout {
  @container (style(--variant: success)) {
    border-color: var(--color-success-30);
    background-color: var(--color-success-95);

    &::before {
      content: var(--icon-success);
      color: var(--color-success-05);
    }
  }

  /* (다른 variants) */
}
```

요소 자체에 설정해야 하는 선언은 매우 적으며, 때로는 단 하나만 필요할 때도 있습니다. 하지만 단 하나의 선언도 너무 많을 수 있어, 사용자 정의 속성을 많은 상위 수준 사용자 정의 속성 사용 사례에서 사용하기 어렵게 만듭니다. 결국 컴포넌트 라이브러리는 pill, outline, size와 같은 프레젠테이션 속성에 의존하게 될 수 있습니다.

**프레젠테이션 속성**은 처음에는 괜찮아 보이거나 DX 측면에서 더 나아 보일 수 있습니다(적어도 각 요소에 변수를 설정하는 것과 비교하면 문자 수가 적습니다). 하지만 여러 가지 사용성 문제를 가지고 있습니다.

- **유연성 감소**

프레젠테이션 속성은 선택자, 미디어 쿼리 등을 기반으로 조건부 적용이 불가능합니다. 이를 변경하려면 더 많은 자바스크립트 코드가 필요합니다. 만약 다른 컴포넌트들과 함께 이 방식을 사용한다면, 더 난감한 상황에 빠질 수 있습니다. 반면에, (상속 가능한) 사용자 정의 속성을 사용하면 부모 컴포넌트에 속성을 설정하고 하위 컴포넌트로 상속할 수 있습니다.

- **장황함**

프레젠테이션 속성은 개별 인스턴스에 적용되어야 하고 상속될 수 없습니다. 중복을 줄이기 위해 템플릿이나 컴포넌트화 같은 형태를 사용하더라도 디버깅 시 개발 도구에서 이러한 속성을 확인해야 합니다.

- **일관성 부족**

대부분의 성숙한 컴포넌트는 사용자 정의 속성도 지원하기 때문에, 사용자는 프레젠테이션 속성과 사용자 정의 속성으로 스타일링되는 부분을 각각 기억해야 합니다. 이 구분은 사용 사례가 아니라 구현의 편의성에 따라 임의적으로 결정됩니다.

`if()`를 사용하면 위의 예가 가능해지지만, 스타일 쿼리만큼의 편리함은 떨어집니다. 이는 계단식으로 사용할 수 없기 때문입니다 (다른 [IACVT](https://www.bram.us/2024/02/26/css-what-is-iacvt/) 선언과 함께 이를 가능하게 하는 [제안](https://github.com/w3c/csswg-drafts/issues/10443)이 있긴 합니다).

```scss
.callout {
  border-color: if(
    style(--variant: success) ? var(--color-success-30): style(
        --variant: danger
      )
      ? var(--color-danger-30): /* (다른 variants) */ var(--color-neutral-30)
  );
  background-color: if(
    style(--variant: success) ? var(--color-success-95): style(
        --variant: danger
      )
      ? var(--color-danger-95): /* (다른 variants) */ var(--color-neutral-95)
  );

  @container (style(--variant: success)) {
    &::before {
      content: var(--icon-success);
      color: var(--color-success-05);
    }
  }

  /* (다른 variants) */
}
```

이것이 주요 사용 사례였지만, 미디어 쿼리를 만들고 `if()`의 조건부 문법의 일부로 조건을 지원하는 것이 꽤 쉽다는 것이 밝혀졌습니다. 또한 이것은 함수이기 때문에 조건을 포함한 인자들을 다른 사용자 정의 속성에 저장할 수 있습니다. 이는 다음과 같은 작업이 가능함을 의미합니다.

```scss
:root {
  --xl: media(width > 1600px);
  --l: media (width > 1200px);
  --m: media (width > 800px);
}
```

그리고 다음과 같이 값을 정의할 수 있습니다.

```scss
padding: if(
  var(--xl) ? var(--size-3): var(--l) or var(--m) ? var(--size-2): var(--size-1)
);
```

자바스크립트의 삼항 연산자처럼, 값의 일부만 변하는 경우에는 더 나은 가독성을 제공할 수 있습니다.

```scss
animation: if(media(prefers-reduced-motion) ? 10s: 1s) rainbow infinite;
```

## 아직 브라우저에 적용되지 않았나요?

믿기 어렵겠지만, 제가 [실제로 받은 질문](https://twitter.com/activenode/status/1801203345257910470)입니다 😅. 아니요, 아직 브라우저에는 없습니다. 그리고 당분간은 도입되지 않을 것입니다. 가장 낙관적인 추정으로는 2년 정도 걸릴 것으로 보입니다. 개발 작업이 어느 순간 중단되지 않는다는 전제 하에 그렇습니다(종종 그렇듯이).

우리는 이제 기능에 대한 합의를 이룬 상태입니다. 다음 단계는 다음과 같습니다.

1. 기능의 *문법*에 대한 합의를 이끌어내야 합니다. 문법 논쟁은 모두가 의견을 가지고 있는 영역이기 때문에 시간이 오래 걸릴 수 있습니다. 현재 논쟁 중인 내용은 다음과 같습니다.

- 조건과 분기 사이에 사용할 구분자는 무엇인가요?
- 값을 나타내지 않는 방법은 무엇인가요? `var()`에서처럼 빈 값을 허용할 것인가요(예: `var(--foo,)`) 아니면 ["빈 값"을 의미하는 전용 문법을 도입할 것인가요?](https://github.com/w3c/csswg-drafts/issues/10441)
- 마지막 값은 선택사항으로 해야 할까요?

2. 기능을 명세화해야 합니다.

3. 첫 번째 구현을 얻어야 합니다. 종종 이것이 가장 어려운 부분입니다. 한 브라우저가 구현하면, 다른 브라우저가 동참하는 것이 훨씬 쉬워집니다.

4. 모든 주요 브라우저에 출시되어야 합니다.

저는 일부 표준 제안을 추적하는 [페이지](https://lea.verou.me/specs/)를 가지고 있으며, 이는 각 단계의 진행 상황이 어떻게 되는지 설명하는 데 도움이 될 것입니다. 사실, [`if()`의 진행 상황도 이곳에서 추적](https://lea.verou.me/specs/#if-mvp)할 수 있습니다.

> 정보 : 이 단계들은 반드시 순차적인 것은 아닙니다. 초기 버전을 명세화하고 나서 다른 문법에 대해 합의하고 명세를 업데이트하는 경우가 종종 있습니다. 때로는 브라우저가 초기 문법을 구현하고 나서 문법이 변경되어 구현을 변경해야 하는 경우도 있습니다(이는 [중첩](https://lea.verou.me/specs/#relaxed-css-nesting) 기능에서도 발생했습니다).

> 참고 : **이 작업이 더 빨리 일어나길 원하나요? `if()`에 대한 기대가 크고 감사함을 표현하고 싶나요? [Open Collective에서 제 웹 표준 작업을 후원해주세요(https://opencollective.com/leaverou/projects/standards-work)].** 이 블로그 글을 쓰면서 실험적으로 시작한 것이며, 많이 홍보할 계획은 없지만, 관심이 있으시면 참고해 보세요.

## CSS에서 첫 번째 조건부 문법인가요?

많은 반응이 "와, 드디어 CSS가 조건부 문법을 갖게 되었네요!"와 같은 반응이었습니다.

여러분… CSS는 처음부터 조건부 문법을 가지고 있었습니다. 모든 선택자는 기본적으로 조건문입니다!

이에 대해 추가적으로 말씀드려보겠습니다.

- `@media`와 `@supports` 규칙도 조건문입니다. 그리고 `@container`를 잊지 마세요.
- `var(--foo, fallback)`은 제한된 형태의 조건문입니다(기본적으로 `if(style(--foo: initial) ? var(--foo) : fallback)`과 같습니다). 따라서 인라인 조건문을 에뮬레이트하기 위한 대부분의 [해결 방법](https://github.com/w3c/csswg-drafts/issues/10064#issuecomment-2161742249)의 기초가 됩니다.

## 이것이 CSS를 명령형으로 만드나요?

널리 퍼진 오해는 비선형 로직(조건문, 반복문)가 언어를 명령형으로 만든다는 것입니다.

**선언형과 명령형의 차이는 로직이 아닌 추상화의 수준에 있습니다.** *목표*를 설명하나요, 아니면 목표를 달성하는 *방법*을 설명하나요? 요리 용어로, 레시피는 명령형이고, 레스토랑 메뉴는 선언형입니다.

조건부 로직은 의도를 더 잘 설명하는 데 도움이 된다면 언어를 _더_ 선언적으로 만들 수 있습니다.

다음 두 가지 CSS 코드 조각을 고려해 보세요.

#### 모양 토글

```scss
button {
  border-radius: calc(0.2em + var(--pill, 999em));
}

.fancy.button {
  /* pill 모양 켜기 */
  --pill: initial;
}
```

#### if()

```scss
button {
  border-radius: if(style(--shape: pill) ? 999em: 0.2em);
}

.fancy.button {
  --shape: pill;
}
```

후자가 목표를 달성하는 방법보다 목표를 지정하는 것에 훨씬 더 가깝다는 점에서 더 선언적이라고 주장하고 싶습니다.

## if가 CSS를 프로그래밍 언어로 만드나요?

매우 흔한 반응 중 하나는 CSS가 이제 프로그래밍 언어가 되었는지에 대한 질문 또는 주장이었습니다. 이를 답하기 위해서는 먼저 프로그래밍 언어가 *무엇*인지 답해야 합니다.

언어를 프로그래밍 언어로 만드는 것이 [튜링 완전성](https://en.wikipedia.org/wiki/Turing_completeness)이라면, [CSS는 10년 넘게 프로그래밍 언어였습니다](https://accodeing.com/blog/2015/css3-proven-to-be-turing-complete). 하지만 그렇다면 [엑셀이나 마인크래프트도 마찬가지입니다](https://en.wikipedia.org/wiki/Turing_completeness#Unintentional_Turing_completeness). 그렇다면 그게 무슨 의미가 있을까요?

만약 명령형이 기준이라면, CSS는 프로그래밍 언어가 아닙니다. 하지만 실제로 많은 프로그래밍 [언어들도 그렇지 않습니다](https://en.wikipedia.org/wiki/Declarative_programming)!

하지만 더 깊은 질문은 *왜 그것이 중요한가*입니다. CSS에 전문화하는 것을 정당화하기 때문인가요? HTML과 CSS만 작성해도 프로그래머로 간주될 수 있기 때문인가요? 이것이 시각적 측면의 문제라면, 우리는 CSS가 프로그래밍 언어인지 여부와 _상관없이_ CSS 전문성을 정당화하기 위해 싸워야 합니다. 여러 잘 알려진 프로그래밍 언어와 CSS를 알고 있는 사람이라면 누구나 증명할 수 있듯이, CSS는 _훨씬 더_ 마스터하기 어렵기 때문입니다.

---

이 모든 것이 훌륭하긴 하지만, 당분간 브라우저에 도입되지는 않을 것입니다. 지금 당장 무엇을 할 수 있을까요? 바로 그 점에 대해 쓴 [Part 2](https://lea.verou.me/blog/2024/css-conditionals-now/)가 있습니다. [CSS Conditionals, now?](https://lea.verou.me/blog/2024/css-conditionals-now/)

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
