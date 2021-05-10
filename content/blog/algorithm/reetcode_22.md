---
title: '[LeetCode] Swap Nodes in Pairs - 파이썬'
date: 2021-05-09 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)

### Example 1:

Input: head = [1,2,3,4]
Output: [2,1,4,3]

### Example 2:

Input: head = []
Output: []

### Example 3:

Input: head = [1]
Output: [1]

### Constraints:

The number of nodes in the list is in the range [0, 100].
0 <= Node.val <= 100

---

### 내 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:

        node = head
        arr = []

        while node is not None :
            arr.append(node.val)
            node = node.next
        for i in range(1,len(arr),2) :
            arr[i], arr[i-1] = arr[i-1], arr[i]

        prev = None

        while arr:
            node = ListNode(arr.pop())
            node.next = prev
            prev = node

        return node
```

먼저 연결리스트를 파이썬 리스트로 만들고 나서 해당 리스트의 인덱스 1부터 2씩 증가시켜 스왑하는 방식으로 했다. 그리고나서 스왑된 배열을 다시 배열리스트로 만들어서 답을 구했다.

### 다른 답안

```python
    def swapPairs(self, head: ListNode) -> ListNode:
        cur = head

        while cur and cur.next :
            cur.val, cur.next.val = cur.next.val, cur.val
            cur = cur.next.next

        return head
```

이 방식은 값만 스왑되는 방식으로 리스트로 만들필요 없이 연결리스트에서 바로바로 스왑하는 방식이다. 훨씬 짧은 코드로 같은 답을 구할 수 있다.
