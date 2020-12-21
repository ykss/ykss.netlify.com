---
title: '[프로그래머스] 이상한 문자 만들기'
date: 2020-12-22 01:00:00
category: 'Algorithm'
draft: false
---
### 문제 설명
문자열 s는 한 개 이상의 단어로 구성되어 있습니다. 각 단어는 하나 이상의 공백문자로 구분되어 있습니다. 각 단어의 짝수번째 알파벳은 대문자로, 홀수번째 알파벳은 소문자로 바꾼 문자열을 리턴하는 함수, solution을 완성하세요.


### 제한 사항
문자열 전체의 짝/홀수 인덱스가 아니라, 단어(공백을 기준)별로 짝/홀수 인덱스를 판단해야합니다.
첫 번째 글자는 0번째 인덱스로 보아 짝수번째 알파벳으로 처리해야 합니다.


### 입출력 예
|s|	return|
|---|---|
|"try hello world"|	"TrY HeLlO WoRlD"|
---


###  내 코드 
```python
def solution(s):
    answer = ''
    newStr = s.split(' ') #이 부분을 그냥 split()으로하면 오답이다.
    for word in newStr :
        for i in range(len(word)) :
                answer += word[i].upper() if i % 2 == 0 else word[i].lower()
        answer += ' '
    return answer[:-1]
```
위 코드 같은 경우 기본적인 개념으로는 처음 받은 문자열 `s`를 `split()` 함수를 통해 공백으로 분리한다. 그리고 거기서 `for문`을 사용해 한단어씩하여 체크하는데, 새로운 문자열 `new_word`를 만들어서 인덱스가 짝수면 대문자로 홀수면 소문자로해서 새로운 문자열에 넣었고, 해당 문자열을 다시 정답배열에 집어넣고 해당 배열을 마지막에 문자열로 공백을 넣어 정답을 구했다. 

여기서 가장 많이 헤맨 부분이 `s.split(' ')` 부분인데, 처음에 계속 `s.split()`로 했더니 일부 테스트 케이스에서는 오답이 발생했다. `split()`을 쓸 때는 괄호안에 구분 기준을 꼭 명시하는게 좋다. 단순한 것 같아도 결과는 완전 달라 질 수 있다. `split(' ')`을 안쓰고 `split()`을 쓰면 공백이 여러개일때 하나로 합쳐지는 결과가 나온다.


---


### 두번쨰 시도코드
```python
def solution(s):
    newStr = s.split(' ')
    answer = ''
    for word in newStr:
        for i, char in enumerate(word):
            answer += char.upper() if i % 2 == 0 else char.lower()
        answer += ' '
    return answer[:-1]
```
위 경우는 기본적으로는 이전의 방법과 유사할 수 있지만, `enumerate()`가 위 해답의 핵심이다. `enumberate()`는 반복문 사용 시 몇 번째 반복문인지 인덱스와 함께 원소를 tuple 형태로 반환한다. 예를 들면 아래와 같다.
```python
arr = [1, 3, 5, 7 ,9]
for i, num in enumerate(arr) :
    print("index:{}, value:{}".format(i,num))
#위와같이 하면 아래와 같은 결과가 출력된다.
#index:0, value:1
#index:1, value:3
#index:2, value:5
#index:3, value:7
#index:4, value:9
```
그렇기 때문에 위 함수에서는 인덱스와 원소가 둘 다 필요한 경우이기 때문에 `enumerate()`를 사용하기에 적합하다. 정답 빈 배열에 바로 해당 원소를 담아서 단어가 끝날때마다 공백을 넣고 마지막에 `answer[:-1]`를 통해 마지막의 공백은 제거하여 반환했다.