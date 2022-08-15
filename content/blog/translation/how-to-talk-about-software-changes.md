---
title: '(번역) 소프트웨어 변경에 대해 이야기하는 방법'
date: 2022-08-16 01:00:00
category: 'Translation'
draft: false
---

# 소프트웨어 변경에 대해 이야기하는 방법

> 작업을 시연하기 위한 4가지 핵심 개요

> 원문: [How to Talk About Software Changes](https://betterprogramming.pub/how-to-talk-about-software-changes-82dfb39cfaa)

![Photo by Headway on Unsplash](https://miro.medium.com/max/1400/1*ZL0nt3fOlWwOoY-j43GeRQ.jpeg)
사진 출처 - [Headway](https://unsplash.com/@headwayio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) ([Unsplash](https://unsplash.com/s/photos/talking-to-people?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText))

당신은 코드를 작성했습니다. 자 이제 어떻게 할까요?

불가피하게 당신은 다른 사람의 작업을 개선하게 될 것입니다. 어떻게 해야 원작자가 불쾌하지 않고 개선 사항을 기뻐하게 할 수 있을까요? 그리고 다른 사람들이 당신의 작업을 개선하는 것이 불편하지 않은 편안한 문화를 어떻게 조성할 수 있을까요?

아래는 제 작업을 시연하기 위한 4가지 핵심 개요입니다. 물론, 어떤 표현은 미묘하게 다를 수 있지만 글의 내용을 요약하는 좋은 출발점입니다.

1. 이전의 상태는 어땠나요?

2. 왜 미흡했나요?

3. 무엇을 변경했나요?

4. 무엇이 더 나아지기를 기대하나요?

이제 각 단계에 대해서 살펴봅시다.

## 1. 이전의 상태는 어땠나요?

![Photo by Aron Visuals on Unsplash](https://miro.medium.com/max/1400/1*7GBv_waMqw17mDpqZ1CbAA.jpeg)
사진 출처 - [Aron Visuals](https://unsplash.com/@aronvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) ([Unsplash](https://unsplash.com/s/photos/map?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText))

문제 영역의 틀을 잡아야 합니다. 특히 큰 조직에서는, 당신이 변경한 제품의 영역을 모든 사람이 알 수 없을 것입니다. 이것은 당신이 설명할 상대를 잘 알수록 더 효과적입니다. 만약 오래 근속한 직원에게 설명한다면 "체크아웃 페이지를 일부 변경했습니다."와 같이 간단한 설명으로 문제를 해결할 수 있습니다. 반면에 신입사원이나 제품을 처음 접하는 사람들에게 설명해야 한다면, 더 깊고 많은 정보를 설명해야 할 것 입니다.

문제 영역에 대해 친숙한 사람들에게는 다음과 같이 한 문장으로 해결될 수 있습니다. "오늘 아침에 체크아웃 페이지에서 변경한 사항을 보여드리겠습니다." 하지만 문제 영역에 대해 친숙하지 않은 상대에게는 그 배경에 대해 더 설명해야 할 것입니다. 현명하게 판단해서 설명하세요.

## 2. 왜 미흡했나요?

소프트웨어 엔지니어링의 일부는 "소프트웨어 고고학"의 역할을 하고 있습니다. 즉, 계층을 파고들어 프로젝트가 어떻게 만들어졌는지, 당시 사고 과정은 어땠는지, 그리고 시간이 지남에 따라 어떻게 진화해왔는지(그리고 잊혀갔는지)를 이해하게 합니다.

![Photo by Hulki Okan Tabak on Unsplash](https://miro.medium.com/max/1400/1*0f2rp_oQiGYsaZ7lEZLZmw.jpeg)
사진 출처 - [Hulki Okan Tabak](https://unsplash.com/@hulkiokantabak?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) ([Unsplash](https://unsplash.com/s/photos/archeological-dig?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText))

무엇이 누락되었는지, 잘못되었는지, 지나치게 복잡한지, 또는 다른 문제가 있는지 설명해야 합니다. 누군가 저지른 실수보다는 미흡한 부분을 끊임없이 발전시키기 위한 이야기의 장으로 만드는 것 대해 의도적이어야 합니다.

현재 존재하는 제품은 항상 그것이 만들어질 당시의 지식과 제약 그리고 여러 절충의 결과라는 것을 기억해야 합니다. 제품이 사용자의 손에 들어오자마자, 우리는 필연적으로 우리가 만들었던 모든 가설들을 검증하고, 새로운 코드를 제공하는 새로운 가설들을 공식화하기 시작합니다.

당신의 변경 사항은 곧 새로운 코드입니다.

만약 당신이 이 부분을 어떻게 표현할지 막막하면, 다음 중 몇 가지 질문에 답해보세요.

- 어떻게 그 미흡함에 대해 알게 되었나요?

- 어떤 데이터를 얻었나요?

- 그 데이터를 어떻게 해석했나요?

- 당시 어떤 절충과 제약이 있었나요?

- 왜 이러한 절충이 더 이상 허용될 수 없나요?

- 어떻게 이러한 제약을 극복했었나요?

## 3. 무엇을 변경했나요?

이제 변경의 핵심으로 들어가 보겠습니다. 항상 제품의 사용자 관점으로부터 변경 사항을 제시해야 합니다. 이를 위해서는 사용자를 이해해야 합니다. 사용자(설명을 듣는 상대가 아닌)가 기술 수준이 높은 경우에만 기술적인 세부 정보를 제시해야 합니다.

![Unsplash 의 Christopher Burns 사진](https://miro.medium.com/max/1400/1*v42v-9babQQ4OJftLGmbzA.jpeg)
사진 출처 - [Christopher Burns](https://unsplash.com/@christopher__burns?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) ([Unsplash](https://unsplash.com/s/photos/construction?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText))

예를 들어, 사용자 대면 애플리케이션을 변경한 경우, 사용자가 차이를 인식하고 (바라건대) 더 개선된 것으로 인식할 수 있도록 노력해야 합니다. 고객은 일반적으로 웹사이트가 함수 기반의 리액트 컴포넌트를 사용하는지 클래스 기반의 리액트 컴포넌트를 사용하는지에 관해 관심이 없습니다. 그러나 사용자들은 이전에 느렸던 페이지가 더 빨라졌는지, 또는 더 적은 노력으로 작업을 완료할 수 있는지에 대해 관심을 둡니다. 그렇다고 모든 기술적 세부 사항을 무시하라는 의미가 아닙니다. 단지 그것들을 발표의 주요 초점으로 두지 말라는 것입니다.

반면에, 때때로 변경 사항들이 매우 기술적인 경우도 있습니다. 가장 순수한 형태로, 리팩터링은 "결과적인 해를 변경하지 않고 소프트웨어 방정식의 요인"을 변경하는 것이 특징입니다. 만약 변경 사항이 최종 사용자에게는 2차 영향만 미치고 주로 다른 엔지니어들에게 도움이 될 때는, 코드가 어떻게 변경되었는지에 대해 설명하는데 필요한 만큼 열심히 준비해야 합니다. (다시 말하자면, 더 낫기를 바랍니다.)

시간이 허락한다면 전후를 모두 보여주는 것을 고려하고, 그렇지 않으면 변경 후에 초점을 맞추도록 해야 합니다. 이 변경이 중요한 이유를 설정하기 위해 처음 두 부분을 활용하세요.

## 4. 무엇이 더 나아지기를 기대하나요?

이 시간을 통해 당신이 시작했던 출발 부분으로 되돌아 가봅시다. 실험 가설을 통해 개선의 틀을 잡아야 합니다. "우리는 {새로운 가설} 때문에 {변경}이 {미흡한 점}을 개선할 것으로 기대합니다."

![Photo by Nagara Oyodo on Unsplash](https://miro.medium.com/max/1400/1*fizuvSFId3u4ttSzzCE3bQ.jpeg)
사진 출처 - [Nagara Oyodo](https://unsplash.com/es/@nagaranbasaran?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) ([Unsplash](https://unsplash.com/s/photos/hope?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText))

이러한 가설 설정 방법은 잘못된 가설의 맥락에서 코드에 대한 건전한 사고방식을 보장하는 데 도움이 됩니다. 가설의 타당성을 성공적으로 검증했기 때문에 가설이 잘못된 것으로 판명되더라도 변경은 가치가 있습니다. 최악의 경우에는 우리는 더 많은 데이터를 얻고 가설을 수정합니다. 최선의 경우라면 우리의 가설이 맞았고 사용자의 경험을 개선합니다.

데이터와 학습의 맥락에서 변경 사항을 꾀어내는 것은 다른 사람의 아이디어가 "좋다" 또는 "나쁘다"라고 의도치 않게 생각하는 것을 예방할 수 있는 좋은 방법입니다. 학습에 집중한다는 것의 의미는 우리는 아무것도 모른다는 것을 내포하고 있습니다. 내가 만들었기 때문에 내 변경 사항이 이미 좋다는 주장보다는 데이터가 수집되기 때문에 우리의 변경이 좋든 안 좋든 우리가 배우리라는 것을 의미합니다.

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
