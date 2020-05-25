---
title: 'SQLD - DCL & TCL'
date: 2020-5-25 00:10:00
category: 'DB'
draft: false
---

#### 

#### 1. DCL



* GRANT

  ```sql
  GRANT [권한] ON [테이블명] TO [사용자] WITH OPTION;
  ```
  
  특정 사용자에게 특정 테이블에 대한 특정 권한을 부여한다. (select, insert, update, delete, references, alter, index, all)

  * WITH GRANT OPTION : 권한을 부여할 수 있는 권한을 부여. 권한 취소하면 모든 권한 회수 됨.
  * WITH ADMIN OPTION : 테이블에 대한 모든 권한 부여. 권한 취소하면 지정 사용자 권한 만 회수됨.





* REVOKE

  ```sql
  REVOKE [권한] ON [테이블명] FROM [사용자]
  ```
  
  부여한 권한을 회수한다.





#### 2. TCL

* COMMIT

  변경한 데이터를 DB에 반영한다. COMMIT을 통해 하나의 트랜잭션 과정을 종료한다.



* ROLLBACK

  데이터에 대한 변경 사용을 취소하고 트랜잭션을 종료한다. 이전에 COMMIT한 곳까지만 복구한다.



* SAVEPOINT

  





