---
title: '[LeetCode] Most Common Word - 문자열 - 파이썬'
date: 2021-04-03 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given a string paragraph and a string array of the banned words banned, return the most frequent word that is not banned. It is guaranteed there is at least one word that is not banned, and that the answer is unique.

The words in paragraph are case-insensitive and the answer should be returned in lowercase.

### Example 1:

Input: paragraph = "Bob hit a ball, the hit BALL flew far after it was hit.", banned = ["hit"]
Output: "ball"
Explanation:
"hit" occurs 3 times, but it is a banned word.
"ball" occurs twice (and no other word does), so it is the most frequent non-banned word in the paragraph.
Note that words in the paragraph are not case sensitive,
that punctuation is ignored (even if adjacent to words, such as "ball,"),
and that "hit" isn't the answer even though it occurs more because it is banned.

### Example 2:

Input: paragraph = "a.", banned = []
Output: "a"

### Constraints:

1 <= paragraph.length <= 1000
paragraph consists of English letters, space ' ', or one of the symbols: "!?',;.".
0 <= banned.length <= 100
1 <= banned[i].length <= 10
banned[i] consists of only lowercase English letters.

---

### 내 코드

```python
class Solution:
    def mostCommonWord(self, paragraph: str, banned: List[str]) -> str:
        new_paragraph = re.sub(r"[^a-zA-Z]"," ",paragraph)
        new_paragraph = [x.lower() for x in new_paragraph.split()]
        count = collections.Counter(new_paragraph)
        sorted_count = count.most_common()
        while sorted_count :
            most = sorted_count.pop(0)
            if most[0] not in banned :
                return most[0]
```

처음에는 정규식을 통해서 알파벳 외에 다른 문자를 제거하고, 그 이후에 한 단어씩 소문자로 변환하여 리스트를 만들었다. 그리고 해당 리스트에서 `Counter()`함수를 통해서 각 단어 횟수를 정하고 `most_common()`을 통해서 가장 많이 등장하는 순으로 나타냈다. 그리고 가장 횟수가 많은 것부터 하나씩 빼어서 그게 금지단어 배열에 포함되어있지 않으면 답으로 출력했다.

### 다른 사람의 코드

```python
def mostCommonWord(self, paragraph: str, banned: List[str]) -> str:
    words = [word for word in re.sub(r'[^\w]',' ',paragraph).lower().split() if word not in banned]
    counts = collections.Counter(words)
    return counts.most_common(1)[0][0]
```

코드 자체는 내 코드와 로직의 흐름은 같은데 훨씬 간결하고 Pythonic 하다. `words`에서 특수문자를 정규식으로 바꾸었다. `\w`는 문자를 나타내고 문자가 아닌 모든걸 공백으로 치환시켰다. 그리고 모든 문자를 소문자로 바꾼 후 `split()`을 통해 단어단위로 나눴고, 그중에서 `banned` 배열에 없는 단어만 리스트로 만들었다. 그리고 `Counter`함수를 통해 등장 횟수를 구했다. 그리고 마지막에서 `most_common(1)`함수를 통해 가장 많이 등장하는 한개를 뽑아서 리턴했다.
