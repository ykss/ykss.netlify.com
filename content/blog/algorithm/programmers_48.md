---
title: '[프로그래머스] 전화번호 목록 - 파이썬'
date: 2021-01-24 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

전화번호부에 적힌 전화번호 중, 한 번호가 다른 번호의 접두어인 경우가 있는지 확인하려 합니다.
전화번호가 다음과 같을 경우, 구조대 전화번호는 영석이의 전화번호의 접두사입니다.

구조대 : 119
박준영 : 97 674 223
지영석 : 11 9552 4421
전화번호부에 적힌 전화번호를 담은 배열 phone_book 이 solution 함수의 매개변수로 주어질 때, 어떤 번호가 다른 번호의 접두어인 경우가 있으면 false를 그렇지 않으면 true를 return 하도록 solution 함수를 작성해주세요.

### 제한 사항

phone_book의 길이는 1 이상 1,000,000 이하입니다.
각 전화번호의 길이는 1 이상 20 이하입니다.

### 입출력 예제

| phone_book                        | return |
| --------------------------------- | ------ |
| ["119", "97674223", "1195524421"] | false  |
| ["123","456","789"]               | true   |
| ["12","123","1235","567","88"]    | false  |

---

### 내 코드

```python
def solution(phone_book):
    phone_book.sort()
    for i in range(len(phone_book)-1):
        if phone_book[i] in phone_book[i+1] :
            print(phone_book[i])
            return False
    return True
```

먼저 주어진 배열을 정렬했다. 해당 배열은 숫자 배열이 아니고 문자열 배열이기 때문에 아스키 코드를 기준으로 정렬되게 된다. 그래서 만약에 접두사가 같은 배열이 있다면 해당 배열 바로 뒤에 위치하게 된다. 그 이후에 처음 문자열과 그 다음 문자열을 비교하는 식으로 한다. 그 방식은 `if ~ in`문을 통해 어떠한 리스트에서 해당 문자열을 포함하고 있는지를 하였다. 근데 문제에서 하나 의문은 접두어인 경우인지를 찾는 경우인데, 막상 접두어가 아닌 뒷부분에 포함해도 통과되었다. 그래서 해당 부분은 문제가 잘못 설명되어 있는 것 같다.

---

### 다른 사람의 코드

```python
def solution(phoneBook):
    phoneBook = sorted(phoneBook)

    for p1, p2 in zip(phoneBook, phoneBook[1:]):
        if p2.startswith(p1):
            return False
    return True
```

가장 좋아요가 많았던 답이다. 이것도 똑같이 `sorted()`를 통해 정렬을 먼저 진행했다. 그리고 나서 `zip()`함수를 써서 `p1`과 `p2`를 사용했다. 그리고 `startswith()`라는 함수를 사용했는데, 나는 기본 함수로 해당 기능을 하는 함수의 존재에 대해서도 이번에 처음 알게되었다. 이렇게 하면 접두사인 경우만 확실히 분별할 수 있었다. 이 함수의 존재만 알았어도 더 쉽게 풀수 있는 문제였다.