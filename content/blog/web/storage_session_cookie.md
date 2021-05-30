---
title: '웹 스토리지 vs 쿠키 vs 세션'
date: 2021-05-20 18:00:00
category: 'Web'
draft: false
---

## 쿠키

![쿠키](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F7sRgL%2Fbtqz4K9S1vV%2F8y6iJNheDBC2d6vD9lkKcK%2Fimg.png)

쿠키는 위의 그림과 같은 흐름으로 이용된다. 쿠키를 사용하는 이유는 HTTP 요청은 상태를 가지고 있지 않기 때문이다.(Stateless) 이 말은 브라우저에서는 서버에 요청을 보낼 때 그 요청 자체로는 그 요청이 누구에게서 오는지 알 수 없고, 쿠키에 정보를 담아서 보내면 서버는 쿠키를 통해 파악할 수 있게된다. 이전에는 쇼핑몰에서 로그인을 해야만 장바구니 정보가 저장되었다면, 요즘 쇼핑몰을 보면 비로그인 상태에서도 일정기간 쿠키를 통해 정보를 유지할 수 있게 되었다. 쿠키는 주로 세션 관리를 통해 로그인, 접속시간 장바구니 등에 활용되기도 하고, 쿠키를 통해 사용자별로 다른 정보를 표시하는 등 개인화가 가능하며, 사용자의 행동과 패턴을 분석할 수 있기 때문에 요즘에는 더 중요한 개념이 되었다.

쿠키를 사용하기 위해서는 `Set-Cookie:키=값;옵션`를 사용한다. 이것은 서버에서 클라이언트한테 쿠키를 저장하라고 요청하는 것이다. 만약에 `Set-Cookie:name=kante`면 name이라는 키에 kante라는 값을 저장해서 보내는 것이다. 옵션도 지정하여 보낼 수 있는데 대략 자주 쓰이는 옵션들은 아래와 같다.

- Expires : 쿠키 만료 날짜를 알려줄 수 있다.
- Max-Age : 쿠키 수명을 알려줄 수 있다. 이 옵션이 있을 경우 Expires이 무시된다.
- HttpOnly : 자바스크립트에서 쿠키에 접근할 수 없도록 한다. XSS를 막기위해 활성화하는 것이 좋다.
- Domain : 도메인을 명시하여 해당 도메인에서만 쿠키가 전송되게 할 수 있다.
- Path : 패스를 명시하여 해당 패스의 요청에서만 쿠키가 전송되게 할 수 있다.

쿠키에는 단점도 존재한다. 장기간 유지되고 브라우저 종료 후에도 유지되는 Persistent Cookie의 경우 사용자의 하드디스크에 저장된다. 그렇기 때문에 공공 PC의 경우는 쿠키를 탈취하여 개인정보를 빼돌릴 수도 있다. 이러한 보안상 취약점이 있고, 네트워크를 통해 암호화되지 않는 쿠키를 전송할 때 쿠키 정보를 탈취하는 스니핑(Sniffing) 공격에 당할 수 도 있다.

## 세션

쿠키와 자주 비교되는 개념으로 세션이 있다. HTTP 세션의 경우, Session ID를 식별자로 데이터를 사용자 브라우저의 쿠키가 아닌 접속한 서버의 DB에 정보를 저장한다. 클라이언트는 HTTP Session ID를 쿠키로 가지고 있다. 세션의 경우 메모리에 저장하기 때문에 브라우저가 종료되면 사라진다. 쿠키의 트래픽 문제와 보안상 취약점을 해결하기 위해 사용되었다. 세션의 절차는 아래와 같다.

![세션](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FGIaFd%2Fbtqz1KX8hRD%2FivthbnRykR90JyTx4KRXSK%2Fimg.png)

1. 클라이언트가 서버에 리소스를 요청한다.
2. 서버에서는 HTTP Request를 통해 쿠키에서 Session ID를 확인해서 존재하면 이용하고 없으면 Set-Cookie를 통해 발행한 Session ID를 보낸다.
3. 클라이언트는 HTTP Request 헤더에 Session ID를 포함해서 원하는 리소스를 요청한다.
4. 서버에서는 세션 ID를 통해서 해당 세션을 찾아 클라이언트 상태를 유지해서 적절한 응답을 한다.

하지만 세션은 서버의 리소스를 사용하기 때문에 세션을 많이 쓸 경우 서버에 부하가 생기게 될 수 있다. 특별히 세션은 사용자 인증, 로그인에 많이 쓰시는데 서비스가 확장되어 유저의 수가 너무 늘어날 경우에는 서버 램이나 DB 성능에 무리를 줄 수 있기에 유의해야 한다.

> CORS (Cross-Origin Resource Sharing) :
> 웹 어플리케이션에서 세션 관리에 사용되는 쿠키는 단일 도메인 및 서브 도메인에서만 사용가능하기 때문에 쿠키를 여러 도메인에서 관리하는 것은 매우 번거롭다.

세션을 쓰기 위해 보장되어야 할 것으로 Confidentiality, Data Integrity, Authenticity가 있는데, Confidentiality는 서버 이외에 어느 누구도 세션 데이터를 해석할 수 없어야 하는 거고, Data Integrity는 서버와 별개로 세션 데이터를 조작해서는 안되는 것이고, Authenticity는 서버 말고는 올바른 세션을 시작할 수 없어야 한다는 원칙이 있다.

이밖에도 세션 데이터는 서버에 보내기 전에 암호화되어야 한다. 그리고 필요에 따라 데이터를 압축하기도 해야 한다.

