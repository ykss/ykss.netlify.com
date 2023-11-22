---
title: '(번역) 헤드리스 컴포넌트: 리액트 UI를 합성하기 위한 패턴'
date: 2023-11-23 01:00:00
category: 'Translation'
draft: false
---

> 원문: [Headless Component: a pattern for composing React UIs](https://martinfowler.com/articles/headless-component.html)

> 리액트 UI 컨트롤이 더 정교해짐에 따라 복잡한 로직이 시각적 표현과 얽히게 될 수 있습니다. 이로 인해 컴포넌트의 동작을 추론하기 어렵고, 테스트하기도 어려워지며, 다른 모양이 필요한 유사한 컴포넌트를 구축해야 할 수도 있습니다. 헤드리스 컴포넌트는 모든 비시각적인 로직과 상태 관리를 추출하여 컴포넌트의 두뇌를 UI에서 분리합니다.

## 목차

- [헤드리스 컴포넌트 패턴 소개](#헤드리스-컴포넌트-패턴-소개)
- [드롭다운 목록 구현하기](#드롭다운-목록-구현하기)
- [키보드 탐색 구현](#키보드-탐색-구현)
- [헤드리스 컴포넌트 테스트](#헤드리스-컴포넌트-테스트)
- [컨텍스트 API가 포함된 선언적 헤드리스 컴포넌트](#컨텍스트-api가-포함된-선언적-헤드리스-컴포넌트)
- [새로운 UI 요구 사항에 적응하기](#새로운-ui-요구-사항에-적응하기)
- [추가 상태애 대해 더 깊게 파보기](#추가-상태애-대해-더-깊게-파보기)
- [원격 데이터 가져오기](#원격-데이터-가져오기)
- [우아함과 재사용성을 위한 리팩터링](#우아함과-재사용성을-위한-리팩터링)
- [드롭다운 컴포넌트의 단순성 유지](#드롭다운-컴포넌트의-단순성-유지)
- [헤드리스 컴포넌트 패턴 마무리](#헤드리스-컴포넌트-패턴-마무리)
- [GUI에서 루트 패턴 다시 살펴보기](#gui에서-루트-패턴-다시-살펴보기)
- [커뮤니티 이해하기](#커뮤니티-이해하기)
- [결론](#결론)

리액트는 UI 컴포넌트와 UI의 상태 관리에 대한 사고 방식을 혁신적으로 변화시켰습니다. 그러나 새로운 기능 요청이나 개선이 있을 때마다, 보기엔 단순해 보이는 컴포넌트도 서로 얽힌 상태와 UI 로직의 복잡체로 빠르게 발전할 수 있습니다.

간단한 드롭다운 목록을 구축한다고 상상해 보세요. 처음에는 열기/닫기 상태를 관리하고 모양을 디자인하는 등 간단해 보입니다. 하지만 애플리케이션이 성장하고 발전함에 따라 이 드롭다운에 대한 요구 사항도 발전합니다.

- **접근성 지원**: 스크린 리더나 기타 보조 기술을 사용하는 사람을 포함하여 모든 사용자가 드롭다운을 사용할 수 있도록 보장하는 것은 또 다른 복잡성을 추가합니다. 포커스 상태와 `aria` 속성을 관리해야 하고, 드롭다운이 의미적으로 올바른지 확인해야 합니다.
- **키보드 네비게이션**: 사용자는 마우스 상호작용에만 제한되어서는 안 됩니다. 화살표 키를 사용하여 옵션을 탐색하거나 `Enter` 키를 사용하여 선택하거나, `Escape` 키를 사용하여 드롭다운을 닫을 수 있어야 합니다. 이를 위해서는 추가적인 이벤트 리스너와 상태 관리가 필요합니다.
- **비동기 데이터 고려사항**: 애플리케이션이 확장됨에 따라 드롭다운 옵션이 더 이상 하드코딩되지 않을 수 있습니다. 대신 API에서 가져올 수도 있습니다. 이 경우 드롭다운 내에서 로딩, 오류 및 비어 있는 상태를 관리해야 할 필요성이 생깁니다.
- **UI 변형 및 테마**: 애플리케이션의 각 부분마다 드롭다운에 대해 다른 스타일이나 테마가 필요할 수 있습니다. 컴포넌트 내에서 이러한 변형을 관리하면 프로퍼티와 합성이 폭발적으로 늘어날 수 있습니다.
- **기능 확장**: 시간이 지남에 따라 다중 선택, 필터링 옵션 또는 다른 폼 컨트롤과의 통합과 같은 추가 기능이 필요할 수 있습니다. 이미 복잡한 컴포넌트에 이러한 기능을 추가하는 것은 어려울 수 있습니다.

이러한 각 고려 사항은 드롭다운 컴포넌트에 복잡성을 더합니다. 상태, 로직 및 UI 표현이 섞이면 유지 관리가 어렵고 재사용하기 어렵습니다. 서로 얽혀 있을수록 의도하지 않은 부작용 없이 변경하기가 더 어려워집니다.

## 헤드리스 컴포넌트 패턴 소개

이러한 문제를 정면으로 마주한 상황에서, 헤드리스 컴포넌트 패턴은 해결책을 제시합니다. 헤드리스 컴포넌트 패턴은 계산과 UI 표현을 분리하여, 개발자가 다재다능하고 유지 관리가 가능하며 재사용 가능한 컴포넌트를 구축할 수 있도록 지원합니다.

헤드리스 컴포넌트는 리액트 디자인 패턴으로 일반적으로 리액트 훅으로 구현되며, 컴포넌트가 특정 UI(사용자 인터페이스)를 규정하지 않고, 로직과 상태 관리만을 전적으로 책임지는 컴포넌트입니다. 이는 작업의 '두뇌'를 제공하지만 '겉모습'은 구현하는 개발자에게 맡깁니다. 본질적으로 특정 시각적 표현을 강요하지 않고 기능성을 제공합니다.

헤드리스 컴포넌트를 시각화해보자면, 한쪽에서는 JSX 뷰와 상호작용하고 다른 한쪽에서는 필요에 따라 기본 데이터 모델과 통신하는 가느다란 레이어로 나타낼 수 있습니다. 이 패턴은 시각적 표현에서 로직을 분리하기 때문에, UI의 동작 또는 상태 관리 측면만을 원하는 개발자에게 특히 유용합니다.

![사진 1: 헤드리스 컴포넌트 패턴](https://martinfowler.com/articles/headless-component/headless-component.png)

_사진 1: 헤드리스 컴포넌트 패턴_

예를 들어 헤드리스 드롭다운 컴포넌트를 생각해 봅시다. 이 컴포넌트는 열기/닫기 상태, 항목 선택, 키보드 탐색 등에 대한 상태 관리를 처리합니다. 렌더링할 때가 되면 자체적으로 하드코딩된 드롭다운 UI를 렌더링하는 대신, 이 상태와 로직을 자식 함수나 컴포넌트에 제공하여 개발자가 시각적으로 어떻게 표시할지 결정할 수 있도록 합니다.

이 글에서는 복잡한 컴포넌트인 드롭다운 목록을 처음부터 다시 구성하여 실제 예제를 살펴보겠습니다. 컴포넌트에 더 많은 기능을 추가하면서 발생하는 문제를 관찰할 것입니다. 이를 통해 헤드리스 컴포넌트 패턴이 어떻게 이러한 문제를 해결하고, 서로 다른 관심사를 구분하며, 보다 다재다능한 컴포넌트를 제작하는 데 도움이 되는지 보여드리겠습니다.

## 드롭다운 목록 구현하기

드롭다운 목록은 많은 곳에서 사용되는 일반적인 컴포넌트입니다. 기본적인 사용 사례를 위한 네이티브 select 컴포넌트도 있지만, 각 옵션을 더 잘 제어할 수 있는 고급 버전은 더 나은 사용자 경험을 제공합니다.

![사진 2: 드롭다운 목록 컴포넌트](https://martinfowler.com/articles/headless-component/dropdown-list.png)

_사진 2: 드롭다운 목록 컴포넌트_

완벽한 구현을 위해 처음부터 새로 만들려면 보기보다 더 많은 노력이 필요합니다. 키보드 탐색, 접근성(예: 스크린 리더 호환성), 모바일 디바이스에서의 사용성 등을 고려해야 합니다.

마우스 클릭만 지원하는 간단한 데스크톱 버전부터 시작하여, 점차 기능을 추가하여 현실적인 드롭다운을 만들 것입니다. 이 글의 목표는 프로덕션에서 사용할 드롭다운 목록을 만드는 방법을 알려드리는 것이 아니라 몇 가지 소프트웨어 디자인 패턴을 소개하는 것입니다. 사실 처음부터 이 작업을 수행하는 것은 권장하지 않으며, 그 대신 잘 만들어진 라이브러리를 사용하는 것을 권장합니다.

기본적으로 사용자가 클릭할 요소(앞으로는 트리거 요소라고 부르겠습니다)와 목록 패널의 표시 및 숨기기 동작을 제어할 상태가 필요합니다. 처음에는 패널을 숨기고 트리거 요소가 클릭되면 목록 패널을 표시합니다.

```tsx
import { useState } from 'react';

interface Item {
  icon: string;
  text: string;
  description: string;
}

type DropdownProps = {
  items: Item[];
};

const Dropdown = ({ items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="dropdown">
      <div className="trigger" tabIndex={0} onClick={() => setIsOpen(!isOpen)}>
        <span className="selection">
          {selectedItem ? selectedItem.text : 'Select an item...'}
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className="item-container"
            >
              <img src={item.icon} alt={item.text} />
              <div className="details">
                <div>{item.text}</div>
                <small>{item.description}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

위의 코드에서는 드롭다운 컴포넌트의 기본 구조를 설정했습니다. `useState` 훅을 사용하여 `isOpen` 및 `selectedItem` 상태를 관리하여 드롭다운의 동작을 제어합니다. 트리거 요소를 간단히 클릭하면 드롭다운 메뉴가 토글되고, 항목을 선택하면 `selectedItem` 상태가 업데이트됩니다.

컴포넌트를 더 명확하게 보기 위해 더 작고 관리하기 쉬운 조각으로 분해해 보겠습니다. 이 분해는 헤드리스 컴포넌트 패턴의 일부가 아니지만, 복잡한 UI 컴포넌트를 여러 조각으로 나누는 것은 가치 있는 활동입니다.

사용자 클릭을 처리하는 `Trigger` 컴포넌트를 추출하는 것부터 시작하겠습니다.

```tsx
const Trigger = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <div className="trigger" tabIndex={0} onClick={onClick}>
      <span className="selection">{label}</span>
    </div>
  );
};
```

`Trigger` 컴포넌트는 클릭 가능한 기본 UI 요소로, 표시할 `label`과 `onClick` 핸들러를 매개 변수로 받으며, 주변 컨텍스트에 구애받지 않습니다. 마찬가지로 옵션 항목들의 목록을 렌더링하는 `DropdownMenu` 컴포넌트를 추출할 수 있습니다.

```tsx
const DropdownMenu = ({
  items,
  onItemClick,
}: {
  items: Item[];
  onItemClick: (item: Item) => void;
}) => {
  return (
    <div className="dropdown-menu">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onItemClick(item)}
          className="item-container"
        >
          <img src={item.icon} alt={item.text} />
          <div className="details">
            <div>{item.text}</div>
            <small>{item.description}</small>
          </div>
        </div>
      ))}
    </div>
  );
};
```

`DropdownMenu` 컴포넌트는 각 항목에 아이콘과 설명이 포함된 항목들의 목록을 표시합니다. 각 항목을 클릭하면 선택된 항목에 인수로 제공된 `onItemClick` 함수가 실행됩니다.

그런 다음 `Dropdown` 컴포넌트 내에서 `Trigger`와 `DropdownMenu`를 조합하고 필요한 상태를 제공합니다. 이 접근 방식은 `Trigger` 및 `DropdownMenu` 컴포넌트가 상태에 구애받지 않고, 전달된 프로퍼티에만 반응하도록 보장합니다.

```tsx
const Dropdown = ({ items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="dropdown">
      <Trigger
        label={selectedItem ? selectedItem.text : 'Select an item...'}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && <DropdownMenu items={items} onItemClick={setSelectedItem} />}
    </div>
  );
};
```

업데이트된 이번 코드 구조에서는 드롭다운의 각 부분에 대해 특화된 컴포넌트를 생성하여 관련 사항을 분리함으로써 코드를 더욱 체계적이고, 쉽게 관리할 수 있도록 했습니다.

![사진 3: 목록 네이티브 구현](https://martinfowler.com/articles/headless-component/list-native.png)

_사진 3: 목록 네이티브 구현_

위 이미지에 표시된 것처럼 "Select an item..." 트리거 요소를 클릭하여 드롭다운을 열 수 있습니다. 목록에서 값을 선택하면 표시된 값이 업데이트되고 드롭다운 메뉴가 닫힙니다.

이 시점에서 리팩터링된 코드는 각 세그먼트가 간단하고 적응성이 뛰어나며 명확합니다. `Trigger` 컴포넌트를 수정하거나, 다른 컴포넌트를 도입하는 것은 비교적 간단합니다. 하지만 더 많은 기능을 도입하고 추가 상태를 관리할 때 현재 컴포넌트들이 그대로 유지될 수 있을까요?

자세한 내용은 키보드 탐색 기능이라는 중요한 개선 사항을 도입을 통해 알아봅시다.

## 키보드 탐색 구현

드롭다운 목록에 키보드 탐색 기능을 통합하면 마우스로 해야 하는 작업을 대체할 수 있어 사용자 경험이 향상됩니다. 이는 접근성을 위해 특히 중요하며 웹 페이지에서 원활한 탐색 환경을 제공합니다. `onKeyDown` 이벤트 핸들러를 사용하여 이를 달성하는 방법을 살펴보겠습니다.

먼저 `Dropdown` 컴포넌트의 `onKeyDown` 이벤트에 `handleKeyDown` 함수를 연결하겠습니다. 여기서는 switch 문을 사용하여 특정 키가 눌렸는지 확인하고 그에 따라 동작을 수행합니다. 예를 들어 'Enter' 또는 'Space' 키를 누르면 드롭다운이 토글됩니다. 마찬가지로 'ArrowDown' 및 'ArrowUp' 키를 사용하면 목록 항목을 탐색하고 필요한 경우 목록의 시작 또는 끝으로 돌아갈 수 있습니다.

```tsx
const Dropdown = ({ items }: DropdownProps) => {
  // ... 이전 상태 변수 ...
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (
      e.key
      // ... 케이스 구문 ...
      // ...  Enter, Space, ArrowDown and ArrowUp 키에 대한 핸들링 ...
    ) {
    }
  };

  return (
    <div className="dropdown" onKeyDown={handleKeyDown}>
      {/* ... JSX의 나머지 부분 ... */}
    </div>
  );
};
```

또한 `selectedIndex` 프로퍼티를 허용하도록 `DropdownMenu` 컴포넌트를 업데이트했습니다. 이 프로퍼티는 강조 표시된 CSS 스타일을 적용하고 현재 선택된 항목에 `aria-selected` 속성을 설정하는 데 사용되어 시각적 피드백과 접근성을 향상시킵니다.

```tsx
const DropdownMenu = ({
  items,
  selectedIndex,
  onItemClick,
}: {
  items: Item[];
  selectedIndex: number;
  onItemClick: (item: Item) => void;
}) => {
  return (
    <div className="dropdown-menu" role="listbox">
      {/* ... JSX의 나머지 부분 ... */}
    </div>
  );
};
```

이제 `Dropdown` 컴포넌트는 상태 관리 코드와 렌더링 로직이 모두 얽혀 있습니다. 여기에는 `selectedItem`, `selectedIndex`, `setSelectedItem` 등과 같은 모든 상태 관리 구조체와 함께 광범위한 스위치 케이스가 들어 있습니다.

## 커스텀 훅으로 헤드리스 컴포넌트 구현하기

이 문제를 해결하기 위해 `useDropdown`이라는 커스텀 훅을 통해 헤드리스 컴포넌트의 개념을 소개하겠습니다. 이 훅은 상태 및 키보드 이벤트 처리 로직을 효율적으로 마무리하여 필수 상태와 함수로 채워진 객체를 반환합니다. `Dropdown` 컴포넌트에서 이를 비구조화함으로써 코드를 깔끔하고 지속 가능하게 유지할 수 있습니다.

비결은 바로 헤드리스 컴포넌트의 주인공인 `useDropdown` 훅에 있습니다. 이 다재다능한 유닛에는 드롭다운이 열려 있는지 여부, 선택된 항목, 강조 표시된 항목, Enter 키에 대한 반응 등 드롭다운에 필요한 모든 것이 들어 있습니다. 다양한 시각적 프레젠테이션, 즉 JSX 요소와 결합할 수 있는 적응성이 장점입니다.

```tsx
const useDropdown = (items: Item[]) => {
  // ... 상태 변수 ...

  // 헬퍼 함수는 UI에 대한 일부 aria 속성을 반환할 수 있습니다.
  const getAriaAttributes = () => ({
    role: 'combobox',
    'aria-expanded': isOpen,
    'aria-activedescendant': selectedItem ? selectedItem.text : undefined,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ... switch 구문 ...
  };

  const toggleDropdown = () => setIsOpen(isOpen => !isOpen);

  return {
    isOpen,
    toggleDropdown,
    handleKeyDown,
    selectedItem,
    setSelectedItem,
    selectedIndex,
  };
};
```

이제 `Dropdown` 컴포넌트가 단순화되고 짧아졌으며 이해하기 쉬워졌습니다. `useDropdown` 훅을 활용하여 상태를 관리하고 키보드 상호 작용을 처리하여, 관심사를 명확하게 분리하고 코드를 더 쉽게 이해하고 관리할 수 있습니다.

```tsx
const Dropdown = ({ items }: DropdownProps) => {
  const {
    isOpen,
    selectedItem,
    selectedIndex,
    toggleDropdown,
    handleKeyDown,
    setSelectedItem,
  } = useDropdown(items);

  return (
    <div className="dropdown" onKeyDown={handleKeyDown}>
      <Trigger
        onClick={toggleDropdown}
        label={selectedItem ? selectedItem.text : 'Select an item...'}
      />
      {isOpen && (
        <DropdownMenu
          items={items}
          onItemClick={setSelectedItem}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};
```

이러한 수정을 통해 드롭다운 목록에 키보드 탐색 기능을 성공적으로 구현하여 접근성과 사용자 편의성을 높였습니다. 또한 이 예시는 훅을 활용하여 복잡한 상태와 로직을 구조적이고 모듈화된 방식으로 관리하는 방법을 보여줌으로써 UI 컴포넌트를 더욱 개선하고 기능을 추가할 수 있는 기반을 마련했습니다.

이 디자인의 장점은 로직과 프레젠테이션이 명확하게 분리되어 있다는 점입니다. 여기서 '로직'이란 선택 컴포넌트의 핵심 기능인 열기/닫기 상태, 선택된 항목, 강조 표시된 요소, 목록에서 선택할 때 화살표 아래로 누르는 등의 사용자 입력에 대한 반응 등을 의미합니다. 이러한 분리를 통해 컴포넌트는 특정 시각적 표현에 얽매이지 않고 핵심 동작을 유지하므로 "헤드리스 컴포넌트"라는 용어를 정당화할 수 있습니다.

## 헤드리스 컴포넌트 테스트

컴포넌트의 로직이 중앙 집중화되어 있어 다양한 시나리오에서 재사용할 수 있기 때문에 이 기능이 안정적으로 작동하는 것이 중요합니다. 따라서 포괄적인 테스트는 필수입니다. 좋은 소식은 이러한 동작을 테스트하는 것이 간단하다는 것입니다.

퍼블릭 메서드를 호출하고 해당 상태 변화를 관찰하여 상태 관리를 검증할 수 있습니다. 예를 들어 `toggleDropdown`과 `isOpen` 상태 사이의 관계를 살펴볼 수 있습니다.

```ts
const items = [{ text: 'Apple' }, { text: 'Orange' }, { text: 'Banana' }];

it('드롭다운 열기/닫기 상태가 핸들링된다.', () => {
  const { result } = renderHook(() => useDropdown(items));

  expect(result.current.isOpen).toBe(false);

  act(() => {
    result.current.toggleDropdown();
  });

  expect(result.current.isOpen).toBe(true);

  act(() => {
    result.current.toggleDropdown();
  });

  expect(result.current.isOpen).toBe(false);
});
```

키보드 탐색 테스트는 주로 시각적 인터페이스가 없기 때문에 약간 더 복잡합니다. 따라서 보다 통합적인 테스트 접근 방식이 필요합니다. 한 가지 효과적인 방법은 동작을 인증하기 위해 가짜 테스트 컴포넌트를 만드는 것입니다. 이러한 테스트는 헤드리스 컴포넌트 활용에 대한 지침 가이드를 제공하고 JSX를 사용하기 때문에 사용자 상호 작용에 대한 진정한 인사이트를 제공하는 두 가지 용도로 사용됩니다.

이전 상태 검사를 통합 테스트로 대체하는 다음 테스트를 고려해 보세요.

```tsx
it('토글을 실행시킨다', async () => {
  render(<SimpleDropdown />);

  const trigger = screen.getByRole('button');

  expect(trigger).toBeInTheDocument();

  await userEvent.click(trigger);

  const list = screen.getByRole('listbox');
  expect(list).toBeInTheDocument();

  await userEvent.click(trigger);

  expect(list).not.toBeInTheDocument();
});
```

아래의 `SimpleDropdown`은 테스트 전용으로 설계된 가짜 <sup>[1](#footnote_1)</sup> 컴포넌트입니다. 헤드리스 컴포넌트를 구현하려는 사용자를 위한 실습 예제로도 사용할 수 있습니다.

```tsx
const SimpleDropdown = () => {
  const {
    isOpen,
    toggleDropdown,
    selectedIndex,
    selectedItem,
    updateSelectedItem,
    getAriaAttributes,
    dropdownRef,
  } = useDropdown(items);

  return (
    <div tabIndex={0} ref={dropdownRef} {...getAriaAttributes()}>
      <button onClick={toggleDropdown}>Select</button>
      <p data-testid="selected-item">{selectedItem?.text}</p>
      {isOpen && (
        <ul role="listbox">
          {items.map((item, index) => (
            <li
              key={index}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => updateSelectedItem(item)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

`SimpleDropdown`은 테스트용으로 제작된 더미 컴포넌트입니다. `useDropdown`의 중앙 집중식 로직을 사용하여 드롭다운 목록을 생성합니다. "Select" 버튼을 클릭하면 목록이 나타나거나 사라집니다. 이 목록에는 일련의 항목(Apple, Orange, Banana)이 포함되어 있으며, 사용자는 해당 항목을 클릭하여 원하는 항목을 선택할 수 있습니다. 위의 테스트는 이 동작이 의도한 대로 작동하는지 확인합니다.

`SimpleDropdown` 컴포넌트를 사용하면 보다 복잡하면서도 현실적인 시나리오를 테스트할 수 있습니다.

```tsx
it('키보드 탐색을 통해 항목을 선택한다.', async () => {
  render(<SimpleDropdown />);

  const trigger = screen.getByRole('button');

  expect(trigger).toBeInTheDocument();

  await userEvent.click(trigger);

  const dropdown = screen.getByRole('combobox');
  dropdown.focus();

  await userEvent.type(dropdown, '{arrowdown}');
  await userEvent.type(dropdown, '{enter}');

  await expect(screen.getByTestId('selected-item')).toHaveTextContent(
    items[0].text
  );
});
```

이 테스트는 사용자가 키보드 입력을 사용하여 드롭다운에서 항목을 선택할 수 있는지 확인합니다. `SimpleDropdown`을 렌더링하고 트리거 버튼을 클릭하면 드롭다운에 초점이 맞춰집니다. 그 후 테스트는 키보드 화살표 키를 눌러 첫 번째 항목으로 이동하고 엔터 키를 눌러 항목을 선택하는 것을 시뮬레이션합니다. 그런 다음 테스트는 선택한 항목에 예상 텍스트가 표시되는지 확인합니다.

헤드리스 컴포넌트에 커스텀 훅을 활용하는 것이 일반적이지만, 이것이 유일한 접근 방식은 아닙니다. 사실 훅이 등장하기 전에는 개발자들이 렌더 프로퍼티나 HOC(Higher-Order Component)를 사용하여 헤드리스 컴포넌트를 구현했습니다. 오늘날에는 HOC가 예전만큼의 인기를 얻지는 못했지만, 리액트 컨텍스트를 사용하는 선언적 API는 여전히 상당히 선호되고 있습니다.

## 컨텍스트 API가 포함된 선언적 헤드리스 컴포넌트

이 예시에서는 리액트 컨텍스트 API를 사용해 비슷한 결과를 얻을 수 있는 다른 선언적 방법을 보여드리겠습니다. 컴포넌트 트리 내에 계층 구조를 설정하고 각 컴포넌트를 교체할 수 있도록 함으로써 키보드 탐색, 접근성 등을 지원하는 등 효과적으로 동작할 뿐만 아니라, 사용자가 자신만의 컴포넌트를 커스터마이징할 수 있는 유연성을 제공하는 가치 있는 인터페이스를 제공할 수 있습니다.

```tsx
import { HeadlessDropdown as Dropdown } from './HeadlessDropdown';

const HeadlessDropdownUsage = ({ items }: { items: Item[] }) => {
  return (
    <Dropdown items={items}>
      <Dropdown.Trigger as={Trigger}>Select an option</Dropdown.Trigger>
      <Dropdown.List as={CustomList}>
        {items.map((item, index) => (
          <Dropdown.Option
            index={index}
            key={index}
            item={item}
            as={CustomListItem}
          />
        ))}
      </Dropdown.List>
    </Dropdown>
  );
};
```

`HeadlessDropdownUsage` 컴포넌트는 `Item` 배열 타입의 `items` 프로퍼티를 받아 `Dropdown` 컴포넌트를 반환합니다. `Dropdown` 내부에는 `CustomTrigger` 컴포넌트를 렌더링하는 `Dropdown.Trigger`와 `CustomList` 컴포넌트를 렌더링하는 `Dropdown.List`를 정의하고, `items` 배열을 매핑하여 각 항목에 대한 `Dropdown.Option`을 생성하고, `CustomListItem` 컴포넌트를 렌더링합니다.

이 구조를 사용하면 컴포넌트 간의 명확한 계층적 관계를 유지하면서 드롭다운 메뉴의 렌더링과 동작을 유연하고 선언적인 방식으로 사용자 정의할 수 있습니다. `Dropdown.Trigger`, `Dropdown.List`, `Dropdown.Option` 컴포넌트는 스타일이 지정되지 않은 기본 HTML 요소(각각 button, ul, li)를 제공한다는 점에 유의하세요. 이 컴포넌트들은 각각 프로퍼티를 허용하여 사용자가 자신만의 스타일과 동작으로 컴포넌트를 커스터마이징할 수 있도록 합니다.

예를 들어 이러한 사용자 정의 컴포넌트를 정의하고 위와 같이 사용할 수 있습니다.

```tsx
const CustomTrigger = ({ onClick, ...props }) => (
  <button className="trigger" onClick={onClick} {...props} />
);

const CustomList = ({ ...props }) => (
  <div {...props} className="dropdown-menu" />
);

const CustomListItem = ({ ...props }) => (
  <div {...props} className="item-container" />
);
```

![사진 4: 커스터마이즈된 요소를 통한 선언적인 UI](https://martinfowler.com/articles/headless-component/declarative-ui.png)

_사진 4: 커스터마이즈된 요소를 통한 선언적인 UI_

구현은 복잡하지 않습니다. `Dropdown`(루트 요소)에 컨텍스트를 정의하고 관리해야 하는 모든 상태를 그 안에 넣고, 자식 노드에서 해당 컨텍스트를 사용하여 상태에 액세스하거나 컨텍스트의 API를 통해 상태를 변경하면 됩니다.

```tsx
type DropdownContextType<T> = {
  isOpen: boolean;
  toggleDropdown: () => void;
  selectedIndex: number;
  selectedItem: T | null;
  updateSelectedItem: (item: T) => void;
  getAriaAttributes: () => any;
  dropdownRef: RefObject<HTMLElement>;
};

function createDropdownContext<T>() {
  return createContext<DropdownContextType<T> | null>(null);
}

const DropdownContext = createDropdownContext();

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('컴포넌트는 <Dropdown/> 내에서 사용해야 합니다.');
  }
  return context;
};
```

이 코드는 일반 `DropdownContextType` 타입과 이 타입으로 컨텍스트를 생성하는 `createDropdownContext` 함수를 정의합니다. 이 함수를 사용하여 `DropdownContext`가 생성됩니다. `useDropdownContext`는 이 컨텍스트에 접근하는 커스텀 훅으로, `<Dropdown/>` 컴포넌트 외부에서 사용될 경우 오류를 발생시켜 원하는 컴포넌트 계층구조 내에서 적절하게 사용되도록 합니다.

그런 다음 컨텍스트를 사용하는 컴포넌트를 정의할 수 있습니다. 컨텍스트 프로바이더부터 시작할 수 있습니다.

```tsx
const HeadlessDropdown = <T extends { text: string }>({
  children,
  items,
}: {
  children: React.ReactNode;
  items: T[];
}) => {
  const {
    //... 훅의 모든 상태와 상태 설정 함수
  } = useDropdown(items);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        toggleDropdown,
        selectedIndex,
        selectedItem,
        updateSelectedItem,
      }}
    >
      <div
        ref={dropdownRef as RefObject<HTMLDivElement>}
        {...getAriaAttributes()}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};
```

`HeadlessDropdown` 컴포넌트는 `children`과 `items`라는 두 가지 프로퍼티를 취하고, 커스텀 훅 `useDropdown`을 사용해 상태와 동작을 관리합니다. 이 컴포넌트는 하위 컴포넌트와 상태 및 동작을 공유하기 위해 `DropdownContext.Provider`를 통해 컨텍스트를 제공합니다. `div` 내에서 참조를 설정하고 접근성을 위해 ARIA 속성을 적용한 다음 `children`을 렌더링하여 중첩된 컴포넌트를 표시함으로써 구조화되고 사용자 정의 가능한 드롭다운 기능을 구현합니다.

이전 섹션에서 정의한 `useDropdown` 훅을 사용한 다음 이 값을 `HeadlessDropdown`의 자식에게 전달하는 방법에 주목하세요. 그런 다음 자식 컴포넌트를 정의할 수 있습니다.

```tsx
HeadlessDropdown.Trigger = function Trigger({
  as: Component = 'button',
  ...props
}) {
  const { toggleDropdown } = useDropdownContext();

  return <Component tabIndex={0} onClick={toggleDropdown} {...props} />;
};

HeadlessDropdown.List = function List({ as: Component = 'ul', ...props }) {
  const { isOpen } = useDropdownContext();

  return isOpen ? <Component {...props} role="listbox" tabIndex={0} /> : null;
};

HeadlessDropdown.Option = function Option({
  as: Component = 'li',
  index,
  item,
  ...props
}) {
  const { updateSelectedItem, selectedIndex } = useDropdownContext();

  return (
    <Component
      role="option"
      aria-selected={index === selectedIndex}
      key={index}
      onClick={() => updateSelectedItem(item)}
      {...props}
    >
      {item.text}
    </Component>
  );
};
```

추가 프로퍼티와 함께 컴포넌트 또는 HTML 태그를 처리하기 위해 `GenericComponentType` 타입을 정의했습니다. 드롭다운 메뉴의 각 부분을 렌더링하는 세 가지 함수 `HeadlessDropdown.Trigger`, `HeadlessDropdown.List`, `HeadlessDropdown.Option`이 정의되어 있습니다. 각 함수는 컴포넌트의 커스텀 렌더링을 허용하기 위해 `as` 프로퍼티를 활용하고 렌더링된 컴포넌트에 추가 프로퍼티를 펼칩니다. 이들 함수는 모두 `useDropdownContext`를 통해 공유된 상태 및 동작에 접근합니다.

- `HeadlessDropdown.Trigger`는 기본적으로 드롭다운 메뉴를 토글하는 버튼을 렌더링합니다.
- `HeadlessDropdown.List`는 드롭다운이 열려 있으면 목록 컨테이너를 렌더링합니다.
- `HeadlessDropdown.Option`은 개별 항목의 목록을 렌더링하고 클릭 시 선택한 항목을 업데이트합니다.

이러한 기능을 종합하면 커스텀 가능하며 접근 가능한 드롭다운 메뉴 구조를 만들 수 있습니다.

이는 코드베이스에서 헤드리스 컴포넌트를 어떻게 활용할지에 대한 사용자 선호도에 따라 크게 달라집니다. 훅은 DOM(또는 가상 DOM) 상호 작용을 포함하지 않아 공유 상태 로직과 UI 사이의 유일한 접점은 ref 객체라는 점에서 저는 훅을 선호합니다. 반면에 컨텍스트 기반 구현에서는 사용자가 커스터마이징하지 않을 때 기본 구현이 제공됩니다.

다음 예제에서는 `useDropdown` 훅을 사용하여 핵심 기능을 유지하면서, 다른 UI로 얼마나 쉽게 전환할 수 있는지 보여드리겠습니다.

## 새로운 UI 요구 사항에 적응하기

버튼을 트리거 요소로 사용하고 드롭다운 목록의 텍스트와 함께 아바타를 표시하는 새로운 디자인이 필요한 시나리오를 생각해 봅시다. `useDropdown` 훅에 이미 로직이 캡슐화되어 있으므로, 새로운 UI에 적응하는 것은 간단합니다.

아래의 새로운 `DropdownTailwind` 컴포넌트에서는 요소의 스타일을 지정하기 위해 Tailwind CSS(Tailwind CSS는 사용자 정의 사용자 인터페이스를 빠르게 구축하기 위한 유틸리티 우선 CSS 프레임워크입니다)를 사용했습니다. 버튼이 트리거 요소로 사용되고 드롭다운 목록의 각 항목에 이미지가 포함되는 등 구조가 약간 수정되었습니다. 이러한 UI 변경에도 불구하고 `useDropdown` 훅 덕분에 핵심 기능은 그대로 유지됩니다.

```tsx
const DropdownTailwind = ({ items }: DropdownProps) => {
  const {
    isOpen,
    selectedItem,
    selectedIndex,
    toggleDropdown,
    handleKeyDown,
    setSelectedItem,
  } = useDropdown<Item>(items);

  return (
    <div
      className="relative"
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
    >
      <button className="btn p-2 border ..." tabIndex={0}>
        {selectedItem ? selectedItem.text : 'Select an item...'}
      </button>

      {isOpen && (
        <ul className="dropdown-menu ..." role="listbox">
          {items.map((item, index) => (
            <li key={index} role="option">
              {/* ... JSX의 남은 부분 ... */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

이 렌더링에서 `DropdownTailwind` 컴포넌트는 `useDropdown` 훅과 인터페이스하여 상태와 상호작용을 관리합니다. 이러한 설계 덕분에 UI를 수정하거나, 개선할 때 기본 로직을 다시 구현할 필요가 없어 새로운 디자인 요구 사항에 쉽게 적응할 수 있습니다.

또한 React Devtools를 사용하면 코드를 좀 더 잘 시각화할 수 있으며, `hooks` 섹션에 모든 상태가 나열되어 있습니다.

![사진 5: 데브툴](https://martinfowler.com/articles/headless-component/dev-tools.png)

_사진 5: 데브툴_

모든 드롭다운 목록은 외형에 관계없이 내부적으로 일관된 동작을 공유하며, 이 모든 동작은 `useDropdown` 훅(헤드리스 컴포넌트)에 캡슐화되어 있습니다. 하지만 원격 환경에서 데이터를 가져와야 하거나 비동기 상태와 같이 더 많은 상태를 관리해야 하는 경우에는 어떻게 해야 할까요?

## 추가 상태애 대해 더 깊게 파보기

드롭다운 컴포넌트를 진행하면서 원격 데이터를 처리할 때 발생하는 좀 더 복잡한 상태를 살펴보겠습니다. 원격 소스에서 데이터를 가져오는 시나리오에서는 로딩, 오류 및 데이터 상태를 처리해야 하는 등 몇 가지 상태를 더 관리해야 할 필요성이 생깁니다.

![사진 6: 다른 상태](https://martinfowler.com/articles/headless-component/dropdown-async-status.png)

_사진 6: 다른 상태_

## 원격 데이터 가져오기

원격 서버에서 데이터를 로드하려면 `loading`, `error`, `data`의 세 가지 새로운 상태를 정의해야 합니다. 일반적으로 `useEffect` 호출을 통해 이를 수행하는 방법은 다음과 같습니다.

```tsx
//...
const [loading, setLoading] = useState<boolean>(false);
const [data, setData] = useState<Item[] | null>(null);
const [error, setError] = useState<Error | undefined>(undefined);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/users');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error: ${error.error || response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

//...
```

이 코드는 `loading`, `data`, `error`의 세 가지 상태 변수를 초기화합니다. 컴포넌트가 마운트되면 비동기 함수를 실행시켜, "/api/users" 엔드포인트에서 데이터를 가져옵니다. 이 함수는 `loading`을 페칭 전에는 `true`로 설정하고, 이후에는 `false`로 설정합니다. 데이터가 성공적으로 불러와지면 `data` 상태에 저장됩니다. 오류가 발생하면 오류가 캡처되어 `error` 상태에 저장됩니다.

## 우아함과 재사용성을 위한 리팩터링

컴포넌트 내에 직접 페칭 로직을 통합하는 것도 가능하지만, 가장 우아하거나 재사용 가능한 접근 방식은 아닙니다. 여기서 헤드리스 컴포넌트의 원리를 좀 더 발전시켜 로직과 상태를 UI에서 분리할 수 있습니다. 페칭 로직을 별도의 함수로 추출하여 이를 리팩터링해 보겠습니다.

```tsx
const fetchUsers = async () => {
  const response = await fetch('/api/users');

  if (!response.ok) {
    const error = await response.json();
    throw new Error('무언가 잘못되었습니다.');
  }

  return await response.json();
};
```

이제 `fetchUsers` 함수가 준비되었으므로 한 단계 더 나아가 가져오는 로직을 일반 훅으로 추상화할 수 있습니다. 이 훅은 *fetch 함수*를 받아들이고 관련된 loading, error 및 data 상태를 관리합니다.

```tsx
const useService = <T>(fetch: () => Promise<T>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const data = await fetch();
        setData(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetch]);

  return {
    loading,
    error,
    data,
  };
};
```

이제 `useService` 훅은 애플리케이션 전체에서 데이터를 가져오는 데 재사용 가능한 해결책으로 등장합니다. 아래 그림과 같이 다양한 유형의 데이터를 가져오는 데 사용할 수 있는 깔끔한 추상화입니다.

```tsx
// 제품 데이터를 가져옵니다.
const { loading, error, data } = useService(fetchProducts);
// 또는 다른 타입의 자원을 가져옵니다.
const { loading, error, data } = useService(fetchTickets);
```

이 리팩터링을 통해 데이터 페칭 로직을 단순화했을 뿐만 아니라 애플리케이션의 다양한 시나리오에서 재사용할 수 있도록 만들었습니다. 이를 통해 드롭다운 컴포넌트를 지속적으로 개선하고 고급 기능과 최적화에 대해 더 깊이 파고들 수 있는 탄탄한 토대를 마련했습니다.

## 드롭다운 컴포넌트의 단순성 유지

`useService` 및 `useDropdown` 훅의 추상화된 로직 덕분에 원격 데이터 페칭을 통합해도 `Dropdown` 컴포넌트가 복잡해지지 않았습니다. 컴포넌트 코드는 가장 단순한 형태로 유지되어 페칭 상태를 효과적으로 관리하고, 수신된 데이터를 기반으로 콘텐츠를 렌더링합니다.

```tsx
const Dropdown = () => {
  const { data, loading, error } = useService(fetchUsers);

  const {
    toggleDropdown,
    dropdownRef,
    isOpen,
    selectedItem,
    selectedIndex,
    updateSelectedItem,
    getAriaAttributes,
  } = useDropdown<Item>(data || []);

  const renderContent = () => {
    if (loading) return <Loading />;
    if (error) return <Error />;
    if (data) {
      return (
        <DropdownMenu
          items={data}
          updateSelectedItem={updateSelectedItem}
          selectedIndex={selectedIndex}
        />
      );
    }
    return null;
  };

  return (
    <div
      className="dropdown"
      ref={dropdownRef as RefObject<HTMLDivElement>}
      {...getAriaAttributes()}
    >
      <Trigger
        onClick={toggleDropdown}
        text={selectedItem ? selectedItem.text : 'Select an item...'}
      />
      {isOpen && renderContent()}
    </div>
  );
};
```

이 업데이트된 `Dropdown` 컴포넌트에서는 `useService`을 사용하여 데이터 페칭 상태를 관리하고, `useDropdown` 훅을 사용하여 드롭다운 관련 상태와 상호작용을 관리합니다. `renderContent` 함수는 페칭 상태에 따라 렌더링 로직을 우아하게 처리하여 로딩 중이든, 오류가 발생했든, 데이터가 있든 올바른 콘텐츠가 표시되도록 합니다.

위의 예시에서 헤드리스 컴포넌트가 파트 간의 느슨한 결합을 어떻게 촉진하는지 살펴보세요. 이러한 유연성 덕분에 다양한 조합을 위해 부품을 교체할 수 있습니다. `Loading` 및 `Error` 컴포넌트를 공유하면 기본 JSX와 스타일링이 포함된 `UserDropdown`을 손쉽게 만들거나 다른 API 엔드포인트에서 데이터를 가져오는 TailwindCSS를 사용하여 `ProductDropdown`을 손쉽게 만들 수 있습니다.

## 헤드리스 컴포넌트 패턴을 사용하면..

헤드리스 컴포넌트 패턴은 JSX 코드를 기본 로직에서 깔끔하게 분리할 수 있는 강력한 방법을 제시합니다. JSX로 선언적 UI를 구성하는 것은 자연스럽게 이루어지지만, 실제 문제는 상태 관리에서 발생합니다. 바로 이 지점에서 헤드리스 컴포넌트가 모든 상태 관리의 복잡성을 해결하여 추상화의 새로운 지평을 열었습니다.

본질적으로 헤드리스 컴포넌트는 로직을 캡슐화하지만 그 자체로는 렌더링하지 않는 함수 또는 객체입니다. 렌더링 부분을 소비자에게 맡기므로 UI 렌더링 방식에 높은 수준의 유연성을 제공합니다. 이 패턴은 여러 시각적 표현에서 재사용하려는 복잡한 로직이 있을 때 매우 유용할 수 있습니다.

```tsx
function useDropdownLogic() {
  // ... 모든 드롭다운 로직
  return {
    // ... 노출된 로직
  };
}

function MyDropdown() {
  const dropdownLogic = useDropdownLogic();
  return (
    // ... dropdownLogic의 로직을 사용하여 UI를 렌더링합니다.
  );
}

```

헤드리스 컴포넌트는 여러 컴포넌트에서 공유할 수 있는 로직을 캡슐화하여 재사용성을 향상시키고, DRY(반복하지 않기) 원칙을 준수하는 등 여러 가지 이점을 제공합니다. 유지 관리 가능한 코드를 작성하기 위한 기본적인 실천 방법인, 로직과 렌더링을 명확하게 구분하여 문제를 명확하게 분리하는 것을 강조합니다. 또한 개발자가 동일한 핵심 로직을 사용하여 다양한 UI 구현을 채택할 수 있게 함으로써 유연성을 제공하며, 이는 다양한 디자인 요구 사항을 처리하거나 다양한 프레임워크로 작업할 때 특히 유용합니다.

하지만 분별력을 가지고 접근하는 것이 중요합니다. 다른 디자인 패턴과 마찬가지로 도전 과제가 있습니다. 익숙하지 않은 사용자에게는 초기 학습 곡선이 있어 일시적으로 개발 속도가 느려질 수 있습니다. 또한 헤드리스 컴포넌트를 신중하게 적용하지 않으면 헤드리스 컴포넌트가 도입한 추상화가 어느 정도의 방향성을 추가하여 코드의 가독성을 복잡하게 만들 수 있습니다.

이 패턴은 다른 프런트엔드 라이브러리나 프레임워크에도 적용될 수 있다는 점에 주목하고 싶습니다. 예를 들어 Vue에서는 이 개념을 `renderless` 컴포넌트라고 부릅니다. 이는 동일한 원리를 구현하여 개발자가 로직과 상태 관리를 별도의 컴포넌트로 분리하여 사용자가 이를 중심으로 UI를 합성할 수 있도록 합니다.

앵귤러 또는 다른 프레임워크에서의 구현이나 호환성에 대해서는 확실하지 않지만, 특정 상황에서 잠재적인 이점을 고려하는 것이 좋습니다.

## GUI에서 루트 패턴 다시 살펴보기

업계에 오래 종사했거나 데스크톱 설정에서 GUI 애플리케이션을 사용해 본 경험이 있다면 헤드리스 컴포넌트 패턴에 익숙할 것입니다. 아마도 다른 이름으로 불리기도 하지만 MVVM의 View-Modal, [프레젠테이션 모델](https://martinfowler.com/bliki/PresentationModel.html) 또는 노출 정도에 따라 다른 용어로도 불릴 수 있습니다. 마틴 파울러는 몇 년 전 [포괄적인 아티클](https://martinfowler.com/eaaDev/uiArchs.html)을 통해 이러한 용어에 대한 심층적인 분석을 제공했는데, 이 아티클에서는 MVC, Model-View-Presenter 등 GUI 세계에서 널리 사용되는 많은 용어를 명확히 정의했습니다.

> 프레젠테이션 모델은 뷰의 상태 및 동작을 프레젠테이션 계층 내의 모델 클래스로 추상화합니다. 이 모델은 도메인 계층과 조정하고 뷰에 대한 인터페이스를 제공하여 뷰에서 의사 결정을 최소화합니다...
>
> -- [Martin Fowler](https://martinfowler.com/bliki/PresentationModel.html)

그럼에도 불구하고 저는 이 확립된 패턴을 조금 더 확장하여 리액트 또는 프런트엔드 세계에서 어떻게 작동하는지 살펴볼 필요가 있다고 생각합니다. 기술이 발전함에 따라 기존 GUI 애플리케이션이 직면한 문제 중 일부는 더 이상 타당하지 않을 수 있으며, 특정 필수 요소는 이제 선택 사항이 될 수 있습니다.

예를 들어, UI와 로직을 분리한 이유 중 하나는 특히 헤드리스 [CI](https://martinfowler.com/articles/continuousIntegration.html)/[CD](https://martinfowler.com/bliki/ContinuousDelivery.html) 환경에서 이 둘의 조합을 테스트하기 어렵다는 점이었습니다. 따라서 테스트 프로세스를 간소화하기 위해 가능한 한 많은 부분을 UI가 없는 코드로 추출하는 것을 목표로 했습니다. 하지만 이는 리액트와 다른 많은 웹 프레임워크에서는 큰 문제가 되지 않습니다. 우선 UI 동작, DOM 조작 등을 테스트할 수 있는 [jsdom](https://github.com/jsdom/jsdom)과 같은 강력한 인메모리 테스트 메커니즘이 있습니다. 이러한 테스트는 헤드리스 CI/CD 서버와 같은 모든 환경에서 실행할 수 있으며, 인메모리 브라우저(예: 헤드리스 Chrome)에서 [Cypress](https://www.cypress.io/)를 사용하여 실제 브라우저 테스트를 쉽게 실행할 수 있는데, 이는
MVC/MVP를 구상할 당시 데스크톱 애플리케이션에서는 불가능했던 일입니다.

MVC가 직면한 또 다른 주요 과제는 데이터 동기화로, 프레젠터 또는 프레젠테이션 모델이 기초 데이터의 변경 사항을 조율하고 다른 렌더링 부분에 알려야 했습니다. 대표적인 예가 아래 그림과 같습니다.

![Figure 7: One model has multiple presentations](https://martinfowler.com/articles/headless-component/mvc-trans.png)

_사진 7: 하나의 모델에 여러 프레젠테이션이 있습니다._

위 그림에서 세 가지 UI 컴포넌트(표, 꺾은선형 차트, 히트맵)는 완전히 독립적이지만 모두 동일한 모델 데이터를 렌더링하고 있습니다. 표에서 데이터를 수정하면 다른 두 그래프가 새로 고쳐집니다. 변경 사항을 감지하고 해당 컴포넌트를 새로 고치도록 변경 사항을 적용하려면 이벤트 리스너를 수동으로 설정해야 합니다.

그러나 단방향 데이터 흐름이 등장하면서 리액트는 다른 많은 최신 프레임워크를 따라서 다른 길을 걷게 되었습니다. 개발자로서 우리는 더 이상 모델 변경 사항을 모니터링할 필요가 없습니다. 기본 아이디어는 모든 변경 사항을 완전히 새로운 인스턴스로 취급하고 모든 것을 처음부터 다시 렌더링하는 것입니다. 여기서 전체 프로세스를 현저하게 간소화하고 [가상 DOM](https://legacy.reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom)과 차별화 및 조정 프로세스를 간과하고 있다는 점에 주목하는 것이 중요합니다. 즉, 코드베이스 내에서 모델 변경 후 다른 세그먼트를 정확하게 업데이트하기 위해 이벤트 리스너를 등록해야 할 필요성이 사라졌음을 의미합니다.

요약하자면, 헤드리스 컴포넌트는 기존 UI 패턴을 재창조하는 것이 목적이 아니라 컴포넌트 기반 UI 아키텍처 내에서 구현하는 역할을 합니다. 로직과 상태 관리를 뷰에서 분리하는 원칙은 특히 명확한 책임을 명시하고 한 뷰를 다른 뷰로 대체할 기회가 있는 시나리오에서 그 중요성을 유지합니다.

## 커뮤니티 이해하기

헤드리스 컴포넌트의 개념은 새로운 것이 아니며 한동안 존재해 왔지만 널리 인정받거나 프로젝트에 통합되지는 못했습니다. 하지만 여러 라이브러리에서 헤드리스 컴포넌트 패턴을 채택하여 접근 가능하고 적응 가능하며 재사용 가능한 컴포넌트의 개발을 촉진하고 있습니다. 이러한 라이브러리 중 일부는 이미 커뮤니티 내에서 상당한 주목을 받고 있습니다.

- [React ARIA](https://react-spectrum.adobe.com/react-aria/): 포괄적인 리액트 애플리케이션을 구축하기 위한 접근성 기본 요소와 훅을 제공하는 Adobe의 라이브러리입니다. 키보드 상호작용, 포커스 관리, ARIA 주석을 관리할 수 있는 훅 모음을 제공하여 접근성 있는 UI 컴포넌트를 더 쉽게 만들 수 있습니다.
- [Headless UI](https://headlessui.com/): 완전히 스타일이 지정되지 않고 접근성이 높은 UI 컴포넌트 라이브러리로, Tailwind CSS와 잘 통합되도록 설계되었습니다. 개발자만의 스타일이 적용된 컴포넌트를 구축할 수 있는 동작 및 접근성을 제공합니다.
- [React Table](https://tanstack.com/table/v8/?from=reactTableV7&original=https://github.com/TanStack/table/tree/v7/docs/src/pages/): 리액트용 빠르고 확장 가능한 테이블과 데이터 그리드를 구축하기 위한 헤드리스 유틸리티입니다. 복잡한 테이블을 쉽게 생성할 수 있는 유연한 훅을 제공하여 UI 표현은 사용자에게 맡깁니다.
- [Downshift](https://www.downshift-js.com/): 접근 가능하고 커스터마이징 가능한 드롭다운, 콤보박스 등을 만드는 데 도움이 되는 미니멀리스트 라이브러리입니다. 모든 로직을 처리하는 동시에 렌더링 측면을 정의할 수 있습니다.

이러한 라이브러리는 복잡한 로직과 동작을 캡슐화하여 헤드리스 컴포넌트 패턴의 본질을 구현하므로 인터랙티브하고 접근성이 뛰어난 UI 컴포넌트를 쉽게 만들 수 있습니다. 제공된 예제는 학습의 디딤돌 역할을 하지만, 실제 시나리오에서 강력하고 접근 가능하며 사용자 지정 가능한 컴포넌트를 구축하려면 이러한 프로덕션 지원 라이브러리를 활용하는 것이 현명합니다.

이 패턴은 복잡한 로직과 상태 관리에 대한 교육을 제공할 뿐만 아니라 헤드리스 컴포넌트 접근 방식을 개선하여 실제 환경에서 사용할 수 있는 강력하고 접근 가능하며 사용자 정의 가능한 컴포넌트를 제공하는 프로덕션 지원 라이브러리를 탐색하도록 유도합니다.

## 결론

이 글에서는 재사용 가능한 UI 로직을 제작할 때 간과하기 쉬운 패턴인 헤드리스 컴포넌트의 개념을 살펴봅니다. 복잡한 드롭다운 목록 생성을 예로 들어 간단한 드롭다운부터 시작하여 키보드 탐색, 비동기 데이터 페칭 등의 기능을 점진적으로 도입해 보았습니다. 이 접근 방식은 재사용 가능한 로직을 헤드리스 컴포넌트로 원활하게 추출하는 방법을 보여주며, 새로운 UI를 쉽게 오버레이할 수 있다는 점을 강조합니다.

실제 사례를 통해 이러한 분리가 어떻게 재사용 가능하고 접근 가능한 맞춤형 컴포넌트를 구축할 수 있는 길을 열어주는지 조명합니다. 또한 헤드리스 컴포넌트 패턴을 옹호하는 React Table, Downshift, React UseGesture, React ARIA, 헤드리스 UI와 같은 유명한 라이브러리를 집중 조명합니다. 이러한 라이브러리는 인터랙티브하고 사용자 친화적인 UI 컴포넌트를 개발하기 위해 미리 구성된 솔루션을 제공합니다.

이 심층 분석에서는 확장 가능하고 접근 가능하며 유지 관리가 가능한 리액트 애플리케이션을 제작하는 데 있어 UI 개발 프로세스에서의 관심사 분리가 가지는 중요성을 강조합니다.

---

### 각주

<a name="footnote_1">1</a>: [Fake](https://martinfowler.com/bliki/TestDouble.html)는 외부 시스템이나 리소스에 대한 액세스를 캡슐화하는 객체입니다. 모든 채택 로직을 코드베이스에 분산시키고 싶지 않을 때 유용하며, 외부 시스템이 변경될 때 한 곳에서 변경하기가 더 쉬워질 수 있습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
