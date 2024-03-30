// Importing the necessary module
import { GoogleGenerativeAI } from "@google/generative-ai";

// Declaring global variables
var i = 0;
var score = 0;
var questions; // Declaring questions globally
var selectedOption;

// Function to show loading screen
const showLoadingScreen = () => {
  document.getElementById("loading-screen").classList.remove("hidden");
};

// Function to hide loading screen
const hideLoadingScreen = () => {
  document.getElementById("loading-screen").classList.add("hidden");
};

// Function to load UI elements
const loadUI = () => {
  let con = document.getElementById("container");
  con.classList.toggle("hidden");
  con.classList.add("container");
};

// Function to handle topic submission
const submitTopic = () => {
  var topic = document.getElementById("topic").value;
  getQuestions(topic);
  hideModal();
};

// Function to hide modal
const hideModal = () => {
  var modal = document.querySelector(".modal");
  modal.style.display = "none";
};

// Function to show result
const showRes = () => {
  document.getElementById("res").classList.remove("hidden");
  Array.from(document.getElementsByClassName("quiz")).forEach(
    (elem) => (elem.style.display = "none")
  );
  document.getElementById("container").classList.add("jcs-aic");

  document.getElementById("score").innerText = score;
};

// Function to highlight the correct answer
const highlightAns = () => {
  var ansInd;
  let ans = questions[i].answer;
  for (let optNo = 0; optNo < questions[i].options.length; optNo++) {
    if (questions[i].options[optNo] == ans) {
      console.log("Answer from search" + questions[i].options[optNo]);
      ansInd = optNo;
      if (ansInd == 0) {
        document.getElementById("opt1").classList.add("correct");
      } else if (ansInd == 1) {
        document.getElementById("opt2").classList.add("correct");
      } else if (ansInd == 2) {
        document.getElementById("opt3").classList.add("correct");
      } else if (ansInd == 3) {
        document.getElementById("opt4").classList.add("correct");
      }
    }
  }
};

// Function to check the selected answer
const checkAns = (e) => {
  // Remove event listeners from options
  Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
    elem.removeEventListener("click", checkAns)
  );
  selectedOption = e.target;
  // When correct option is selected
  if (selectedOption.innerText == questions[i].answer) {
    highlightAns();
    score += 1;
  }
  // When incorrect option selected
  else {
    e.target.classList.add("wrong");
    highlightAns();
  }
  document.getElementById("skipNextBtn").innerText = "Next";
};

// Function to load the current question
const loadQue = () => {
  document.getElementById("skipNextBtn").innerText = "Skip";
  Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
    elem.addEventListener("click", checkAns)
  );
  document.getElementById("queNo").innerText = i + 1;
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

// Function to load the next question
const loadNextQue = () => {
  Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
    elem.addEventListener("click", checkAns)
  );
  i++;
  loadQue(questions);
  Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
    elem.classList.remove("correct")
  );
  Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
    elem.classList.remove("wrong")
  );
};

// Function to retrieve questions from API
const getQuestions = async (topic) => {
  try {
    showLoadingScreen(); // Show loading screen before making API call

    // Create GoogleGenerativeAI instance
    const genAI = new GoogleGenerativeAI(
      "AIzaSyAL-xcWgAfO_h-z6vx-t7k0Mk1EDHvUZcA"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Set prompt for generating questions
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
      ].Make sure there are no syntax errors in the response, no missing colons, semicolons, brackets, square-brackets or anything.When mentioning title of anything in the question, use single quotation mark (') instead of double ones("). Options of the questions should be inside an array named options.In case of current affairs, make sure all the questions are up to date with current time`;

    // Generate content using prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;

    hideLoadingScreen(); // Hide loading screen after receiving API response

    let questionsString = response.text().trim();
    console.log("Raw JSON data:", questionsString);
    questions = JSON.parse(questionsString);

    loadUI();
    loadQue(questions);
  } catch (error) {
    hideLoadingScreen(); // Ensure loading screen is hidden in case of error
    alert(
      `It's not my fault. The Gemini AI by Google is causing some issues. Please reload the page.\nAlso, The error says: ${error}`
    );
  }
};

// Function to handle skipping a question
const skipQue = () => {
  highlightAns();
  document.querySelector("#skipNextBtn").innerText = "Next";
};

// Function to handle skipping or loading next question
const skipNextQue = () => {
  if (document.querySelector("#skipNextBtn").innerText == "Skip") {
    skipQue();
  } else {
    loadNextQue();
  }
};

// Event listeners for topic submission and skip/next button
document.getElementById("enter").addEventListener("click", submitTopic);
document.querySelector("#skipNextBtn").addEventListener("click", skipNextQue);
