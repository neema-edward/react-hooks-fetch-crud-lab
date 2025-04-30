// src/QuestionItem.js
import React from "react";

function QuestionItem({ question, setQuestions }) {
  const { id, prompt, answers, correctIndex } = question;

  const handleDelete = () => {
    console.log("Attempting to delete question with id:", id); // Debug
    if (!id) {
      console.error("Question id is undefined or null");
      return;
    }
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`DELETE failed with status: ${response.status}`);
        }
        console.log("Question deleted from server:", id); // Debug
        setQuestions((prevQuestions) => {
          console.log("Filtering questions:", prevQuestions); // Debug
          return prevQuestions.filter((q) => q.id !== id);
        });
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`PATCH failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((updatedQuestion) => {
        console.log("Updated question:", updatedQuestion); // Debug
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