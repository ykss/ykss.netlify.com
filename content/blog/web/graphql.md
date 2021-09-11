---
title: 'GraphQL 알아보기'
date: 2021-09-12 01:00:00
category: 'Web'
draft: true
---

최근 개발을 진행하다보면 GraphQL이라는 것을 자주 들어보게 되었다. 하지만 정작 `GraphQL`이 무엇인지는 알지 못하다보니 알아봐야 겠다는 생각이 들어서 이번 포스트를 통해 정리하고자 한다.

## 1. `GraphQL`이란?

`GraphQL`은 페이스북에서 만든 쿼리 언어이다. 아직 역사가 오래되지는 않았으나, 최근 인기가 매우 가파르게 상승하고 있다. 아래 트렌드를 보면 꾸준히 증가하고 있는 추세임을 알 수 있다.

![graphql](./images/graphql.png)

`GraphQL`(gql)은 SQL과 마찬가지로 쿼리언어이지만, sql과 gql은 구조부터 매우 다르고, 그 쓰임새도 또한 다르다. sql은 주로 데이터베이스에 저장된 데이터를 효율적으로 가져오는 것이 목적이지만, gql은 웹 클라이언트가 데이터를 서버로 부터 효율적으로 가져오는 것이 목적이다. sql의 경우, 주로 백엔드에서 많이 작성하여 사용되지만, gql의 경우 클라이언트 쪽에서 작성하여 사용한다. 아래는 sql과 gql의 예시이다.

```sql
SELECT * FROM example WHERE user_id in ('ykss');
```

```gql
{
  example {
    admin
    users {
      name
    }
  }
}
```

서버사이드 gql 앱은 gql로 작성된 쿼리를 입력으로 받아서 쿼리 처리 결과를 클라이언트로 돌려준다. HTTP API가 특정 DB나 플랫폼에 종속적이지 않은 것 처럼 gql도 또한 DB나 플랫폼에 종속되지 않는다. 그리고 네트워크 방식에도 종속적이지 않은데, 일반적으로는 HTTP POST와 웹소켓 프로토콜을 사용하지만, TCP/UDP를 활용하는 것 또한 가능하다.

![Graphql pipeline](https://miro.medium.com/max/1200/0*hSlFfFMBz18n2Y7E.png)

## 2. REST API와 비교

REST API의 경우, URL과 METHOD를 조합하여 요청하기 때문에 다양한 ENDPOINT가 존재한다. 하지만 이에 반해 gql은 단 하나의 ENDPOINT가 존재한다.

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
