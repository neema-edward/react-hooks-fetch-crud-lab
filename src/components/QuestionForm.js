import React, { useState } from "react";

function QuestionForm({ setQuestions, setPage }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("answer")) {
      const index = parseInt(name.split("-")[1]);
      const newAnswers = [...formData.answers];
      newAnswers[index] = value;
      setFormData({ ...formData, answers: newAnswers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      prompt: formData.prompt,
      answers: formData.answers,
      correctIndex: parseInt(formData.correctIndex),
    };

    console.log("Submitting new question:", newQuestion); // Debug
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`POST failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((createdQuestion) => {
        console.log("Created question:", createdQuestion); // Debug
        setQuestions((prevQuestions) => [...prevQuestions, createdQuestion]);
        setFormData({
          prompt: "",
          answers: ["", "", "", ""],
          correctIndex: 0,
        });
        setPage("List"); // Switch to QuestionList to show new question
      })
      .catch((error) => console.error("Error creating question:", error));
  };

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
          />
        </label>
        {formData.answers.map((answer, index) => (
          <label key={index}>
            Answer {index + 1}:
            <input
              type="text"
              name={`answer-${index}`}
              value={answer}
              onChange={handleChange}
              required
            />
          </label>
        ))}
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {formData.answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer || `Answer ${index + 1}`}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;