

const app = {}

app.rolls = {
    dice: [],
    successes: 0,
    success: 1,
    rerollSuccess: 1,
}

app.diceRollSim = () => {
    return Math.floor(Math.random() * 6) + 1
}

app.countSuccesses = (success) => {
    
    app.rolls.successes = app.rolls.dice.reduce( (acc, current) => {
        if(current.roll >= success || current.success) {
            current.success = true
            return acc + 1
        } 
        current.success = false
        return acc
    }, 0)
    
}

app.ifSuccess = (value, threshold) => {
    if (value >= threshold) {
        return true
    }
    return false
}

app.showSuccessCount = () => {
    const successElement = document.getElementsByClassName("successes")[0]
    successElement.innerHTML = ""

    const showSuccesses = document.createElement("p")
    showSuccesses.innerText = `Successful rolls: ${app.rolls.successes}`
    successElement.appendChild(showSuccesses)
}

app.showResults = () => {
    
    app.showSuccessCount()

    const dice = document.getElementsByClassName("diceArea")[0]
    dice.innerHTML = ""
    app.rolls.dice.forEach((die, i)=>{
        const showRoll = document.createElement("p")
        showRoll.innerText = `${die.roll}`
        showRoll.classList.add("dice")
        if(die.success) {
            showRoll.classList.add("successRoll")
        } else {
            showRoll.classList.add("failRoll")
        }
        showRoll.addEventListener("click", () => app.rerollClick(i))
        dice.appendChild(showRoll)
    })
}

app.rerollClick = (index) => {
    const rerollSuccess = document.getElementById("rerollSuccess").value
    const newRoll = app.diceRollSim()
    const isSuccess = app.ifSuccess(newRoll, rerollSuccess)

    console.log({newRoll, rerollSuccess, isSuccess})
    

    app.rolls.dice[index] = {
        roll: newRoll,
        success: isSuccess
    }
    console.log(app.rolls.dice)

    const clickedDice = document.getElementsByClassName("dice")[index]
    clickedDice.innerText = newRoll
    clickedDice.classList.remove("successRoll")
    clickedDice.classList.remove("failRoll")

    if(isSuccess) {
        clickedDice.classList.add("successRoll")
    } else {
        clickedDice.classList.add("failRoll")
    }

    
    // app.countSuccesses(rerollSuccess)
    // app.showSuccessCount() 
    // app.showResults()
}

app.rollManyDice = (numOfDice) => {
    const validNumOfDice = numOfDice >= 1 && numOfDice <= 60
    if (validNumOfDice) {
        for (let i = 0; i < numOfDice; i++) {
            const roll = app.diceRollSim()
            app.rolls.dice.push({
                roll: roll,
                success: null,
             })
        }
        app.countSuccesses(app.rolls.success)
        app.showResults(app.rolls.success)
        app.showRerollOptions()
    }

}

app.rollDiceButtonClick = (event) => {
    event.preventDefault()
    // document.getElementsByClassName("diceArea")[0].innerHTML = ""
    // document.getElementsByClassName("successes")[0].innerHTML = ""

    const numOfDice = document.getElementById("numOfDice").value
    const success = document.getElementById("successfulRoll").value

    app.rolls = {
        dice: [],
        successes: 0,
        success: success
    }

    app.rollManyDice(numOfDice)

}

app.createOptionsElements = (max) => {
    const rerollSuccessSelect = document.createElement("select")
    rerollSuccessSelect.classList.add("rerollSuccess")
    rerollSuccessSelect.id = "rerollSuccess"
    for(let i = 2; i<=max; i++) {
        const option = document.createElement("option")
        option.value = i
        option.innerHTML = i
        rerollSuccessSelect.append(option)
    }
    const rerollLabel = document.createElement("label")
    rerollLabel.for = "rerollSuccess"
    rerollLabel.innerText = "Minimum reroll to be success"
    document.getElementById("rerollOption").appendChild(rerollLabel)
    document.getElementById("rerollOption").appendChild(rerollSuccessSelect)
}



app.showRerollOptions = () => {
    document.getElementById("reroll").innerHTML = ""
    const rerollForm = document.createElement("form")

    const rerollButton = document.createElement("button")
    rerollButton.innerHTML = "Reroll failed rolls"
    rerollForm.appendChild(rerollButton)

    document.getElementById('rerollOption').innerHTML = ""
    app.createOptionsElements(6)

    document.getElementById("reroll").appendChild(rerollForm)
    
}

app.reroll = (event) => {
    event.preventDefault()
    
    const rerollSuccess = document.getElementById("rerollSuccess").value
    app.rolls.rerollSuccess = rerollSuccess
    const rerolledDice = app.rolls.dice.map((die) => {
        if (!die.success) {
            return {
                roll: app.diceRollSim(),
                success: false
            }
        }
        return die
    })
    app.rolls.dice = rerolledDice
    app.countSuccesses(rerollSuccess)
    app.showResults(app.rolls.rerollSuccess)
}


// document ready
(function(){
    
    document.getElementById("rollDiceButton").addEventListener("click", app.rollDiceButtonClick)
    document.getElementById("reroll").addEventListener("click", app.reroll)
})()    
