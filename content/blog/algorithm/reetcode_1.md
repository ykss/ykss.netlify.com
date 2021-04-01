---
title: '[LeetCode] Valid Palindrome - 문자열 - 파이썬'
date: 2021-04-01 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

### Example 1:

Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

### Example 2:

Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

### Constraints:

1 <= s.length <= 2 \* 105
s consists only of printable ASCII characters.

---

### 내 코드

```python
class Solution:
    def isPalindrome(self, s: str) -> bool :
        temp = []
        for x in s :
            if x.isalnum() :
                temp.append(x.lower())
        while len(temp) > 1 :
            if temp.pop(0) != temp.pop() :
                return False
        return True
```

시도에서 틀렸던 내용이 크게 세가지 부분에서 잘못했었는데, 일단 `isalnum()`대신 `isalpha()`로 했었는데, `isalpha()`같은 경우는 영문자만 판별하지만, `isalnum()`같은 경우, 영문자와 숫자를 포함한다. 숫자에 대해서 빼먹었다. 그리고 두번째는 대소문자에 대한 건데 `A`와 `a`는 같은 부분이기 때문에 `lower()`처리를 해줬어야 하는데 그 부분이 빠졌었다. 그리고 마지막으로 그 전에는 `temp[i] != temp[-i]` 이런 식으로 비교하려고 했지만, `pop()`을 쓰는게 더 깔끔한 부분이었어서 변경했다. 리트코드는 또 처음이라 헤멧는데, 영어 문제나 다른 코테 환경에도 익숙해져야 겠다.

### 데크 자료형을 이용한 풀이

```python
def isPalindrome(self, s: str) -> bool :
    strs : Deque = collections.deque()

    for char in s :
        if char.isalnum():
            strs.append(char.lower())

    while len(strs) > 1 :
        if strs.popleft() != strs.pop():
            retrun False

    return True
```

이렇게 하면 기존 방식에서 데크 자료형을 사용한 부분만 달라졌지만 이렇게 했을 때, 속도를 더 높일수 있다. 기존 나의 풀이에 비해 5배 정도 성능 개선이 되었다.

### 정규식과 슬라이싱을 사용한 풀이

```python
def isPalindrome(self, s: str) -> bool :
    s = s.lower()
    s = re.sub('[^a-z0-9]', '', s)
    return s == s[::-1]
```

기존 풀이와 다른 부분은 정규식을 통해서 알파벳이나 숫자가 아니면 모두 제거했고, 마지막은 슬라이싱 기능을 통해서 `[::-1]`을 이용하여 반대로 뒤집었다. 그리고 뒤집은 결과를 기존 `s`와 비교하여 같으면 True 다르면 False를 리턴하도록 해서 구했다. 이 방법의 경우는 두 번째 방법보다 2배 정도 속도가 빠르다.
