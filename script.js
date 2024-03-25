import { GoogleGenerativeAI } from "@google/generative-ai";

var i = 0;
var score = 0;
var questions; // Declaring questions globally
var selectedOption;

const loadUI = () => {
  let con = document.getElementById("container");
  con.classList.toggle("hidden");
  con.classList.add("container");
};

const submitTopic = () => {
  var topic = document.getElementById("topic").value;
  getQuestions(topic);
  hideModal();
};

const hideModal = () => {
  var modal = document.querySelector(".modal");
  modal.style.display = "none";
};

const showRes = () => {
  alert(score);
};

const checkAns = (e) => {
  selectedOption = e.target;
  if (selectedOption.innerText == questions[i].answer) {
    score += 1;
    selectedOption.classList.add("correct");
  }
};

const loadQue = () => {
  // Removed questions parameter
  if (i < questions.length) {
    document.getElementById("question").innerText = questions[i].question;
    document.getElementById("opt1").innerText = questions[i].options[0];
    document.getElementById("opt2").innerText = questions[i].options[1];
    document.getElementById("opt3").innerText = questions[i].options[2];
    document.getElementById("opt4").innerText = questions[i].options[3];
  } else if (i == questions.length) {
    showRes();
  }
};

const loadNextQue = () => {
  i++;
  loadQue(questions);
  selectedOption.classList.toggle("correct");
};

const getQuestions = async (topic) => {
  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyAL-xcWgAfO_h-z6vx-t7k0Mk1EDHvUZcA"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 20 questions on the topic ${topic} for preparation of NDA exam with medium difficulty in the format of objects with the following structure:

    [
      {
        "question": "Question 1 here",
        "options": ["option 1", "option 2", "option 3", "option 4"],
        "answer": "answer here"
      },
      {
        "question": "Question 2 here",
        "options": ["option 1", "option 2", "option 3", "option 4"],
        "answer": "answer here"
      },
      // Add more data here
    ].Make sure there are no syntax errors in the response, no missing colons, semicolons, brackets, square-brackets or anything.When mentioning title of anything in the question, use single quotation mark (') instead of double ones("). Options of the questions should be inside an array named options`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let questionsString = response.text().trim();
    console.log("Raw JSON data:", questionsString);
    questions = JSON.parse(questionsString); // Assigning value to global questions variable

    loadUI();
    loadQue(questions);
  } catch (error) {
    console.error(error);
  }
};

document.getElementById("enter").addEventListener("click", submitTopic);
document.querySelector(".next").addEventListener("click", loadNextQue);
Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
  elem.addEventListener("click", checkAns)
);
