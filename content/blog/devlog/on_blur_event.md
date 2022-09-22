---
title: '드롭다운에서 on Blur 이벤트 사용하기'
date: 2022-09-23 01:00:00
category: 'DevLog'
draft: false
---

![](<./images/on_blur_event(1).png>)

[Forrest](https://for-rest.netlify.app)를 개발하던 중 드롭다운 메뉴를 개발하였다. 드롭다운 항목을 누르면 위 그림과 같이 옵션 리스트가 포함되는 형식의 화면이었다. 여기서 추가적으로 요청된 부분은 목록이 띄워져 있을 때, **목록 밖의 항목을 클릭하면 목록이 닫히도록** 하는 요구 사항이었다.

이전에 리액트 네이티브 개발을 할 땐, 컴포넌트에 내장된 `onBlur` 이벤트가 있어서 쉽게 해당 부분을 처리할 수 있었지만, 어떤 방식으로 할 지 좋은 방법이 떠오르지 않았다.

## 기존 코드

기존의 코드는 아래와 같았다. 기존 코드에서는 다시 목록을 여는 항목을 클릭해야만 목록이 닫히는 상황이었다.

```tsx
<div className="relative text-6xl">
  <div className="flex flex-row justify-center items-center">
    <p className="mr-5">
      <span className="text-primary font-bold">{mainHoliday.name}</span>까지
    </p>
    <div
      onClick={() => {
        setIsOpened(!isOpened);
      }}
    >
      <ArrowDown />
    </div>
  </div>
  <div className="flex justify-center">
    {isOpened && (
      <div className="absolute top-20 xl:left-[49.3%] lg:left-[48.5%] text-left text-xl bg-white w-80 rounded-2xl shadow-3xl border-solid px-3 py-2">
        <div className="relative w-[25px] left-[45%] bottom-4 border-b-8 border-x-[13px] border-x-transparent border-white shadow-2xl"></div>
        <ul className="overflow-y-auto h-72 ">
          {remainHolidays.map((holiday, idx) => {
            return (
              <li
                className="p-4 rounded-md hover:bg-background"
                key={holiday.name}
                onClick={e => {
                  handleClick(e);
                }}
              >
                {holiday.name}
              </li>
            );
          })}
        </ul>
      </div>
    )}
  </div>
</div>
```

## 첫 번째 시도

처음에 리액트 네이티브에서 같은 기능을 개발했었던 경험을 떠올려, `div`에 `onBlur` 이벤트를 걸어보려고 했지만, 도통 이벤트가 발생되지 않았다. 그래서 다소 무식(?)한 방법을 시도했다.

```tsx
// ...
<div className="flex justify-center">
  {isOpened && (
    <>
      <div
        className="w-[100vw] h-[100vw] fixed left-0 top-0 bg-transparent"
        onClick={() => {
          setIsOpened(!isOpened);
        }}
      ></div>
      <div className="absolute top-20 text-left text-base xl:text-xl lg:text-xl sm:text-base md:text-base bg-white w-64 sm:w-64 md:w-80 lg:w-80 xl:w-80 rounded-2xl shadow-3xl border-solid px-3 py-2 z-50">
        <div className="relative w-[25px] left-[45%] bottom-4 border-b-8 border-x-[13px] border-x-transparent border-white shadow-2xl"></div>
        <ul className="overflow-y-auto h-auto">
          {remainHolidays.map(holiday => {
            return (
              <li
                className="p-4 rounded-md hover:bg-background"
                key={holiday.name}
                onClick={handleClick}
              >
                {holiday.name}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  )}
</div>
```

위 코드와 같이 목록을 출력하기 전에 화면을 꽉 채우는 투명한 `div`를 생성하였다. 그리고 해당 `div`에 `onClick`이벤트를 걸어 해당 `div`가 클릭되면 목록을 닫도록 처리했다. 목록은 해당 투명한 `div`보다 위에 있다는 것을 나타내기 위해 `z-50`을 통해 `z-index`를 조정하였다. 이렇게 하면 의도된 대로 목록 외에 다른 부분에 클릭 이벤트가 일어날 때, 드롭다운 목록이 닫혔다. 사용 상에 큰 문제는 없었지만, 특정 부분 이외의 부분을 클릭하거나 다른 컴포넌트와 겹쳐진 부분을 클릭했을 때 닫혀지지 않는 현상도 조금씩은 존재했다.

어쨌든 요구 사항을 반영했지만, 뭔가 포커싱과 관련된 문제인데 포커싱으로 풀지 못하니 아쉬운 마음이 있었다.

## 리팩터링

해당 프로젝트가 아닌 실무에서 개발을 하다가 커스텀 셀렉트 박스 컴포넌트를 구현하는 부분을 진행하고 있었다. 해당 컴포넌트도 내가 기존에 겪었던 부분과 동일하게 셀렉트 박스에서 옵션을 표시하고, 옵션 외의 부분들을 클릭했을 때 옵션 목록이 닫히도록 하는 기능이 필요했다. 해당 부분을 개발하던 중 `div`에 `onBlur` 이벤트를 발생시키기 위해서는 `tab-index`와 함께 쓰여야한다는 사실을 알게되었다.

그래서 [Forrest](https://for-rest.netlify.app)의 기존 부분에도 활용해봐야겠다는 생각이 들었다. 새로 리팩터링한 코드는 아래와 같다.

```tsx
<div
  className="relative text-lg xl:text-6xl lg:text-5xl md:text-3xl sm:text-lg pb-3 sm:pb-3 md:pb-3 lg:pb-6 xl:pb-6"
  onBlur={handleBlur}
  tabIndex={0}
>
  <div className="flex flex-row justify-center items-center z-40">
    <p
      className="mr-5"
      onClick={() => {
        setIsOpened(!isOpened);
      }}
    >
      <span className="text-primary font-bold">{mainHoliday.name}</span>까지
    </p>
    <div
      className="w-2 xl:w-5 lg:w-4 md:w-2 sm:w-2"
      onClick={() => {
        setIsOpened(!isOpened);
      }}
    >
      <ArrowDown />
    </div>
  </div>
  <div className="flex justify-center">
    {isOpened && (
      <>
        <div className="absolute top-20 text-left text-base xl:text-xl lg:text-xl sm:text-base md:text-base bg-white w-64 sm:w-64 md:w-80 lg:w-80 xl:w-80 rounded-2xl shadow-3xl border-solid px-3 py-2 z-50">
          <div className="relative w-[25px] left-[45%] bottom-4 border-b-8 border-x-[13px] border-x-transparent border-white shadow-2xl"></div>
          <ul className="overflow-y-auto h-auto">
            {remainHolidays.map(holiday => {
              return (
                <li
                  className="p-4 rounded-md hover:bg-background"
                  key={holiday.name}
                  onClick={handleClick}
                >
                  {holiday.name}
                </li>
              );
            })}
          </ul>
        </div>
      </>
    )}
  </div>
</div>
```

위 코드와 같이 최상위 `div`에 `onBlur` 이벤트와 `tabIndex`를 추가해주면서 해당 컴포넌트가 포커스를 잃으면 해당 목록을 닫도록 해줬다. 여기서 주의할 점은 `onBlur`와 `tabIndex`를 어떤 위치에 넣는지가 중요하다. 포커스를 잃을 때 이벤트가 발생할 적합한 곳에 넣어줘야 한다.

## 정리

`div`의 `onBlur`와 같은 포커스 관련 이벤트를 트리거하기 위해서는 `tab-index`도 같이 사용해야 한다.
