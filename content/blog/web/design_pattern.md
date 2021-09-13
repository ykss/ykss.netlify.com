---
title: '[디자인패턴] mvc vs mvp vs mvvm'
date: 2021-09-14 01:00:00
category: 'Web'
draft: false
---

MVC, MVVM 등 이러한 디자인 패턴 용어는 웹 개발을 하다보면 자연스럽게 알게되는 패턴이다. 이러한 패턴들은 화면에 보여주는 로직과 실제 데이터가 처리되는 로직을 분리하기 위해 생겨났다. 하지만 이러한 패턴들이 서로 어떤 차이가 있는지를 확실히 아는게 중요하다는 생각이 들어서 이번 기회에 정리해보려고 한다.

## 1. MVC

가장 처음 들었었고, 가장 유명하다고 생각하는 패턴이 바로 MVC(Model-View-Controller) 패턴이다. MVC 패턴이 어떤 구조를 가지고 어떻게 동작하고 어떤 특징과 장단점이 있는지 알아보자.

### 1.1 MVC 패턴의 구조

![mvc](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F7IE8f%2FbtqBRvw9sFF%2FAGLRdsOLuvNZ9okmGOlkx1%2Fimg.png)

- Model : 어플리케이션에서 사용하는 데이터와 그 데이터 처리를 담당하는 부분

- View : 사용자에게 보여지는 UI 부분

- Controller : 사용자의 입력(Action)을 받아서 처리하는 부분

### 1.2 MVC 패턴의 동작

사용자들의 액션이 Controller에 들어오게되고, 컨트롤러는 사용자의 Action을 확인해서, Model을 업데이트하고, Controller가 Model을 나타낼 View를 선택하면, View는 업데이트된 Model을 이용하여 화면을 나타낸다. 아래 그림을 통해 쉽게 이해 가능하다. 비유하자면 View는 웹 레이어, Controller는 서버, Model은 DB 라고 볼 수 있다.

