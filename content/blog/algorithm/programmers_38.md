---
title: '[프로그래머스] 키패드 누르기 - 파이썬'
date: 2021-01-12 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

스마트폰 전화 키패드의 각 칸에 다음과 같이 숫자들이 적혀 있습니다.

![문제설명 사진](https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/4b69a271-5f4a-4bf4-9ebf-6ebed5a02d8d/kakao_phone1.png)

이 전화 키패드에서 왼손과 오른손의 엄지손가락만을 이용해서 숫자만을 입력하려고 합니다.
맨 처음 왼손 엄지손가락은 \* 키패드에 오른손 엄지손가락은 # 키패드 위치에서 시작하며, 엄지손가락을 사용하는 규칙은 다음과 같습니다.

엄지손가락은 상하좌우 4가지 방향으로만 이동할 수 있으며 키패드 이동 한 칸은 거리로 1에 해당합니다.
왼쪽 열의 3개의 숫자 1, 4, 7을 입력할 때는 왼손 엄지손가락을 사용합니다.
오른쪽 열의 3개의 숫자 3, 6, 9를 입력할 때는 오른손 엄지손가락을 사용합니다.
가운데 열의 4개의 숫자 2, 5, 8, 0을 입력할 때는 두 엄지손가락의 현재 키패드의 위치에서 더 가까운 엄지손가락을 사용합니다.
4-1. 만약 두 엄지손가락의 거리가 같다면, 오른손잡이는 오른손 엄지손가락, 왼손잡이는 왼손 엄지손가락을 사용합니다.
순서대로 누를 번호가 담긴 배열 numbers, 왼손잡이인지 오른손잡이인 지를 나타내는 문자열 hand가 매개변수로 주어질 때, 각 번호를 누른 엄지손가락이 왼손인 지 오른손인 지를 나타내는 연속된 문자열 형태로 return 하도록 solution 함수를 완성해주세요.

### 제한사항

numbers 배열의 크기는 1 이상 1,000 이하입니다.
numbers 배열 원소의 값은 0 이상 9 이하인 정수입니다.
hand는 "left" 또는 "right" 입니다.
"left"는 왼손잡이, "right"는 오른손잡이를 의미합니다.
왼손 엄지손가락을 사용한 경우는 L, 오른손 엄지손가락을 사용한 경우는 R을 순서대로 이어붙여 문자열 형태로 return 해주세요.

### 입출력 예

| numbers                           | hand    | result        |
| --------------------------------- | ------- | ------------- |
| [1, 3, 4, 5, 8, 2, 1, 4, 5, 9, 5] | "right" | "LRLLLRLLRRL" |
| [7, 0, 8, 2, 8, 3, 1, 5, 7, 6, 2] | "left"  | "LRLLRRLLLRR" |
| [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]    | "right" | "LLRLLRLLRL"  |

---

### 내 코드

```python
def solution(numbers, hand):
    answer = ''
    left = 10
    right = 12

    for number in numbers :
        if number in [1,4,7] :
            left = number
            answer += 'L'
        elif number in [3,6,9] :
            right = number
            answer += 'R'
        elif number in [2,5,8,0] :
            number = 11 if number == 0 else number
            leftDist = abs(number - left)
            rightDist = abs(number - right)
            if leftDist // 3 + leftDist % 3 < rightDist // 3 + rightDist % 3 :
                left = number
                answer += 'L'
            elif leftDist // 3 + leftDist % 3 > rightDist // 3 + rightDist % 3 :
                right = number
                answer += 'R'
            elif leftDist // 3 + leftDist % 3 == rightDist // 3 + rightDist % 3 :
                if hand == 'left' :
                    left = number
                    answer += 'L'
                else :
                    right = number
                    answer += 'R'
    return answer
```

