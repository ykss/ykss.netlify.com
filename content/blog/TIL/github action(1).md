---
title: 'Github Action(깃헙 액션) 써보기(1)'
date: 2021-05-25 18:00:00
category: 'TIL'
draft: true
---

![action main](https://jonnung.dev/images/github_action_cover.png)

최근 주변 친구들을 통해 github action이라는 것이 되게 유용하고 요즘 많이 활용된다는 이야기를 들었었다. 그래서 단순히 아~ 그렇구나 하고 넘어갔었지만, 인프런에서 관련 강의를 우연히 보게되면서 한번 써보고 맛보자(?)라는 마음으로 해보게되었다. 그리고 이 기회에 포스팅으로 정리해보려고 한다.

## Github Action이란?

![Action](https://ifh.cc/g/iI8u1L.jpg)

Github Action은 깃헙 저장소를 기반으로 일련의 work flow를 자동화 하도록 해주는 CI/CD 도구라고 할 수 있다. 이 workflow는 어떻게 구성하느냐에 따라 빌드, 테스트, 배포 등 다양한 과정에 활용될 수 있고, 이러한 워크플로우를 직접 구성하고 만들 수도 있으며, Github 마켓 플레이스에서 내 워크플로우를 공유하거나 다른 사람의 워크플로우를 가져올 수도 있다. 그리고 Github Action에서는 Runners를 제공하여 이러한 워크플로우를 리눅스, 윈도우 등 환경을 지정하여 실행할 수 있다.

## Github Action의 과금정책과 사용 범위는?

CI/CD도구이든 어쨌든 실제로 활용을 하기 위해서는 과금정책 부분도 쉽게 지나칠 수 있는 부분은 아니다. Github Action의 경우, Git repo의 공개/비공개 여부에 따라서 공개일 경우에는 파격적으로 무료로 제공하고 있다. 그리고 private repo의 경우에는 한달에 500MB 스토리지와 2,000분 이상 실행될 경우에는 과금이 들어가고 있다.

한 저장소에 최대 20개의 Workflow를 등록할 수 있고, 워크플로우 내에 Job같은 경우 실행 단위마다 최대 6시간 실행가능하다. 만약에 6시간이 초과 될 경우에는 자동으로 종료된다.

## Workflow 구성

---

> 참고

1. [Introduction to GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions)
2. [Github Action 빠르게 시작하기](https://jonnung.dev/devops/2020/01/31/github_action_getting_started/)
