---
title: '리액트 다루는 기술 정리 (8) - 리덕스 라이브러리 이해'
date: 2021-06-26 18:00:00
category: 'React'
draft: false
---

# 16. 리덕스 라이브러리 이해하기

리덕스는 가장 많이 사용하는 상태 라이브러리이다. 리덕스를 사용하면 컴포넌트의 상태 업데이트 관련 로직을 다른 파일로 분리시켜 효율적으로 관리 할 수 있다. 전역 상태를 관리할 때 특히 효과적이다. 이전 장에서 정리한 Context API로도 전역 상태 관리가 가능하다. 하지만 단순 전역 상태 관리 뿐만 아니라 더욱 더 체계적인 관리를 하고 싶다면 프로젝트가 클 수록 리덕스 사용 시 유지 보수성이 높고, 작업 효율이 극대화 된다. 편리한 개발자 도구 지원과 미들웨어 제공을 통해 비동기 작업을 효율적으로 관리할 수 있도록 해주는 장점도 있다.

## 16.1 개념 정리

### 16.1.1 액션

상태에 변화가 필요할 경우 액션(action)이 발생한다. 액션 객체는 반드시 type 필드를 가지고 있어야 하고 나머지 값은 상태 업데이트 시 참고용이고, 필수는 아니다.

```jsx
{
	type:'ADD_TODO',
	data:{
		id:1,
		text:'리덕스 학습'
	}
}
```

### 16.1.2 액션 생성 함수(action creator)

액션 객체를 만들어 주는 함수이다. 어떤 변화를 일으킬 때마다 액션 객체를 만들어야하는데 매번 액션 객체를 직접 작성하기 어렵기 때문에 함수로 만들어서 관리한다.

```jsx
function addTodo(data) {
	return {
		type: 'ADD_TODO',
		data
	};
}
```

### 16.1.3 리듀서

리듀서는 변화를 일으키는 함수이다. 액션을 만들어서 발생시키면 리듀서가 현재 상태와 전달받은 액션 객체를 파라미터로 받아서 새로운 상태를 만들어 반환해준다.

```jsx
const initialState = {
	counter: 1
};
function reducer(state = initialState, action) {
	switch(action.type) {
		case INCREMENT:
			return {
				counter: state.counter+1
			};
		default:
			return state;
	}
}
```

### 16.1.4 스토어

프로젝트에 리덕스 적용하기 위해 스토어(store)를 만드는데, 한 프로젝트는 단 한개의 스토어만 가진다. 스토어 안에는 현재 애플리케이션 상태와 리듀서, 내장 함수가 들어가 있다. 

### 16.1.5 디스패치

디스패치(dispatch)는 스토어의 내장 함수 중 하나이다.  액션을 발생시키는 것이라고 이해하면 된다. `dispatch(action)` 과 같은 형태로 액션 객체를 파라미터로 넣어서 호출한다. 이 함수가 호출될 때 스토어는 리듀서 함수를 실행시키고 새로운 상태를 받는다.

### 16.1.6 구독

구독(subscribe)도 스토어의 내장 함수 중 하나로 subscribe 함수 안에 리스너 함수를 파라미터로 넣어서 호출하면 리스너 함수가 액션이 디스패치되어 상태가 업데이트 될 때마다 호출된다. 

```jsx
const listener = () => {
	console.log('updated!')
}
const unsubscribe = store.subscribe(listener);

unsubscribe(); // 구독 비활성화 시 함수 호출
```

## 16.2 리액트 없이 쓰는 리덕스

리덕스는 리액트에 종속되는 라이브러리가 아니다. augular와 함께 쓰일 수도 있고 vue에서도 사용할 수 있다. 하지만 vue에서는 보통 vuex를 많이 사용한다. 리덕스는 바닐라JS와도 사용할 수 있다. 

```jsx
//DOM노드 지정
const divToggle = document.querySelector('.toggle');
const counter = document.querySelector('h1');
const btnIncrease = document.querySelector('#increase');
const btnDecrease = document.querySelector('#decrease');

//액션 이름 정의
const TOGGLE_SWITCH = 'TOGGLE_SWITCH';
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

//액션 생성 함수
const toggleSwitch = () => ({ type: TOGGLE_SWITCH });
const increase = () => ({ type: INCREASE, difference });
const decrease = () => ({ type: DECREASE });

//초기 값 설정
const initialState = {
    toggle: false,
    counter: 0
};

//리듀서 함수 (기본값을 파라미터에서 설정해주어야 함)
function reducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_SWITCH:
            return {
                ...state, // 불변성 유지
                toggle: !state.toggle
            };
        case INCREASE:
            return {
                ...state,
                counter: state.counter + action.difference
            };
        case DECREASE:
            return {
                ...state,
                counter: state.counter - 1
            };
        default:
            return state;
    }
}

//스토어 생성
const store = createStore(reducer);

//render 함수 생성
const render = () => {
    const state = store.getState();
    if (state.toggle) {
        divToggle.classList.add('active');
    } else {
        divToggle.classList.remove('active');
    }
    counter.innerText = state.counter;
}

render();

// 구독하기 - 액션이 발생하여 상태 업데이트 될 때마다 호출하도록
store.subscribe(render);

//액션 발생시키기
divToggle.onclick = () => {
    store.dispatch(toggleSwitch());
};
btnIncrease.onclick = () => {
    store.dispatch(increase(1));
};
btnDecrease.onclick = () => {
    store.dispatch(decrease());
}
```

## 16.3 리덕스의 세 가지 규칙

### 16.3.1 단일 스토어

하나의 앱에는 하나의 스토어가 있는게 권장된다.

### 16.3.2 읽기 전용 상태

리덕스 상태는 읽기 전용이다. 리덕스도 상태 업데이트 시 기존 객체를 건드리지 않고 새로운 객체를 생성해야 한다. 리덕스에서 불변성을 유지해야 하는 이유는 내부적으로 데이터 변경을 감지하기 위함이다. 

### 16.3.3 리듀서는 순수 함수

리듀서는 순수 함수여야 한다.

- 리듀서 함수는 이전 상태와 액션 객체를 파라미터로 받는다.
- 파라미터 외의 값에는 의존하면 안된다.
- 이전 상태는 건드리지 않고, 변화를 준 새로운 상태 객체를 만들어 반환한다.
- 똑같은 파라미터로 호출된 리듀서 함수는 언제나 똑같은 결과 값을 반환한다.


---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
