---
title: '[LeetCode] Remove Duplicate Letters - 파이썬'
date: 2021-05-16 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given a string s, remove duplicate letters so that every letter appears once and only once. You must make sure your result is the smallest in lexicographical order among all possible results.

Note: This question is the same as 1081: https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/

### Example 1:

Input: s = "bcabc"
Output: "abc"

### Example 2:

Input: s = "cbacdcbc"
Output: "acdb"

### Constraints:

1 <= s.length <= 104
s consists of lowercase English letters.

### 내 코드

```python
class Solution:
    def removeDuplicateLetters(self, s: str) -> str:
        counter, check, stack = collections.Counter(s), set(), []

        for x in s :
            counter[x] -= 1
            if x in check :
                continue
            while stack and x < stack[-1] and counter[stack[-1]] > 0 :
                check.remove(stack.pop())
            stack.append(x)
            check.add(x)

        return ''.join(stack)
```

`collections.Counter()`와 `set()`자료형, `stack`을 사용해서 푼 문제이다. 스트링의 글자 개수를 센거에서 counter에서 줄이면서 이미 등장한 글자는 넘기고 `while`문을 통해 사전적 순서로 stack에 남을 수 있도록 하고, 마지막에 스택을 문자열로 만들어서 리턴했다.
