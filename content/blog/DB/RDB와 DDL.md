---
title: 'SQLD - RDB와 DDL'
date: 2020-5-23 00:10:00
category: 'DB'
draft: false
---


#### 1. 관계연산

* 선택연산(Selection) : 조건에 맞는 행만 조회
* 투영연산(Projection) : 조건에 맞는 속성만 조회
* 결합연산(Join) : 공통된 속성을 통해 새로운 릴레이션 생성
* 나누기 연산(Division) : 기준 릴레이션에서 나누는 리레이션이 가지고 있는 속성과 동일한 값을 가지는 행을 추출하고 나누는 릴레이션의 속성을 삭제하고 중복된 행을 제거하는 연산



#### 2. SQL 종류

* DDL - 데이터베이스 구조 정의 언어 (CREATE, ALTER, DROP, RENAME) 
* DML - 데이블의 데이터를 입력, 수정, 삭제, 조회 (INSERT, UPDATE, DELETE, SELECT)
* DCL - 사용자에게 권한을 부여하거나 회수 (GRANT, REVOKE, TRUMCATE)
* TCL - 트랜잭션 제어 (COMMIT, ROLLBACK, SAVEPOINT)





* 트랜잭션의 특성(ACID)
  * 원자성(Atomicity) : ALL or Nothing
  * 일관성(Consistency) : 트랜잭션 후에도 일관성이 유지되어야 함.
  * 고립성(Isolation) : 트랜잭션 중에 다른 트랜잭션 접근 불가
  * 영속성(Durability) : 성공적으로 완료하고 나서 영구적 보장 되어야 함.





* SQL문 실행 순서 : Parsing - Execution - Fetch





#### 3. DDL

테이블을 생성하기 위해서는 `CREATE  Table` 문을 사용해야 한다. 테이블 변경은 `ALTER Table` 문을 사용하고, 테이블 삭제는 `DROP Table`을 사용한다.



* CREATE

  ```sql
  CREATE TABLE EMP {
  	empno number(10),
  	ename varchar2(20),
  	sal number(10,2), --소수점 둘째자리까지 저장
  	deptno varchar2(4) not null,
  	createdate date default sysdate, --오늘 날짜를 기본으로 함
  	constraint emppk primary key(empno); --제약조건으로 기본키 설정
  }
  ```

  테이블 생성시 제약조건에 `ON DELETE CASCADE` 옵션을 사용하면 참조되는 데이터를 자동으로 반영할 수 있다. (참조 무결성 준수)





* ALTER

  ```sql
  -- 테이블 명 변경
  ALTER TABLE EMP
  	RENAME TO NEW_EMP;
  	
  -- 칼럼 추가
  ALTER TABLE EMP
  	ADD (age number(2) default 1);
  	
  -- 칼럼 변경
  ALTER TABLE EMP
  	MODIFY (ename varchar2(40) not null);
  	
  -- 칼럼 삭제
  ALTER TABLE EMP
  	DROP COLUMN age;
  	
  -- 칼럼명 변경
  ALTER TABLE EMP
  	RENAME COLUMN ename to new_ename;
  ```





* DROP

  ```sql
  DROP TABLE EMP CASCADE CONSTRAINT;
  ```





* VIEW 

  뷰는 가상의 테이블이고 참조한 테이블이 변경되면 뷰도 변경된다. 뷰는 조회는 가능한데, 입력, 수정, 삭제는 제약이 있다. 특정 칼럼만 조회하여 보안성을 향상시킨다. 한번 생성된 뷰는 변경할 수 없다. ALTER 문으로도 뷰를 변경할 수 없다.

  ```
  CREATE VIEW T_EMP AS
  	SELECT * FROM EMP;
  ```

  * 장점 
    * 1) 보안 기능
    * 2) 데이터관리 간단
    * 3) SELECT 문이 간단
    * 4) 하나의 테이블에 여러 개 뷰 생성 가능
  * 단점
    * 1) 독자적인 인덱스 생성 불가
    * 2) 삽입, 수정, 삭제 연산 제약
    * 3) 데이터 구조 변경 불가