이 문제는 푸는데 오래걸렸고, 상당히 고민이 많이 들어갔다. 일단 다음 누를 숫자가 `1,4,7` 이거나 `3,6,9` 일 경우는 별도의 로직이 필요없다. 하지만 다음 누를 숫자가 `2,5,8,0`일 경우, 신경 쓸 부분이 많아진다. 일단 거리를 구해야 하기 때문인데, 왼손으로부터의 거리와 오른손으로부터의 거리를 비교하여 더 적은 쪽으로 눌러야하기 때문이다. 게다가 방향도 상,하,좌,우로만 갈 수 있기 때문에 거리 계산하는게 생각보다 복잡했다. 만약에 좌표값으로 나타내져 있다면 좌표 값을 통해서 거리 계산하는게 수월했을 수 있는데, 그렇지도 않았기 때문에 거리 계산에 애를 먹었다. 그러다가 찾은 것이 `leftDist // 3 + leftDist % 3` 이 부분인데, 먼저 단순히 누를 숫자와 현재 위치를 빼고 절대값으로 구한 `leftDist`와 `rightDist`를 구하고, 구한 거리를 `3`으로 나눈 몫과 나머지를 더하면 진짜 거리가 구해졌다. 이건 수학적인 머리가 필요했던 거라 내가 풀기에 조금 취약했던 방식이었던 것 같다. 그렇게 거리를 구하고 나서는 어려운 점 없이 답을 구할 수 있었다.

---

### 다른 사람의 코드

```python
def solution(numbers, hand):
    answer = ''
    key_dict = {1:(0,0),2:(0,1),3:(0,2),
                4:(1,0),5:(1,1),6:(1,2),
                7:(2,0),8:(2,1),9:(2,2),
                '*':(3,0),0:(3,1),'#':(3,2)}

    left = [1,4,7]
    right = [3,6,9]
    lhand = '*'
    rhand = '#'
    for i in numbers:
        if i in left:
            answer += 'L'
            lhand = i
        elif i in right:
            answer += 'R'
            rhand = i
        else:
            curPos = key_dict[i]
            lPos = key_dict[lhand]
            rPos = key_dict[rhand]
            ldist = abs(curPos[0]-lPos[0]) + abs(curPos[1]-lPos[1])
            rdist = abs(curPos[0]-rPos[0]) + abs(curPos[1]-rPos[1])

            if ldist < rdist:
                answer += 'L'
                lhand = i
            elif ldist > rdist:
                answer += 'R'
                rhand = i
            else:
                if hand == 'left':
                    answer += 'L'
                    lhand = i
                else:
                    answer += 'R'
                    rhand = i

    return answer
```

이 코드는 키패드를 `{key:value}` 형태인 **딕셔너리**자료형을 사용하여 좌표값으로 만들어 계산하였다. 좌표 값으로 변환하게 되면 거리 계산을 **맨하탄거리**측정 방법으로 할 수 있게되는데, 그건 아래 별도로 정리하도록 하고 일단 위 코드에서는 다음 누를 숫자를 딕셔너리의 `key`로 호출해서 좌표를 받고, 해당 좌표를 이용하여 맨하탄 거리 측정법의 공식인 `|x1-y1|+|x2-y2|`를 통해서 거리를 구했다. 그리고 그 거리를 구한 후에는 같은 방식으로 답을 구했다. 이렇게 딕셔너리 자료형을 사용하는 좋은 방법에 대해서 알 수 있었고, `left = [1,4,7]` 과 같이 코드를 더 깔끔하기 위해 정리한 것은 좋은 방법이라는 생각을 했다.

### 유클리드 거리계산법과 맨하탄 거리 계산법

![거리측정법](https://t1.daumcdn.net/cfile/tistory/23732633588067522E)

위 그림을 보면 어떤 지점에서 특정 지점으로 이동할 떄 파란색과 같이 구한 것이 `맨하탄 거리측정법`이고 초록색과 같이 구한 것이 `유클리드 거리측정법`이다.

![유클리드](https://i1.wp.com/hleecaster.com/wp-content/uploads/2019/12/dis3.png?w=351)

유클리드 거리 측정법의 위의 공식이고, 아래와 같이 코드로 나타낼 수 있다.

```python
def euclidean_distance(pt1, pt2):
  distance = 0
  for i in range(len(pt1)):
    distance += (pt1[i] - pt2[i]) ** 2
  return distance ** 0.5
```

![맨하탄](https://i0.wp.com/hleecaster.com/wp-content/uploads/2019/12/dis5.png?w=307)

맨하탄 거리 측정법 공식은 위와 같고 아래와 같은 코드로 나타낼 수 있다.

```python
def manhattan_distance(pt1, pt2):
  distance = 0
  for i in range(len(pt1)):
    distance += abs(pt1[i] - pt2[i])
  return distance
```
