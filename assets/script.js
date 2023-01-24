
//----DOM Variables----
let StartPage = document.getElementById("start")
let startbutton = document.getElementById("start-btn")
let end = document.getElementById("end")
let timeEl = document.querySelector(".time")
let InitalInput = document.querySelector("#Inital")
let SaveButton = document.querySelector("#Save")
let ScoreDisplay = document.querySelector("#score")
let scoreboardSection = document.querySelector('#score-board')
let scoreboardDisplay = document.querySelector('#high-scores')
let answerMessageDispay = document.querySelector("#answerMessage")
let GoBackButton = document.querySelector("#Go-Back")

//----Question List----
let questionlist = ["q1", "q2", "q3", "q4", "q5"]
let questionNUMBER = 0

//----Que First Question----
let question = document.getElementById(questionlist[questionNUMBER])

//----Set Time----
let secondsLeft = 60

//----Initial Functions (Load Scoreboard)----
function init() {
    scoreboard()
}

//----Start: Que First Question & Begin Timer----
function start() {
    setTime()
    StartPage.style.display = "none"
    question.style.display = "block"
}

//----Move on to Next Question----
function next() {
    question.style.display = "none"
    questionNUMBER++;
    if (questionNUMBER < questionlist.length) {
        question = document.getElementById(questionlist[questionNUMBER])
        question.style.display = "block"
        //If no more questions remain, quiz is over
    } else {
        end.style.display = "block"
        timeEl.style.display = "none"
    }
}

//----Set Time----
function setTime() {
    // Sets interval in variable
    var timerInterval = setInterval(function () {
        secondsLeft--;
        timeEl.textContent = secondsLeft + " seconds left";

        if (secondsLeft <= 0) {
            // Stops execution of action at set interval
            clearInterval(timerInterval);
            // If time is less than or equal to 0, quiz is over
            question.style.display = "none"
            end.style.display = "block"
            timeEl.style.display = "none"
        } else if (questionNUMBER >= questionlist.length) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

//----Save High Score----
SaveButton.addEventListener("click", function (event) {
    event.preventDefault();

    //Retrieve Scores from Local Storage
    Scores = localStorage.getItem("Scores")

    //Check if input is at at least 2 Characters
    if (InitalInput.value != "" && InitalInput.value.length < 3) {
        //If nothing exist in local storage create JSON and add data
        if (Scores == null) {
            var Scores = {
                Inital: [InitalInput.value],
                Score: [secondsLeft]
            };
            localStorage.setItem("Scores", JSON.stringify(Scores));
            reset()
        //If JSON exists in local storage, add data
        } else {
            Scores = JSON.parse(Scores)
            Scores.Inital.push(InitalInput.value)
            Scores.Score.push(secondsLeft)
            localStorage.setItem("Scores", JSON.stringify(Scores))
            reset()
        }
    //Inform the user to enter a valid intial
    } else {
        alert("Please enter a valid intial (Max 2 Characters)")
    }
});

//----Restart Quiz----
function reset() {
    location.reload()
}

//----Display Scoreboard on the start page----
function scoreboard() {
    Scores = localStorage.getItem("Scores")
    //If recent scores exist in local storage, proceed
    if (Scores != null) {

        //Display Scoreboard Section
        scoreboardSection.style.display = "block"
        //Parse JSON
        Scores = JSON.parse(Scores)
        SortScores = Scores.Score
        SortIntials = Scores.Inital
        //Sort Scorese from High to Low and Match with Intials
        let zipped = SortScores.map((e, i) => [e, SortIntials[i]],);
        zipped.sort((SortScores, SortIntials) =>  SortIntials[0] - SortScores[0]);
        SortScores = zipped.map(e => e[0]);
        SortIntials = zipped.map(e => e[1]);
        //List all scores
        for (i = 0; i < SortScores.length; i++) {
            list = document.createElement("li")
            list.textContent = SortIntials[i] + ": " + SortScores[i]
            scoreboardDisplay.append(list)
        }
    }
}

//----Answer Message Displayed in Footer----
function answerMessage(element) {
    if (element.getAttribute("id") != "start-btn") {
        answerMessageDispay.textContent = element.getAttribute("q-answer")
    }
}

//----Start Quiz when Start Button is clicked----
startbutton.addEventListener("click", start)

//----Reset Game when Go Back Button is clicked----
GoBackButton.addEventListener("click", reset)

//----Retrieve DOM of the Answer Clicked on----
document.addEventListener("click", function (event) {
    let element = event.target
    //Move to next question if element clicked on is an option
    if (element.matches(".option")) {
        next()
    }
    //Subtract time id answer is wrong
    if (element.getAttribute("q-answer") == "Incorrect") {
        secondsLeft = secondsLeft - 5
    }
    ScoreDisplay.textContent = "Score: " + secondsLeft
    answerMessage(element)
})

init()




