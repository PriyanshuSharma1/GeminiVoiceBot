import { useState } from "react";
import ReactMarkdown from "react-markdown";

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
        method: "post",
        body: JSON.stringify({ history: chatHistory, message: value }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();

      setChatHistory((prev) => [
        ...prev,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);
      setValue("");
      setError("");
    } catch (error) {
      setError("Something went wrong. Please try again");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getResponse();
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
          }}
          onPress={handleKeyPress}
        />
        {!error && <button onClick={getResponse}>Ask</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="search-results">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            {chatItem.role} 
            <p className="answer">
              <ReactMarkdown>{chatItem.parts[0].text}</ReactMarkdown>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
