---
title: '[Typescript] 유틸리티 타입 정리(2)'
date: 2021-10-13 01:00:00
category: 'Typescript'
draft: false
---

저번 포스트 소개하는 않았지만 그럼에도 유용한 유틸리티 타입들이 많아서 추가적으로 몇가지 소개하고자 한다.

## 자주 사용하는 유틸리티 타입 알아보기

### 1. keyof

`keyof` 키워드는 특정 interface에서 key들만 union 형태로 받을 수 있다. 아래 예시를 보면 인터페이스의 key 값들만 받아서 하나의 타입으로 사용할 때, 유용하게 쓰일 수 있음을 알 수 있다.

```ts
interface Player {
  name: string
  position: string
  age: number
  national: 'EU' | 'Non-EU'
}

type PlayerKey = keyof Player
// 'name' | 'position' | 'age' | 'national'
```

### 2. Record

레코드(Record) 타입은 두개의 제네릭 타입을 받을 수 있고, `Record<K,T>`의 형태로 자주 쓰인다. 특히 key-value 형태의 값을 짝지어 사용할 때 유용하게 쓰일 수 있다.

```ts
type team = 'Chelsea' | 'Arsenal' | 'ManUtd' | 'ManCity' | 'Liverpool'
type rank = '1' | '2' | '3' | '4' | '5'

const CurrentRank: Record<team, rank> = {
  Chelsea: 1,
  ManCity: 2,
  Liverpool: 3,
  ManUtd: 4,
  Arsenal: 5,
}

interface Player = {
  name: string,
  age: number,
  position : string
}

const isValid = (player : Player) => {
  const result : Record<keyof Player, boolean> = {
    name : player.name !== '',
    age: player.age >0,
    position : player.position !==''
  }
  return result
}
```

### 3. Exclude

익스클루드(Exclude) 타입은 두 개의 제네릭 타입을 받아서 `Exclude<T1,T2>`와 같은 형태로 쓰이고 T1에서 T2를 제거하고 사용하는 방식이다. Omit과 다른 점은 프로퍼티가 아닌 타입으로 제거한다는 것이다.

```ts
type T1 = string | number
type T2 = Exclude<T1, number> // string

type T1 = string | number | boolean
type T2 = Exclude<T1, number | string> // boolean
```

### 4. NonNullable

논널러블(NonNullable) 타입은 `NonNullable<T>`과 같은 형태로 쓰이며, Null로 처리되는 타입과 undefined를 제거한다.

```ts
type T1 = string | null | undefined | void
type T2 = NonNullable<T1> // string | void
```

## 정리

간단하게만 정리해봤는데, 타입스크립트를 계속 사용하다 보면 충분히 많이 쓸 수 있을만한 타입들이 많다고 느껴졌고, 이것들에 익숙해지면 좀 더 능숙하게 타입스크립트를 다룰 수 있겠다는 생각이 들었다.

---

> 출처

- 1.  [TypeScript #8 유틸리티 타입 Utility Types](https://www.youtube.com/watch?v=IeXZo-JXJjc&list=PLZKTXPmaJk8KhKQ_BILr1JKCJbR0EGlx0&index=8)
