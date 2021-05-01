---
title: '[LeetCode] Best Time to Buy and Sell Stock - 파이썬'
date: 2021-05-02 01:00:00
category: 'Algorithm'
draft: false
---

### Description

You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

### Example 1:

Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

### Example 2:

Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.

### Constraints:

1 <= prices.length <= 105
0 <= prices[i] <= 104

---

### 내 코드

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_value = sys.maxsize
        max_value = 0

        for price in prices :
            min_value = min(price, min_value)
            max_value = max(price-min_value, max_value)
        return max_value
```

최댓값과 최솟값을 계속 갱신해가면서 답을 구하는 방법인데, 여기서 초기 값을 어떻게 설정하는지가 포인트이다. 최댓값과 최솟값을 정하는 부분에서는 `sys.maxsize, -sys.maxsize`와 같이 초기화 할 수도 있고, `float('inf'), float('-inf')`로도 가능하다. 물론 문제의 제약조건에서 범위가 정해져있는 경우, 해당 범위대로 해도된다.
