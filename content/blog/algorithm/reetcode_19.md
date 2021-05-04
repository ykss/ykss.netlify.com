---
title: '[LeetCode] Merge Two Sorted Lists - 파이썬'
date: 2021-05-04 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.

### Example 1:

Input: l1 = [1,2,4], l2 = [1,3,4]
Output: [1,1,2,3,4,4]

### Example 2:

Input: l1 = [], l2 = []
Output: []

### Example 3:

Input: l1 = [], l2 = [0]
Output: [0]

### Constraints:

The number of nodes in both lists is in the range [0, 50].
-100 <= Node.val <= 100
Both l1 and l2 are sorted in non-decreasing order.

---

### 내 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        if (not l1) or (l2 and l1.val > l2.val) :
            l1, l2 = l2, l1
        if l1 :
            l1.next = self.mergeTwoLists(l1.next, l2)
        return l1
```

이 코드는 매우 짧지만, 재귀적인 용법을 쓰기 때문에 한번에 본다고 쉽게 이해되는 코드는 아니다. 이 코드의 포인트는 재귀 호출과 변수 스왑이다. `l1, l2 = l2, l1`와 같은 방법은 다중 할당의 방식으로 스왑하는 것이다.
