---
title: '(번역) 좋은 리팩터링 vs 나쁜 리팩터링'
date: 2024-09-09 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [Good Refactoring vs Bad Refactoring](https://www.builder.io/blog/good-vs-bad-refactoring)

![thumbnail](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fba58b9ad55ac461181bc7d5f9babd14a)

저는 수년간 많은 개발자를 고용해 왔습니다. 그중 상당수는 우리의 코드가 대대적인 리팩터링이 필요하다는 확고한 신념을 가지고 있었습니다. 하지만 문제는, 거의 모든 경우에서 다른 개발자들이 리팩터링된 코드를 이전보다 이해하고 유지보수하기 더 어렵다고 느꼈다는 점입니다. 게다가, 일반적으로 더 느리고 버그가 많기도 했습니다.

오해하지 마세요. 리팩터링 자체가 나쁜 것은 아닙니다. 그것은 코드 베이스를 견고하게 유지하는 데 중요한 과정입니다. 문제는 나쁜 리팩터링은, 음.., 나쁩니다. 더 나은 것을 만들려다 오히려 상황을 더 악화시키는 함정에 빠지기 쉽게 합니다.

그렇다면, 좋은 리팩터링과 나쁜 리팩터링의 차이를 알아보고, 모두가 코드 베이스 근처에 오기만 해도 꺼리는 개발자가 되지 않으려면 어떻게 해야 하는지 알아봅시다.

![코드 리팩터링에 지나치게 집착하는 비버의 만화](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fe857bc9a29f8428a95d0b0233a6f3f8e?format=webp&width=2000)

## 리팩터링의 좋은 점, 나쁜 점, 추악한 점

추상화는 좋을 수도 있고 나쁠 수도 있습니다. 핵심은 언제 어떻게 적용해야 하는지를 아는 것입니다. 자주 발생하는 함정과 이를 피하는 방법을 살펴보겠습니다.

### 1. 코딩 스타일을 크게 변경하는 것

제가 가장 자주 본 실수 중 하나는 개발자들이 리팩터링 과정에서 코딩 스타일을 완전히 바꾸는 경우입니다. 이는 종종 다른 배경을 가진 사람이 오거나 특정 프로그래밍 패러다임에 대해 강한 의견을 가진 경우에 발생합니다.

예를 들어 아래와 같이 정리할 필요가 있는 코드가 있다고 가정해 보겠습니다.

#### **변경 전**

```tsx
// 🫤 이 코드는 더 간결해질 수 있습니다.
function processUsers(users: User[]) {
  const result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].age >= 18) {
      const formattedUser = {
        name: users[i].name.toUpperCase(),
        age: users[i].age,
        isAdult: true,
      };
      result.push(formattedUser);
    }
  }
  return result;
}
```

#### **나쁜 리팩터링**

```tsx
import * as R from 'ramda';

// 🚩 완전히 다른 스타일과 라이브러리를 채택했습니다.
const processUsers = R.pipe(
  R.filter(R.propSatisfies(R.gte(R.__, 18), 'age')),
  R.map(
    R.applySpec({
      name: R.pipe(R.prop('name'), R.toUpper),
      age: R.prop('age'),
      isAdult: R.always(true),
    })
  )
);
```

이 리팩터링 된 버전은 함수형 프로그래밍을 좋아하는 사람들에게는 매력적일 수 있지만, 새로운 라이브러리(Ramda)를 도입하고 완전히 다른 코딩 스타일을 적용했습니다. 이 접근 방식에 익숙하지 않은 팀에게는 유지보수가 악몽처럼 느껴질 수 있습니다.

#### **좋은 리팩터링**

```tsx
// ✅ 컨벤션을 지키면서 더 깔끔합니다.
function processUsers(users: User[]): FormattedUser[] {
  return users
    .filter(user => user.age >= 18)
    .map(user => ({
      name: user.name.toUpperCase(),
      age: user.age,
      isAdult: true,
    }));
}
```

이 버전은 `filter`와 `map`과 같은 더 보편적인 자바스크립트 메서드를 사용하여 원래 코드를 개선합니다. 이는 더 간결하고 읽기 쉬워졌지만, 완전히 새로운 패러다임이나 외부 의존성을 도입하지 않았습니다.

### 2. 불필요한 추상화

한 번은 기본 코드를 제대로 이해하지 못한 채 수많은 새로운 추상화를 추가한 사람을 고용한 적이 있습니다. 그 결과, 함께 묶어서는 안 되는 것들을 그룹화하기 시작했고, 시간이 지나면서 (의도적으로) 점차 코드의 일부를 서로 다른 방향으로 분리하려고 했습니다. 또한 서로 다른 API에는 각각 다른 설정이 필요했는데, 일부 설정들을 잘못 통합해 버렸습니다.

#### **변경 전**

```tsx
// 🫤 이 코드는 더 간결해질 수 있습니다.
function processUsers(users: User[]) {
  const result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].age >= 18) {
      const formattedUser = {
        name: users[i].name.toUpperCase(),
        age: users[i].age,
        isAdult: true,
      };
      result.push(formattedUser);
    }
  }
  return result;
}
```

#### **나쁜 리팩터링**

```tsx
// 🚩 여기에는 필요 이상으로 많은 레이어와 추상화가 있습니다.
class UserProcessor {
  private users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  public process(): FormattedUser[] {
    return this.filterAdults().formatUsers();
  }

  private filterAdults(): UserProcessor {
    this.users = this.users.filter(user => user.age >= 18);
    return this;
  }

  private formatUsers(): FormattedUser[] {
    return this.users.map(user => ({
      name: this.formatName(user.name),
      age: user.age,
      isAdult: true,
    }));
  }

  private formatName(name: string): string {
    return name.toUpperCase();
  }
}

const processUsers = (users: User[]): FormattedUser[] => {
  return new UserProcessor(users).process();
};
```

이 리팩터링은 여러 메서드를 가진 클래스를 도입하는데, 이는 더 "객체 지향적"으로 보일 수 있지만, 실제로는 더 복잡해지고 한눈에 이해하기 어려워집니다.

#### **좋은 리팩터링**

```tsx
// ✅ 컨벤션을 지키면서 더 깔끔합니다.
const isAdult = (user: User): boolean => user.age >= 18;

const formatUser = (user: User): FormattedUser => ({
  name: user.name.toUpperCase(),
  age: user.age,
  isAdult: true,
});

function processUsers(users: User[]): FormattedUser[] {
  return users.filter(isAdult).map(formatUser);
}
```

이 버전은 불필요한 복잡성을 도입하지 않고, 로직을 재사용할 수 있는 작은 함수로 분해합니다.

### 3. 일관성의 부족

개발자들이 코드 베이스의 일부를 "개선"이란 명목으로 바꾸려고 시도하다가 나머지 코드 베이스와는 완전히 다르게 작동하게 만든 사례를 본 적이 있습니다. 이는 개발자가 서로 다른 스타일 사이에서 컨텍스트 전환을 해야 하므로 혼란과 좌절을 초래할 수 있습니다.

예를 들어, 리액트 쿼리를 일관되게 사용하여 데이터 페칭을 처리하는 리액트 애플리케이션이 있다고 가정해 봅시다.

```tsx
// 앱 전체에서
import { useQuery } from 'react-query';

function UserProfile({ userId }) {
  const { data: user, isLoading } = useQuery(['user', userId], fetchUser);

  if (isLoading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

이제 한 개발자가 단지 하나의 컴포넌트에서만 리덕스 툴킷을 사용하기로 결정했다고 가정해 보겠습니다.

```tsx
// 일회용 컴포넌트
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './postsSlice';

function PostList() {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  return <div>{posts.map(post => <div key={post.id}>{post.title}</div>)}</div>;
```

이러한 불일치는 한 컴포넌트에서만 완전히 다른 상태 관리 패턴을 도입하므로 만족스럽지 않습니다.

더 나은 접근 방식은 리액트 쿼리를 계속 사용하는 것입니다.

```tsx
// 일관성 있는 접근 방식
import { useQuery } from 'react-query';

function PostList() {
  const { data: posts, isLoading } = useQuery('posts', fetchPosts);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

이 버전은 애플리케이션 전체에서 데이터 페칭에 리액트 쿼리를 사용하며 일관성을 유지합니다. 더 간단하고, 다른 개발자들이 한 컴포넌트를 위해 새로운 패턴을 배울 필요가 없습니다.

코드 베이스의 일관성이 중요하다는 점을 기억하세요. 새로운 패턴을 도입해야 하는 경우, 일회성 불일치를 만들기보다는 먼저 팀원들의 동의를 얻을 방법을 고려하세요.

### 4. 코드 이해 없이 리팩터링하기

제가 본 큰 문제 중 하나는 코드를 이해하기 위해 리팩터링을 시도하는 것입니다. 이것은 매우 나쁜 생각입니다. 특정 코드를 6~9개월 정도 다루라는 의견을 들은 적이 있습니다. 그렇지 않으면 버그를 만들거나 성능을 해칠 가능성이 높습니다.

#### **변경 전**

```tsx
// 🫤 여기에는 너무 많은 하드 코딩이 있습니다.
function fetchUserData(userId: string) {
  const cachedData = localStorage.getItem(`user_${userId}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  return api.fetchUser(userId).then(userData => {
    localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
    return userData;
  });
}
```

#### **나쁜 리팩터링**

```tsx
// 🚩 캐싱은 어디로 갔나요?
function fetchUserData(userId: string) {
  return api.fetchUser(userId);
}
```

리팩터링을 수행한 사람은 코드를 단순화했다고 생각할 수 있지만, 실제로는 API 호출을 줄이고 성능을 향상하기 위해 존재했던 중요한 캐싱 메커니즘을 제거한 것입니다.

#### **좋은 리팩터링**

```tsx
// ✅ 기존 동작을 보존하는 깔끔한 코드
async function fetchUserData(userId: string) {
  const cachedData = await cacheManager.get(`user_${userId}`);
  if (cachedData) {
    return cachedData;
  }

  const userData = await api.fetchUser(userId);
  await cacheManager.set(`user_${userId}`, userData, { expiresIn: '1h' });
  return userData;
}
```

이 리팩터링은 캐싱 기능을 유지하면서, 만료 기능을 갖춘 더 정교한 캐시 관리자를 사용해 잠재적으로 캐싱 동작을 개선할 수 있습니다.

### 5. 비즈니스 맥락을 이해하라

한 번은 끔찍한 레거시 코드가 가득한 회사에 입사한 적이 있습니다. 저는 이커머스 회사를 더 빠르고, 현대적이며, 더 나은 기술로 마이그레이션 하는 프로젝트를 이끌었죠... 그 기술은 바로 Angular.js였습니다.

그런데 알고 보니 이 비즈니스는 SEO에 크게 의존하고 있었고, 우리는 느리고 비대한 단일 페이지 앱을 만들었습니다.

2년 동안 우리가 만든 것이라고는 기존 웹사이트의 더 느리고, 버그가 많으며, 유지 보수하기 어려운 복제품뿐이었습니다. 왜 이런 일이 벌어졌을까요? 이 프로젝트를 주도한 사람들(저를 포함해서 - 이 시나리오에서 저는 바보였습니다)이 이 사이트에서 일해본 적이 없었기 때문입니다. 저는 어리고 어리석었죠.

이 실수와 관련된 현대적인 예시를 살펴봅시다.

#### **나쁜 리팩터링**

```tsx
// 🚩 SEO 중심 사이트에 단일 페이지 앱은 나쁜 생각입니다.
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/product/:id" component={ProductDetails} />
      </Switch>
    </Router>
  );
}
```

이 접근 방식은 현대적이고 깔끔해 보일 수 있지만, 전적으로 클라이언트 사이드 렌더링입니다. SEO에 크게 의존하는 이커머스 사이트에는 재앙이 될 수 있습니다.

#### **좋은 리팩터링**:

```tsx
// ✅ 서버가 SEO 중심 사이트를 렌더링 합니다.
export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts();
  return { props: { products } };
};

