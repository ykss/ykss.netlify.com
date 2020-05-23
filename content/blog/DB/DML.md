---
title: 'SQLD - DML'
date: 2020-5-24 00:10:00
category: 'DB'
draft: false
---

#### 

#### 1. DML



* INSERT

  ```sql
  INSERT INTO EMP VALUES(1000,'임베스트');
  
  ALTER TABLE DEPT NOLOGGING; -- NOlogging 사용
  ```

  데이터베이스에 데이터를 입력하면 로그파일에 정보를 기록한다. Nologging 옵션은 로그파일 기록을 최소화시켜서 성능을 향상시킨다. Buffer Cache 메모리 영역을 생략하고 기록한다.





* UPDATE

  ```sql
  UPDATE EMP
  	SET ENAME='마운트'
  	WHERE EMPNO = 19;
  ```





* DELETE

  ```sql
  DELETE FROM EMP
  	WHERE EMPNO = 100;
  ```

  테이블의 모든 데이터를 삭제하는 방법은 `DELETE FROM`과 `TRUNCATE TABLE`이 있는데, 전자는 삭제해도 테이블 용량은 감소하지 않는 반면, 후자는 테이블의 용량도 초기화 시킨다.





* ORDER BY

  ```sql
  SELECT * FROM EMP ORDER BY ENAME, SAL DESE;
  ```

  순서를 정렬할 수 있는데, 오름차순이나 내림차순을 지정하지 않으면 기본적으로 오름차순으로 정렬된다.





* DISTINCT, ALIAS

  `DISTINCT`는 칼럼명 앞에 지정하여 중복된 데이터를 한 번만 조회하도록 한다. `ALIAS` 는 테이블명이나 칼럼명을 간략하게 할 때 사용한다.

  

  

#### 2. NULL 관련 함수



* NVL 함수 - NULL이면 다른 값으로 바꾸는 것이다. `NVL(MGR,0)`이면 `MGR`칼럼이 NULL이면 0으로 바꾼다.
* NVL2 함수 - `NVL2(MGR, 1, 0)`은 `MGR`칼럼이 NULL이 아니면 1을 NULL이면 0으로 반환한다.
* NULLIF 함수 - `NULLIF(exp1,exp2)`는 `exp1`과 `exp2`가 같으면 NULL을 다르면 `exp1`을 반환한다.
* COALESCE - `COALESCE(exp1, exp2, exp3)` 은 `exp1`이 NULL이 아니면 `exp1`의 값을 아니면 뒤의 값의 NULL여부를 판단하여 값을 반환한다.





#### 3. GROUP 연산



* GROUP BY는 소규모 행을 그룹화 해서 합계, 평균, 최댓값, 최솟값 등을 계산할 때 주로 쓴다.
* HAVING 구에 조건문을 쓴다.
* ORDER BY 또한 쓸 수 있다.

```sql
SELECT DEPTNO, SUM(SAL)
FROM EMP
GROUP BY DEPTNO
HAVING SUM(SAL)>10000; --group by 한 결과에서 급여 합계가 10000 이상인 것만 조회한다.
```



* 집계함수
  * COUNT() - 행 수 조회. COUNT(*)은 NULL도 포함
  * SUM() - 합계
  * AVG() - 평균
  * MAX() , MIN() - 최대, 최소 값
  * STDDEV() - 표준편차
  * VARIAN() - 분산





#### 4. SELECT 문 실행 순서

**FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY** 순으로 실행된다.







#### 5. 형변환

* 명시적 형변환
  * TO_NUMBER(문자열)
  * TO_CHAR(숫자 혹은 날짜,[FORMAT])
  * TO_DATE(문자열,FORMAT)





#### 6. 내장형 함수



* 문자열 함수
  * ASCII(문자)
  * CHAR(아스키코드)
  * SUBSTR(문자열,m,n)
  * CONCAT(문자열1, 문자열2)
  * LOWER(문자열)
  * UPPER(문자열)
  * LEN(문자열)
  * LTRIM(), RTRIM(), TRIM(문자열, 지정문자) - 지정된 문자 삭제, 생략하면 공백 삭제



* 날짜형 함수
  * SYSDATE - 오늘 날짜
  * EXTRACT('YEAR' | 'MONTH' | 'DAY' from dual)



* 숫자형 함수
  * ABS(숫자) - 절대값
  * SIGN(숫자) - 양수, 음수, 0 구별
  * MOD(숫자1,숫자2) - 숫자1을 숫자2로 나눈 나머지 계산, 대신 % 사용 가능
  * CEIL / FLOOR(숫자) -
  * ROUND(숫자, m) - 소수점 m자리에서 반올림. 기본값은 0
  * TRUNC(숫자,m) - 소수점 m자리에서 절삭한다. 기본값은 0





#### 7. DECODE & CASE

* DECODE

  * IF 문을 구현한다. 특정 조건이 참이면 A, 거짓이면 B를 리턴한다.
  * `DECODE(EMPNO, 1000, 'TRUE', 'FALSE')`

* CASE

  * IF ~ THEN ~ ELSE ~ END 처럼 사용할 수 있다.
  * WHEN 구에 조건을 사용하고 참이면 THEN, 거짓이면 ELSE 구가 실행된다.

  ```sql
  SELECT CASE
  	WHEN EMPNO = 1000 THEN 'A'
  	WHEN EMPNO = 1001 THEN 'B'
  	ELSE 'C'
  	END
  FROM EMP;
  ```





#### 8. ROWNUM & ROWID

* ROWNUM

  * 조회되는 행 수를 제한 할 때 주로 사용

  ```sql
  SELECT * FROM EMP
  WHERE ROWNUM <= 1;
  ```

* ROWID

  * 데이터베이스 내에서 데이터를 구분할 수 있는 유일한 값이다

  ```sql
  SELECT rowid, ename
  FROM EMP;
  ```

  

  

  

#### 9. WITH 

서브쿼리를 사용해서 임시 테이블이나 뷰처럼 사용하는 구문이다. 서브쿼리 블록에 별칭을 지정할 수 있다.

```sql
WITH viewData AS
	(SELECT * FROM EMP
	 UNION ALL
	 SELECT * FROM EMP
	 )
	 SELECT * FROM viewData WHERE EMPNO = 1000;
```