## Cookie vs Session

쿠키와 세션의 차이는 아래 표와 같이 정리된다.
![](https://ifh.cc/g/I682gK.jpg)

## Web Storage

HTML5에는 데이터를 클라이언트로 저장할 수 있는 자료구조인 Web Storage 스펙이 포함되어 있다. Web Storage는 키/값(key-value) 형태로 데이터를 저장해서 key를 기준으로 조회하는 패턴이다. 그리고 영구 저장소(Local Storage)와 임시 저장소(Session Storage)를 따로 두어 데이터의 지속성을 구분할 수 있기 때문에 환경에 맞게 선택하여 사용할 수 있다.

사실 기존 웹 환경에서 사용하는 쿠키(Cookie)와 매우 유사하지만 쿠키의 단점을 극복하는 개선점 등이 추가되어 도입되었다. 하지만 여전히 웹 환경에서 쿠키는 유효하고 많이 쓰이고 있다. 웹 스토리지의 등장이 절대 쿠키를 배제한다는 의미는 아니다.

개발자 도구에서 웹스토리지와 쿠키 모두 확인이 가능하다.
![개발자도구](https://ifh.cc/g/5Nsbng.jpg)

## Web Storage vs Cookie

### 1. 쿠키는 매번 서버로 전송한다.

웹 사이트에서 쿠키를 설정하면 이후 모든 웹 요청은 쿠키 정보를 포함하여 서버로 전송된다. 웹 스토리지의 경우 저장된 데이터가 클라이언트에만 존재하고 서버 전송은 발생하지 않는다. 그렇기 때문에 네트워크 트래픽이 줄어든다.

### 2. 웹 스토리지는 단순 문자열을 넘어서 객체 정보 저장이 가능하다.

문자열 기반 데이터 외에 객체를 저장 할 수 있기 때문에 개발 편의성을 향상시키는 주요 장점이다.

### 3. 웹 스토리지는 용량 제한이 비교적 크다.

쿠키는 개수와 용량에 제한이 있다. 한 사이트에 저장 가능한 쿠키는 최대 20개고 한 사이트의 최대 쿠키 크기는 4KB이다. 그러나 웹 스토리지에는 5MB까지 저장이 가능하다. 쿠키를 사용할 때도 하위 키를 이용해 이러한 제한을 다소 극복할 수 있고, 대부분은 쿠키의 제한까지 데이터 저장할 필요가 없긴 하다.

### 4. 영구 데이터 저장이 가능하다.

쿠키는 만료 일자가 지정되어 있어서 언젠가 제거되고, 만료일자를 지정하지 않으면 세션 쿠키가 된다. 만일 영구 쿠키를 원하면 만료일을 멀게 설정(Persistent Cookie)하여 해결 가능하다. 이에 반해 웹 스토리지는 만료기간이 없기 때문에 한번 저장한 데이터를 영구적으로 저장할 수 있다.

## Local Storage vs Session Storage

웹 스토리지는 로컬 스토리지와 세션 스토리지로 두가지 용도의 저장소를 제공하고, 쿠키와 마찬가지로 도메인 단위로 접근이 제한된다. A 도메인에서 저장한 데이터는 B 도메인에서 조회할 수 없다.

### Local Storage

명시적으로 데이터를 지우지 않으면 영구적인 보관이 가능하다. Window 전역 객체인 LocalStorage 컬렉션을 통해 저장, 조회가 가능하다.

```
데이터 저장 - localStorage.setItem(키, 값)

데이터 제거 - localStorage.removeItem(키)

데이터 읽기 - localStorage.getItem(키)

데이터 전체 제거 - localStorage.clear()
```

### Session Storage

데이터의 지속성과 액세스 범위에 특수한 제한이 존재하는 저장소이다. window 전역 객체인 sessionStorage를 통해 저장과 조회가 이루어진다. 데이터 유지 측면에서는 지속적으로 보관되지 않기 때문에 세션 쿠키와 성질이 비슷한데, 현재 페이지가 브라우징 되고 있는 브라우저 컨텍스트 내에서만 데이터가 유지된다. 때문에 브라우저를 종료하고 다시 켜면 사라진다. 세션 스토리지도 도메인 단위로 생성된다. 게다가 같은 도메인이라도 웹 브라우저가 다를 경우, 별개의 영역이 생성된다. 브라우저 컨텍스트가 다르기 때문이다. 같은 브라우저라도 탭을 추가해서 같은 페이지를 접속해도 별개의 세션 스토리지가 생성되는 것이다.

```
데이터 저장 - sessionStorage.setItem(키, 값)

데이터 제거 - sessionStorage.removeItem(키)

데이터 읽기 - sessionStorage.getItem(키)

데이터 전체 제거 - sessionStorage.clear()
```

웹 스토리지의 보안은 서로 다른 도메인의 데이터 침범은 막지만 사용자 단의 침범은 막지 않는다. 그러므로 클라이언트는 얼마든 저장된 값을 임으로 수정할 수 있다. 이것은 쿠키와 동일하다. 그렇기 때문에 개발자는 사용자에 의해서 임의 변경되지 않도록 대비해야 한다.

---

> 참고

1. [LocalStorage, SessionStorage, Cookie의 차이점](https://velog.io/@ejchaid/localstorage-sessionstorage-cookie%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90)
2. [쿠키, 세션, 로컬 스토리지, 세션스토리지, indexedDB, 캐시](https://tristan91.tistory.com/521)