![mvc동작](https://miro.medium.com/max/1000/1*23_6IjYfnybitGq4jO0QCg.gif)

> MVC에서 View가 업데이트 되는 방법에는 View가 Model을 이용해서 직접 업데이트하거나, Model에서 View에게 Notify 하여 업데이트하거나, View가 Polling으로 주기적으로 Model의 변경을 감지하여 업데이트하는 방법이 있다.

### 1.3 MVC 패턴의 특징

Controller는 여러 개의 View를 선택할 수 있는 1:n 구조이다. Controller는 View를 선택하기만 하고 직접 업데이트 하지는 않는다. (View가 Controller를 알지 못해야 한다.) 컨트롤러는 Model에 직접적인 영향을 끼칠 수 있다. 하지만 Model은 Controller, View와 직접적인 관련은 없고 간접적인 방식으로 전달한다. Controller는 View에 영향을 끼치지만, View는 그럴 수 없다. 그리고 Controller는 View를 선택하여 영향을 끼칠 수 있지만 그 반대는 안된다.

### 1.4 MVC 패턴의 장점

굉장히 단순한 패턴이기 때문에 널리 사용되고 있다. 그렇기 때문에 많이쓰이고 보편적이라는 게 장점이다.

### 1.5 MVC 패턴의 단점

View와 Model 사이의 의존성이 높은 편이다. 때문에 어플리케이션이 커질 수록 복잡해질 수 있고, 유지보수에 어려움이 있을 수 있다. 규모가 커질수록 Controller가 커지게 된다. Controller에서 다수의 View를 선택하기 때문이다.

## 2. MVP

MVP 패턴은 Model - View - Presenter 패턴이다. Model과 View는 MVC 패턴이랑 같고 Controller 대신 Presenter가 존재하는 것이다.

### 2.1 MVP 패턴의 구조

![MVP구조](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FclZlsT%2FbtqBTLzeUCL%2FIDA8Ga6Yarndgr88g9Nkhk%2Fimg.png)

- Model : 어플리케이션에서 사용되는 데이터와 데이터를 처리하는 부분

- View : 사용자에게 보여지는 UI 부분

- Presenter : View에서 요청한 정보로 Model을 가공하여 View에게 전달해주는 부분. View와 Model 사이의 가교 역할을 한다.

### 2.2 MVP 패턴의 동작

사용자의 Action이 View를 통해서 들어오면 View는 데이터를 Presenter에 요청하고, Presenter는 다시 Model에 데이터를 요청하고 Model은 요청받은 데이터를 응답하여 보내면 Presenter가 View에 데이터를 전달하여 주고, 해당 데이터가 View에 반영되어 화면에 나타나게 된다.

![mvc와 mvp의 차이](https://i1.wp.com/www.vangeloven.net/wp-content/uploads/2016/05/xQe2B.gif?resize=712%2C405)

### 2.3 MVP 패턴의 특징

Presenter는 View와 Model의 인스턴스를 가지고 있어서 둘을 연결하고, Presenter와 View는 1:1 관계이다.

### 2.4 MVP 패턴의 장점

MVP 패턴의 장점은 View와 Model 간의 의존성이 없다는 것이다. MVC 패턴의 단점이던 의존성을 해결한 것이다.

### 2.5 MVP 패턴의 단점

View와 Presenter 사이의 의존성이 높아졌다. 사실 View와 Model의 의존성을 해결했기 때문에 불가피한 부분이라고 할 수 있다. 그리고 View와 Presenter가 1:1 관계가 되면서 각각의 View마다 Presenter가 존재하게 된다. 그래서 MVP 패턴을 이용할 경우 비교적 코드 량이 많아질 수 있다.

## 3. MVVM

MVVM 패턴은 Model - View - View Model을 뜻한다. Model과 View는 다른 패턴과 동일하다. Vue.js가 MVVM 패턴을 기반으로 구현되었다.

![mvvm](https://media.vlpt.us/images/din0121/post/af708306-e4d3-4055-b9e5-6871a5b27216/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-12-17%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%207.21.23.png)

### 3.1 MVVM 패턴의 구조

- Model : 어플리케이션에서 사용되는 데이터와 데이터를 처리하는 부분

- View : 사용자에게 보여지는 UI 부분

- View Model : View를 표현하기 위해 만든 View를 위한 Model이다. View를 나타내기 위한 데이터 처리를 하는 부분이다.

### 3.2 MVVN 패턴의 동작

Action은 동일하게 View를 통해서 들어오고, 들어오고 난 후 Command 패턴으로 View Model에 Action이 전달된다. 그럼 View Model은 Model에 데이터를 요청하고, Model은 View Model에게 데이터를 응답한다. 그리고 View Model은 받은 데이터를 가지고 가공하여 저장한 후에 View와 함께 Data Binding 하여 화면을 나타낸다. ViewModel은 View에 영향을 주지 않는다. 그리고 View 또한 Model에 영향을 끼치지 않는다. View는 View Model에 영향을 끼치고 View Model은 Model의 데이터를 수정한다. ViewModel은 컨트롤러 역할을 한다.

### 3.3 MVVM 패턴의 특징

Command 패턴과 Data Binding 두 가지 패턴을 사용해서 구현되었다. 두 패턴으로 View와 View Model 사이의 의존성을 없앴고, View Model과 View는 1:n 관계이다.

> `Command` 패턴읜 요청을 객체의 형태로 캡슐화해서 사용자가 보낸 요청을 나중에 이용할 수 있도록 매서드 이름, 매개변수 등 요청에 필요한 정보를 저장, 로깅, 취소하는 패턴이다. `Data Binding`은 제공자와 소비자로 부터 데이터 소스를 함께 묶어서 동기화하는 기법이다.

### 3.4 MVVM 패턴의 장점

View와 Model 사이의 의존성이 없다. 그리고 Command 패턴과 Data Binding을 시작해서 View와 View model 사이의 의존성도 없다. 각각 부분이 독립적이어서 모듈화 개발에 좋다.

### 3.5 MVVM 패턴의 단점

View Model의 설계가 쉽지 않다.

## 정리

역시나 개발이나 개발 방법론에는 정답이 없듯, 디자인 패턴에도 무조건 이게 좋아! 이런건 없는 것 같다. 패턴별로 장단점이 있기 때문에 프로젝트에 맞게 잘 선택하는 것이 필요하다. 물론 제일 효과적이고 중요한 것은 이러한 패턴들을 모두 직접 써보고 느껴보는게 제일 좋을 것 같은데, 실제 프로젝트 적용해보도록 해봐야겠다.

---

출처 :

1. [MVC, MVP, MVVM 비교](https://beomy.tistory.com/43)

2. [MVC, MVP, MVVM 비교](https://magi82.github.io/android-mvc-mvp-mvvm/)
