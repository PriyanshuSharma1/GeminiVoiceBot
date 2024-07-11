import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const Ques = [
    "Can I book an appointment?",
    "Is the Hospital open today?",
    "What are the visiting hours?",
    "Can I bring my pet?",
  ];

  const FAQs = () => {
    const randomIndex = Math.floor(Math.random() * Ques.length);
    setValue(Ques[randomIndex]);
  };
  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Please enter a question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ history: chatHistory, message: value }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.json();
      console.log(data);

      setChatHistory((prev) => [
        ...prev,
        {
          role: "user",
          parts: value,
        },
        {
          role: "AI",
          parts: data.message,
        },
      ]);
      setValue("");
      setError(""); // Clear error on successful response
    } catch (error) {
      setError("Something went wrong. Please try again");
    }
  };

  return (
    <div className="app">
      <p>
        Let's have some conversation
        <button className="surprise" onClick={FAQs}>
          FAQs
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is New Year?"
          onChange={(e) => {
            setValue(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
        />
        {!error && <button onClick={getResponse}>Ask</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="search-results">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role} : {chatItem.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
