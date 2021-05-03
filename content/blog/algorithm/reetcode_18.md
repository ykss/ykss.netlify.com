---
title: '[LeetCode] Palindrome Linked List - 파이썬'
date: 2021-05-03 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given the head of a singly linked list, return true if it is a palindrome.

### Example 1:

Input: head = [1,2,2,1]
Output: true

### Example 2:

Input: head = [1,2]
Output: false

### Constraints:

The number of nodes in the list is in the range [1, 105].
0 <= Node.val <= 9

### Follow up:

Could you do it in O(n) time and O(1) space?

---

### 내 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        q = []
        if not head :
            return True
        while head is not None :
            q.append(head.val)
            head = head.next
        while len(q) > 1 :
            if q.pop(0) != q.pop() :
                return False
        return True
```

일단 연결 리스트로는 메서드가 충분하지 않기 때문에 리스트로 변환한 후에 하는게 났다. 리스트 자료형에는 pop()이나 슬라이싱과 같은 메서드가 기본적으로 있기 때문에 활용하여 할 수 있다. 여기서는 연결리스트를 먼저 리스트로 변환하고 `pop()`을 통해 첫 원소와 마지막 원소를 빼서 비교하여 다르면 팰린드롬이 아니므로 거짓을 리턴하도록 하여 답을 구했다.
