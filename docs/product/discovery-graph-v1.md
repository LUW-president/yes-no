# Discovery Decision Graph v1

## 1) Overview
Discovery Graph v1 defines a deterministic yes/no funnel from immediate need discovery to intent classification and final action proposal.

Core invariant:

question → gesture → answer → clarity

This document is architecture-only and does not activate runtime behavior.

---

## 2) Full node list (deterministic)

### Root / discovery nodes
1. `q1_now_want` — Is there something you want right now?
2. `q2_can_happen_now` — Can it happen right now?
3. `q3_involves_person` — Does it involve another person?
4. `q4_physical` — Is it something physical?
5. `q5_change_feeling` — Would it change how you feel?
6. `q6_usually_enjoy` — Is it something you usually enjoy?
7. `q7_practical` — Is it something practical?
8. `q8_urgent` — Is it urgent?
9. `q9_environment` — Does it involve your environment?
10. `q10_outsource` — Is it something you usually outsource?

### Action leaf nodes
11. `a_order_chinese_food`
12. `a_play_elvis`
13. `a_play_philosophy_podcast`
14. `a_contact_friend`
15. `a_turn_off_lights`
16. `a_hire_taskrabbit`
17. `a_book_rosa_massage`
18. `a_contact_mount_sinai`
19. `a_find_babysitter`
20. `a_call_911`

Graph traversal depth is constrained to max 7 questions per path.

---

## 3) Deterministic node graph diagram (v1)

```text
q1_now_want
 ├─ yes → q2_can_happen_now
 │    ├─ yes → q4_physical
 │    │    ├─ yes → q7_practical
 │    │    │    ├─ yes → q10_outsource
 │    │    │    │    ├─ yes → a_hire_taskrabbit
 │    │    │    │    └─ no  → q9_environment
 │    │    │    │         ├─ yes → a_turn_off_lights
 │    │    │    │         └─ no  → a_order_chinese_food
 │    │    │    └─ no  → q6_usually_enjoy
 │    │    │         ├─ yes → a_book_rosa_massage
 │    │    │         └─ no  → a_play_philosophy_podcast
 │    │    └─ no  → q5_change_feeling
 │    │         ├─ yes → q6_usually_enjoy
 │    │         │    ├─ yes → a_play_elvis
 │    │         │    └─ no  → a_play_philosophy_podcast
 │    │         └─ no  → q3_involves_person
 │    │              ├─ yes → a_contact_friend
 │    │              └─ no  → a_play_philosophy_podcast
 │    └─ no  → q8_urgent
 │         ├─ yes → a_call_911
 │         └─ no  → q3_involves_person
 │              ├─ yes → a_find_babysitter
 │              └─ no  → q5_change_feeling
 │                   ├─ yes → a_book_rosa_massage
 │                   └─ no  → a_play_elvis
 └─ no  → q5_change_feeling
      ├─ yes → a_play_elvis
      └─ no  → q7_practical
           ├─ yes → q9_environment
           │    ├─ yes → a_turn_off_lights
           │    └─ no  → a_play_philosophy_podcast
           └─ no  → a_contact_friend
```

---

## 4) Example traversal paths

### Path A — food intent
- q1 yes → q2 yes → q4 yes → q7 yes → q10 no → q9 no → **a_order_chinese_food**

### Path B — music/relaxation intent
- q1 no → q5 yes → **a_play_elvis**

### Path C — emergency intent
- q1 yes → q2 no → q8 yes → **a_call_911**

### Path D — service request intent
- q1 yes → q2 yes → q4 yes → q7 yes → q10 yes → **a_hire_taskrabbit**

### Path E — healthcare/care-team intent (future clinical gate)
- q1 yes → q2 no → q8 yes + healthcare context flag → **a_contact_mount_sinai**

---

## 5) Mapping to intent buckets

- `a_order_chinese_food` → `food`
- `a_play_elvis` → `music`
- `a_play_philosophy_podcast` → `podcast`
- `a_contact_friend` / `a_find_babysitter` → `social_contact`
- `a_turn_off_lights` → `home_environment`
- `a_hire_taskrabbit` / `a_book_rosa_massage` → `service_request`
- `a_contact_mount_sinai` → `healthcare`
- `a_call_911` → `emergency`
- `a_book_rosa_massage` / `a_play_elvis` → `relaxation`
- `a_play_philosophy_podcast` → `exploration`

---

## 6) Mapping to action proposals

- **order_chinese_food**
  - Template: “Would you like me to order your usual Chinese food?”

- **play_elvis**
  - Template: “Would you like me to play Elvis?”

- **play_philosophy_podcast**
  - Template: “Would you like the latest philosophy podcast?”

- **book_rosa_massage**
  - Template: “Would you like me to book Rosa your masseuse?”

- **contact_mount_sinai**
  - Template: “Do you want me to contact your care team at Mount Sinai?”

- **find_babysitter**
  - Template: “Would you like me to find a babysitter?”

- **hire_taskrabbit**
  - Template: “Would you like me to find a TaskRabbit for this?”

- **turn_off_lights**
  - Template: “Would you like me to turn off the lights?”

- **call_911**
  - Template: “Would you like me to call 911?”

---

## Notes
- Architecture prep only.
- No runtime wiring.
- No classifier or decision-engine changes.
- Unknown gesture handling remains retry-only at current question.
