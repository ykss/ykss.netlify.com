---
title: '[프로그래머스] 2016년 - 파이썬'
date: 2020-12-27 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
2016년 1월 1일은 금요일입니다. 2016년 a월 b일은 무슨 요일일까요? 두 수 a ,b를 입력받아 2016년 a월 b일이 무슨 요일인지 리턴하는 함수, solution을 완성하세요. 요일의 이름은 일요일부터 토요일까지 각각 SUN,MON,TUE,WED,THU,FRI,SAT입니다. 예를 들어 a=5, b=24라면 5월 24일은 화요일이므로 문자열 TUE를 반환하세요.


### 제한 조건
2016년은 윤년입니다.
2016년 a월 b일은 실제로 있는 날입니다. (13월 26일이나 2월 45일같은 날짜는 주어지지 않습니다)


### 입출력 예
|a	|b	|result|
|---|---|---|
|5	|24	|"TUE"|
---


###  내 코드 
```python
import datetime

def solution(a, b):
    return datetime.date(2016,a,b).strftime('%a').upper()
```
이건 날짜 모듈을 쓰지 않고는 어떻게 해야할지 감이 안와서 날짜 모듈에 대해서 공부한 후에 풀었다. `datetime` 모듈을 import해서 해당 모듈의 `date()`함수를 써서 받아온 `a`,`b`를 받아서 날짜로 받은 후 `strftime()`을 통해서 해당 날짜를 문자열로 받았고 거기서 `%a`로 요일을 `Tue`와 같은 형식으로 받도록 했다. 그리고 마지막으로 대문자로 출력하기위해 `upper()`함수를 써서 마무리했다.

---


### 다른 사람의 코드
```python
def solution(a, b): 
    answer = ""
    if a>=2:
        b+=31
        if a>=3:
            b+=29#2월
            if a>=4:
                b+=31#3월
                if a>=5:
                    b+=30#4월
                    if a>=6:
                        b+=31#5월
                        if a>=7:
                            b+=30#6월
                            if a>=8:
                                b+=31#7월
                                if a>=9:
                                    b+=31#8월
                                    if a>=10:
                                        b+=30#9월
                                        if a>=11:
                                            b+=31#10월
                                            if a==12:
                                                b+=30#11월
    b=b%7

    if b==1:answer="FRI"
    elif b==2:answer="SAT" 
    elif b==3:answer="SUN"
    elif b==4:answer="MON"
    elif b==5:answer="TUE"
    elif b==6:answer="WED"
    else:answer="THU"
    return answer
```
어떻게 하면 라이브러리를 쓰지 않고 풀 수 있나봤는데, 정말 라이브러리가 없었다면 위처럼 일일히 계산하여 하드코딩으로 풀어야 겠다는 생각을 하고 라이브러리를 잘 쓸 수 있도록 다양한 라이브러리를 많이 알고 활용해야겠다는 생각을 했다.