---
title: '[Typescript] 제네릭'
date: 2021-10-14 01:00:00
category: 'Javascript'
draft: false
---

타입스크립트에서 중요한 개념 중 하나인 제네릭에 대해서 정리해보려고 한다. 타입스크립트 코드를 보다보면 자주 보이는 것이 `<T>`와 같은 형태의 코드인데, 이런게 바로 제네릭을 사용한 모습이다. 이전에도 다른 언어를 공부할 때도 제네릭에 대한 것은 들어본 적이 있었지만 제대로 활용한 적은 없었던 것 같아서 이번 기회에 정리하면서 실제로 사용해보려고 한다.

## 제네릭

제네릭을 이용하면 클래스와 함수, 인터페이스 등을 다양한 타입으로 재사용 할 수 있다. 타입을 마치 함수 파라미터 처럼 사용하는 것이다. 아래 예시와 같이 사용한다.

```ts
function getSize<T>(arr: T[]): number {
  return arr.length
}
```

위의 예시를 보면 배열의 길이를 구하는 함수인데, 만약 제네릭이 쓰이지 않으면, 타입스크립트에서는 `string[]`타입일지 `number[]` 타입일지, `boolean[]`타입일지 확실히 모르기 때문에 타입을 명시해주기 어려운 경우가 있을 수 있다. 이런 경우에 함수 오버로드를 사용하는 방식도 있고, 아니면 Union 타입을 사용하는 방법도 있지만, 이러한 상황에서 제네릭을 사용하는 것은 매우 효과적이다.

`<T>`를 일반적으로 사용하긴 하지만 사실 다른 알파벳을 사용하는 것도 가능하다. 그래서 제네릭을 활용하면 아래와 같이 위 함수를 사용할 수 있다.

```ts
const arr1 = [1, 2, 3]
getSize<number>(arr1) // 3

const arr2 = ['a', 'b', 'c']
getSize<string>(arr1) // 3

const arr3 = [{}, {}, { name: 'yu' }]
getSize<object>(arr1) // 3

const arr4 = [true, true, false]
getSize<boolean>(arr1) // 3
```

다른 활용 법을 보면 아래와 같이 사용할 수도 있다.

```ts
interface Player<T> = {
  name: string;
  age : number;
  record : T;
}

const p1 : Player<{goal:number; assist:number}> = {
  name: 'mason mount',
  age : 22,
  record : {
    goal: 5,
    assist: 10
  }
}

const p2 : Player<string> = {
  name: 'danny drinkwater',
  age : 31,
  record : 'none'
}
```

## 정리

제네릭은 함수의 파라미터 처럼 사용한다고 하면 비교적 쉽게 이해하고 사용할 수 있는 개념이라는 생각이 들었다. 제네릭을 잘 사용하면 함수나 타입, 인터페이스 등의 재사용성에 큰 도움이 될 수 있기 때문에, 개발하는 동안 적극적으로 사용해봐야겠다는 생각이 들었다.

---

> 출처

- 1.  [TypeScript #7 제네릭 Generics](https://www.youtube.com/watch?v=pReXmUBjU3E&list=PLZKTXPmaJk8KhKQ_BILr1JKCJbR0EGlx0&index=7)

- 2. [타입스크립트 핸드북 - 제네릭](https://joshua1988.github.io/ts/guide/generics.html#%EC%A0%9C%EB%84%A4%EB%A6%AD%EC%9D%98-%ED%95%9C-%EC%A4%84-%EC%A0%95%EC%9D%98%EC%99%80-%EC%98%88%EC%8B%9C)
