---
title: '[LeetCode] Implement Stack using Queues - 파이썬'
date: 2021-05-27 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Implement a last in first out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal queue (push, top, pop, and empty).

Implement the MyStack class:

void push(int x) Pushes element x to the top of the stack.
int pop() Removes the element on the top of the stack and returns it.
int top() Returns the element on the top of the stack.
boolean empty() Returns true if the stack is empty, false otherwise.

### Notes:

You must use only standard operations of a queue, which means only push to back, peek/pop from front, size, and is empty operations are valid.
Depending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue), as long as you use only a queue's standard operations.

### Example 1:

Input
["MyStack", "push", "push", "top", "pop", "empty"][], [1], [2], [], [], []]
Output
[null, null, null, 2, 2, false]

### Explanation

MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top(); // return 2
myStack.pop(); // return 2
myStack.empty(); // return False

### Constraints:

1 <= x <= 9
At most 100 calls will be made to push, pop, top, and empty.
All the calls to pop and top are valid.

### Follow-up:

Can you implement the stack such that each operation is amortized O(1) time complexity? In other words, performing n operations will take overall O(n) time even if one of those operations may take longer. You can use more than two queues.

### 내 코드

```python
from collections import deque

class MyStack:

    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.queue = deque()


    def push(self, x: int) -> None:
        """
        Push element x onto stack.
        """
        self.queue.append(x)
        for _ in range(len(self.queue) - 1) :
            self.queue.append(self.queue.popleft())


    def pop(self) -> int:
        """
        Removes the element on top of the stack and returns that element.
        """
        return self.queue.popleft()


    def top(self) -> int:
        """
        Get the top element.
        """
        return self.queue[0]


    def empty(self) -> bool:
        """
        Returns whether the stack is empty.
        """
        return len(self.queue) == 0


# Your MyStack object will be instantiated and called as such:
# obj = MyStack()
# obj.push(x)
# param_2 = obj.pop()
# param_3 = obj.top()
# param_4 = obj.empty()
```

이건 큐를 이용해서 스택을 구현하는 문제였다. 먼저 `init` 부분은 파이썬에서 제공하는 `deque()` 자료구조를 통해서 구현했고, `push`의 경우, 처음에는 큐의 맨 뒤에 추가한 다음에, 다시 왼쪽부터 있던 것들을 그 뒤로 추가하여, `push` 한 수가 큐의 맨 앞으로 가게 했다. 이건 스택의 맨 위에 추가한 것으로 생각하면 된다. 그리고 `pop`은 `popleft()`를 통해 가장 앞의 요소를 꺼내도록 하고 리턴하게 했다. 그리고 `top()`은 스택의 맨 위 요소를 꺼내는 것이기 때문에 첫번째 인덱스를 리턴하고 요소에서 제거하지는 않았다. 그리고 마지막으로 `empty`는 큐의 길이가 0이면 빈것으로 아니면 false를 리턴하도록하여 구현했다.
