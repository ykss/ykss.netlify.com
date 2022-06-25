---
title: 'vue-property-decorator (vue+typescript+class)'
date: 2022-06-25 02:00:00
category: 'Vue'
draft: false
---

`vue-property-decorator`는 typescript환경에서 vue를 클래스 타입으로 사용할 때 주로 사용하는 라이브러리이고 `vue-class-component`를 기반으로 만들어졌다.

`vue-class-component` 라이브러리는 데코레이터(@)를 사용하여 클래스 스타일로 코딩할 수 있게 해주는 라이브러리이다.

1. @Component

`@Component` 데코레이터는 정의한 class를 Vue component로 만들어준다. data나 methods도 일반적인 클래스의 프로퍼티 형태로 선언하여 사용할 수 있다. 이 데코레이터는 `vue-property-decorator`에서 제공한다기 보단 `vue-class-component`에서 가져온 것이다.

```ts
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Example extends Vue {
  // data
  message = 'hello world!'
  // method
  hello() {
    console.log('hello world!')
  }
}
```

단, 메서드를 선언할 때, `create()`, `mounted()` 와 같이 vue의 라이프사이클 훅이나 `beforeRouteEnter`처럼 뷰 네비게이트 가드 훅 등은 특별한 기능을 하기 때문에 일반적인 메서드 이름으로는 피해야 한다.

Computed Properties의 경우는 두 가지 방법으로 사용 가능하다. 첫 번째 방법은 `getter/setter`를 선언하여 사용하는 것이다.

```ts
<template>
  <input v-model="name">
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Example extends Vue {
  firstName = 'Ngolo'
  lastName = 'Kante'

  get name() {
    return this.firstName + ' ' + this.lastName
  }

  set name(value) {
    const splitted = value.split(' ')
    this.firstName = splitted[0]
    this.lastName = splitted[1] || ''
  }
}
</script>
```

또 다른 방법은 `@Component` 데코레이터 내에서 사용하는 방법이다.

```ts
@Component({
  computed: {
    name() {
      retrun this.firstName + ' ' + this.lastName;
    }
  }
})
export default class Example extends Vue {
  firstName = 'Ngolo'
  lastName = 'Kante'
}
```

위의 경우 처럼 `computed, components, filters` 와 같은 컴포넌트 옵션들을 데코레이터 인자에 포함시켜 사용할 수 있다. 이외에도 자주 사용되는 옵션은 directives, mixins, life-cycle hooks 등이 있다.

2. @Prop

> @Prop(options: (PropOptions | Constructor[] | Constructor) = {})

컴포넌트에서 Prop을 받아 쓸 때 사용하는 데코레이터이다. `@Prop({ default: 'default value' })` 식으로 Prop의 기본 값을 지정해줄 수 있다.

```ts
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Prop(Number) readonly propA: number | undefined
  @Prop({ default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined
}
```

위 코드를 보면 `readonly`와 `!`가 쓰이는 걸 볼 수 있는데 실제 `@Prop`을 사용할 때, 자주 함께 쓰이곤 한다.

> - `readonly`
>
> 대상 멤버를 읽기 전용으로 한정하겠다는 한정자이다. `readonly` 한정자가 붙어 있는 변수에 할당을 하면 오류가 생긴다. 보통 `@Prop`이나 `@Model` 등에 `readonly` 한정자를 선언하는게 좋다.
>
> - `!` (NonNullAssersion)
>
> `!`은 `null` 아님 단언이라고 할 수 있다. `!`가 붙은 경우에는 해당 멤버는 `null`이나 `undefined`가 아니라고 확정짓는 의미이다. 너무 많이 사용할 경우 확장성에 제한이 생길 수 있기 때문에 `required: true`나 default value를 설정하는게 바람직하다.

3. @PropSync

> @PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {})

보통의 경우, 부모 컴포넌트에서 내려준 Prop의 경우, 자식 컴포넌트에서 직접 변경하면 아래와 같은 메시지를 보게된다.

> Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "variables"

뷰는 기본적으로 단방향으로 내려주기 때문에 props값을 가져와서 data에 넣어서 props로 받은 값을 child에서 변경시키면 안된다. 이러한 경우에 `@PropSync`를 사용하면 부모가 정의한 `.sync`를 통해 전달받은 props를 변경할 수 있다.

<부모 컴포넌트>

```ts
<template>
	<ChildComponent
    :selectedItems.sync="selectedItems"
   />
</template>

@Component({
  components: {
    ChildComponent,
  },
})
export default class ParentComponent extends Vue {
  public selectedItems: Array<string> = [];
}
```

<자식 컴포넌트>

```ts
@Component
export default class ChildComponent extends Vue {
  @PropSync('selectedItems') public selected?: Array<string>

  create() {
    this.selected = []
  }
}
```

여기서 주의할 점은 부모 컴포넌트에서 `:selectItems.sync="..."`를 통해 내렸다면 자식 컴포넌트에서 `@PropSync`의 인자 name에도 동일하게 지정해줘야한다. 이게 제대로 매핑되지 않으면 오류가 발생한다.

4. @Watch

> @Watch(path: string, options: WatchOptions = {})

```ts
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Example extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) {}

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged1(val: Person, oldVal: Person) {}

  @Watch('person')
  onPersonChanged2(val: Person, oldVal: Person) {}

  @Watch('person')
  @Watch('child')
  onPersonAndChildChanged() {}
}
```

`@Watch()`의 인자로 지정한 변수를 모니터링해서 변경이 되었을 때 처리를 수행하는 데코레이터이다. 첫 번째 인자에는 모니터링 대상 값을 넣고, 두 번째 인자에는 옵션을 지정할 수 있다. 자주 쓰이는 옵션은 아래와 같다.

`deep: true / false` : nested object도 감시할지 여부이다. 옵션을 사용할 경우, 객체 내부(하위 속성)의 값까지도 변경되었는지 감지한다.

`immediate: true / false` : 처음 값을 읽어들이는 시점에도 호출할지 여부이다.

만약 같은 값을 여러 번 `@Watch()` 했을 경우에 가장 마지막에 지정한 것이 유효하다.

5. @Emit

> @Emit(event?: string)

Prop이 상위 컴포넌트에서 하위 컴포넌트로 데이터를 내려주는 것이라면, Emit은 하위 컴포넌트에서 상위 컴포넌트로 데이터를 넘길 순 없기 때문에 하위 컴포넌트에서 이벤트를 발생시켜 상위 컴포넌트의 데이터를 변화시키는 것이다.

<상위 컴포넌트>

```ts
<template>
  <ChildComponent @showLog="handleClick"/>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ChildComponent from '@/components/ChildComponent.vue';

@Component({
  components: {
    ChildComponent
  }
})
export default class ParentComponent extends Vue {
  handleClick(value: string) {
  console.log('hello world ', value);
 }
}
</script>
```

<하위 컴포넌트> - `@Emit`을 사용하지 않을 경우.

```ts
<template>
  <form @submit="onSubmit">
    <input v-model="value">
    <button type="submit">Submit</button>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ChildComponent extends Vue {
  value = '';

  // 부모로 값 전달
  onSubmit() {
    this.$emit('showLog', this.value);
  }
}
</script>
```

위와 같이 `$emit()`을 호출하면 괄호안에 정의된 이벤트가 발생한다. 일반적으로 하위 컴포넌트 특정 메서드 내부에서 호출한다. 하위 컴포넌트에서 `@Emit`을 사용하면 좀 더 코드가 단순해질 수 있다. 처리되는 이벤트 이름은 `@Emit` 옵션으로 구분할 수도 있지만 생략할 경우에는 메서드의 이름을 이벤트의 이름으로 사용한다.

```ts
<template>
  <form @submit="onSubmit">
    <input v-model="value">
    <button type="submit">Submit</button>
  </form>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

@Component
export default class ChildComponent extends Vue {
  value = '';

  @Emit()
  showLog() {
    return this.value
  }
}
</script>
```

