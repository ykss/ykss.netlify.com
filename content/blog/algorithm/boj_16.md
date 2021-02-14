---
title: '[BOJ] 0 만들기 - 파이썬'
date: 2021-02-16 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

1부터 N까지의 수를 오름차순으로 쓴 수열 1 2 3 ... N을 생각하자.

그리고 '+'나 '-', 또는 ' '(공백)을 숫자 사이에 삽입하자(+는 더하기, -는 빼기, 공백은 숫자를 이어 붙이는 것을 뜻한다). 이렇게 만든 수식의 값을 계산하고 그 결과가 0이 될 수 있는지를 살피자.

N이 주어졌을 때 수식의 결과가 0이 되는 모든 수식을 찾는 프로그램을 작성하라.

### 입력

첫 번째 줄에 테스트 케이스의 개수가 주어진다(<10).

각 테스트 케이스엔 자연수 N이 주어진다(3 <= N <= 9).

### 출력

각 테스트 케이스에 대해 ASCII 순서에 따라 결과가 0이 되는 모든 수식을 출력한다. 각 테스트 케이스의 결과는 한 줄을 띄워 구분한다.

### 예제 입출력

| 입력          | 출력                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 2</br>3</br>7 | 1+2-3</br></br>1+2-3+4-5-6+7</br>1+2-3-4+5+6-7</br>1-2 3+4+5+6+7</br>1-2 3-4 5+6 7</br>1-2+3+4-5+6-7</br>1-2-3-4-5+6+7 |

---

### 내 코드 (참고)

```python
import copy

def makeOperators (array, n) :
    if len(array) == n :
        operatorList.append(copy.deepcopy(array))
        return
    array.append(' ')
    makeOperators(array, n)
    array.pop()

    array.append('+')
    makeOperators(array, n)
    array.pop()

    array.append('-')
    makeOperators(array, n)
    array.pop()

testcase = int(input())
for _ in range(testcase) :
    num = int(input())
    operatorList = []
    makeOperators([], num - 1)
    lists = [ x for x in range(1, num + 1) ]

    for operator in operatorList :
        string = ''
        for i in range(num - 1):
            string += str(lists[i]) + operator[i]
        string += str(lists[-1])
        if eval(string.replace(" ","")) == 0:
            print(string)
    print()
```

이 문제도 재귀 함수를 활용하여 푸는 문제이다. N의 범위가 `(3 <= N <= 9)`이기 때문에 계산 가능한 모든 케이스를 계산해서 결과가 0인 수식만 출력하는 것이다. 모든 케이스를 계산하기 위해 모든 경우의 연산자(' ','+','-')를 만들어주는 `makeOperator()`함수를 통해 모든 케이스의 연산자 배열을 만든다. 이 함수에서 포인트는 `copy` 모듈을 임포트하여 `deepcopy()`를 쓰는 것이다. 깊은 복사를 통해 해당 단순히 해당 배열만 넘기는 것이 아니고, 해당 배열안의 객체까지 모두 재귀적으로 복사한다. 그리고나서 만들어진 연산자 리스트를 활용해서 `string`을 만들고 해당 문자열에서 공백 문자를 없앤것을 `eval()`함수로 계산한 값이 0이면 출력하도록 했다. 여기서 `eval()`함수는 식을 문자열로 받아서 실행하는 함수이다. 식을 문자열로 받아 계산하거나, 함수를 실행할 때 활용 될 수 있는 함수이다.
