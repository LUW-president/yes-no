# Protocol v0 Event Model

## question.presented
- event_id
- event_type
- timestamp
- session_id
- user_id
- question_id
- question_text
- channel

## answer.recorded
- event_id
- event_type
- timestamp
- session_id
- user_id
- question_id
- answer (yes|no)
- input_mode (gesture|tap|voice)
- latency_ms

## artifact.proposed
- event_id
- event_type
- timestamp
- session_id
- user_id
- artifact_id
- artifact_type (script|image|film|idea|other)
- source_question_ids (array)

## artifact.accepted
- event_id
- event_type
- timestamp
- session_id
- user_id
- artifact_id
- accepted (true)

## artifact.rejected
- event_id
- event_type
- timestamp
- session_id
- user_id
- artifact_id
- accepted (false)
- rejection_reason_code (optional)

## session.closed
- event_id
- event_type
- timestamp
- session_id
- user_id
- close_reason (completed|timeout|user_exit|system)
- summary_ref (optional)