export default function ProductList({ products }) {
  return <div>...</div>;
}
```

이 Next.js 기반 접근 방식은 서버 사이드 렌더링을 기본적으로 제공하며, 이는 SEO에 매우 중요합니다. 또한 초기 페이지 로드를 더 빠르게 하고, 느린 연결을 사용하는 사용자들에게 향상된 성능을 제공합니다. Remix도 이 목적에 적합하며, 서버 사이드 렌더링과 SEO 최적화를 위한 유사한 이점을 제공합니다.

### 6. 과도한 코드 통합

한 번은 출근 첫날부터 즉시 백엔드 코드를 리팩터링하기 시작한 사람을 고용한 적이 있습니다. 우리는 여러 개의 Firebase 함수를 가지고 있었고, 이들 중 일부는 타임아웃과 메모리 할당 같은 설정이 달랐습니다.

우선 변경 전 설정을 살펴보겠습니다.

#### **변경 전**

```tsx
// 😕 코드베이스에 같은 코드가 40번 이상 있었다면, 아마도 통합할 수 있을 것입니다.
export const quickFunction = functions
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onRequest(...);

export const longRunningFunction = functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .https.onRequest(...);
```

이 사람은 모든 함수를 하나의 `createApi` 함수로 묶기로 했습니다.

#### **나쁜 리팩터링**

```tsx
// 🚩 통합해서는 안 되는 설정을 맹목적으로 통합하는 경우
const createApi = (handler: RequestHandler) => {
  return functions
    .runWith({ timeoutSeconds: 300, memory: '512MB' })
    .https.onRequest((req, res) => handler(req, res));
};