6. @Ref

> @Ref(refKey?: string)

`@Ref`는 `$refs`에서 참조할 수 있는 요소 또는 컴포넌트를 정의하는 것으로 엘리먼트나 컴포넌트 요소에 접근하기 위해 사용한다.

```ts
<template>
  <ChildComponent ref="childComponent" />
  <button ref="submitButton">Submit</button>
</template>
<script>
import { Vue, Component, Ref } from 'vue-property-decorator'

@Component({
components: {
ChildComponent
}
})
export default class SampleComponent extends Vue {
@Ref() childComponent: ChildComponent;
@Ref() submitButton: HTMLButtomElement;

mounted() {
  // 자식 컴포넌트 메서드 실행
  this.childComponent.updateValue();
  // 버튼에 포커스 설정
  this.submitButton.focus()
}
}
</script>
```

`@Ref()`를 쓰지 않았다면, `this.$refs.submitButton.focus()`와 같은 식으로 불러다 쓸 수 있다.

7. @Provide/ @Inject

> @Provide(key?: string | symbol) / @Inject(options?: { from?: InjectKey, default?: any } | InjectKey)

부모 컴포넌트에서 `@Provide`로 정의된 대상을 자식 컴포넌트에서 @Inject로 참조할 수 있다. 이렇게만 보면 단순히 props와 차별점이 없어보인다. 부모 컴포넌트 아래 하위 컴포넌트가 깊게 여러 컴포넌트가 존재할 경우, 일반적으로 props를 통해 최하위 컴포넌트로 전달하려면, 전달에 또 전달을 반복해야 하지만(props drilling), `provide / inject`를 활용하면 최하단 컴포넌트에서 바로 불러다 쓸 수 있다. 리액트의 context API와 조금 비슷한 느낌이라고 볼 수 있다.

하지만 Vue 공식 문서에서도 고급 플러그인이나 컴포넌트 라이브러리에서 주로 사용되고 일반적인 애플리케이션에서 사용을 지양해야한다고 명시하고 있기 때문에 가능하면 vuex와 같이 상태관리 라이브러리를 사용하는 편이 바람직하다. `provide` / `inject`를 사용할 경우 코드의 추적이 어렵기 때문이다.

<부모 컴포넌트>

```ts
<template>
  <div class="home">
    <button @click="changeMessage">메세지를 바꿔주세요.</button>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import Children from "@/components/Children.vue";

@Component({
  components: {
    Children,
  },
})
export default class HomeView extends Vue {
  message = "hello world";
  changeMessage() {
    this.message = "change";
  }
  @Provide("message") msg = "provide/inject example";
}
</script>
```

<자식 컴포넌트>

```ts
<template>
  <div>
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Inject,
  Prop,
  Vue,
  Watch,
} from "vue-property-decorator";

@Component
export default class Children extends Vue {
  @Inject() readonly message!: string;
}
</script>
```

`@ProvideReactive` / `@InjectReactive`의 경우는 위와 동일하지만, `@ProvideReactive`를 통해 제공된 값이 부모 컴포넌트에서 변경되었을 때, 자식 컴포넌트의 `@InjectReactive`를 통해 받은 값이 그 변경에 반응한다는 점이 다르다.

## 정리

이 밖에도 `@Model`, `@ModelSync`, `@VModel` 등 데코레이터가 존재하지만, 자주 활용할만한 데코레이터 위주로 정리하였다. 여러가지 데코레이터 중에서 `@Component`나 `@Prop`과 같은 경우는 일상적으로 많이 쓰이는 데코레이터지만, `@PropSync` 와 같은 데코레이터 또한 사용하면 유용하게 사용할 수 있을 것 같다.

---

출처

1. [Vue Router의 LifeCycle 이해하기](https://adeuran.tistory.com/14)

2. [vue-router 네비게이션 가드](https://beomy.tistory.com/75)
