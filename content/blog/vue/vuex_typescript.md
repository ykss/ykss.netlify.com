---
title: 'vuex + typescript (vuex-module-decorator, vuex-class)'
date: 2022-06-28 02:00:00
category: 'Vue'
draft: false
---

Vue를 사용하면서 전역 상태관리 라이브러리로 Vuex를 주로 사용한다. (리액트의 Redux와 같은 존재..)

Vue 공식 도큐멘테이션에서도 Vuex를 추천할만큼 대표적인 라이브러리라고 할 수 있다. 하지만 typescript와 함께 활용되는 부분에 대해서는 Vuex의 공식 문서에도 썩 자세히 나와있지 않다. 특히 주로 클래스 컴포넌트로 개발하는 개발자들에게는 더 더욱 잘 맞지 않는다.

그래서 Vuex를 클래스 형태로 정의해서 typescript와 쓰기 위해서 `vuex-module-decorator`와 `vuex-class`가 주로 쓰인다. 보통 typescript와 Vue를 사용해서 클래스 형태로 개발할 때 `vue-class-component`와 `vue-property-decorator`가 주로 사용되는데, `vuex-class`와 `vuex-module-decorator` 또한 위 두 라이브러리와 궁합이 잘 맞는 라이브러리라고 할 수 있겠다.

`vuex-module-decorator`를 사용하지 않을 경우와 사용할 경우는 아래와 같이 코드가 달라진다.

<사용하지 않을 경우>

```ts
const store = new Vuex.Store({})
```

<사용할 경우 - 클래스 형태>

```ts
import { Module, Mutation, Action, VuexModule } from 'vuex-module-decorators'

@Module
export default class Store extends VuexModule {}
```

이러한 부분은 일반적인 Vue 사용에서 `vue-class-component`를 통해 클래스 형태의 컴포넌트를 사용하게 되었고, 더 효율적인 사용을 위해 `vue-property-decorator`가 등장한 것과 맥락이 같았다. 스토어 또한 클래스 형태로 만들기 위해 `vuex-class`가 등장했고, 또 그것을 @를 통해 더 효율적으로 사용하게 하기 위해 `vuex-module-decorator`가 등장했다. (완벽하게 이러한 관계는 아니겠지만, 이런 맥락으로 이해가 되었다.)

개인적으로 스토어를 기존의 방식으로 정의한 것과 `vuex-module-decorator`를 사용해 모듈 형식으로 @를 써서 정의한 코드를 보면 확실히 후자가 가독성 측면에서 더 좋았고, 코드도 간결하게 표현할 수 있다는 생각이 들었다. 표현 방식만 다를 뿐 어떤 정답이 정해진 것은 아니기 때문에, 본인이 쓰기에 더 편하고 잘 읽히는 방식을 사용하면 된다.

## 1. `@Module`

마치 `@Component` 데코레이터와 비슷하게, 해당 클래스가 모듈인 것으로 지정해주는 데코레이터이다. `@Module` 선언이 되어있고, 해당 클래스가 VuexModule을 상속하여야 스토어의 역할을 할 수 있다.

`@Module` 데코레이터의 인자안에 `dynamic, namespaced, name`등의 옵션 지정이 가능하다.

## 2. state

기존에 state를 선언하려면 객체안에 state 속성 안에 선언을 해주어야 했지만, 데코레이터를 사용할 때는 변수 선언하듯이 선언이 가능하다. `vue-module-decorator`로 아래와 같이 코딩해도 기존 방식으로 다시 변환 됨을 기억하자.

<기존 방식>

```ts
export default {
  state: {
    wheels: 2,
  },
}
```

< vue-module-decorator 방식>

```ts
import { Module, VuexModule } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2
}
```

state의 경우에는 값이 결정되어 있지 않은 경우, `null`로 초기화되어야 한다. 타입 같은 경우는 타입 유니온을 통해 `number|null`과 같이 선언해줄 수 있다.

## 3. getter

getter 같은 경우에는 getter 역할을 하는 메서드를 get을 붙여 선언하는 방식으로 사용될 수 있다.

<기존 방식>

```ts
export default {
  //...
  getters: {
    axles: state => state.wheels / 2,
  },
}
```

< vue-module-decorator 방식>

```ts
import { Module, VuexModule } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2
  get axles() {
    return this.wheels / 2
  }
}
```

