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
  document.getElementById("res").classList.remove("hidden");
  /* Array.from(document.getElementsByClassName("quiz")).forEach((elem) =>
    elem.classList.add("hidden")
  ); */
  Array.from(document.getElementsByClassName("quiz")).forEach(
    (elem) => (elem.style.display = "none")
  );
  document.getElementById("container").classList.add("jcs-aic");

  document.getElementById("score").innerText = score;
};

const checkAns = (e) => {
  selectedOption = e.target;
  //when correct option is selected
  if (selectedOption.innerText == questions[i].answer) {
    score += 1;
    selectedOption.classList.add("correct");
  }
  //incorrect option selected
  else {
    e.target.classList.add("wrong");
    var ansInd;
    let ans = questions[i].answer;
    console.log(`ans from ans ${ans}`);
    console.log(questions[i].options);
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

    console.log(`ansInd : ${ansInd}`);
  }
};

const loadQue = () => {
  if (i < questions.length) {
    /* //temporarily commenting and adding show res here
    showRes(); */
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
  Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
    elem.classList.remove("correct")
  );
  Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
    elem.classList.remove("wrong")
  );
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
    ].Make sure there are no syntax errors in the response, no missing colons, semicolons, brackets, square-brackets or anything.When mentioning title of anything in the question, use single quotation mark (') instead of double ones("). Options of the questions should be inside an array named options.In case of current affairs, make sure all the questions are up to date with current time`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let questionsString = response.text().trim();
    console.log("Raw JSON data:", questionsString);
    questions = JSON.parse(questionsString);

    loadUI();
    loadQue(questions);
  } catch (error) {
    alert(error);
  }
};

document.getElementById("enter").addEventListener("click", submitTopic);
document.querySelector(".next").addEventListener("click", loadNextQue);
Array.from(document.querySelectorAll(".optBtns")).forEach((elem) =>
  elem.addEventListener("click", checkAns)
);
