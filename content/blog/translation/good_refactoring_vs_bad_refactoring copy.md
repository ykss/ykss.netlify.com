---
title: '(번역) 리액트 컴포넌트의 유형 돌아보기'
date: 2024-10-24 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [Types of React Components [2024]](https://www.robinwieruch.de/react-component-types/)

2013년 리액트가 출시된 이후 다양한 유형의 컴포넌트가 등장했습니다. 그중 일부는 여전히 최신 리액트 애플리케이션에 필수적이지만, 다른 일부는 이전 세대의 프로젝트에서 주로 사용되며 현재는 더 이상 사용되지 않는(deprecated) 기술입니다. 이 가이드는 초심자를 위해 최신 컴포넌트와 패턴을 개괄적으로 설명하며, 어떤 것이 여전히 중요한지, 그리고 왜 일부는 더 이상 사용되지 않는지 설명합니다. 이 글을 통해 과거와 최신의 리액트 컴포넌트 및 패턴을 구별할 수 있게 될 것입니다.

## 목차

- [리액트 createClass](#리액트-createclass)
- [리액트 믹스인 (패턴)](#리액트-믹스인-패턴)
- [리액트 클래스 컴포넌트](#리액트-클래스-컴포넌트)
- [리액트 고차 컴포넌트 (패턴)](#리액트-고차-컴포넌트-패턴)
- [리액트 함수 컴포넌트](#리액트-함수-컴포넌트)
- [리액트 서버 컴포넌트](#리액트-서버-컴포넌트)
- [비동기 컴포넌트](#비동기-컴포넌트)

## 리액트 createClass

리액트는 초기에는 **createClass** (더 이상 사용되지 않음)를 통해 자바스크립트 클래스를 사용하지 않고도, 리액트 클래스 컴포넌트를 생성할 수 있는 팩토리 함수로 컴포넌트를 정의했습니다. 이 방식은 2015년 자바스크립트 ES6가 도입되기 전까지 리액트 컴포넌트를 만드는 표준이었습니다. 당시 자바스크립트 ES5에는 네이티브 클래스 문법이 없었기 때문입니다.

```jsx
import createClass from 'create-react-class';

const CreateClassComponent = createClass({
  getInitialState: function() {
    return {
      text: '',
    };
  },

  handleChangeText: function(event) {
    this.setState({ text: event.target.value });
  },

  render: function() {
    return (
      <div>
        <p>Text: {this.state.text}</p>

        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChangeText}
        />
      </div>
    );
  },
});

export default CreateClassComponent;
```

이 예제에서 리액트의 `createClass()` 팩토리 메서드는 리액트 컴포넌트의 메서드들을 정의하는 객체를 인자로 받습니다.`getInitialState()` 함수는 컴포넌트의 상태를 초기화하는 데 사용되며, 필수 메서드인 `render()`는 JSX를 이용해 화면 출력을 처리합니다. 또한, `incrementCounter()`와 같은 추가 메서드는 이벤트 핸들러로 사용할 수 있도록 객체에 추가할 수 있습니다.

부수 효과를 위한 생명주기 메서드도 제공되었습니다. 예를 들어, 상태의 `text` 값을 브라우저의 로컬 스토리지에 매번 기록하려면 `componentDidUpdate()` 생명주기 메서드를 사용할 수 있습니다. 또한, 초기 상태를 받을 때 로컬 스토리지에서 값을 읽을 수도 있습니다.

```jsx
import createClass from 'create-react-class';

const CreateClassComponent = createClass({
  getInitialState: function() {
    return {
      text: localStorage.getItem('text') || '',
    };
  },

  componentDidUpdate: function() {
    localStorage.setItem('text', this.state.text);
  },

  handleChangeText: function(event) {
    this.setState({ text: event.target.value });
  },

  render: function() {
    return (
      <div>
        <p>Text: {this.state.text}</p>

        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChangeText}
        />
      </div>
    );
  },
});

export default CreateClassComponent;
```

리액트의 createClass 메서드는 더 이상 리액트 코어 패키지에서 제공되지 않습니다. 사용해 보고 싶다면 [create-react-class](https://www.npmjs.com/package/create-react-class)라는 추가 노드 패키지를 설치해야 합니다.

## 리액트 믹스인 (패턴)

**리액트 믹스인(mixins)**(더 이상 사용되지 않음)은 재사용 가능한 컴포넌트 로직을 위한 리액트의 첫 번째 패턴으로 소개되었습니다. 리액트에서 믹스인을 사용하면 컴포넌트 로직을 독립된 객체로 추출할 수 있었습니다. 컴포넌트에 믹스인을 사용할 때, 해당 믹스인의 모든 기능이 컴포넌트에 도입됩니다.

```jsx
import createClass from 'create-react-class';

const LocalStorageMixin = {
  getInitialState: function() {
    return {
      text: localStorage.getItem('text') || '',
    };
  },

  componentDidUpdate: function() {
    localStorage.setItem('text', this.state.text);
  },
};

const CreateClassWithMixinComponent = createClass({
  mixins: [LocalStorageMixin],

  handleChangeText: function(event) {
    this.setState({ text: event.target.value });
  },

  render: function() {
    return (
      <div>
        <p>Text: {this.state.text}</p>

        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChangeText}
        />
      </div>
    );
  },
});

export default CreateClassWithMixinComponent;
```

예를 들어 `LocalStorageMixin`은 로컬 스토리지 내에서 텍스트 상태를 관리하는 로직을 캡슐화하며, `getInitialState`에서 `text`를 초기화하고 `componentDidUpdate`에서 이를 업데이트합니다. `mixins` 배열에 믹스인을 추가함으로써, 컴포넌트는 코드를 중복하지 않고도 이 공유 기능을 재사용할 수 있습니다.

그러나 믹스인은 여러 [단점](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)이 있었기 때문에 더 이상 사용되지 않으며, 오직 createClass 컴포넌트에서만 사용되었습니다.

## 리액트 클래스 컴포넌트

**리액트 클래스 컴포넌트** (권장되지 않음)는 2015년 3월에 출시된 버전 0.13에서 도입되었습니다. 그 이전에는 개발자들이 컴포넌트를 정의하기 위해 createClass 함수를 사용했지만, 결국 리액트는 2017년 4월에 버전 15.5에서 createClass를 폐지하고 클래스 컴포넌트를 대신 사용할 것을 권장했습니다.

클래스 컴포넌트는 ES6가 출시된 이후 자바스크립트 클래스 문법을 활용할 수 있는 방법으로 도입되었습니다.

```jsx
import React from 'react';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.handleChangeText = this.handleChangeText.bind(this);
  }

  handleChangeText(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    return (
      <div>
        <p>Text: {this.state.text}</p>

        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChangeText}
        />
      </div>
    );
  }
}

export default ClassComponent;
```

자바스크립트 클래스로 작성된 리액트 컴포넌트는 클래스 생성자와 같은 메서드를 포함합니다. 이 생성자는 리액트에서 주로 초기 상태를 설정하거나 메서드를 바인딩하는 데 사용됩니다. 또한 JSX를 출력하는 필수 메서드인 render 메서드를 포함합니다.

모든 리액트 컴포넌트 내부 로직은 객체 지향의 상속으로 제공되었습니다. 하지만 상속을 그 이상의 목적으로 사용 하는것은 권장되지 않았다는 점을 유의해야 합니다. 대신, 항상 상속보다는 합성(composition)을 사용하는 것으로 권장되었습니다.

> 더 읽기: [리액트의 합성](https://www.robinwieruch.de/react-component-composition/)

자바스크립트 클래스를 사용하는 또 다른 문법은 ES6 화살표 함수를 통해 메서드를 자동으로 바인딩하는 것을 허용합니다.

```jsx
import React from 'react';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    // handleChangeText에 화살표 함수를 사용하는 경우, 아래의 코드는 필요 없습니다.
    // this.handleChangeText = this.handleChangeText.bind(this);
  }

  handleChangeText = event => {
    this.setState({ text: event.target.value });
  };

  render() {
    return (
      <div>
        <p>Text: {this.state.text}</p>

        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChangeText}
        />
      </div>
    );
  }
}

export default ClassComponent;
```

리액트 클래스 컴포넌트는 컴포넌트의 마운팅, 업데이트, 언마운팅을 위한 다양한 생명주기 메서드도 제공합니다. 앞서 다룬 로컬 스토리지 예제의 경우, 생명주기 메서드를 사용하여 부수 효과로 처리할 수 있습니다.

```jsx
import React from 'react';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: localStorage.getItem('text') || '',
    };

    this.handleChangeText = this.handleChangeText.bind(this);
  }

  componentDidUpdate() {
    localStorage.setItem('text', this.state.text);
  }

  handleChangeText(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    return (
      <div>
        <p>Text: {this.state.text}</p>

        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChangeText}
        />
      </div>
    );
  }
}

export default ClassComponent;
```

리액트 훅이 2019년 2월에 출시된 버전 16.8에서 도입되면서 훅을 사용한 함수 컴포넌트가 업계 표준이 되었으며, 사실상 리액트 클래스 컴포넌트는 구식이 되었습니다. 그전에는 함수 컴포넌트가 상태를 관리하거나 부수 효과를 처리할 수 없었기 때문에 클래스 컴포넌트와 함수 컴포넌트가 공존했습니다.

## 리액트 고차 컴포넌트 (패턴)

리액트 고차 컴포넌트 (Higher-Order Components , HOCs) (더 이상 권장되지 않음)는 리액트 컴포넌트 간의 재사용 가능한 로직을 위한 고급 패턴으로 인기를 끌었습니다.

> 더 읽기: [리액트 고차 컴포넌트에 대해 더 알아보기](https://www.robinwieruch.de/react-higher-order-components/)

**고차 컴포넌트**는 컴포넌트를 입력으로 받아 확장된 기능을 가진 컴포넌트를 출력하는 컴포넌트를 의미합니다. 로컬 스토리지 기능을 추출한 예제를 다시 살펴봅시다.

```jsx
import React from 'react';

const withLocalStorage = storageKey => Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        value: localStorage.getItem(storageKey) || '',
      };
    }

    componentDidUpdate() {
      localStorage.setItem(storageKey, this.state.value);
    }

    onChangeValue = event => {
      this.setState({ value: event.target.value });
    };

    render() {
      return (
        <Component
          value={this.state.value}
          onChangeValue={this.onChangeValue}
          {...this.props}
        />
      );
    }
  };
};

class ClassComponent extends React.Component {
  render() {
    return (
      <div>
        <p>Text: {this.props.value}</p>

        <input
          type="text"
          value={this.props.value}
          onChange={this.props.onChangeValue}
        />
      </div>
    );
  }
}

export default withLocalStorage('text')(ClassComponent);
```

또 다른 고급 리액트 패턴은 **리액트 Render Prop 컴포넌트**로, 이는 종종 고차 컴포넌트의 대안으로 사용되었습니다. 고차 컴포넌트와 Render Prop 컴포넌트는 클래스 컴포넌트와 함수 컴포넌트 모두에서 사용할 수 있습니다.

> 더 읽기: [리액트 Render Prop 컴포넌트에 대해 더 알아보기](https://www.robinwieruch.de/react-render-props/)

리액트 고차 컴포넌트와 Render Prop 컴포넌트 모두 현재의 리액트 애플리케이션에서는 많이 사용되지 않습니다. 오늘날에는 리액트 훅과 함께 사용하는 함수 컴포넌트가 컴포넌트 간 로직을 공유하는 표준입니다.

## 리액트 함수 컴포넌트

리액트 함수 컴포넌트 (FC, 때때로 **함수형 컴포넌트**라고도 불림)는 리액트 클래스 컴포넌트를 대체하는 용도로 사용됩니다. 함수로 표현되며, 클래스 대신 사용됩니다. 과거에는 함수 컴포넌트에서 상태나 부수 효과를 사용할 수 없었기 때문에 **함수형 무상태(Stateless) 컴포넌트**라고 불렸지만, 리액트 훅 덕분에 이제는 상태와 부수 효과를 사용할 수 있어 함수 컴포넌트로 다시 브랜딩되었습니다.

> 더 읽기: [리액트 함수 컴포넌트에 대해 더 알아보기](https://www.robinwieruch.de/react-function-component/)

> 더 읽기: [리액트 훅에 대해 더 알아보기](https://www.robinwieruch.de/react-hooks/)

**리액트 훅**은 상태와 부수 효과를 **함수 컴포넌트**에 도입하여, 현재는 이들이 *최신 리액트 애플리케이션의 업계 표준*이 되었습니다. 리액트에는 다양한 내장 훅들이 있으며, 커스텀 훅도 만들 수 있습니다. 앞서 나온 리액트 클래스 컴포넌트를 리액트 함수 컴포넌트로 전환하는 예제를 살펴봅시다.

```jsx
import { useState } from 'react';

const FunctionComponent = () => {
  const [text, setText] = useState('');

  const handleChangeText = event => {
    setText(event.target.value);
  };

  return (
    <div>
      <p>Text: {text}</p>

      <input type="text" value={text} onChange={handleChangeText} />
    </div>
  );
};

export default FunctionComponent;
```

이전 코드는 상태 관리를 위한 리액트의 내장 [useState 훅](https://www.robinwieruch.de/react-usestate-hook/)을 사용하는 함수 컴포넌트를 보여줍니다. 리액트 훅은 또한 부수 효과를 함수 컴포넌트에 도입하기 위해 만들어졌습니다. 아래 코드는 상태 값이 변경될 때마다 실행되는 [리액트의 useEffect 훅](https://www.robinwieruch.de/react-useeffect-hook/)을 보여줍니다.

```jsx
import { useEffect, useState } from 'react';

const FunctionComponent = () => {
  const [text, setText] = useState(localStorage.getItem('text') || '');

  useEffect(() => {
    localStorage.setItem('text', text);
  }, [text]);

  const handleChangeText = event => {
    setText(event.target.value);
  };

  return (
    <div>
      <p>Text: {text}</p>

      <input type="text" value={text} onChange={handleChangeText} />
    </div>
  );
};

export default FunctionComponent;
```

마지막으로, 두 훅을 하나의 캡슐화된 커스텀 훅으로 추출할 수 있습니다. 이 커스텀 훅은 컴포넌트의 상태를 로컬 스토리지와 동기화하도록 보장합니다. 결과적으로, 이 훅은 함수형 컴포넌트에서 사용할 수 있는 필요한 값과 설정 함수(setter function)를 반환합니다.

```jsx
import { useEffect, useState } from 'react';

const useLocalStorage = storageKey => {
  const [value, setValue] = useState(localStorage.getItem(storageKey) || '');

  useEffect(() => {
    localStorage.setItem(storageKey, value);
  }, [storageKey, value]);

  return [value, setValue];
};

const FunctionComponent = () => {
  const [text, setText] = useLocalStorage('text');

  const handleChangeText = event => {
    setText(event.target.value);
  };

  return (
    <div>
      <p>Text: {text}</p>

      <input type="text" value={text} onChange={handleChangeText} />
    </div>
  );
};

export default FunctionComponent;
```

함수 컴포넌트에서 추출되었기 때문에, 이 커스텀 훅은 다른 컴포넌트에서 재사용할 수 있어 비즈니스 로직을 공유할 수 있습니다. 이는 믹스인, 고차 컴포넌트, Render Prop 컴포넌트에 해당하는 리액트의 추상화 및 고급 패턴입니다.

> 더 읽기: [리액트 커스텀 훅에 대해 더 알아보기](https://www.robinwieruch.de/react-custom-hook/)

믹스인은 오직 createClass 컴포넌트에서만 사용되었지만, 고차 컴포넌트와 Render Prop 컴포넌트는 클래스와 함수 컴포넌트 모두에서 사용됩니다. 하지만, 컴포넌트 간 로직을 공유하는 권장 방법은 커스텀 훅을 사용하는 것입니다.

## 리액트 서버 컴포넌트

리액트의 가장 최근 추가된 기능(2023년)은 리액트 서버 컴포넌트(RSC)입니다. 이는 개발자가 컴포넌트를 서버에서 실행할 수 있게 해 줍니다. 주요 이점은 클라이언트에 오직 HTML만 전송되며, 컴포넌트가 서버 측 리소스에 접근할 수 있다는 점입니다.

서버 컴포넌트는 서버에서 실행되기 때문에, 앞서 소개한 예제와 동일하게 1:1로 비교할 수는 없습니다. 왜냐하면 이 컴포넌트들은 서로 다른 사용 사례를 다루기 때문입니다. 다음 예제는 서버 측 리소스(예: 데이터베이스)에서 데이터를 가져와 JSX를 렌더링 된 HTML로 클라이언트에 전송하는 서버 컴포넌트의 예입니다.

```jsx
const ReactServerComponent = async () => {
  const posts = await db.query('SELECT * FROM posts');

  return (
    <div>
      <ul>
        {posts?.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReactServerComponent;
```

서버 컴포넌트의 등장과 함께 리액트는 클라이언트에서 실행되는 전통적인 리액트 컴포넌트를 가리키는 **클라이언트 컴포넌트**라는 용어도 도입했습니다. 앞서 이 가이드에서 본 모든 것이 클라이언트 컴포넌트에 해당합니다.

서버 컴포넌트는 클라이언트 컴포넌트와 달리 리액트 훅이나 [이벤트 핸들러](https://www.robinwieruch.de/react-event-handler/)와 같은 자바스크립트를 사용할 수 없습니다. 그 이유는 서버에서 실행되기 때문입니다.

> 더 읽기: [Next.js를 활용한 풀스택 개발 배우기](https://www.road-to-next.com/)

리액트 자체는 서버 컴포넌트에 대한 기본적인 명세와 구성 요소만을 제공하며, 이를 구현하기 위해서는 리액트 프레임워크(예: Next.js)가 필요합니다.

## 비동기 컴포넌트

현재 비동기 컴포넌트는 서버 컴포넌트에서만 지원되지만, 미래에는 클라이언트 컴포넌트에서도 지원될 예정입니다. 컴포넌트가 async로 표시되면 비동기 작업(예: 데이터 페칭)을 수행할 수 있습니다.

이전의 서버 컴포넌트 예제에서 이러한 동작을 볼 수 있었습니다. 컴포넌트가 데이터베이스에서 데이터를 가져와 렌더링 된 JSX를 HTML로 클라이언트에 전송했기 때문입니다. 하지만 클라이언트 컴포넌트에서는 이 방식이 작동하지 않는데, 이는 클라이언트 측에서 렌더링이 차단될 수 있기 때문입니다.

현재로서는 자바스크립트 Promise를 클라이언트 컴포넌트에 전달할 수 있습니다.

```jsx
import { Suspense } from 'react';

const ReactServerComponent = () => {
  const postsPromise = db.query('SELECT * FROM posts');

  return (
    <div>
      <Suspense>
        <ReactClientComponent promisedPosts={postsPromise} />
      </Suspense>
    </div>
  );
};
```

또 리액트의 use API를 사용해 클라이언트 컴포넌트에서 이를 해결할 수 있습니다.

```jsx
'use client';

import { use } from 'react';

const ReactClientComponent = ({ promisedPosts }) => {
  const posts = use(promisedPosts);

  return (
    <ul>
      {posts?.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export { ReactClientComponent };
```

미래에는 리액트가 클라이언트 컴포넌트에서도 async 컴포넌트를 지원하여 렌더링 전에 클라이언트 컴포넌트에서 데이터를 가져올 수 있을 가능성이 큽니다.

---

모든 리액트 컴포넌트는 [리액트 Props](https://www.robinwieruch.de/react-pass-props-to-component/)를 사용하는 방식이 동일합니다. 이는 컴포넌트 트리 아래로 정보를 전달하는 데 사용되기 때문입니다. 그러나 상태와 부수 효과의 사용 방식은 클래스 컴포넌트와 함수 컴포넌트에서 다릅니다.

이 가이드는 다양한 유형의 리액트 컴포넌트와 그 사용 방법, 그리고 이러한 컴포넌트들이 역사적 맥락에서 어떻게 변화했는지 보여주었습니다. 여기에서 [모든 예제](https://github.com/rwieruch/examples/tree/main/react-component-types)를 확인할 수 있습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
