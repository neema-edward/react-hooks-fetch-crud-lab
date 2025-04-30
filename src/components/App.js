// src/App.js
import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    console.log("Fetching questions"); // Debug
    fetch("http://localhost:4000/questions")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Fetch failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched questions:", data); // Debug
        setQuestions(data);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm setQuestions={setQuestions} setPage={setPage} />
      ) : (
        <QuestionList questions={questions} setQuestions={setQuestions} />
      )}
    </main>
  );
}

export default App;