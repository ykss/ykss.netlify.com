---
title: '(번역) 과소평가된 리팩터링으로 메모리 사용량을 90% 줄인 방법'
date: 2026-07-14 09:30:00
category: 'Translation'
draft: false
---

> 원문: [How an Underrated Refactor Saved 90% Memory Usage](https://tanstack.com/blog/tanstack-table-v9-memory-performance)

![TanStack Table V9 - 메모리 성능](https://tanstack.com/cdn-cgi/image/quality%3D80%2Cformat%3Dauto/blog-assets/tanstack-table-v9-memory-performance/header.png)

TanStack Table V8과 비교해 TanStack Table V9의 메모리 사용량이 최대 90% 줄었다고요? 맞습니다! 적어도 큰 테이블에서는요.

어떻게 이런 결과를 얻었을까요? 애초에 어떻게 이렇게 개선할 여지가 많았던 걸까요?

TanStack Table V9에는 더 나은 방향으로 바뀐 아키텍처 변화가 많습니다. 상태 관리 시스템을 전면 개편했고, 훨씬 더 작은 "사용한 만큼만 비용을 지불하는" 런타임 모델을 갖춘 새로운 기능/플러그인 시스템도 도입했습니다.

하지만 Table V9를 개발하는 동안 얻은 가장 큰 성능 개선 중 하나는 더 미묘한 막후 리팩터링에서 나왔습니다. 이 리팩터링 덕분에 페이지네이션되거나 가상화된 수십만 또는 수백만 개의 행을 처리해야 하는 큰 테이블에서 TanStack Table V9는 Table V8보다 메모리를 최대 약 90% 적게 사용하게 되었습니다.

이 개선은 TanStack Table을 어떻게 사용하려는지에 따라 아주 큰 변화일 수도 있고, 거의 중요하지 않은 변화일 수도 있습니다. Table V8에서는 많은 요인에 따라 달라지지만, 브라우저에서 메모리 문제에 부딪히기 전까지 TanStack Table이 처리할 수 있는 행은 약 100만 개, 많아야 150만 개 정도라고 기대할 수 있었습니다. 이 지점은 대개 4GB 부근입니다. Table V9에서는 벤치마크 기준으로 TanStack Table이 4GB 메모리를 사용하기 전까지 처리할 수 있는 최대 행 수가 이제 1,000만-1,600만 개입니다. 물론 웹 페이지가 얼마나 복잡한지에 따라 이 낙관적인 수치보다 낮은 지점에서 문제가 생길 가능성이 큽니다. 그래도 TanStack Table 자체의 확장성이 최대 10배 개선된 셈입니다.

브라우저 클라이언트 측에서 1,500만 개의 행을 가져오거나, 다른 방식으로 TanStack Table에 처리를 맡겨야 할까요? 글쎄요. 보통은 그렇지 않겠지만, 그렇게까지 "비현실적"이라고만은 할 수 없는 사용 사례도 본 적이 있습니다. 😉

이 글에서는 벤치마크 결과를 살펴본 뒤, 이 성능 개선을 어떻게 이뤘는지 자세히 다룹니다. 놀랄 만큼 단순한 리팩터링이었고, 거의 단점이 없었습니다. 호환성을 깨는 변경 사항(breaking change) 하나를 제외하면요. 이미 사용하고 있지 않다면, 같은 패턴으로 자체 메모리 사용량을 개선할 수 있는 라이브러리가 꽤 많을 것입니다.

## 결과

![페이지네이션된 행, 가상화된 행, 가상화된 열, 키친 싱크 예제 전반에서 TanStack Table V8과 Table V9의 메모리 사용량을 보여 주는 차트](https://tanstack.com/cdn-cgi/image/quality%3D80%2Cformat%3Dauto/blog-assets/tanstack-table-v9-memory-performance/charts.png)

위 차트는 TanStack Table이 렌더링뿐 아니라 처리하도록 요청받은 셀 수, 즉 행 x 열이 늘어날수록 Table V8과 Table V9의 메모리 사용량 차이가 훨씬 더 뚜렷해진다는 것을 보여 줍니다. 그래프 왼쪽에서는 차이가 미미하지만, 오른쪽에서는 100만 행 x 8열을 처리할 때 Table V9가 Table V8보다 보존된 JS 힙(retained JS heap)을 2.4GB 넘게 적게 사용합니다.

전체 벤치마크 결과는 다음과 같습니다.

| 벤치마크 예제       |            셀 수(행 x 열) | Table V8 메모리 사용량 | Table V9 메모리 사용량 | 절감된 메모리 | 개선 비율 |
| ------------------- | ------------------------: | ---------------------: | ---------------------: | ------------: | --------: |
| paginated rows      |               80 (10 x 8) |                1.93 MB |                1.91 MB |       0.02 MB |      1.0% |
| paginated rows      |         8,000 (1,000 x 8) |                4.71 MB |                2.22 MB |       2.49 MB |     52.9% |
| paginated rows      |     800,000 (100,000 x 8) |              272.58 MB |               27.28 MB |     245.30 MB |     90.0% |
| paginated rows      | 8,000,000 (1,000,000 x 8) |             2710.06 MB |              257.19 MB |    2452.87 MB |     90.5% |
| virtualized rows    |               80 (10 x 8) |                2.13 MB |                2.10 MB |       0.03 MB |      1.4% |
| virtualized rows    |         8,000 (1,000 x 8) |                5.16 MB |                2.68 MB |       2.48 MB |     48.1% |
| virtualized rows    |     800,000 (100,000 x 8) |              273.42 MB |               28.12 MB |     245.30 MB |     89.7% |
| virtualized rows    | 8,000,000 (1,000,000 x 8) |             2714.32 MB |              261.46 MB |    2452.86 MB |     90.4% |
| virtualized columns |             100 (10 x 10) |                2.24 MB |                2.24 MB |       0.00 MB |      0.0% |
| virtualized columns |        10,000 (100 x 100) |                5.31 MB |                3.83 MB |       1.48 MB |     27.9% |
| virtualized columns |     100,000 (100 x 1,000) |               25.82 MB |               10.73 MB |      15.09 MB |     58.4% |
| virtualized columns |  1,000,000 (100 x 10,000) |              230.47 MB |               80.24 MB |     150.23 MB |     65.2% |
| kitchen sink        |               80 (10 x 8) |                2.18 MB |                2.38 MB |      -0.20 MB |     -9.2% |
| kitchen sink        |         8,000 (1,000 x 8) |                4.96 MB |                2.79 MB |       2.17 MB |     43.8% |
| kitchen sink        |     800,000 (100,000 x 8) |              272.83 MB |               36.91 MB |     235.92 MB |     86.5% |
| kitchen sink        | 8,000,000 (1,000,000 x 8) |             2710.31 MB |              349.22 MB |    2361.09 MB |     87.1% |

전반적으로 행 수가 늘어날수록 메모리 사용량 절감도 매우 일관되게 함께 커집니다.

이 예제 벤치마크 대부분은 페이지네이션이나 정렬 같은 기능 한두 개만 구현한 최소 예제입니다. 반면 키친 싱크 예제는 TanStack Table이 제공하는 모든 기능을 사용하는, 더 현실적인 예제로 의도했습니다.

짚고 넘어갈 만한 점이 하나 있습니다. 10행 x 8열만 있는 키친 싱크 예제에서는 Table V9가 실제로 Table V8보다 메모리를 약간 더 사용합니다. 이는 아마 CPU 성능 향상을 위해 내부 메모이제이션을 더 추가했기 때문일 가능성이 큽니다. 하지만 그 개선으로 늘어난 메모리 사용량은 매우 작아서, 이 다른 리팩터링이 그 차이를 압도합니다. 본질적으로 이전에는 없던 거대한 메모리 사용량 예산이 새로 열린 셈이고, 그 예산은 테이블이 생성하는 객체 수와 함께 커집니다. 앞으로는 약간의 메모리 사용량을 대가로 속도를 최적화하는 데 조금 더 자유로워질 수 있습니다.

## 메모리 사용량을 측정한 방법

이 벤치마크가 어떻게 실행됐는지 궁금하다면 [여기에서 저장소](https://github.com/KevinVandy/tanstack-table-benchmarks)를 확인할 수 있습니다.

벤치마크 러너는 Playwright와 Chrome DevTools Protocol을 사용합니다. 각 예제에 대해 다음 작업을 수행합니다.

- 프로덕션용 Vite 예제를 빌드합니다.
- `vite preview`를 시작합니다.
- 새 Chromium 컨텍스트에서 페이지를 엽니다.
- 테이블이 준비됐다고 보고할 때까지 기다립니다.
- `HeapProfiler.collectGarbage`로 가비지 컬렉션을 강제 실행합니다.
- 보존된 JS 힙을 기록합니다.
- DOM 개수와 렌더링된 행/셀 개수를 기록합니다.
- 예제에 측정할 인터렉션이 있으면 테이블을 스크롤하거나 페이지네이션합니다.

이 벤치마크는 변경된 부분, 즉 TanStack Table이 생성하는 행, 열, 셀, 헤더 객체 수에 스트레스를 주도록 설계했습니다.

## 리팩터링

이제 이 성능 개선을 어떻게 이뤘는지 살펴보겠습니다.

큰 비밀은 이겁니다. 공유 프로토타입(shared prototype)을 사용했습니다. 사실상 그게 전부입니다. 자세히 살펴보겠습니다.

## Table V8이 하던 방식

TanStack Table V8에서는 테이블, 행, 열, 셀, 헤더 등의 객체를 만들 때 값과 메서드를 모두 각 객체 인스턴스에 직접 할당했습니다.

조금 단순화하면 새 행 객체를 구성하는 코드는 다음과 같았습니다.

```ts
const row = {
  // values
  id,
  index: rowIndex,
  original,
  depth,
  parentId,
  _valuesCache: {},
  _uniqueValuesCache: {},

  // methods
  getValue: columnId => {
    // ...
  },
  getUniqueValues: columnId => {
    // ...
  },
  renderValue: columnId =>
    row.getValue(columnId) ?? table.options.renderFallbackValue,
  getLeafRows: () => flattenBy(row.subRows, d => d.subRows),
  getParentRow: () =>
    row.parentId ? table.getRow(row.parentId, true) : undefined,
  getAllCells: memo(/* ... */),
  _getAllCellsByColumnId: memo(/* ... */),
  // maybe a dozen other methods from features ...
};
```

이는 자바스크립트를 작성하는 아주 자연스러운 방식입니다. 일반 애플리케이션 코드라면 다른 방식으로 작성되리라고 기대하지 않을 것입니다. 문제는 TanStack Table에서 이 코드가 수천 또는 수백만 개의 행을 만드는 루프 안에 있을 수 있다는 점입니다. 그리고 각 행에는 어쩌면 수십 또는 수백 개의 셀을 만드는 자체 루프가 있습니다.

결국 잠재적으로 수백만 개의 객체 인스턴스가 모두 같은 메서드를 계속해서 자기 복사본으로 갖는 상황이 됩니다. 거의 동일한 셀과 행 객체가 수백만 개 생깁니다. 거의 동일한 열과 헤더 객체도 잠재적으로 수십 또는 수백 개 생깁니다.

비용은 중복된 함수 객체에만 있지 않습니다. 이런 스타일에서는 모든 화살표 함수가 클로저 스코프(closure scope)도 함께 가질 수 있습니다. 그 클로저는 행, 테이블, 캐시, 옵션, 또는 객체를 만든 팩터리의 다른 로컬 값을 캡처할 수 있습니다. 이런 클로저 스코프도 인스턴스마다 유지되며, 메모리 사용량이 그렇게 공격적으로 증가할 수 있는 큰 이유입니다.

## Table V9이 대신 하는 방식

TanStack Table V9 알파를 개발하는 동안, 모든 행, 열, 셀, 헤더 객체를 만들 때 이 리팩터링을 도입했습니다.

```ts
function getRowPrototype(table) {
  // Only create this row prototype once and cache it on the table instance
  if (!table._rowPrototype) {
    // create the row prototype object
    table._rowPrototype = { table };

    const features = Object.values(table._features);
    for (let i = 0; i < features.length; i++) {
      // create the methods for the row prototype - row.getValue(), row.getUniqueValues(), etc.
      features[i]!.assignRowPrototype?.(table._rowPrototype, table);
    }
  }

  return table._rowPrototype;
}

// This code is in a loop that creates thousands or millions of rows
export const constructRow = (
  table,
  id,
  original,
  rowIndex,
  depth,
  subRows,
  parentId
) => {
  // grab already made row prototype to get the methods
  const row = Object.create(getRowPrototype(table));

  // only assign unique values for this row
  row._uniqueValuesCache = {};
  row._valuesCache = {};
  row.depth = depth;
  row.id = id;
  row.index = rowIndex;
  row.original = original;
  row.parentId = parentId;
  row.subRows = subRows ?? [];

  return row;
};
```

따라서 모든 행 객체마다 `row.getValue()`, `row.getUniqueValues()` 같은 메서드를 잠재적으로 수백만 번 만드는 대신, 한 번만 만들고 행 프로토타입에 할당합니다. 그런 다음 새 행 객체에는 그 프로토타입만 연결합니다.

이 방식은 인스턴스마다 생기던 메서드 클로저도 제거합니다. 공유 프로토타입 메서드는 `this`를 통해 특정 행을 받으므로, 행별 상태는 모든 행마다 새 함수 스코프에 캡처되는 대신 행 객체에 남습니다.

열, 셀, 헤더 객체에도 같은 패턴을 반복했습니다. 다만 가장 큰 영향은 행 객체에서 나왔습니다. 행 객체가 가장 확장될 가능성이 크고, 많은 메서드를 가질 가능성도 크기 때문입니다. 테이블 객체에는 프로토타입 메서드를 사용할 필요가 없었습니다. 테이블은 이미 객체 인스턴스가 하나뿐이니까요.

## 자바스크립트 클래스를 쓰지 않은 이유

여기서 자연스럽게 이런 질문이 나옵니다. 그냥 `Row`, `Column`, `Cell`, `Header` 클래스를 만들고 메서드를 거기에 두면 안 될까요?

일반적인 라이브러리라면 꽤 타당한 선택입니다. 자바스크립트 클래스 메서드는 이미 클래스 프로토타입에 존재하므로, 메서드에 클래스 필드나 생성자에서 할당한 화살표 함수를 쓰지 않는 한 `class Row { getValue() {} }` 구현도 이 리팩터링과 비슷한 메모리 이점을 얻을 수 있습니다.

문제는 TanStack Table V9의 API가 기능에서 동적으로 구성된다는 점입니다. 열 표시 여부 기능이 등록된 경우에만 `row.getVisibleCells()`가 존재하길 원합니다. 행 정렬 기능이 등록된 경우에만 `column.toggleSorting()`이 존재하길 원합니다. 같은 생각이 행, 열, 셀, 헤더, 커스텀 플러그인 API 전반에 적용됩니다.

이를 클래스로 모델링하려 하면 금세 어색해집니다. 자바스크립트 클래스에는 단일 상속만 있지만, TanStack Table의 기능 시스템은 조건부 다중 상속에 더 가깝습니다. 어떤 테이블은 정렬, 필터링, 페이지네이션, 열 표시 여부, 행 선택, 고정, 그룹화, 커스텀 플러그인을 사용할 수 있습니다. 또 다른 테이블은 정렬만 사용할 수도 있습니다. 전혀 다른 조합을 쓰는 테이블도 있을 수 있습니다.

다음과 같은 믹스인 체인을 만드는 방식을 상상해 볼 수 있습니다.

```ts
Row = withSorting(withColumnVisibility(withPagination(BaseRow)));
```

하지만 그러면 모든 기능이 클래스 합성에 참여해야 하고, 순서가 더 깨지기 쉬워지며, 커스텀 플러그인은 적절한 시점에 올바른 클래스 형태를 확장해야 합니다. 가능은 하지만 더 단순하지는 않습니다.

수동 프로토타입 접근 방식은 클래스에서 실제로 원하는 부분, 즉 공유 프로토타입 메서드를 제공합니다. 동시에 기능 시스템은 동적으로 유지합니다.

각 테이블은 등록한 기능에 정확히 맞는 API만 담은 프로토타입을 갖습니다. 이 점이 트리 셰이킹 가능한 런타임 모델에서 중요한 부분이며, 가능한 모든 기능 조합을 클래스 상속으로 밀어 넣으려는 것보다 훨씬 깔끔합니다.

## Table V8에서 이 방식을 쓰지 않은 이유

TanStack Table V8에 이런 종류의 리팩터링을 제안한 Michael Leibman의 원래 PR이 있었습니다. 하지만 저희는 이 방식이 기술적으로 미묘하게 호환성을 깨는 변경 사항을 도입한다는 사실을 발견했습니다. 그래서 Table V8 대신 Table V9에서 구현하는 편이 덜 위험하다고 판단했습니다.

그 미묘하게 호환성을 깨는 변경 사항은 무엇일까요? 주로 객체 메서드를 구조 분해하면 더 이상 동작하지 않는다는 점입니다.

이런 코드는 깨집니다.

```ts
const { getValue } = row;

const value = getValue('name');
```

이렇게 메서드를 사용해야 합니다.

```ts
const value = row.getValue('name');
```

Table V8에서는 `getValue` 같은 메서드가 행 팩터리 안에서 만들어진 화살표 함수였기 때문에 이 방식이 동작했습니다. 해당 메서드는 행 객체를 클로저로 닫고 있었으므로, 어떻게 호출되는지 신경 쓰지 않았습니다.

Table V9에서 메서드는 행 프로토타입에서 공유되며, 어떤 행에 대해 동작하는지 알기 위해 `this` 컨텍스트를 사용합니다. 이런 식으로 메서드를 구조 분해하면 함수는 얻지만 원래의 수신자(receiver)는 잃습니다. 그러면 strict mode에서 `this`는 `undefined`가 되고, 메서드는 행을 찾을 수 없습니다. ES 모듈은 항상 strict mode이고 TanStack Table은 모듈로 배포되므로, 이 strict mode 동작은 여기서 자동으로 적용됩니다.

메서드는 자체 프로퍼티로 나타나지 않습니다. 예를 들어 `Object.keys(row)`, 객체 스프레드, `JSON.stringify`에는 나타나지 않습니다. 메서드는 프로토타입에 존재하지만, 콘솔의 `[[Prototype]]` 아래에서는 여전히 찾을 수 있습니다. 이는 `{ ...row }` 같은 얕은 복사가 행 데이터는 복사하지만 객체의 메서드는 떨어뜨린다는 뜻이기도 합니다.

```ts
console.log(row);
// { id, index, original, depth, parentId, _valuesCache, _uniqueValuesCache }
```

하지만 그래도 메서드는 똑같이 호출할 수 있습니다. `row.getValue()` 호출은 계속 동작합니다. 자바스크립트는 객체 자체에서 메서드를 찾지 못하면 자동으로 프로토타입에서 메서드를 찾기 때문입니다.

특히 단점이 이 점뿐이라면, 호환성을 깨는 릴리스에서 감수할 만한 트레이드오프입니다. 하지만 이 변경을 Table V8에 밀어 넣을 수는 없었습니다.

## 마무리 생각

TanStack Table 같은 라이브러리에는 분명히 적용할 만한 가치가 있는 리팩터링입니다. 확장해야 하는 상황에서 같은 최적화로 이점을 얻을 수 있는 다른 라이브러리나 애플리케이션이 얼마나 많을지 궁금합니다. 여러분에게 유용할 수 있겠다는 생각에 여기에서 공유할 만한 가치가 있다고 판단했습니다.

TanStack Table 사용자 입장에서 이 변화가 무엇을 의미하는지 궁금하다면, 바라건대 거의 알아차리지 못할 보이지 않는 개선일 것입니다. Table V8에서 Table V9로 마이그레이션하는 가이드에는 호환성을 깨는 작은 변경 사항들을 문서화할 예정입니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
