import React, { useState, useEffect } from "react";
import output from "../utils/sentiment";
import Chart from "chart.js/auto";
import "../styles/dashboard.scss";
import feedback from "../../../backend/array.json";

const labelColors = {
  positive: "green",
  negative: "red",
  neutral: "blue",
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);

  useEffect(() => {
    // Cleanup function to destroy previous chart instances
    return () => {
      chart1?.destroy();
      chart2?.destroy();
    };
  }, [data]); // Empty dependency array ensures this effect runs once after initial render and cleans up on component unmount

  async function output_sentiment(feedbackEmail) {
    const response = await output(feedbackEmail);
    return response;
  }
  useEffect(() => {
    async function sentiment_analysis_data() {
      try {
        let posSum = 0,
          negSum = 0,
          neuSum = 0,
          response,
          x;
        await Promise.all(
          feedback.map(async (feedbackEmail) => {
            response = await output_sentiment(feedbackEmail);
            console.log("response", response);
            const parsedResponse = JSON.parse(response);
            x = parsedResponse[0].map((item) => ({
              label: item.label,
              score: item.score,
              color: labelColors[item.label.toLowerCase()],
            }));

            if (x[0].label === "negative") {
              negSum += x[0].score;
            }
            if (x[0].label === "positive") {
              posSum += x[0].score;
            }
            if (x[0].label === "neutral") {
              neuSum += x[0].score;
            }

            if (x[1].label === "negative") {
              negSum += x[1].score;
            }
            if (x[1].label === "positive") {
              posSum += x[1].score;
            }
            if (x[1].label === "negative") {
              neuSum += x[1].score;
            }

            if (x[2].label === "negative") {
              negSum += x[2].score;
            }
            if (x[2].label === "positive") {
              posSum += x[2].score;
            }
            if (x[2].label === "negative") {
              neuSum += x[2].score;
            }
          })
        );

        posSum /= feedback.length;
        negSum /= feedback.length;
        neuSum /= feedback.length;

        console.log("----------------", posSum, negSum, neuSum);

        let newParsedResponse = [
          { label: "positive", score: posSum },
          { label: "negative", score: negSum },
          { label: "neutral", score: neuSum },
        ];

        console.log("newParsedResponse", newParsedResponse);

        const newData = newParsedResponse.map((item) => ({
          label: item.label,
          score: item.score * 100,
          color: labelColors[item.label.toLowerCase()],
        }));

        console.log("new data", newData);

        setData(newData);
      } catch (error) {
        console.error("Error in sentiment_analysis_data:", error);
      }
    }

    sentiment_analysis_data();
  }, []);

  useEffect(() => {
    console.log("THE MAIN DATA", data);
    // Destroy the existing Chart instances
    const chart12 = Chart.getChart("myChart1");
    const chart23 = Chart.getChart("myChart2");

    // Destroy the Chart instances if they exist
    if (chart12) {
      chart12.destroy();
    }
    if (chart23) {
      chart23.destroy();
    }

    const ctx1 = document.getElementById("myChart1");

    setChart1(
      new Chart(ctx1, {
        type: "bar",
        data: {
          labels: data.map((item) => item.label),
          datasets: [
            {
              label: "feedback rating",
              data: data.map((item) => item.score),
              borderWidth: 1,
              backgroundColor: data.map((item) => item.color),
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    );

    const ctx2 = document.getElementById("myChart2");

    setChart2(
      new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: data.map((item) => item.label),
          datasets: [
            {
              label: "# of Votes",
              data: data.map((item) => item.score),
              borderWidth: 1,
              backgroundColor: data.map((item) => item.color),
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    );

    return () => {
      chart1?.destroy();
      chart2?.destroy();
    };
  }, [data]); // Re-run this effect whenever data changes

  return (
    <div className="fullDiv">
      <div className="div">
        <canvas id="myChart1"></canvas>
        <canvas id="myChart2" style={{ height: "90%" }}></canvas>
      </div>
      <div className="feedback">
        <h2>Recent Feedbacks: </h2>
        <ul>
          {feedback.map((feedbackEmail) => (
            <li>{feedbackEmail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
