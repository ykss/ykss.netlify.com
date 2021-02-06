---
title: '[BOJ] 친구 네트워크'
date: 2021-02-07 01:00:00
category: 'Algorithm'
draft: false
---

### 문제

민혁이는 소셜 네트워크 사이트에서 친구를 만드는 것을 좋아하는 친구이다. 우표를 모으는 취미가 있듯이, 민혁이는 소셜 네트워크 사이트에서 친구를 모으는 것이 취미이다.

어떤 사이트의 친구 관계가 생긴 순서대로 주어졌을 때, 두 사람의 친구 네트워크에 몇 명이 있는지 구하는 프로그램을 작성하시오.

친구 네트워크란 친구 관계만으로 이동할 수 있는 사이를 말한다.

### 입력

첫째 줄에 테스트 케이스의 개수가 주어진다. 각 테스트 케이스의 첫째 줄에는 친구 관계의 수 F가 주어지며, 이 값은 100,000을 넘지 않는다. 다음 F개의 줄에는 친구 관계가 생긴 순서대로 주어진다. 친구 관계는 두 사용자의 아이디로 이루어져 있으며, 알파벳 대문자 또는 소문자로만 이루어진 길이 20 이하의 문자열이다.

### 출력

친구 관계가 생길 때마다, 두 사람의 친구 네트워크에 몇 명이 있는지 구하는 프로그램을 작성하시오.

### 예제 입출력

| 입력                                                                                                                            | 출력                                      |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 2 </br> 3 </br> Fred Barney </br> Barney Betty </br> Betty Wilma </br> 3 </br> Fred Barney </br> Betty Wilma </br> Barney Betty | 2 </br> 3 </br> 4 </br> 2 </br> 2 </br> 4 |

---

### 내 코드

```python
def find(x):
    if x == parent[x]:
        return x
    else :
        p = find(parent[x])
        parent[x] = p
        return p

def union(x, y):
    x = find(x)
    y = find(y)
    if x != y :
        parent[y] = x
        number[x] += number[y]

testcase = int(input())
for _ in range(testcase) :
    parent = dict()
    number = dict()
    relations = int(input())
    for _ in range(relations) :
        x, y = input().split(' ')
        if x not in parent :
            parent[x] = x
            number[x] = 1
        if y not in parent :
            parent[y] = y
            number[y] = 1
        union(x,y)
        print(number[find(x)])
```

이번 문제는 연결된 노드들을 찾는 `Union-Find` 알고리즘을 활용하여 푸는 문제였다. 딕셔너리 형태(key-value)를 두 개 만들어서, 하나는 친구들, 두번째는 부모 노드를 표시했다. 그래서 연결되는 경우에 부모 노드가 바뀌게끔 하면서 반복했다. 처음에는 자기 자신을 부모로 놓고, 계속 연결할 떄마다 기준 노드를 부모로 한다. 그렇게 관계의 수만큼 반복하고 나서 부모 노드에 연결된 관계의 수를 출력했다.
