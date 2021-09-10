---
title: '[styling] Emotion.js 알아보기'
date: 2021-09-10 01:00:00
category: 'Web'
draft: false
---

`Emotion.js`는 스타일링을 위한 라이브러리로 CSS-in-JS 방식의 라이브러리 중 하나이다. CSS-in-JS 방식은 css 스타일시트를 따로 두지 않고 자바스크립트 코드 안에서 스타일링을 하는 방식을 말한다. emotion.js는 바닐라 자바스크립트와 같이 프레임워크를 사용하지 않는 환경이나, React와 함께 주로 사용된다.

> CSS-in-JS를 쓰려고 하는 이유는 1)컴포넌트로 만들어 재사용하기 위해, 2) 중복되는 className 문제를 해결하기 위해 (Global namespace), 3) 자바스크립트에서 쓰는 상수, props등을 공유하기 위해, 4) 미사용 코드 처리를 위해 등등 여러가지 장점이 있기 때문이다.

## 1. 설치

```bash
# Framework Agnostic
$ npm install @emotion/css

# React
$ npm install @emotion/react
```

## 2. 특징

일반적으로 `styled-component`를 사용한 적이 있다면 매우 유사한 방식이라고 할 수 있다. 그래서 차이점에 대해서 살펴보는게 중요한데 `emotion.js`에서는 `css prop`을 사용 가능하다. 이 기능을 통해서 기존에 정의한 컴포넌트 스타일을 쉽고 안전하게 확장할 수 있다. 이게 `styled-components` 라이브러리와의 차이라고 할 수 있겠다. `@emotion/styled`를 통해 스타일드 컴포넌트와 거의 동일한 방식으로 사용할 수 있는데다, `@emotion/core`를 통해 확장성 까지 있는 것이다.

```jsx
import styled from '@emotion/styled'

const DivStyle = styled.div`
  background-color: blue;
  font-size: 24px;
  border-radius: 4px;
  padding: 32px;
  text-align: center;
  &:hover {
    color: white;
  }
`

export default function App() {
  return <DivStyle>example</DivStyle>
}
```

위와 같이 스타일드 컴포넌트 처럼 쓸 수도 있지만, 상황에 따라 굳이 스타일드 컴포넌트를 만들 필요 없이 인라인으로 아래와 같이 css를 작성하는 것도 가능하다.

```jsx
<div css={css`
    width: 400px;
    background-color: #ffffff
`}>
```

이렇게만 보면 그냥 인라인 스타일링이랑 무엇이 다른지 싶겠지만, `emotion.js`의 css prop은 일반적인 inline style과는 다르다. media query(`@media`)를 쓸 수 있을 뿐만 아니라, pseudo selector나 nested selector(`{}`)도 사용 가능하다.

![labeling](https://cdn-images-1.medium.com/max/1600/1*McKlxIMuHFOWXY_tswRzDg.png)

다음으로 중요한 특징 중 하나가 바로 `emotion.js`에서는 labeling 기능을 제공한다는 것이다. 위 이미지처럼 스타일드 컴포넌트나 이모션으로 스타일링시에 class name을 자동으로 hash를 붙여 생성하여 겹치지 않게 해주는데, 이 부분이 디자이너와의 협업에서 문제가 되었다. 그래서 `emotion.js`에서는 라벨링 방식을 제공하여 협업 시 class name에 대한 문제를 해결 해주었다. 라벨링은 아래 코드와 같이 간단하게 지정 할 수 있다.

```jsx
let style = css`
    color: blue,
    label: blue-label
`

let secondStyle = css`
    color: black,
    label: black-label
`
```

위와 같은 방식이 아니더라도 `babel`과 함께 `babel plugin emotion`이라는 플러그인을 사용해서 `label-format`을 지정하여 자동으로 해결할 수도 있다. (`.babelrc` 파일에 설정) `[dirname]-[filename]--[local]`와 같은 형태로 설정하면 (코드의 위치 -- 파일이름 -- 변수명) 으로 자동 라벨링이 이루어진다.

```json
"plugins": [
    [
      "emotion",
      {
       "autoLabel": true
       "labelFormat": "[dirname]-[filename]--[local]",
      }
    ]
  ]
```

---

## 결론

나는 웹 개발시 주로 사용하던 `styled-components`를 사용했었는데, `emotion.js` 또한 매우 유사하기 때문에 러닝커브 없이 사용할 수 있는 점이 매력적으로 느껴졌고, 사실 처음에는 `next.js`와 `styled-component`를 같이 쓸 수 없다고 해서 불가피하게 써야되는줄 알았는데, 알아보니 쓸 수 있었다. 그래도 `emotion.js`가 같은 기능은 물론 추가로 더 많은 기능을 제공하고, 심지어 빌드했을 때 용량까지도 작다는 것을 보고 그럼 이왕이면 `emotion.js`를 사용하면 좋겠다는 생각을 했다. 여러 채용공고에서도 흔히 쓰는 걸 봤기 때문에, 역시 많이 쓰는 이유가 있는 것 같다.

---

출처 :

1. [https://ideveloper2.dev/blog/2019-05-05--thinking-about-emotion-js-vs-styled-component/](https://ideveloper2.dev/blog/2019-05-05--thinking-about-emotion-js-vs-styled-component/)

2. [https://brunch.co.kr/@kmongdev/17](https://brunch.co.kr/@kmongdev/17)
