// src/QuestionItem.js
import React from "react";

function QuestionItem({ question, setQuestions }) {
  const { id, prompt, answers, correctIndex } = question;

  const handleDelete = () => {
    console.log("Deleting question with id:", id); // Debug
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Question deleted from server:", id); // Debug
          setQuestions((prevQuestions) =>
            prevQuestions.filter((q) => q.id !== id)
          );
        } else {
          console.error("Failed to delete question:", response.status);
        }
      })
      .catch((error) => console.error("Error deleting question:", error));
  };

  const handleCorrectIndexChange = (e) => {
    const newCorrectIndex = parseInt(e.target.value);
    console.log("Updating correctIndex for id:", id, "to:", newCorrectIndex); // Debug
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((response) => response.json())
      .then((updatedQuestion) => {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === id ? { ...q, correctIndex: newCorrectIndex } : q
          )
        );
      })
      .catch((error) => console.error("Error updating question:", error));
  };

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select value={correctIndex} onChange={handleCorrectIndexChange}>
          {options}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;