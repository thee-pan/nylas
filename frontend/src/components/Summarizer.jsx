import React, { useState } from "react";
import "dotenv";

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/knkarthick/MEETING_SUMMARY",
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AI_API_KEY}`,
        "Content-Type": "application/json", // Set content type to JSON
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

function SummarizerApp({ selectedEmailContent }) {
  const [summaryText, setSummaryText] = useState("");

  const handleButtonClick = () => {
    if (summaryText) {
      setSummaryText("");
    } else {
      query({
        inputs: selectedEmailContent,
      })
        .then((response) => {
          setSummaryText(response[0].summary_text);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div>
      <button className="generate-button" onClick={handleButtonClick}>
        Summarize
      </button>
      {summaryText && (
        <div className="sum-window">
          <p>{summaryText}</p>
        </div>
      )}
    </div>
  );
}

export default SummarizerApp;
