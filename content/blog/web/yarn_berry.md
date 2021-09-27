---
title: 'Yarn berry는 무엇일까?'
date: 2021-09-27 01:00:00
category: 'Web'
draft: false
---

최근 기업들의 공고를 보면 기술 스택에서 yarn berry를 심심찮게 볼 수 있었다. 보통 `yarn`은 `npm`과 함께 패키지 관리 도구로 양대산맥을 이루고 있기 때문에 알고있지만, `yarn berry`에 대해서는 아직 알지 못하기 때문에 한번 이번 기회에 어떤 것인지 정리하고 어떤 부분 때문에 요즘 잘 쓰이고 있는지 간결하게 정리해보고자 한다.

## 1. yarn berry가 등장한 배경

yarn berry라고 불리지만 사실은 yarn v2라고 할 수 있다. 일단 yarn berry에 대해서 알기 위해서는 왜 기존에 npm과 yarn(v1)이 있는데 yarn berry가 등장했는지를 살펴봐야 한다. 기존 npm의 문제점을 먼저 살펴보면 아래와 같다.

- lock 파일이 없어 생기는 패키지의 버저닝/의존성 이슈가 존재

- 보안 이슈가 존재

- 패키지가 늘어날수록 성능 저하 발생

이러한 문제점들이 있었기 때문에, 새로운 패키지 매니저인 yarn이 등장하였다. yarn은 npm의 위와 같은 문제점들을 보완하기 위해 아래와 같은 특징들을 가지고 있었다.

- yarn.lock 파일 자동 생성, 체크썸을 통해 어떤 환경이든 동일한 패키지 설치 지원

- 의존성 트리 이슈는 lock파일과 알고리즘을 통해 개선

- 패키지 병렬 설치를 통한 성능 개선

- 캐시 디렉터리(cache directory)를 통한 오프라인 미러링과 [left-pad](https://www.bloter.net/newsView/blt201604040002) 이슈 방지

이렇게 yarn은 여러가지를 보완하여 나왔지만 여전히 yarn과 npm의 공통적인 문제점들이 남아있었다.

#### 1. node_modules의 거대함

![node_modules](https://miro.medium.com/max/700/0*ZrqQa2lkiXDmXvLN.png)

node_modules의 depth와 용량은 간단한 패키지 몇개의 설치만으로도 매우 커지게된다. 만약 `next.js`같은 프레임워크나 라이브러리를 사용하게된다면, node_modules는 기가 단위의 용량을 사용할 수도 있게 무거워진다. 거기에 depth는 점점 깊어져 삭제, 수정, 실행등의 속도에 영향을 끼치게 된다.

NPM은 패키지를 찾기 위해 상위 디렉토리의 node_modules 폴더를 탐색하기 때문에 패키지를 찾지 못할 수록 I/O속도는 느려진다. 패키지를 찾지 못하면 상위 디렉터리의 node_modules를 계속 검사하는 것이다.

#### 2. 유령 의존성(Phantom Dependency)

![유령 의존성](https://miro.medium.com/max/700/0*dBcvEKcuTdmiUGfA.png)

hoisted 되면서 설치한적이 없는 패키지를 사용할 수 있게 되는 것이 유령 의존성이다. 이런 이슈는 `package.json`을 통해 설치 되지 않은 패키지를 사용할 수 도 있고, 삭제할 때도 사용하던 패키지를 사용할 수 없게 되기도 한다. 개발 과정에서 이러한 이슈로 많은 시간이 낭비되기도 한다. 뿐만 아니라 패키지를 삭제할 때 의존성을 정확히 파악하기 어려워서 삭제를 못하거나 버전 업그레이드가 어려워지는 상황도 많이 일어난다.

## 2. yarn berry는?

위와 같은 공통적인 문제를 가지고 있던 상황에서 2018년 yarn berry가 등장했다. yarn berry(v2)에서는 pnp(plug'n'play)라는 개념을 도입해서 여러 이슈들을 해결해주었다. yarn v2에서는 비효율적인 node_modules 대신 `.pnp.cjs`라는 파일을 생성한다. 그리고 해당 파일은 아래와 같은 포맷을 가진다. 패키지 이름과 버전, 패키지의 실제 위치를 담은 맵과, 패키지 이름, 패키지 버전 그리고 패키지의 종속성을 담은 맵은 저장한다.

```js
["@ant-design/react-slick", [ //패키지 이름
  ["npm:0.28.3", { //패키지 버전
    //패키지 경로
    "packageLocation": "./.yarn/cache/@ant-design-react-slick-npm-0.28.3-ece1f2feb7-887cb395bd.zip/node_modules/@ant-design/react-slick/",
    "packageDependencies": [ //패키지 종속성
      ["@ant-design/react-slick", "npm:0.28.3"],
      ["@babel/runtime", "npm:7.14.6"],
      ["classnames", "npm:2.3.1"],
      ["json2mq", "npm:0.2.0"],
      ["lodash", "npm:4.17.21"],
      ["resize-observer-polyfill", "npm:1.5.1"]
    ],
    "linkType": "HARD",
  }]
]],
```

이렇게 `.pnp.cjs` 파일을 사용하는 것은 여러가지 이점을 가지고 있다.

- `.pnp.cjs` 파일 하나만 생성하여 설치가 빨라진다.

- disk I/O 사용이 줄어들어 안정적인 설치가 가능하다.

- 종속성 트리의 최적화 및 예측가능한 패키지를 인스턴스화한다.

- repository에 `.pnp.cjs`를 커밋할 수 있고, 다른 곳에서도 `yarn install`을 할 필요가 없다. (zero-install)

- 프로그램의 빠른 시작이 가능하다. (node resolution의 파일시스템 순회가 빨라진다.)

- 의존성 끌어올리기(hoisting)을 하지 않아서 유령 의존성 현상을 막을 수 있다.

- zip 파일을 통해 패키지를 관리해서 빠진 의존성을 찾거나 변경된 것을 찾기 쉽다. 의존성 문제를 손쉽게 해결 가능하다.

> Zero-installs를 사용했을 때, node_modules가 1.2GB 크기의 13만 5천개 파일로 구성되어있는 반면 Yarn PnP는 139MB의 천개 파일로 구성된다.

이러한 점 때문에 결과적으로 배포 시간을 단축시키는데 도움이 될 수 있다.

## 3. 사용법

yarn이 설치되었다는 가정하에 먼저 아래와 같이 yarn의 버전을 berry로 변경한다.

```bash
yarn set version berry
```

이렇게 하고 기존과 같이 `yarn install`을 해주면 node_modules가 사라지고 `.yarn`이라는 폴더가 생긴다. 그리고 그안에 패키지 정보를 담고 있는 `.pnp.cjs` 파일이 생기고 `cache` 디렉토리에 package들이 zip파일로 압축되어 있다.

---

출처 :

1. [node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)

2. [yarn berry 적용기(1)](https://medium.com/wantedjobs/yarn-berry-%EC%A0%81%EC%9A%A9%EA%B8%B0-1-e4347be5987)
