import React, { useState } from 'react';

function QAChat() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');

  const postQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestions([{ text: questionText, replies: [] }, ...questions]);
    setQuestionText('');
  };

  const postReply = (idx, reply) => {
    setQuestions(questions.map((q, i) => i === idx ? { ...q, replies: [...q.replies, reply] } : q));
  };

  return (
    <section className="container1" role="region" aria-label="Questions and chat">
      <div>
        <h2 style={{ marginBottom: '12px', color: '#d5dce2' }}>Ask a Question</h2>
        <form className="question-form" onSubmit={postQuestion}>
          <textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question here..."
            required
          />
          <button type="submit" className="btn" style={{ background: 'rgba(153, 205, 50, 0.275)', color: 'white', marginTop: '10px' }}>
            Post Question
          </button>
        </form>
      </div>

      <hr style={{ margin: '18px 0', border: 'none', borderTop: '1px solid #eef6ff' }} />

      <div>
        <h2 style={{ color: '#d5dce2' }}>Questions</h2>
        <div id="questionsList" style={{ marginTop: '12px' }}>
          {questions.map((q, idx) => (
            <div key={idx} className="question">
              <p><strong>User: </strong>{q.text}</p>
              <div className="comments">
                {q.replies.map((r, j) => (
                  <p key={j}><strong>Reply: </strong>{r}</p>
                ))}
              </div>
              <form className="reply-form" onSubmit={(e) => { e.preventDefault(); const val = e.target.reply.value.trim(); if(val){ postReply(idx, val); e.target.reply.value=''; } }}>
                <input name="reply" type="text" placeholder="Write a reply..." required />
                <button type="submit" className="btn" style={{ background: 'var(--primary)', color: 'white' }}>Reply</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QAChat;