export const quickFunction = createApi(handleQuickRequest);
export const longRunningFunction = createApi(handleLongRunningRequest);
```

이 리팩터링은 모든 API에 동일한 설정을 적용하여 API마다 개별적으로 설정을 재정의할 수 없게 만들었습니다. 이는 각 함수에 대해 다른 설정이 필요한 경우가 있기 때문에 문제입니다.

더 나은 접근 방식은 Firebase 옵션을 API별로 전달할 수 있도록 하는 것입니다.

#### **좋은 리팩터링**

```tsx
// ✅ 적절한 기본값을 설정하되 누구나 재정의할 수 있도록 허용합니다.
const createApi = (handler: RequestHandler, options: ApiOptions = {}) => {
  return functions
    .runWith({ timeoutSeconds: 300, memory: '512MB', ...options })
    .https.onRequest((req, res) => handler(req, res));
};

export const quickFunction = createApi(handleQuickRequest, {
  timeoutSeconds: 60,
  memory: '256MB',
});
export const longRunningFunction = createApi(handleLongRunningRequest, {
  timeoutSeconds: 540,
  memory: '1GB',
});
```

이 방식으로 추상화의 이점을 유지하면서도 필요한 유연성을 보존할 수 있습니다. 코드를 통합하거나 추상화할 때는 사용하는 사람들의 입장을 항상 생각해 보세요. "더 깔끔한" 코드를 위해 유연성을 희생하지 마세요. 추상화는 원래 구현이 제공한 모든 기능을 허용할 수 있도록 해야 합니다.

그리고 정말로, "개선"하기 전에 코드를 제대로 이해해야 합니다. 이번에 일부 API를 배포했을 때 무분별한 리팩터링으로 인해 문제가 발생했습니다.

## 올바른 리팩터링 방법

코드 리팩터링은 분명 필요합니다. 하지만 제대로 해야 합니다. 우리의 코드는 완벽하지 않고 정리가 필요하지만, 코드 베이스와 일관성을 유지하고, 코드를 잘 이해하며, 추상화에 신중을 기해야 합니다.

성공적인 리팩터링을 위한 몇 가지 팁은 다음과 같습니다.

1. 점진적으로 작업하세요. 대대적인 수정보다는 관리가 가능하도록 변경을 작게 만드세요.
2. 중요한 리팩터링이나 새로운 추상화를 도입하기 전에 코드를 깊이 이해하세요.
3. 기존의 코딩 스타일과 맞추세요. 일관성은 유지보수의 핵심입니다.
4. 너무 많은 새로운 추상화를 피하세요. 복잡성이 정말 필요한 경우가 아니면 간단하게 유지하세요.
5. 팀의 동의 없이 새로운 라이브러리, 특히 매우 다른 프로그래밍 스타일의 라이브러리를 추가하지 마세요.
6. 테스트를 작성하고 진행하면서 리팩터링하세요. 이를 통해 원래 기능이 유지되는지 확인할 수 있습니다.
7. 이러한 원칙을 동료들이 준수하도록 하세요.

![코드 이해, 작은 변경, 피드백 받기, 반복에 대한 흐름도](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fd9793fb2c0b14962b88ee123f35f11d6?format=webp&width=2000)

## 더 나은 리팩터링을 위한 도구와 기법

리팩터링이 유익한지 아닌지 확인하려면 다음과 같은 기법과 도구의 사용을 고려하세요.

### 린트 도구

일관된 코드 스타일을 강제하고 잠재적인 문제를 잡아내기 위해 Linting 도구를 사용하세요. [Prettier](https://prettier.io/)는 일관된 스타일로 자동 포맷팅하는 데 도움을 줄 수 있으며, [Eslint](https://eslint.org/)는 자체 플러그인을 쉽게 커스터마이즈하여 더 세밀한 일관성 검사를 도와줍니다.

### 코드 리뷰

리팩터링 된 코드를 병합하기 전에 동료로부터 피드백을 받기 위해 철저한 코드 리뷰를 시행하세요. 이를 통해 잠재적인 문제를 초기에 잡아내고, 리팩터링 된 코드가 팀의 기준과 기대에 부합하는지 확인할 수 있습니다.

### 테스트

리팩터링 된 코드가 기존 기능을 깨뜨리지 않도록 테스트를 작성하고 실행하세요. [Vitest](https://vitest.dev/)는 빠르고, 안정적이며, 기본적으로 설정이 필요 없는 간편한 테스트 러너입니다. 시각적 테스트를 위해 [Storybook](https://storybook.js.org/)을 고려해 보세요. [React Testing Library](https://github.com/testing-library/react-testing-library)는 리액트 컴포넌트를 테스트하는 데 훌륭한 도구 모음이며, [Angular](https://github.com/testing-library/angular-testing-library) 및 [더 많은 변형](https://github.com/testing-library)도 있습니다.

### (적절한) AI 도구

기존 코딩 스타일과 규칙에 맞는 리팩터링 작업을 도울 수 있는 AI 도구를 활용하세요.

프런트엔드 코딩의 일관성을 유지하는 데 특히 유용한 도구 중 하나는 [Visual Copilot](https://www.builder.io/m/design-to-code)입니다. 이 AI 기반 도구는 디자인을 코드로 변환하는 데 도움을 주며, 기존의 코딩 스타일에 맞게 설계 시스템 구성 요소와 토큰을 올바르게 활용할 수 있습니다.

<iframe width="740" height="415" src="https://cdn.builder.io/o/assets%2FYJIGb4i01jvw0SRdL5Bt%2F434666a6b3584f0a87bfafcd1fa24fa3%2Fcompressed?apiKey=YJIGb4i01jvw0SRdL5Bt&token=434666a6b3584f0a87bfafcd1fa24fa3&alt=media&optimized=true" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 결론

리팩터링은 소프트웨어 개발의 필수적인 부분이지만, 기존 코드 베이스와 팀의 역할을 존중하면서 신중하게 이루어져야 합니다. 리팩터링의 목표는 외부 동작을 변경하지 않으면서 코드의 내부 구조를 개선하는 것입니다.

리팩터링의 최종 목표는 외부 사용자에게는 눈에 띄지 않지만, 개발자의 작업을 훨씬 쉽게 만드는 것입니다. 가독성, 유지보수성, 효율성을 향상하면서 전체 시스템을 방해하지 않습니다.

다음에 코드를 "대대적으로 개선"하고 싶은 충동을 느낄 때, 잠시 멈춰 서서 깊이 이해하고, 변화의 영향을 고려하며, 팀이 만족할 만한 점진적인 개선을 해보세요.

미래의 자신(그리고 동료들)은 코드 베이스를 깔끔하고 유지보수 가능하게 유지하려는 신중한 접근 방식에 감사할 것입니다.

혹시 유튜브 영상도 좋아하시나요? 제가 직접 만든 비디오도 있습니다.

[![](https://img.youtube.com/vi/N-BqaCIS92k/0.jpg)](https://youtu.be/N-BqaCIS92k)

## 소개

안녕하세요, 저는 [Builder.io](https://www.builder.io/)의 CEO인 Steve입니다. 우리는 Visual Copilot과 같은 개발 도구를 만들고 있으며, 이 도구는 [Figma 디자인을 훌륭한 코드로 변환](https://www.builder.io/m/design-to-code)합니다. 꼭 한 번 사용해 보세요.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
