---
title: '(번역) SOLID 원칙으로 리액트 훅 작성하기'
date: 2024-06-17 01:00:00
category: 'Translation'
draft: false
---

<link rel="canonical" href="https://www.ykss.netlify.app">

> 원문 : [Write SOLID React Hooks](https://www.perssondennis.com/articles/write-solid-react-hooks)

![](https://www.perssondennis.com/_next/image?url=%2Fimages%2Farticles%2Fwrite-solid-react-hooks%2Fwrite-solid-react-hooks.webp&w=2048&q=50)

SOLID는 가장 일반적으로 사용되는 디자인 패턴 중 하나입니다. 여러 언어와 프레임워크에서 사용되며, 리액트에서 사용하는 방법을 소개하는 문서도 많습니다.

SOLID에 대한 각 리액트 문서는 약간씩 다른 방식으로 모델을 제시하는데, 컴포넌트에 적용하거나 타입스크립트에 적용하는 경우들은 있지만 훅에 원리를 적용하는 경우는 거의 없습니다.

훅은 리액트의 기초의 일부이므로, 이 문서에서 SOLID 원칙이 어떻게 훅에 적용되는지 살펴보겠습니다.

## 단일 책임 원칙(SRP - Single Responsibility Principle)

SOLID의 첫 글자인 S는 가장 이해하기 쉬운 글자입니다. 본질적으로 하나의 훅이나 컴포넌트가 한 가지 일을 하도록 한다는 뜻입니다.

```
// 단일 책임 원칙
모듈은 단 하나의 액터만 담당해야 합니다.
```

예를 들어 아래의 useUser 훅을 살펴보면 user와 todo task을 가져오고 task를 유저 객체에 병합합니다.

```jsx
import { useState } from 'react';
import { getUser, getTodoTasks } from 'somewhere';

const useUser = () => {
  const [user, setUser] = useState();
  const [todoTasks, setTodoTasks] = useState();

  useEffect(() => {
    const userInfo = getUser();
    setUser(userInfo);
  }, []);

  useEffect(() => {
    const tasks = getTodoTasks();
    setTodoTasks(tasks);
  }, []);

  return { ...user, todoTasks };
};
```

이 훅은 단일 책임 원칙을 준수하지 않으므로 SOLID 하지 않습니다. user 데이터를 가져오는 책임과 todo task를 가져오는 책임, 즉 두 가지를 모두 가지고 있기 때문입니다.

대신 위의 코드를 user에 대한 데이터를 가져오는 훅과 todo task를 가져오는 훅으로 분리해야 합니다.

```jsx
import { useState } from 'react';
import { getUser, getTodoTasks } from 'somewhere';

// useUser 훅은 더 이상 todo task를 가져오는 작업을 담당하지 않습니다.
const useUser = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = getUser();
    setUser(userInfo);
  }, []);

  return { user };
};

// Todo task를 가져오는 작업은 그 자신의 고유한 훅이 수행합니다.
// 이 훅은 실제로 별도 파일에 있어야 합니다. 하나의 파일에는 하나의 훅만 두세요!
const useTodoTasks = () => {
  const [todoTasks, setTodoTasks] = useState();

  useEffect(() => {
    const tasks = getTodoTasks();
    setTodoTasks(tasks);
  }, []);

  return { todoTasks };
};
```

이 원칙은 모든 훅과 컴포넌트에 적용되며, 모두 각각 한 가지 일만 해야 합니다. 이 원칙을 적용할 때 자문해야 하는 사항은 아래와 같습니다.

1. UI(프레젠테이션)를 표시해야 하는 컴포넌트인가요? 아니면 데이터(로직)를 처리해야 하는 컴포넌트인가요?
2. 이 훅은 어떤 단일 유형의 데이터를 처리해야 하나요?
3. 이 훅이나 컴포넌트는 어떤 레이어에 속하나요? 데이터 저장소를 처리하는 건가요? 아니면 UI의 일부일까요?

위의 각 질문에 대해 같은 답변을 하지 못하는 훅을 만들고 있다면, 여러분은 단일 책임 원칙을 위반하고 있는 것입니다.

여기서 주목해야 할 흥미로운 점은 첫 번째 질문입니다. 이 질문은 실제로 UI를 렌더링하는 컴포넌트가 데이터도 처리해서는 안 된다는 뜻입니다. 즉, 이 원칙을 엄격하게 지키려면 데이터를 표시하는 각 리액트 컴포넌트에는 해당 로직과 데이터를 처리하는 훅이 있어야 합니다. 다시 말해, 데이터를 표시하는 컴포넌트가 데이터를 가져와서는 안 됩니다.

### 리액트에서 SRP를 사용하는 이유는 무엇인가요?

이 단일 책임 원칙은 실제로 리액트와 매우 잘 어울립니다. 리액트는 컴포넌트 기반 아키텍처를 따르며, 이는 작은 컴포넌트들이 함께 모여 애플리케이션을 구성할 수 있도록 구성된 아키텍처를 의미합니다. 컴포넌트의 크기가 작을수록 재사용할 수 있는 가능성이 높아집니다. 이는 컴포넌트와 훅 모두에 적용됩니다.

이러한 이유로 리액트는 단일 책임 원칙에 기반을 두고 있습니다. 이 원칙을 따르지 않으면 항상 새로운 훅과 컴포넌트를 작성해야하고 재사용하는 경우는 거의 없을 것입니다.

단일 책임 원칙을 따르지 않으면 코드를 테스트하기 힘들어집니다. 또한 수백 줄에서 최대 1000줄에 이르는 테스트 파일을 종종 발견하게 될지도 모릅니다.

## 개방/폐쇄 원칙(OCP - Open/Closed Principle)

SOLID의 다음 글자인 개방/폐쇄 원칙에 대해 계속 알아보겠습니다. OCP는 SRP와 마찬가지로 정의만큼은 이해하기 쉬운 원칙 중 하나입니다.

```
// 개방/폐쇄 원칙
소프트웨어 엔티티(클래스, 모듈, 함수 등)는 확장에는 개방적이어야 하지만, 수정에는 폐쇄적이어야 합니다.
```

최근에 리액트를 시작한 초보자를 위해 더 쉽게 해석하면 다음과 같습니다.

```
다시 건들지 않을 수 있도록 훅과 컴포넌트를 작성하고, 다른 훅/컴포넌트에서는 재사용만 하세요.
```

이 글의 앞부분에서 단일 책임 원칙에 대해 언급한 내용을 떠올려 보세요. 리액트에서는 작은 컴포넌트를 작성하고 이를 결합해야 합니다. 이것이 왜 도움이 되는지 살펴보겠습니다.

```jsx
import { useState } from 'react';
import { getUser, updateUser } from 'somewhere';

const useUser = ({ userType }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = getUser();
    setUser(userInfo);
  }, []);

  const updateEmail = newEmail => {
    if (user && userType === 'admin') {
      updateUser({ ...user, email: newEmail });
    } else {
      console.error('Cannot update email');
    }
  };

  return { user, updateEmail };
};
```

위의 훅은 유저를 가져와서 반환합니다. 유저 유형이 관리자인 경우 해당 유저는 이메일을 업데이트할 수 있습니다. 일반 유저는 이메일 업데이트가 허용되지 않습니다.

위의 코드로 해고되지는 않을 것입니다. 하지만 디자인 패턴 책을 아이들에게 읽어줄 정도로 열정적인 팀의 백엔드 담당자 Pete에게는 아주 짜증나는 일입니다.

Pete는 무엇에 대해 불평할까요? 그는 아래와 같이 컴포넌트를 다시 작성해 달라고 요청할 것입니다. 관리자 기능을 자체적인 useAdmin 훅으로 옮기고, 일반 유저가 사용할 수 있어야 하는 기능만 useUser 훅에 남겨둬야 합니다.

```jsx
import { useState } from 'react';
import { getUser, updateUser } from 'somewhere';

// useUser 훅은 이제 이메일 업데이트 기능 없이
// 사용자만 반환합니다.
const useUser = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = getUser();
    setUser(userInfo);
  }, []);

  return { user };
};

// 새로운 훅인 useAdmin은 useUser 훅을 확장하며,
// 이메일을 업데이트하는 추가 기능을 제공합니다.
const useAdmin = () => {
  const { user } = useUser();

  const updateEmail = newEmail => {
    if (user) {
      updateUser({ ...user, email: newEmail });
    } else {
      console.error('Cannot update email');
    }
  };

  return { user, updateEmail };
};
```

Pete가 이 업데이트를 요청한 이유는 무엇일까요? 무례하고 까다로운 Pete는 나중에 다른 유형의 유저가 생겼을 때 작은 if 문을 새로 추가하여 코드를 업데이트해야 할 가능성이 있는 대신, 지금 그 훅을 다시 작성하고 내일 다시 코드 리뷰를 하러 오기를 원하기 때문입니다.

부정적으로 말하자면 그렇지만, 긍정적으로 표현하자면 이 새로운 useAdmin 훅을 사용하면 관리자 유저에게만 영향을 미치는 기능을 구현하거나 새로운 유형의 유저를 추가할 때 useUser 훅에서 아무것도 변경할 필요가 없다는 것입니다.

새 유저 유형이 추가되거나 useAdmin 훅이 업데이트되면 useUser 훅을 건드리거나 해당 테스트를 업데이트할 필요가 없습니다. 즉, 새로운 유저 유형(예: 가짜 유저)을 추가할 때 일반 유저에게 실수로 버그를 전송할 필요가 없습니다. 대신, 새로운 useFakeUser 훅을 추가하기만 하면 고객이 급여 주말에 은행 계좌에 가짜 데이터가 표시되는 문제가 발생하여 금요일 밤 9시에 상사가 전화하는 일은 없을 것입니다.

![Pete의 아들은 스파게티 코드 개발자를 조심해야 한다는 것을 알고 있습니다.](https://www.perssondennis.com/_next/image?url=/images/articles/write-solid-react-hooks/frontend-developer-under-the-bed.webp&w=1200&q=75)
_Pete의 아들은 스파게티 코드 개발자를 조심해야 한다는 것을 알고 있습니다._

### 리액트에서 OCP를 사용하는 이유는 무엇인가요?

리액트 프로젝트에 얼마나 많은 훅과 컴포넌트가 있어야 하는지는 논쟁의 여지가 있습니다. 각각의 컴포넌트에는 렌더링 비용이 발생합니다. 리액트는 간단한 TODO 목록 구현을 위해 22개의 디자인 패턴이 422개의 클래스로 이어지는 자바가 아닙니다. 이것이 바로 Wild West Web(www)의 아름다움입니다.

그러나 개방/폐쇄 원칙은 분명히 리액트에서도 사용할 수 있는 몇 안 되는 패턴입니다. 위의 예시에서는 훅이 최소한으로 사용되었고, 그다지 많은 일을 하지 않았습니다. 보다 실질적인 훅과 더 큰 프로젝트에서는 이 원칙이 매우 중요해집니다.

추가 훅이 필요하고 구현하는 데 시간이 조금 더 걸릴 수 있지만, 훅의 확장성이 높아져 더 자주 재사용할 수 있습니다. 테스트를 다시 작성하는 횟수가 줄어들어 훅이 더 견고해집니다. 그리고 가장 중요한 것은 이전 코드를 건드리지 않으면 버그를 만들지 않는다는 것입니다.

![작동이 잘 되는 것을 건드리지 마세요.](https://www.perssondennis.com/_next/image?url=/images/articles/write-solid-react-hooks/dont-touch-what-is-not-broken.webp&w=1200&q=75)
_작동이 잘 되는 것을 건드리지 마세요._

## 리스코프 치환 원칙 (LSP - Liskov Substitution Principle)

아, 그 이름... 리스코프가 누굴까요? 그리고 누가 그녀를 치환할까요? 그리고 그녀를 치환한다는 것은 말도 안되지 않나요?

```
S가 T를 서브타입화하는 경우, T에 대해 유지되는 것은 S에도 유지됩니다.
```

이 원칙은 분명히 상속과 관련된 것인데, 리액트나 자바스크립트에서는 대부분의 백엔드 언어만큼 자연스럽게 실행되지는 않습니다. 자바스크립트는 ES6 이전까지는 클래스조차 없었으며, 클래스는 프로토타입 기반 상속을 위한 구문 설탕으로 [2015/2016년경에 도입](https://caniuse.com/?search=class)되었습니다.

이를 염두에 두고 이 원칙의 사용은 코드가 어떻게 작성되어 있는지에 따라 달라집니다. 리스코프와 유사한 원칙이 리액트에서 의미가 있을 수 있습니다.

```
훅/컴포넌트가 일부 props를 받아들이는 경우, 해당 훅/컴포넌트를 확장하는 모든 훅과 컴포넌트는 확장하는 훅/컴포넌트가 받아들이는 모든 props를 받아들여야 합니다. 반환값도 마찬가지입니다.
```

이에 대한 예를 설명하기 위해 두 개의 스토리지 훅인 useLocalStorage와 useLocalAndRemoteStorage를 살펴볼 수 있습니다.

```jsx
import { useState } from 'react';
import {
  getFromLocalStorage,
  saveToLocalStorage,
  getFromRemoteStorage,
} from 'somewhere';

// useLocalStorage는 로컬 스토리지에서 데이터를 가져옵니다.
// 새 데이터가 저장되면 저장소 콜백을 호출합니다.
const useLocalStorage = ({ onDataSaved }) => {
  const [data, setData] = useState();

  useEffect(() => {
    const storageData = getFromLocalStorage();
    setData(storageData);
  }, []);

  const saveToStorage = newData => {
    saveToLocalStorage(newData);
    onDataSaved(newData);
  };

  return { data, saveToStorage };
};

// useLocalAndRemoteStorage 로컬 및 원격 스토리지에서 데이터를 가져옵니다.
// 데이터가 저장될 때 트리거할 콜백이 없습니다.
const useLocalAndRemoteStorage = () => {
  const [localData, setLocalData] = useState();
  const [remoteData, setRemoteData] = useState();

  useEffect(() => {
    const storageData = getFromLocalStorage();
    setLocalData(storageData);
  }, []);

  useEffect(() => {
    const storageData = getFromRemoteStorage();
    setRemoteData(storageData);
  }, []);

  const saveToStorage = newData => {
    saveToLocalStorage(newData);
  };

  return { localData, remoteData, saveToStorage };
};
```

위의 훅을 사용하면 useLocalAndRemoteStorage는 useLocalStorage와 동일한 작업(로컬 스토리지에 저장)을 수행하지만, 데이터를 추가 장소에 저장하여 useLocalStorage의 기능을 확장했기 때문에 useLocalStorage의 하위 유형으로 볼 수 있습니다.

두 훅에는 일부 공유 props와 반환값이 있지만, useLocalAndRemoteStorage에는 useLocalStorage가 허용하는 onDataSaved 콜백 props가 누락되어 있습니다. 반환 프로퍼티의 이름도 다르게 지정되어 있으며, 로컬 데이터는 useLocalStorage에서는 data로 이름이 지정되지만 useLocalAndRemoteStorage에서는 localData로 이름이 지정됩니다.

리스코프에게 물어본다면 이것은 그녀의 원칙을 어긴 것입니다. 어떤 게으른 개발자가 useLocalAndRemoteStorage 훅에 대한 onDataSaved 콜백을 구현하지 않았다고 해서 단순히 useLocalStorage를 useLocalAndRemoteStorage 훅으로 대체할 수 없다는 사실을 깨닫고 서버 측 데이터도 유지하도록 웹 애플리케이션을 업데이트하려고 할 때 그녀는 상당히 화가 났을 것입니다.

리스코프는 이를 지원하기 위해 훅을 업데이트할 것입니다. 또한, useLocalStorage 훅의 로컬 데이터 변수 명도 useLocalAndRemoteStorage의 로컬 데이터 변수 명과 일치하도록 업데이트할 것입니다.

```jsx
import { useState } from 'react';
import {
  getFromLocalStorage,
  saveToLocalStorage,
  getFromRemoteStorage,
} from 'somewhere';

// 리스코프는 훅의 인터페이스(변수 이름)와 일치시키기 위해서
// 데이터 상태 변수의 이름을 localData로 변경했습니다.
const useLocalStorage = ({ onDataSaved }) => {
  const [localData, setLocalData] = useState();

  useEffect(() => {
    const storageData = getFromLocalStorage();
    setLocalData(storageData);
  }, []);

  const saveToStorage = newData => {
    saveToLocalStorage(newData);
    onDataSaved(newData);
  };

  // 이 훅은 이제 "data" 대신 "localData"를 반환합니다.
  return { localData, saveToStorage };
};

// 리스코프는 useLocalStorage의 프롭 인터페이스와 일치시키기 위해
// 이 훅에 onDataSaved 콜백을 추가했습니다,
const useLocalAndRemoteStorage = ({ onDataSaved }) => {
  const [localData, setLocalData] = useState();
  const [remoteData, setRemoteData] = useState();

  useEffect(() => {
    const storageData = getFromLocalStorage();
    setLocalData(storageData);
  }, []);

  useEffect(() => {
    const storageData = getFromRemoteStorage();
    setRemoteData(storageData);
  }, []);

  const saveToStorage = newData => {
    saveToLocalStorage(newData);
    onDataSaved(newData);
  };

  return { localData, remoteData, saveToStorage };
};
```

훅에 공통 인터페이스(들어오는 props, 나가는 반환값)가 있으면 교환이 매우 쉬워질 수 있습니다. 그리고 리스코프 치환 원칙을 따른다면, 다른 훅/컴포넌트를 상속하는 훅과 컴포넌트는 그 훅이나 컴포넌트가 상속하는 훅이나 컴포넌트로 치환할 수 있어야 합니다.

![개발자가 자신의 원칙을 따르지 않아서 실망하는 리스코프](https://www.perssondennis.com/_next/image?url=/images/articles/write-solid-react-hooks/worried-liskov.webp&w=1200&q=75)
_개발자가 자신의 원칙을 따르지 않아서 실망하는 리스코프_

### 리액트에서 LSP를 사용하는 이유는 무엇인가요?

리액트에서 상속은 그다지 눈에 띄지는 않지만, 내부적으로는 분명히 사용됩니다. 웹 애플리케이션에는 종종 비슷해 보이는 컴포넌트가 여러 개 있기도 합니다. 텍스트, 제목, 링크, 아이콘 링크 등은 모두 비슷한 유형의 컴포넌트이며 상속을 통해 이점을 얻을 수 있습니다.

IconLink 컴포넌트는 Link 컴포넌트를 래핑할 수도 있고 그렇지 않을 수도 있습니다. 어느 쪽이든 동일한 인터페이스(동일한 props 사용)로 구현하면 이점을 얻을 수 있습니다. 이렇게 하면 추가 코드를 편집할 필요 없이 애플리케이션의 어느 곳에서든 언제든지 Link 컴포넌트를 IconLink 컴포넌트로 교체하는 것이 간단합니다.

훅도 마찬가지입니다. 웹 애플리케이션은 서버에서 데이터를 가져옵니다. 로컬 스토리지나 상태 관리 시스템을 사용할 수도 있습니다. 이러한 경우 props을 공유하여 상호 교환할 수 있도록 하는 것이 바람직합니다.

애플리케이션은 백엔드 서버에서 사용자, 작업, 제품 또는 기타 데이터를 가져올 수 있습니다. 이러한 함수는 인터페이스를 공유하여 코드와 테스트를 더 쉽게 재사용할 수 있습니다.

## 인터페이스 분리 원칙 (ISP - Interface Segregation Principle)

좀 더 명확한 또 다른 원칙은 인터페이스 분리 원칙입니다. 정의는 아주 짧습니다.

```
사용하지 않는 메서드에 의존하도록 코드를 강제해서는 안 됩니다.
```

이름에서 알 수 있듯이 인터페이스와 관련이 있으며, 기본적으로 함수와 클래스는 명시적으로 사용하는 인터페이스만 구현해야 한다는 뜻입니다. 이는 인터페이스를 깔끔하게 유지하고 클래스가 여러 메서드를 포함하는 하나의 큰 인터페이스를 구현하는 대신 몇 개의 인터페이스를 선택하여 구현하도록 하는 것이 가장 쉬운 방법입니다.

예를 들어 웹사이트를 소유한 사람을 나타내는 클래스는 그 사람에 대한 세부 정보를 설명하는 Person이라는 인터페이스와 소유한 웹사이트에 대한 메타데이터가 있는 Website라는 인터페이스 두 개를 구현해야 합니다.

```ts
interface Person {
  firstname: string;
  familyName: string;
  age: number;
}

interface Website {
  domain: string;
  type: string;
}
```

만약 소유자와 웹사이트에 대한 정보를 모두 포함하는 단일 인터페이스 웹사이트를 만들었다면 이는 인터페이스 분리 원칙에 위배됩니다.

```ts
interface Website {
  ownerFirstname: string;
  ownerFamilyName: number;
  domain: string;
  type: string;
}
```

위 인터페이스의 문제점이 무엇인지 궁금할 수 있습니다. 문제는 인터페이스의 사용성을 떨어뜨린다는 것입니다. 만약 human이 아니라 company라면 어떻게 하겠습니까? company는 실제로 family name이 없습니다. 그렇다면 human과 company 모두 사용할 수 있도록 인터페이스를 수정할까요? 아니면 CompanyOwnedWebsite라는 새로운 인터페이스를 만들까요?

그러면 선택적 프로퍼티가 많은 인터페이스를 만들거나 각각 PersonWebsite 및 CompanyWebsite이라는 두 개의 인터페이스를 만들 수 있습니다. 이 두 가지 솔루션 중 어느 것도 최적은 아닙니다.

```ts
// 대안 1

// 이 인터페이스에는 다음과 같은 문제가 있습니다.
// 속성이 인터페이스의 일부 소비자에게 필수임에도 불구하고
// 선택적 속성이 포함되어 있습니다.
interface Website {
  companyName?: string;
  ownerFirstname?: string;
  ownerFamilyName?: number;
  domain: string;
  type: string;
}

// 대안 2

// 이것은 원래 웹사이트 인터페이스가 사람에 맞게 이름이 바뀐 것입니다.
// 즉, 이전 코드와 테스트를 업데이트해야 했고
// 잠재적으로 몇 가지 버그가 발생할 수 있습니다.
interface PersonWebsite {
  ownerFirstname: string;
  ownerFamilyName: number;
  domain: string;
  type: string;
}

// 회사에서 사용할 수 있는 새로운 인터페이스입니다.
interface CompanyOwnedWebsite {
  companyName: string;
  domain: string;
  type: string;
}
```

ISP를 따르는 솔루션은 다음과 같습니다.

```ts
interface Person {
  firstname: string;
  familyName: string;
  age: number;
}

interface Company {
  companyName: string;
}

interface Website {
  domain: string;
  type: string;
}
```

위의 적절한 인터페이스를 사용하면 company 웹사이트를 나타내는 클래스는 Company 및 Website 인터페이스를 구현할 수 있지만 Person 인터페이스에서 firstname 및 familyName 프로퍼티를 고려할 필요가 없습니다.

### 리액트에서 ISP가 사용되나요?

따라서 이 원칙은 분명히 인터페이스에 적용되므로 타입스크립트를 사용하여 리액트 코드를 작성하는 경우에만 관련성이 있어야 하지 않을까요?

당연히 아닙니다! 인터페이스를 타이핑하지 않는다고 해서 인터페이스가 존재하지 않는 것은 아닙니다. 인터페이스는 곳곳에 존재하며, 단지 명시적으로 입력하지 않을 뿐입니다.

리액트에서 각 컴포넌트와 훅에는 입력과 출력이라는 두 가지 주요 인터페이스가 있습니다.

```tsx
// 훅에 대한 입력 인터페이스는 prop입니다.
const useMyHook = ({ prop1, prop2 }) => {
  // ...

  // 훅의 출력 인터페이스는 반환값입니다.
  return { value1, value2, callback1 };
};
```

타입스크립트를 사용하면 일반적으로 입력 인터페이스는 입력하지만, 출력 인터페이스는 선택 사항이기 때문에 건너뛰는 경우가 많습니다.

```tsx
// 입력 인터페이스.
interface MyHookProps {
  prop1: string;
  prop2: number;
}

// 출력 인터페이스.
interface MyHookOutput {
  value1: string;
  value2: number;
  callback1: () => void;
}

const useMyHook = ({ prop1, prop2 }: MyHookProps): MyHookOutput => {
  // ...

  return { value1, value2, callback1 };
};
```

훅이 prop2를 아무 용도로도 사용하지 않는다면 props의 일부가 아니어야 합니다. 단일 prop의 경우 prop 목록과 인터페이스에서 쉽게 제거할 수 있습니다. 하지만 prop2가 이전 장의 부적절한 Website 인터페이스 예시와 같이 객체 타입이라면 어떻게 될까요?

```tsx
interface Website {
  companyName?: string;
  ownerFirstname?: string;
  ownerFamilyName?: number;
  domain: string;
  type: string;
}

interface MyHookProps {
  prop1: string;
  website: Website;
}

const useMyCompanyWebsite = ({ prop1, website }: MyHookProps) => {
  // 이 훅은 domain, type 및 companyName을 사용합니다.
  // 그러나 ownerFirstname이나 ownerFamilyName은 사용하지 않습니다.

  return { value1, value2, callback1 };
};
```

이제 website prop이 있는 useMyCompanyWebsite 훅이 있습니다. website 인터페이스의 일부가 훅에 사용된 경우, 전체 website prop을 간단히 제거할 수 없습니다. website prop을 유지해야 하므로 ownerFirstname과 ownerFamiliyName에 대한 인터페이스 prop도 유지해야 합니다. 즉, company를 위한 이 훅이 해당 용도에 적절하게 작동하지 않을 수 있음에도 불구하고 개인 소유의 웹사이트 소유자가 이 훅을 사용할 수 있다는 의미이기도 합니다.

### 리액트에서 ISP를 사용하는 이유는 무엇인가요?

이제 ISP가 무엇을 의미하는지, 그리고 타입스크립트를 사용하지 않더라도 리액트에 어떻게 적용되는지 살펴보았습니다. 위의 사소한 예시만 봐도 ISP를 따르지 않을 때 어떤 문제가 발생하는지 알 수 있습니다.

더 복잡한 프로젝트에서는 가독성이 가장 큰 문제입니다. 인터페이스 분리 원칙의 목적 중 하나는 가독성을 방해할 뿐인 불필요한 코드의 존재, 즉 혼란을 피하는 것입니다. 그리고 잊지 말아야 할 것은 테스트 가능성입니다. 실제로 사용하지 않는 props의 테스트 커버리지에 신경을 써야 할까요?

대규모 인터페이스를 구현하면 props를 선택 사항으로 만들어야 할 수도 있습니다. 함수가 그러한 프로퍼티를 처리하는 것처럼 인터페이스에 나타나기 때문에 함수의 존재 여부와 잠재적 오용을 확인하는 문이 더 많아질 수 있습니다.

## 의존성 역전 원칙 (Dependency Inversion Principle, DIP)

마지막 원칙인 DIP에는 오해가 많은 용어가 포함되어 있습니다. 의존성 역전, 의존성 주입, 제어의 역전의 차이점이 무엇인지에 대해 많은 사람들이 혼란스러워합니다. 먼저 이 용어들을 정의해 보겠습니다.

#### 의존성 역전

의존성 역전 원칙은 고수준 모듈이 저수준 모듈로부터 아무것도 가져오지 말아야 하며, 둘 다 추상화에 의존해야 한다고 말합니다. 이는 본래 사용하는 모듈의 구현 세부 사항에 의존할 수 있는 고수준 모듈이 그러한 의존성을 가져서는 안 된다는 의미입니다.

고수준 및 저수준 모듈은 서로의 내부 구현 세부 사항에 대해 아무것도 알지 못한 채 사용할 수 있도록 작성되어야 합니다. 각 모듈은 인터페이스가 동일하게 유지되는 한 대체 구현으로 교체 가능해야 합니다.

#### 제어의 역전(Inversion of Control, IoC)

제어의 역전은 의존성 역전 문제를 해결하기 위해 사용되는 원칙입니다. 이 원칙은 모듈의 의존성을 외부 엔티티나 프레임워크에서 제공해야 한다고 명시합니다. 이렇게 하면 모듈 자체는 의존성을 단순히 사용하기만 하면 되고, 의존성을 생성하거나 관리할 필요가 없습니다.

#### 의존성 주입(Dependency Injection, DI)

의존성 주입은 제어의 역전을 구현하는 일반적인 방법 중 하나입니다. DI는 생성자나 setter 메서드를 통해 의존성을 모듈에 주입합니다. 이를 통해 모듈은 의존성을 직접 생성하지 않고 사용할 수 있게 되며, 이는 IoC 원칙에 부합합니다. 주목할 만한 점은, 의존성 주입이 제어의 역전을 달성하는 유일한 방법은 아니라는 것입니다.

### 리액트에서 DIP가 사용되나요?

용어가 명확해졌고 DIP 원칙이 의존성 역전에 관한 것임을 알았으니 이 정의가 어떻게 보이는지 다시 살펴볼 수 있습니다.

```
고수준 모듈은 저수준 모듈로부터 아무것도 가져오지 말아야 하며, 둘 다 추상화에 의존해야 합니다.
```

이것이 리액트에 어떻게 적용될까요? 리액트는 일반적으로 의존성 주입과 관련된 라이브러리가 아닌데, 그렇다면 의존성 역전 문제를 어떻게 해결할 수 있을까요?

이 문제를 해결하는 가장 일반적인 방법은 훅입니다. 훅은 의존성 주입으로 여겨지지 않습니다. 왜냐하면 훅은 컴포넌트 내에 하드코딩되어 있고, 컴포넌트의 구현을 변경하지 않고 다른 훅으로 교체할 수 없기 때문입니다. 개발자가 코드를 업데이트할 때까지 동일한 훅이 여전히 사용됩니다.

하지만 의존성 주입이 의존성 역전을 달성하는 유일한 방법은 아니라는 점을 기억하세요. 훅은 리액트 컴포넌트에 대한 외부 종속성으로 볼 수 있으며, 훅 내부의 코드를 추상화하는 인터페이스(props)가 있습니다. 이러한 방식으로 훅은 컴포넌트가 훅에 대한 세부 사항을 알 필요 없이 추상적인 인터페이스에 의존하기 때문에 의존성 역전 원리를 구현합니다.

의존성 주입을 실제로 사용하는 리액트에서 DIP를 보다 직관적으로 구현하는 또 다른 방법은 HOC와 컨텍스트를 사용하는 것입니다. 아래의 withAuth HOC를 보세요.

```tsx
const withAuth = (Component) => {
  return (props) => {
    const { user } = useContext(AuthContext)

    if (!user) {
      return <LoginComponent>
    }

    return <Component {...props} user={user} />
  }
}

const Profile = () => { // Profile 컴포넌트... }

// withAuth HOC를 사용하여 Profile 컴포넌트에 user를 삽입합니다.
const ProfileWithAuth = withAuth(Profile)
```

위에 표시된 withAuth HOC는 의존성 주입을 사용하여 Profile 컴포넌트에 유저를 제공합니다. 이 예제에서 흥미로운 점은 종속성 주입의 사용법을 한 번만 보여주는 것이 아니라 실제로 두 개의 종속성 주입이 포함되어 있다는 것입니다.

이 예제에서 유저를 Profile 컴포넌트에 주입하는 것만이 유일한 주입은 아닙니다. withAuth 훅은 실제로 useContext 훅을 통해 종속성 주입으로 유저를 가져옵니다. 코드 어딘가에서 누군가가 유저를 컨텍스트에 주입하는 프로바이더를 선언했습니다. 해당 유저 인스턴스는 컨텍스트에서 유저를 업데이트하여 런타임에 변경할 수도 있습니다.

### 리액트에서 DIP를 사용하는 이유는 무엇인가요?

의존성 주입은 리액트와 일반적으로 연관된 패턴은 아니지만, 실제로는 HOC와 컨텍스트에 존재합니다. 그리고 HOC와 컨텍스트에서 많은 시장 점유율을 차지한 훅들도 의존성 역전 원칙과 잘 부합합니다.

따라서 DIP는 이미 리액트 라이브러리 자체에 내장되어 있으므로 당연히 활용해야 합니다. 사용하기 쉽고 모듈 간의 느슨한 결합, 훅 및 컴포넌트 재사용성, 테스트 가능성 등의 이점을 제공합니다. 또한 단일 책임 원칙과 같은 다른 디자인 패턴을 더 쉽게 구현할 수 있습니다.

하지만, 간단한 해결책이 이미 존재할 때 지나치게 복잡한 해결책을 시도하거나 패턴을 과용하는 것은 지양해야 합니다. 저는 리액트 컨텍스트를 의존성 주입을 구현하는 유일한 목적으로 사용하는 것과 같은 제안을 웹이나 책에서 본 적이 있습니다. 아래와 같은 것들을 말입니다.

```tsx
const User = () => {
  const { role } = useContext(RoleContext);

  return <div>{`User has role ${role}`}</div>;
};

const AdminUser = ({ children }) => {
  return (
    <RoleContext.Provider value={{ role: 'admin' }}>
      {children}
    </RoleContext.Provider>
  );
};

const NormalUser = ({ children }) => {
  return (
    <RoleContext.Provider value={{ role: 'normal' }}>
      {children}
    </RoleContext.Provider>
  );
};
```

위의 예시에서는 User 컴포넌트에 역할을 주입하고 있지만, 컨텍스트를 사용하는 것은 순전히 과잉입니다. 리액트 컨텍스트는 컨텍스트 자체가 목적에 부합할 때 적절한 경우에 사용해야 합니다. 이 경우에는 간단한 props를 사용하는 것이 더 나은 해결책이었을 것입니다.

```tsx
const User = ({ role }) => {
  return <div>{`User has role ${role}`}</div>;
};

const AdminUser = () => <User role="admin" />;

const NormalUser = () => <User role="normal" />;
```

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