## 4. `@Mutation`

`@Mutation` 을 통해 mutation 선언이 간으하고 해당 데코레이터를 사용하고 나면 `this`는 state를 가르키게 된다. 그렇기 때문에 `state.item++` 이나 `this.item++` 모두 가능하다.

<기존 방식>

```ts
export default {
  state: {
    wheels: 2,
  },
  mutations: {
    puncture: (state, payload) => {
      state.wheels = state.wheels - payload
    },
  },
}
```

< vue-module-decorator 방식>

```ts
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2

  @Mutation
  puncture(n: number) {
    this.wheels = this.wheels - n
  }
}
```

Mutation에 `async`가 쓰이면 안된다. 그리고 `=>` 방식으로 정의되서도 안된다. 런타임에 다시 바인딩해야 하기 때문이다.

## 5. `@Action`

액션을 선언하는 방식도 `@Action` 데코레이터를 통해 정의한다. 비동기 작업을 처리해야 하는 경우, `async`와 함께 자주 사용된다. `@Action` 메서드가 정의되면 `this`는 `{...[all fields of state], context}`와 같은 형태를 가지게 된다. `@Action({ commit: 'increment' })`으로 표현하여 뮤테이션에 커밋해 줄 수도 있다.

<기존 방식>

```ts
const request = require('request')
export default {
  state: {
    wheels: 2,
  },
  mutations: {
    addWheel: (state, payload) => {
      state.wheels = state.wheels + payload
    },
  },
  actions: {
    fetchNewWheels: async (context, payload) => {
      const wheels = await request.get(payload)
      context.commit('addWheel', wheels)
    },
  },
}
```

< vue-module-decorator 방식>

```ts
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { get } from 'request'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2

  @Mutation
  addWheel(n: number) {
    this.wheels = this.wheels + n
  }

  @Action
  async fetchNewWheels(wheelStore: string) {
    const wheels = await get(wheelStore)
    this.context.commit('addWheel', wheels)
  }
}
```

## 6. `@MutationAction`

`@Action`과 `@Mutation`을 사용하다 보면 아래와 같은 요구 사항이 생길 수 있다.

먼저 비동기 작업을 수행해야 한다.

그 후 뮤테이션을 통해 결과값을 스토어에 커밋해야 한다.

위와 같은 상황을 위해 사용되는 데코레이터가 `@MutationAction`이다.

```ts
const typicodeModule = {
  state: {
    posts: [],
    users: [],
  },
  mutations: {
    updatePosts: function(state, posts) {
      state.posts = posts
    },
  },
  actions: {
    updatePosts: async function(context) {
      const posts = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
      )
      context.commit('updatePosts', posts)
    },
  },
}
```

위와 같이 표현할 수 있는 것을 `@MutationAction`을 통해 아래와 같이 나타낼 수 있다.

```ts
import {VuexModule, Module, MutationAction} from 'vuex-module-decorators'

  @Module
  class TypicodeModule extends VuexModule {
  posts: Post[] = []
  users: User[] = []

  @MutationAction
  async function updatePosts() {
  const posts = await axios.get('https://jsonplaceholder.typicode.com/posts')
  return { posts }

  }
}
```

## 참고

`namespace` 모듈을 사용하려면 `@Module` 데코레이터 안에서 `@Module({ namespaced: true, name: 'mm' })`과 같이 정의할 수 있다. 네임스페이스를 사용함을 통해 여러 스토어 모듈을 사용할 때, 구분할 수 있게 된다.

컴포넌트에서 스토어를 연결하여 사용할 때, `vuex-class`의 `namespace` 를 사용하여 만들어진 스토어 모듈을 연결한다. 그 후 해당 모듈의 state와 getter로 상탯값을 가져와 화면에 보여주는 것이다.

```ts
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace, State, Action, Getter } from 'vuex-class';

const CountStoreModule = namespace('CountStore');

@Component
export default class Home extends Vue {
  @CountStoreModule.State('count')
  private count!: number;

  @CountStoreModule.Getter('doubledCount')
  private doubledCount!: number;

  @CountStoreModule.Action('incr')
  private incr!: (delta: number) => void;
}
```

---

## 출처

1. [VueJS 에서 Typescript로 개발하기 4](https://blog2.deliwind.com/20181207/frontend-vue-typescript-4/)

2. [vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/)
