---
title: '[LeetCode] Group Anagrams - 문자열 - 파이썬'
date: 2021-04-04 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Example 1:

Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

### Example 2:

Input: strs = [""]
Output: [[""]]

### Example 3:

Input: strs = ["a"]
Output: [["a"]]

### Constraints:

1 <= strs.length <= 104
0 <= strs[i].length <= 100
strs[i] consists of lower-case English letters.

---

### 내 코드

```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        sorted_dict = collections.defaultdict(list)
        for word in strs :
            sorted_dict[''.join(sorted(word))].append(word)
        return sorted_dict.values()
```

딕셔너리를 이용해 풀었는데, 그냥 딕셔너리의 `setdefault()`를 이용할 경우엔 여러번 호출해야 하는 불편함이 있는데 `collections.defaultdict()`를 이용하면 최초 키 값의 기본 값을 지정해줄 수 있기 때문에 더 유용하다. 그 이후에는 `sorted(word)`를 통해 문자열을 정렬해서 리스트로 반환하고, 해당 리스트를 다시 `join()`을 통해서 문자열로 만들어 그것을 key로 썼다. 그리고 해당 key의 리스트에 해당 단어를 넣은 다음에 해당 딕셔너리의 값들을 출력했다. 문제에서 순서는 상관없다고 하여 덜 까다로울 수 있었다. `sort()`함수는 리스트의 내장함수여서 리스트만 정렬가능하지만 `sorted()`는 문자열도 정렬하여 리스트로 반환해주는걸 기억하고 잘 활용하자.
