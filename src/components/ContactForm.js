import React, {useState, createRef} from 'react'

export const ContactForm = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [postingError, setPostingError] = useState(false);
  const [postingSuccess, setPostingSuccess] = useState(false);
  const emailEl = createRef();
  const messageEl = createRef();

  const postMail = async () => {
    const email = emailEl.current.value;
    const message = messageEl.current.value;

    setIsPosting(true);

    try {
      const res = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message,
        }),
      });

      if (!res.ok) {
        setPostingError(true);
      } else {
        setPostingSuccess(true);
      }
    } catch (e) {
      setPostingError(true);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    postMail();
  };

  return (
    <>
      {postingSuccess ? (
        <p>Message sent. Thank you!</p>
      ) : (
        <form method="post" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Contact form</legend>
            <label htmlFor="email">Your email address*</label>
            <input
              type="email"
              aria-label="Your email address"
              name="email"
              id="email"
              placeholder="Email address"
              ref={emailEl}
              disabled={isPosting ? 'disabled' : undefined}
              required
            />
            <label htmlFor="message">Your message*</label>
            <textarea
              ref={messageEl}
              id="message"
              aria-label="Your message"
              placeholder="Message"
              disabled={isPosting ? 'disabled' : undefined}
              rows="5"
              required
            />
            <button disabled={isPosting ? 'disabled' : undefined}>Send</button>
          </fieldset>
        </form>
      )}
      {postingError ? <p>Something went wrong, please try again (later).</p> : null}
    </>
  );
};