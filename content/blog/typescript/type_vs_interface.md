---
title: '[Typescript] 타입(Type)과 인터페이스(Interface)의 차이점'
date: 2022-09-06 01:00:00
category: 'Typescript'
draft: false
---

타입스크립트에서 타입(Type)과 인터페이스(Interface)는 유사한 점이 매우 많고, 여러 경우에 자유롭게 혼용되어 사용 가능하다. 그러나 둘 사이에는 차이와 한계가 분명히 존재한다.

## 원시 타입(Primitive Types)

```ts
{
  type CustomString = string;
  const str: CustomString = '';

  // ❌
  interface CustomStringByInterface = string;
}
```

타입은 원시 타입(symbol, boolean, string, number, bigint, etc.)을 정의할 수 있다. 반면에 인터페이스는 불가능하다. 타입은 새로운 타입을 만드는 것이 아니기 때문에 type alias로 불린다. 반면에 인터페이스는 항상 새로운 타입을 생성한다.

## 유니온 타입(Union Types)

```ts
{
  type Fruit = 'apple' | 'lemon';
  type Vegetable = 'potato' | 'tomato';

  // 'apple' | 'lemon' | 'potato' | 'tomato'
  type Food = Fruit | Vegetable;
  const apple: Food = 'apple';
}
```

유니온 타입은 타입만 사용 가능하다.

## 튜플 타입(Tuple Types)

```ts
{
  type Animal = [name: string, age: number];
  const cat: Animal = ['', 1];
}
```

튜플 타입은 타입으로만 정의 가능하다.

## 객체/함수 타입(Objects / Function Types)

인터페이스와 타입 모두 객체 타입이나 함수 타입을 선언할 수 있다. 하지만 인터페이스의 경우, 같은 인터페이스를 여러번 선언 가능하다. 그리고 그들은 자동으로 병합된다. 반면에 타입은 병합되지 않고 유니크 해야 한다.

```ts
{
  // 인터페이스를 사용할 때, 같은 이름의 인터페이스는 자동 병합된다.
  interface PrintName {
    (name: string): void;
  }

  interface PrintName {
    (name: number): void;
  }

  // ✅
  const printName: PrintName = (name: number | string) => {
    console.log('name: ', name);
  };
}

{
  // 타입을 사용할 때, 그것은 유일 해야하고, 오직 &를 사용해야만 병합 가능하다.
  type PrintName = ((name: string) => void) & ((name: number) => void);

  // ✅
  const printName: PrintName = (name: number | string) => {
    console.log('name: ', name);
  };
}
```

다른 키 포인트는 타입은 `&`(intersection)을 사용하고, 인터페이스는 상속(inheritance)를 사용한다.

```ts
{
  interface Parent {
    printName: (name: number) => void;
  }

  // ❌ 인터페이스 'Child'는 인터페이스 'Parent'를 잘못 확장했다.
  interface Child extends Parent {
    printName: (name: string) => void;
  }
}

{
  type Parent = {
    printName: (name: number) => void;
  };

  type Child = Parent & {
    // 여기서 두 printName은 intersection 된다.
    // 이것은 `(name: number | string) => void`과 같다.
    printName: (name: string) => void;
  };

  const test: Child = {
    printName: (name: number | string) => {
      console.log('name: ', name);
    },
  };

  test.printName(1);
  test.printName('1');
}
```

위에 나타난 에러와 같이 인터페이스를 상속할 때, 서브타입은 슈퍼타입과 충돌할 수 없고, 오직 확장만 가능하다.

```ts
{
  interface Parent {
    printName: (name: number) => void;
  }

  interface Child extends Parent {
    // ✅
    printName: (name: string | number) => void;
  }
}
```

위에서 볼 수 있듯이 인터페이스는 `extends`를 사용하여 상속을 구현한다. 그리고 타입은 &를 사용하여 교차(intersection)을 구현한다.

몇 가지 케이스에서 자동 병합과 인터페이스의 확장성은 유용하다. 만약 써드파티 라이브러리를 만들었거나 공개 API를 공개 했다면, 사용자는 그것을 인터페이스 메카니즘을 통해 확장할 수 있다.

만약 객체 타입을 선언하기 원한다면, 인터페이스를 먼저 사용하고, 필요할 때 타입을 사용하는 것이 좋다.

## 매핑된 객체 타입(Mapped Object Types)

```ts
type Vegetable = 'potato' | 'tomato';

{
  type VegetableOption = {
    [Property in Vegetable]: boolean;
  };

  const option: VegetableOption = {
    potato: true,
    tomato: false,
  };

  // "potato" | "tomato"
  type VegetableAlias = keyof VegetableOption;
}

{
  interface VegetableOption {
    // ❌ 매핑된 타입은 프로퍼티나 메서드로 선언할 수 없다.
    [Property in Vegetable]: boolean;
  }
}

export {};
```

매핑된 객체 타입은 타입으로만 정의될 수 있고, `in` 키워드와 `keyof` 키워드를 사용할 수 있다.

## 알려지지 않은 타입(Unknown Types)

```ts
{
  const potato = { name: 'potato', weight: 1 };

  // type Vegetable = {
  // name: string;
  // weight: number;
  // }
  type Vegetable = typeof potato;

  const tomato: Vegetable = {
    name: 'tomato',
    weight: 2,
  };
}
```

`unknown` 타입을 다룰 때, `typeof`를 사용하여 타입을 확인할 수 있다. 그러나 그것은 타입으로만 가능하고, 인터페이스는 불가하다.

## 정리

결론적으로 타입은 인터페이스의 거의 모든 기능을 커버한다. 그러나 인터페이스는 항상 확장 가능하고, 타입은 그렇지 않다. 그러므로 경우에 따라서 선택하여 사용해야 한다. 가급적 프로젝트내에서 일관된 기준에 따라 선택해야 한다.

### 타입을 사용해야 하는 경우

- 원시 타입을 정의할 경우

- 튜플 타입을 정의할 경우

- 함수 타입을 정의할 경우

- 유니온 타입을 정의할 경우

- 매핑된 타입을 정의할 경우

### 인터페이스를 사용해야 하는 경우

- 선언 병합(자동 병합)의 이점을 활용해야 하는 경우

- 객체 타입을 정의하거나, 타입을 사용할 필요가 없을 경우

---

## 출처

- https://betterprogramming.pub/differences-between-type-aliases-and-interfaces-in-typescript-4-6-6489246d4e48
