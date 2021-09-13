---
title: '[디자인패턴] mvc vs mvp vs mvvm'
date: 2021-09-12 01:00:00
category: 'Web'
draft: true
---

MVC, MVVM 등 이러한 디자인 패턴 용어는 웹 개발을 하다보면 자연스럽게 알게되는 패턴이다. 하지만 정작 이러한 패턴들이 왜 생기게 되었고, 어떤 차이가 있는지를 확실히 아는게 중요하다는 생각이 들어서 이번 기회에 정리해보려고 한다.

## 1. MVC

가장 처음 들었었고, 가장 유명하다고 생각하는 패턴이 바로 MVC(Model-View-Controller) 패턴이다. MVC 패턴이 어떤 구조를 가지고 어떻게 동작하고 어떤 특징과 장단점이 있는지 알아보자.

### 1.1 MVC 패턴의 구조

![mvc](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F7IE8f%2FbtqBRvw9sFF%2FAGLRdsOLuvNZ9okmGOlkx1%2Fimg.png)

- Model : 어플리케이션에서 사용하는 데이터와 그 데이터 처리를 담당하는 부분

- View : 사용자에게 보여지는 UI 부분

- Controller : 사용자의 입력(Action)을 받아서 처리하는 부분

### 1.2 MVC 패턴의 동작

사용자들의 액션이 Controller에 들어오게되고, 컨트롤러는 사용자의 Action을 확인해서, Model을 업데이트하고, Controller가 Model을 나타낼 View를 선택하면, View는 업데이트된 Model을 이용하여 화면을 나타낸다. 아래 그림을 통해 쉽게 이해 가능하다.

![mvc동작](https://miro.medium.com/max/1000/1*23_6IjYfnybitGq4jO0QCg.gif)

> MVC에서 View가 업데이트 되는 방법에는 View가 Model을 이용해서 직접 업데이트하거나, Model에서 View에게 Notify 하여 업데이트하거나, View가 Polling으로 주기적으로 Model의 변경을 감지하여 업데이트하는 방법이 있다.

### 1.3 MVC 패턴의 특징

Controller는 여러 개의 View를 선택할 수 있는 1:n 구조이다. Controller는 View를 선택하기만 하고 직접 업데이트 하지는 않는다. (View가 Controller를 알지 못해야 한다.)

### 1.4 MVC 패턴의 장점

굉장히 단순한 패턴이기 때문에 널리 사용되고 있다. 그렇기 때문에 많이쓰이고 보편적이라는 게 장점이다.

### 1.5 MVC 패턴의 단점

View와 Model 사이의 의존성이 높은 편이다. 때문에 어플리케이션이 커질 수록 복잡해질 수 있고, 유지보수에 어려움이 있을 수 있다.

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

View와 Presenter 사이의 의존성이 높아졌다. 사실 View와 Model의 의존성을 해결했기 때문에 불가피한 부분이라고 할 수 있다.

## 3. MVVM

MVVM 패턴은 Model - View - View Model을 뜻한다. Model과 View는 다른 패턴과 동일하다.

### 3.1 MVVM 패턴의 구조

- Model : 어플리케이션에서 사용되는 데이터와 데이터를 처리하는 부분

- View : 사용자에게 보여지는 UI 부분

- View Model : View를 표현하기 위해 만든 View를 위한 Model이다. View를 나타내기 위한 데이터 처리를 하는 부분이다.

### 3.1 MVVN 패턴의 동작

Action은 동일하게 View를 통해서 들어오고, 들어오고 난 후 Command 패턴으로 View Model에 Action이 전달된다. 그럼 View Model은 Model에 데이터를 요청하고, Model은 View Model에게 데이터를 응답한다. 그리고 View Model은 받은 데이터를 가지고 가공하여 저장한 후에 View와 함께 Data Binding 하여 화면을 나타낸다.

---

출처 :

1. [MVC, MVP, MVVM 비교](https://beomy.tistory.com/43)
