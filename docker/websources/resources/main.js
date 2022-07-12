const awsEndpoint = "https://6j46umlmq6.execute-api.us-east-1.amazonaws.com/dev"

const CHOICES = ["paper", "scissor", "stone"]

var emailForm = document.getElementById('emailForm')
const player = document.getElementById("player_email")
var resultsForm = document.getElementById('resultsForm')
var playerChoices = document.getElementsByName("playerChoices")
var oppenent = document.getElementById("oppenent")
var paperChoice = document.getElementById("paperChoice")
var paperBtn = document.getElementById("paper")
var scissorChoice = document.getElementById("scissorChoice")
var scissorBtn = document.getElementById("scissor")
var stoneChoice = document.getElementById("stoneChoice")
var stoneBtn = document.getElementById("stone")
const choicesArray = [paperChoice, scissorChoice, stoneChoice]
const choicesBtnsArray = [paperBtn, scissorBtn, stoneBtn]
var resultContent = document.getElementById("result")

// player: paper, opponent: stone -> result: win
function judgeResult(player, opponent) {
    if (player === "paper") {
        if (opponent == "paper") {
            return "draw"
        } else if (opponent == "scissor") {
            return "lose"
        } else {
            return "win"
        }
    } else if (player === "scissor") {
        if (opponent == "paper") {
            return "win"
        } else if (opponent == "scissor") {
            return "draw"
        } else {
            return "lose"
        }
    } else if (player === "stone") {
        if (opponent == "stone") {
            return "draw"
        } else if (opponent == "scissor") {
            return "win"
        } else {
            return "lose"
        }
    }
}

// click buttons to play
for (let i = 0; i < choicesArray.length; i++) {
    choicesArray[i].addEventListener("submit", function(e) {
        e.preventDefault()
        const playerChoice = choicesBtnsArray[i].value
        const opponentChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)]
        oppenent.innerHTML = "<h2>" + opponentChoice + "</h2>"
        const result = judgeResult(playerChoice, opponentChoice)
        resultContent.innerHTML = "<h2>" + result + "</h2>"
        saveResult(player.value, playerChoice, opponentChoice, result)
    })
}

// email: test@gmail.com -> password: XXXXXX
emailForm.addEventListener('submit', function(e) {

    e.preventDefault()

    alert("Password has been emailed")

    fetch(awsEndpoint + "/generate",{
        method: 'POST',
        body: JSON.stringify({
            "email": player.value,
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    .then(function(response){
        return response.json()
    })
})

// save result to dynamoDB table
function saveResult(email, player, opponent, result) {
    fetch(awsEndpoint + "/choose",{
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "player": player,
            "opponent": opponent,
            "result": result
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    .then(function(response){
        return response.json()
    })
}

// email results to player
resultsForm.addEventListener('submit', function(e) {
    const password = document.getElementById("password")

    e.preventDefault()

    alert("Please check your email!")

    fetch(awsEndpoint + "/query",{
        method: 'POST',
        body: JSON.stringify({
            "email": player.value,
            "password": password.value
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    .then(function(response){
        return response.json()
    })
})