---
title: '[LeetCode] Reverse String - 문자열 - 파이썬'
date: 2021-04-01 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Write a function that reverses a string. The input string is given as an array of characters s.

### Example 1:

Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

### Example 2:

Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]

### Constraints:

1 <= s.length <= 105
s[i] is a printable ascii character.

Follow up: Do not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.

---

### 내 코드

```python
class Solution:
    def reverseString(self, s: List[str]) -> None:
        s = s.reverse()
```

문자열 `s`를 `reverse()`를 통해 뒤집어서 해결했다. `s = s[::-1]`로도 시도를 해봤는데, 리트코드에서는 오류가 발생한다. 제약조건에 공간 복잡도를 O(1)로 제한하고 있기 때문에 제약이 있기도하다. 약간 트릭성으로 `s[:] = s[::-1]`으로 하면 해결이 가능하다.
