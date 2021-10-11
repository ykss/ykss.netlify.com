---
title: '[Typescript] 유틸리티 타입 정리'
date: 2021-10-09 01:00:00
category: 'Javascript'
draft: false
---

타입스크립트 개발을 진행하면서 타입스크립트에 대해서 여러가지 배워가고 있다. 그 중에 type들이나 interface 등을 새롭게 공부하면서 유틸리티 타입에 대해서 접하게 되었고, 다양한 유틸리티 타입에 대해서 정리해보려고 한다.

## 1. 유틸리티 타입

유틸리티 타입은 이미 정의해 놓은 타입을 변환하여 사용할 때 주로 사용하는 문법이다. 기존의 인터페이스와 제네릭 등만 활용해도 타입 변환 활용이 가능하지만, 유틸리티 타입을 적절히 활용하면 훨씬 간결하고 효율적으로 타입 변환이 가능하다.

## 2. 자주 사용하는 유틸리티 타입 알아보기

### 1. Partial

파셜(Partial) 타입은 특정 타입의 부분 집합을 만족하는 타입을 정의할 수 있다. 기존에는 필수적으로 있어야 할 타입들이 Partial을 이용하면 인터페이스에서 일부 타입만 활용이 가능하다.

```ts
interface Player {
  name: string
  position: string
}

type MayHaveName = Partial<Player>
const me: MayHaveEmail = {} // 가능
const mount: MayHaveEmail = { name: 'mason mount' } // 가능
const lukaku: MayHaveEmail = { name: 'romelu lukaku', position: 'striker' } // 가능
```

### 2. Pick

픽(Pick) 타입은 특정 타입에서 몇 개의 속성을 선택하여 타입을 정의할 수 있다. 기존에는 속성이 전부 필요했다면 특정 속성 몇개만 선택하여 타입을 정의하는 것이 가능해지는 것이다.

```ts
interface Player {
  name: string
  position: string
}

const human: Pick<Player, 'name'> = {
  name: 'ngolo kante',
}

type HasThen<T> = Pick<Promise<T>, 'then' | 'catch'>
let hasThen: HasThen<number> = Promise.resolve(4)
hasThen.then // 위에서 'then'만 선택하면 'then'만 제공, 'catch' 선택하면 'catch만 제공'
```

### 3. Omit

오밋(Omit) 타입은 특정 타입에서 지정된 속성을 제거하여 타입을 정의할 수 있다.

```ts
interface Player {
  name: string
  position: string
  number: number
  team: string
}

const mount: Omit<Player, 'number'> = {
  name: 'mason mount',
  position: 'midfielder',
  team: 'chelsea',
}

const kovacic: Omit<Player, 'number' | 'team'> = {
  name: 'kovacic',
  position: 'midfielder',
}
```

### 4. Required

리콰이얼드(Required) 타입은 파셜 타입의 반대 개념으로 특정 타입에서 지정된 속성을 모두 필수로 하여 타입을 정의할 수 있다.

```ts
interface Player {
  name: string
  position?: string
  number?: number
  team?: string
}

const obj: Player = { name: 'timo werner' };

const obj2: Required<Player> = {
    name: 'kai havertz',
    position:'midfielder',
    number: 29
    };

Property 'team' is missing in type '{ name: 'kai havertz', position:'midfielder',number: 29 }' but required in type 'Required<Player>'.
```

### 5. Readonly

Readonly 타입은 모든 타입을 Readonly하게 만들어 주는 타입으로 const 변수와 같이 재할당 할 수 없는 속성으로 정의하는 것이다.

```ts
interface Player {
  name: string
}

const firstPlayer: Readonly<Player> = { name: 'timo werner' };

firstPlayer.name = "mason mount";

Cannot assign to 'name' because it is a read-only property.
```

## 정리

위에 소개한 유틸리티 타입 외에도 `Record`,`Exclude`,`Extract`,`NonNullable` 등 여러가지 유틸리티 타입들이 존재한다. 사용하다가 더 필요한 부분들이 있으면 그때 그때 찾아보고 정리해보도록 하자

---

> 출처

- 1. [유틸리티 타입이란?](https://joshua1988.github.io/ts/usage/utility.html#%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0-%ED%83%80%EC%9E%85%EC%9D%B4%EB%9E%80)

- 2. [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
