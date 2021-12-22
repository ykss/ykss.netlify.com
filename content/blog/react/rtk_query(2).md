---
title: '[Redux] RTK Query - Query와 Mutation'
date: 2021-12-05 01:00:00
category: 'React'
draft: true
---

RTK Query에서 Query는 데이터를 가져오기 위하여 사용하고, Mutation은 데이터 갱신 요청을 서버에 보내고 데이터 변경점을 로컬 캐시에 반영하기 위해 사용한다. 데이터를 다시 가져오도록 강제하고 캐싱된 데이터를 무효화할 때도 사용한다.

## 1. Query

Query는 RTK Query를 사용할 때 가장 흔히 사용되는 유즈케이스이다. 쿼리는 모든 데이터 가져오기 관련 라이브러리 작업을 수행할 수 있지만, `GET` 요청(데이터를 읽을 때)에만 사용하는 것이 추천된다. 서버에 있는 데이터를 변경하거나 데이터가 캐싱된 내용을 무효화할 가능성이 있는 작업의 경우 쿼리보다 **뮤테이션**이 권장된다.

기본적으로 RTK Query는 `fetchBaseQuery`와 함께 사용되고 `axios`와 비슷하게 요청 헤더와 응답 파싱을 자동으로 처리하는 `Fetch wrapper`이다.

## 2. 쿼리 엔드포인트 정의하기

쿼리 엔드포인트는 `createApi`의 `endpoints` 내부에서 객체를 반환하고 필드를 `builder.query()` 메소드를 사용하여 정의한다. 또한 쿼리 파라미터를 포함하여

## 정리

쿼리는

---

출처

1. [RTK 쿼리 핸드북](https://raejoonee.gitbook.io/rtk-query/rtk-query)
