---
title: '(번역) Jest, React 및 Typescript를 사용한 단위 테스트'
date: 2022-09-22 01:00:00
category: 'Translation'
draft: false
---

> 원문: [Unit testing with Jest, React, and TypeScript](https://harshal0902.hashnode.dev/unit-testing-with-jest-react-and-typescript#heading-automated-testing)

## 💡 소프트웨어 테스트는 무엇인가요?

![](http://www.abstracta.us/wp-content/uploads/2016/09/giphy-48.gif)

소프트웨어 테스트(Software Testing)은 소프트웨어 애플리케이션이나 제품이 의도된 대로 작동하는지 평가하고 확인하는 과정입니다. 테스팅을 통해 버그 방지, 개발 비용 절감, 성능 향상 등에 장점을 얻을 수 있습니다.

소프트웨어 개발자로서 최종 사용자를 염두에 두고 테스트를 실행하고, 사용자가 사용하는 것과 동일한 방식으로 애플리케이션을 테스트 함으로써 프로그램이 실패할 가능성을 낮추는 것은 중요합니다.

## 🤔 왜 테스트를 작성해야 하나요?

- 좋은 테스트 커버리지를 보장합니다.
- 유지보수 비용과 소프트웨어 지원 비용 절감시킵니다.
- 테스트 케이스를 재사용할 수 있습니다.
- 소프트웨어가 최종 사용자의 요구사항을 충족시키는지 확인할 수 있습니다.
- 소프트웨어의 품질과 사용자 경험을 향상합니다.
- 더 높은 품질의 제품은 더 많은 고객 만족으로 이어집니다.
- 더 많은 고객 만족은 기업의 이익을 증가시킵니다.

## 🤖 자동화된 테스팅

자동화된 테스팅은 사전에 준비된 테스트 스크립트를 실행하는 장치에 의해 수행됩니다. 이러한 테스트는 클래스의 단일 메서드를 검사하는 것부터 일련의 복잡한 UI 작업 수행에 있어 동일한 결과가 나오는지 검증하는 것까지 복잡성이 훨씬 다양할 수 있습니다. 이것은 수동 테스트보다 더 강력하고 신뢰할 수 있습니다.

## 🖥 테스팅의 종류

### 1) 단위 테스트(Unit Testing)

단위 테스트는 매우 기본적이며 애플리케이션의 소스 코드에서 수행됩니다. 이러한 테스트는 소프트웨어의 메서드와 함수에서 사용하는 각 클래스, 컴포넌트 또는 모듈을 테스트하는 작업이 수반됩니다. 지속적 통합 서버는 비교적 저렴한 비용으로 매우 빠르게 단위 테스트를 수행할 수 있습니다.

### 2) 통합 테스트(Integration Testing)

통합 테스트를 통해 애플리케이션의 다양한 컴포넌트나 서비스가 제대로 작동하는지 확인할 수 있습니다. 예를 들어, 데이터베이스 상호 작용을 테스트하거나 마이크로 서비스가 의도한 대로 상호 작용하도록 제공하는 것을 포함할 수 있습니다. 애플리케이션의 여러 다른 컴포넌트들이 작동해야 하기 때문에 이러한 테스트를 수행하는 데 추가적인 비용이 발생합니다.

### 3) 기능 테스트(Functional Testing)

애플리케이션의 비즈니스 요구 사항은 기능 테스트의 주요 초점입니다. 기능 테스트에서는 수행되는 동안 시스템의 중간 상태를 체크하지 않고 수행의 결과만 확인합니다.

둘 다 상호 작용하기 위해 여러 컴포넌트가 필요하기 때문에 통합 테스트와 기능 테스트는 종종 혼동되곤 합니다. 기능 테스트에서는 제품 요구 사항에 따라 데이터베이스에서 특정 값을 얻을 것으로 예상하지만, 통합 테스트는 사용자가 데이터베이스를 쿼리할 수 있는지만 확인합니다.

### 4) 종단 간 테스트(End-to-end Testing - E2E)

종단 간 테스트는 애플리케이션의 전체 맥락에서 소프트웨어를 사용하여 사용자의 행동을 시뮬레이션합니다. 웹 페이지를 로드하거나 로그인하는 것처럼 간단한 시나리오나 이메일 알림, 온라인 결제처럼 다소 복잡한 시나리오에 대해서 다양한 사용자 흐름이 의도한 대로 작동하는지 확인합니다.

종단 간 테스트는 매우 유용하지만 실행하는 데 비용이 많이 들고, 자동화된 경우에는 관리하기 어려울 수 있습니다. 주요 변경 사항을 빠르게 발견하려면, 제한된 수의 중요한 종단 간 테스트를 갖고 하위 수준의 테스트(단위 및 통합 테스트)에 더 의존하는 것이 좋습니다.

### 5) 검증 테스트(Validation Testing)

인수 테스트는 시스템이 비즈니스 요구사항을 충족하는지 여부를 공식적으로 결정하는 테스트입니다. 테스트 동안 전체 애플리케이션을 실행하면서 사용자 동작을 재현하는 데 집중합니다. 한 단계 더 나아가 시스템의 효율성을 평가하고 특정한 목표가 달성되지 않으면 개선을 거부할 수 있습니다.

### 6) 성능 테스트(Performance Testing)

성능 테스트는 특정 워크로드를 처리하는 시스템의 능력을 평가합니다. 이러한 평가는 애플리케이션의 신뢰성, 속도, 확장성 및 응답성을 결정하는 데 도움이 됩니다. 예를 들어, 성능 테스트는 많은 수의 요청이 처리될 때 응답 시간을 모니터링하거나 시스템이 상당한 양의 데이터에 어떻게 응답하는지 평가할 수 있습니다. 프로그램이 성능 표준을 충족하는지 평가하고, 병목 현상을 찾고, 트래픽이 많을 때 안정성을 측정하고, 훨씬 더 많은 작업을 수행할 수 있습니다.

### 7) 스모크 테스트(Smoke Test)

스모크 테스트는 애플리케이션의 기본 작동을 검사하는 간단한 테스트입니다. 이 테스트는 신속하게 수행되도록 설계되었으며, 주요 시스템 컴포넌트가 계획대로 작동하고 있다는 확신을 제공하는 것에 목적이 있습니다.

스모크 테스트는 더 비용이 많이 드는 테스트를 실행할 수 있는지를 결정하기 위해 새 빌드를 만든 직후에, 또는 새로 배포된 환경에서 애플리케이션이 제대로 작동하는지 확인하기 위해 배포 직후에 도움이 될 수 있습니다.

## 🧪 테스트 주도 개발(TDD)

테스트 주도 개발에서는 테스트 케이스를 검증하는 코드보다 테스트 케이스를 먼저 작성해야 합니다. 그리고 테스트 주도 개발은 빠른 개발 주기를 반복하는 데 의존합니다. 자동화된 단위 테스트를 사용하여 설계 및 종속성의 무제한 분리를 지시합니다.

테스트 주도 개발의 모토는 아래와 같습니다.

- 빨강(Red) : 테스트 케이스를 만들고 실패시킵니다.
- 녹색(Green) : 어떤 방법으로든 테스트 케이스를 통과시킵니다.
- 리팩터링(Refactor) : 코드를 변경하여 중복을 제거합니다.

> 테스트 주도 개발을 사용할 때, 함수 자체를 작성하기 전에 테스트를 작성하는 것이 좋습니다.

![](https://c.tenor.com/r3XdvPsAV3kAAAAC/despicable-me-minions.gif)

## ⚙ 기본 설정

먼저 타입 스크립트 기반의 리액트 앱을 만들어 봅시다.

```bash
npx create-react-app jest-example --template typescript
```

이제 `package.json`을 열면 `jest-dom`과 `testing-library/react`가 이미 종속성으로 설치되어 있음을 알 수 있습니다.

- `jest-dom` : 이 라이브러리는 jest를 확장하는 데 사용할 수 있는 커스텀 jest 매처(Matcher)를 제공합니다. 이렇게 하면 테스트가 더 선언적이고, 명확하게 읽고 유지 관리할 수 있습니다.

- `testing-library/react` : 브라우저에서 React에 의해 렌더링 된 실제 DOM 트리를 테스트하기 위해 만들어진 테스트 유틸리티 도구입니다. 라이브러리의 목표는 사용자가 애플리케이션을 사용하는 방법과 유사한 테스트를 작성하도록 돕는 것입니다.

src 디렉터리에는 모든 앱 코드와 `App.test.tsx`라는 파일이 포함되어 있습니다. 이 파일에는 App 컴포넌트가 링크를 렌더링 하는지 확인하는 테스트가 포함되어 있습니다. 이제 테스트 코드를 분석하고 어떤 역할을 하고 있는지 확인해봅시다.

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// 테스트의 목적을 간략하게 설명합니다.
test('renders learn react link', () => {
  // 준비(Arrange): 테스트 환경과 컴포넌트 렌더링을 준비합니다.
  render(<App />);

  // 실행(Act): 예상되는 링크를 찾습니다.
  const linkElement = screen.getByText(/learn react/i);

  // 검증(Assert): 문서에 필요한 링크가 있는지 확인합니다.
  expect(linkElement).toBeInTheDocument();
});
```

이제 다음 명령을 실행하여 테스트를 실행합니다.

```bash
npm run test
```

결과는 다음과 같습니다.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1660404645218/i1svnyTGD.png?auto=compress,format&format=webp)

이제 `App.tsx`을 변경하고 테스트 결과를 실패시킵니다. `App.tsx` 파일로 이동하여, "Learn React"를 "Let's Learn"으로 변경합니다. 결과는 다음과 같습니다.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1660405372207/12gjTXdN8.png?auto=compress,format&format=webp)

테스트가 깨지는 이유는 DOM에 "learn react" 문자열을 포함하는 요소가 없기 때문입니다. "learn react" 텍스트가 포함된 새로운 엘리먼트를 추가하면 테스트는 다시 성공합니다.

## ✍ 첫 번째 테스트 작성해보기

이제 `App.tsx`로 이동하여 새 기능을 추가해 보겠습니다.

```tsx
export function add(a: number, b: number): number {
  return a + b;
}
```

이제 `App.test.tsx`로 이동하여 새 테스트를 작성해보겠습니다.

```tsx
describe('add function', () => {
  describe('when given to integers', () => {
    it('should return a add result', () => {
      // 준비(Arrange): 예상되는 덧셈 결과와 함수 인수를 준비합니다.
      // 이 예시에서는 5 + 8이 13이 된다는 결과를 예측합니다.
      const [a, b, expected] = [5, 8, 13];

      // 여기서는, 배열 비구조화를 활용하여 "a === 5," "b === 8," 과 "expected === 13"과 같이 할당합니다.

      // 실행(Act): 참인 함수 결과를 얻기위해 add 함수를 사용합니다.
      const result = add(a, b);

      // 검증(Assert): 이제 함수의 출력과 예상 결과를 비교합니다.
      expect(result).toEqual(expected);
    });
  });
});
```

이제 테스트를 실행하면 다음과 같은 결과가 표시됩니다.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1660406404388/pRe0ZXc-n.png?auto=compress,format&format=webp)

## 🛠 이제 몇 가지 컴포넌트를 테스트해 봅시다

이제 몇 가지 컴포넌트를 테스트할 시간입니다. `App.tsx`에서 다른 기능을 만들어 봅시다.

```tsx
export function Login() {
  return (
    <div>
      <div>
        <input type="email" name="email" placeholder="email" />
      </div>
      <div>
        <input type="password" name="password" placeholder="password" />
      </div>

      <div>
        <button type="button">Sign In</button>
        <button type="button">Sign Up</button>
      </div>
    </div>
  );
}
```

이제 `App.test.tsx`로 이동하여 이 컴포넌트에 대한 테스트 케이스를 작성합니다.

```ts
describe('Login component tests', () => {
  let container: HTMLDivElement;

  // beforeEach: 이 파일의 각 테스트가 실행되기 전에 이 함수를 실행합니다. 함수가 promise를 반환하거나 생성자인 경우, jest는 테스트를 실행하기 전에 해당 promise가 해결될 때까지 기다립니다.
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(<Login />, container);
  });

  // 테스트가 서로 방해되지 않도록 마지막에 모든 것을 초기화합니다.
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  // 각 입력 필드를 렌더링하기 위한 테스트를 실행합니다.
  it('Renders all input fields correctly', () => {
    // 입력 필드를 선택합니다.
    const inputs = container.querySelectorAll('input');
    // 입력 필드가 올바르게 렌더링되었는지 확인합니다.
    expect(inputs).toHaveLength(2);

    // 첫 번째 입력 필드 및 두 번째 입력 필드를 각각 "이메일" 및 "암호"인지 확인합니다.
    expect(inputs[0].name).toBe('email');
    expect(inputs[1].name).toBe('password');
  });

  // 각 버튼을 렌더링하기 위한 테스트를 실행합니다.
  it('Renders all buttons correctly', () => {
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0].type).toBe('button');
    expect(buttons[1].type).toBe('button');
  });
});
```

완성된 코드는 다음과 같습니다.

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { add, Login } from './App';
import * as ReactDOM from 'react-dom';

// 테스트의 목적을 간략하게 설명합니다.
test('renders learn react link', () => {
  // 준비(Arrange): 테스트 환경과 컴포넌트 렌더링을 준비합니다.
  render(<App />);

  // 실행(Act): 예상되는 링크를 찾습니다.
  const linkElement = screen.getByText(/learn react/i);

  // 검증(Assert): 문서에 필요한 링크가 있는지 확인합니다.
  expect(linkElement).toBeInTheDocument();
});

describe('add function', () => {
  describe('when given to integers', () => {
    it('should return a add result', () => {
      // 준비(Arrange): 예상되는 덧셈 결과와 함수 인수를 준비합니다.
      // 이 예시에서는 5 + 8이 13이 된다는 결과를 예측합니다.
      const [a, b, expected] = [5, 8, 13];

      // 여기서는, 배열 비구조화를 활용하여 "a === 5," "b === 8," 과 "expected === 13"과 같이 할당합니다.

      // 실행(Act): 참인 함수 결과를 얻기위해 add 함수를 사용합니다.
      const result = add(a, b);

      // 검증(Assert): 이제 함수의 출력과 예상 결과를 비교합니다.
      expect(result).toEqual(expected);
    });
  });
});

describe('Login component tests', () => {
  let container: HTMLDivElement;

  // beforeEach: 이 파일의 각 테스트가 실행되기 전에 이 함수를 실행합니다. 함수가 promise를 반환하거나 생성자인 경우, jest는 테스트를 실행하기 전에 해당 promise가 해결될 때까지 기다립니다.
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(<Login />, container);
  });

  // 테스트가 서로 방해되지 않도록 마지막에 모든 것을 초기화합니다.
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  // 각 입력 필드를 렌더링하기 위한 테스트를 실행합니다.
  it('Renders all input fields correctly', () => {
    // 입력 필드를 선택합니다.
    const inputs = container.querySelectorAll('input');
    // 입력 필드가 올바르게 렌더링되었는지 확인합니다.
    expect(inputs).toHaveLength(2);

    // 첫 번째 입력 필드 및 두 번째 입력 필드를 각각 "이메일" 및 "암호"인지 확인합니다.
    expect(inputs[0].name).toBe('email');
    expect(inputs[1].name).toBe('password');
  });

  // 각 버튼을 렌더링하기 위한 테스트를 실행합니다.
  it('Renders all buttons correctly', () => {
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0].type).toBe('button');
    expect(buttons[1].type).toBe('button');
  });
});
```

## 🥇 최종 결과

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1660414672913/seH8Exww-.png?auto=compress,format&format=webp)

![](https://c.tenor.com/BDRo_mT0ooQAAAAM/youpassed-you.gif)

이제 모든 테스트가 통과되었으므로, 더 많은 컴포넌트를 만들고 단위 테스트를 추가할 수 있습니다.

## 🤝 결론

대규모 앱 일수록 특히 유지 보수 및 소프트웨어 지원 비용을 절감하기 위해 애플리케이션 테스트는 필수적입니다. 이 블로그에서는 Jest, React 및 Typescript로 단위 테스트를 작성하는 방법을 볼 수 있습니다. 더 많은 컴포넌트를 만들고 그 컴포넌트들을 위한 더 많은 테스트를 작성하세요. 전체 소스 코드는 [Github](https://github.com/Harshal0902/Jest-example)에서 찾을 수 있습니다.

![](https://c.tenor.com/Li9JkKIIH14AAAAd/john-kurt-reyes-bye-john-kurt-reyes.gif)

감사합니다.

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
