---
title: '[BOJ] 키로거 - 파이썬'
date: 2021-02-03 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

창영이는 강산이의 비밀번호를 훔치기 위해서 강산이가 사용하는 컴퓨터에 키로거를 설치했다. 며칠을 기다린 끝에 창영이는 강산이가 비밀번호 창에 입력하는 글자를 얻어냈다.

키로거는 사용자가 키보드를 누른 명령을 모두 기록한다. 따라서, 강산이가 비밀번호를 입력할 때, 화살표나 백스페이스를 입력해도 정확한 비밀번호를 알아낼 수 있다.

강산이가 비밀번호 창에서 입력한 키가 주어졌을 때, 강산이의 비밀번호를 알아내는 프로그램을 작성하시오.

### 입력

첫째 줄에 테스트 케이스의 개수가 주어진다. 각 테스트 케이스는 한줄로 이루어져 있고, 강산이가 입력한 순서대로 길이가 L인 문자열이 주어진다. (1 ≤ L의 길이 ≤ 1,000,000) 강산이가 백스페이스를 입력했다면, '-'가 주어진다. 이때 커서의 바로 앞에 글자가 존재한다면, 그 글자를 지운다. 화살표의 입력은 '<'와 '>'로 주어진다. 이때는 커서의 위치를 움직일 수 있다면, 왼쪽 또는 오른쪽으로 1만큼 움직인다. 나머지 문자는 비밀번호의 일부이다. 물론, 나중에 백스페이스를 통해서 지울 수는 있다. 만약 커서의 위치가 줄의 마지막이 아니라면, 커서 및 커서 오른쪽에 있는 모든 문자는 오른쪽으로 한 칸 이동한다.

### 출력

각 테스트 케이스에 대해서, 강산이의 비밀번호를 출력한다. 비밀번호의 길이는 항상 0보다 크다.

### 예제 입출력

| 입력                                   | 출력                    |
| -------------------------------------- | ----------------------- |
| 2 <br/> <<BP<A>>Cd- <br/> ThIsIsS3Cr3t | BAPC <br/> ThIsIsS3Cr3t |

---

### 내 코드

```python
testcase = int(input())
for _ in range(testcase) :
    keyLog = input()
    front_stack = []
    back_stack = []
    for log in keyLog :
        if log == '>' :
            if back_stack :
                front_stack.append(back_stack.pop())
        elif log == '-' :
            if front_stack :
                front_stack.pop()
        elif log == '<' :
            if front_stack :
                back_stack.append(front_stack.pop())
        else :
            front_stack.append(log)
    front_stack.extend(reversed(back_stack))
    print(''.join(front_stack))

```

이 문제는 프로그래머스 프린터 문제와 동일해서 같은 방법으로 풀었다. 아직도 처음 입력을 받아서 쓰는게 익숙치 않은 것 같다.
