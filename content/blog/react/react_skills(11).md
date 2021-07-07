---
title: '리액트 다루는 기술 정리 (11) - 코드 스플리팅'
date: 2021-07-08 01:00:00
category: 'React'
draft: false
---

프로젝트를 완성해서 제공할 때는 빌드를 거쳐서 배포해야 하는데, 빌드 작업을 진행할 때 JS 파일안에서 불필요한 주석, 공백 들을 제거해서 파일 크기를 최소화하고 문법도 원활하게 실행되도록 코드 트랜스파일 작업이 필요하다. 만약 프로젝트 내에 이미지 같은 정적 파일이 있으면 해당 파일을 위한 경로도 설정된다.

이 부분을 웹팩(Webpack)이 담당하는데, 웹팩에서 별도 설정을 하지 않으면 프로젝트에서 사용 중인 모든 자바스크립트 파일이 하나의 파일로 합쳐지고, 모든 CSS 파일도 하나의 파일로 합쳐진다. CRA로 프로젝트 빌드할 때도 최소 두 개 이상의 JS 파일이 생성되는데, CRA의 웹팩 설정에 SplitChunks라는 기능이 적용되어 node_modules에서 불러온 파일, 일정 크기 이상의 파일, 여러 파일 간에 공유된 파일을 자동으로 분리시켜서 캐싱의 효과가 있게 해준다.

```jsx
npm run-script build
```

![빌드 경로](<[https://ifh.cc/g/r4pyyB.jpg](https://ifh.cc/g/r4pyyB.jpg)>)

빌드한 후에 보면 build/static 경로에 자바스크립트 파일이 여러개 생성된 것을 볼 수 있다. 거기에 해시값이 포함되어 있는데, 이 해시 값을 통해 브라우저가 새로 파일을 받아야 할지를 판단한다. 2로 시작하는 파일은 라이브러리 관련 코드가 들어있는 것이고, main으로 시작하는 파일은 App과 같은 컴포넌트에 대한 코드가 들어가 있다. 그래서 2로 시작하는 파일이 비교적 긴 것을 확인 할 수 있다. SplitChunks라는 웹팩 기능을 통해서는 자주 바뀌지 않은 코드들인 2로 시작하는 파일들이 캐싱의 이점을 오래 누리는 것이 가능하다.

이렇게 파일을 분리하는 작업이 코드 스플리팅이다. 프로젝트에 기본적으로 제공되는 SplitChunks를 통한 코드 스플리팅은 단순히 효율적인 캐싱 효과만 제공한다. 만약 페이지가 A,B,C가 있으면 A에만 접근이 필요해도 main 파일에는 A,B,C 컴포넌트가 모두 저장되어버린다. 그럼 당장 접근하지 않는 컴포넌트 정보도 포함되어 파일크기가 커진다.

이러한 문제점을 해결할 수 있는 것이 코드 비동기 로딩이다. 이것 또한 코드 스플리팅 방법 중 하나이다.

## 19.1 자바스크립트 함수 비동기 로딩

import를 함수로 사용하면 Promise를 반환한다. import() 함수 형태로 메서드에 사용해서 빌드하면 파일을 main 파일안에 포함되지 않고 따로 분리시켜 저장한다. 그리고 실제 함수가 필요한 지점에 파일을 불러와서 함수를 사용할 수 있다. 이러한 문법이 dynamic import이다. 하지만 이것은 웹팩에서 제공하고있기 때문에 별도로 설정할 필요가 없다.

## 19.2 React.lazy와 Suspense를 통한 컴포넌트 코드 스플리팅

코드 스플리팅을 위해서 리액트에 내장된 유틸 함수인 React.lazy와 컴포넌트인 Suspense가 있다.

### 19.2.1 state를 사용한 코드 스플리팅

만약에 React.lazy 없이 컴포넌트 코드 스프리팅을 한다면 클래스형 컴포넌트로 전환해야 한다. 그리고 SplitMe 컴포넌트를 불러와 state에 넣어주고, state안의 SplitMe가 유효하면 해당 컴포넌트를 렌더링하는 방식으로 해야한다. state를 사용해서 컴포넌트 코드 스플리팅 하는 것은 어렵다기보다는 매번 state를 선언해주어야 하는 부분이 불편할 수 있다

### 19.2.2 React.lazy와 Suspense 사용하기

React.lazy와 Suspense를 사용하면 state를 따로 선언하지 않고 컴포넌트 코드 스플리팅이 가능하다. React.lazy는 컴포넌트를 렌더링하는 시점에서 비동기적으로 로딩할 수 있게 해주는 유틸 함수이다.

```jsx
const SplitMe = React.lazy(() => import('./SplitMe'))
```

Suspense는 리액트 내장 컴포넌트로 코드 스플리팅 된 컴포넌트를 로딩하도록 발동시킬 수 있다. 로딩이 끝나지 않았으 때 보여줄 UI도 설정할 수 있다.

```jsx
import React, { Suspense } from 'react'
;<Suspense fallback={<div> loading... </div>}>
  <SplitMe />
</Suspense>
```

위 코드에서 fallback props를 통해 로딩 중 보여줄 UI 설정이 가능하다.

### 19.2.3 Loadable Components를 통한 코드 스플리팅

Loadable Components는 코드 스플리팅을 돕는 라이브러리이다. 이 라이브러리의 장점은 서버 사이드 렌더링을 지원한다. (React.lazy와 Suspense는 지원x) 그리고 렌더링 전에 스플리팅된 파일을 미리 불러올 수도 있다.

서버 사이드 렌더링은 웹서비스의 초기 로딩 속도 개선, 캐싱 및 SEO(검색엔진 최적화)를 가능케해준다. SSR을 사용하면 초기 렌더링을 서버에서 처리해주는데 초기 로딩속도 개선 뿐만 아니라 검색엔진에서 크롤링하기도 좋아 검색엔진 최적화에 도움이 된다. 아래와 같이 적용할 수 있다.

```jsx
const SplitMe = loadable(() => import('./components/SplitMe'), {
  fallback: <div>loading...</div>,
})

function App() {
  const [visible, setVisible] = useState(false)
  const onClick = () => {
    setVisible(true)
  }
  const onMouseOver = () => {
    SplitMe.preload()
  }

  return (
    <div className="App">
      <CounterContainers />
      <hr />
      <TodosContainers />
      <hr />
      <SampleContainers />
      <p onClick={onClick} onMouseOver={onMouseOver}>
        코드 스플리팅
      </p>
      {visible && <SplitMe />}
    </div>
  )
}
```

컴포넌트를 미리 불러오는(preload)방법의 경우, 위와 같이 `preload()` 함수를 이벤트에 걸어놓으면 해당 태그나 버튼에 마우스를 올려 놓기만 해도 해당 컴포넌트를 미리 받아올 수 있기 때문에 렌더링에 더 적은 시간, 즉 로딩 시간을 줄일 수도 있어 사용성을 높여준다. 이밖에도 타임아웃이나 로딩 UI 딜레이 등 여러가지 기능을 제공한다.

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
