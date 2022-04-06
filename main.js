let intervals = []
let intervalsDefault = []

let roots = []

let order = 0
let functionOrder = 0
let numbers = []

let expression = ""

let stopCriteria = 1
let precision = 0.1

function getNumbers() {
    numbers = []

    for (let i = 0; i <= order; i++) {
        numbers[i] = parseFloat(document.getElementById(String.fromCharCode(i + 65)).value)
    }
}

function getPrecision() {
    precision = parseFloat(document.getElementById("getPrecision").value)
}

function calculateIntervals() {
    intervals = []
    intervalsDefault = []

    for(let numTest = -4; numTest <= 4; numTest++) {
        let elevate = order

        let resultA = 0
        let resultB = 0
        
        let numTestSucessor = numTest + 1

        for(let i = 0; i < numbers.length; i++) {
            resultA += numbers[i]*(numTest**elevate)
            resultB += numbers[i]*(numTestSucessor**elevate)
            
            elevate--
        }

        if(resultA == 0) {
            roots.push(numTest)
        }

        if(resultA < 0 && resultB > 0) {
            intervals.push([numTest, numTestSucessor])

            if(numTest < numTestSucessor) {
                intervalsDefault.push([numTest, numTestSucessor])
            }

            if(numTest > numTestSucessor) {
                intervalsDefault.push([numTestSucessor, numTest])
            }
        }

        if(resultA > 0 && resultB < 0) {
            intervals.push([numTestSucessor, numTest])

            if(numTest < numTestSucessor) {
                intervalsDefault.push([numTest, numTestSucessor])
            }

            if(numTest > numTestSucessor) {
                intervalsDefault.push([numTestSucessor, numTest])
            }
        }
    }

    console.log(intervals)
    console.log(intervalsDefault)
}

function calculateRoots() {
    roots = []

    for(let i = 0; i < intervals.length; i++) {
        while(stopCriteria > precision) {
            let result = 0
            let elevate = order

            let average =  (intervals[i][0] + intervals[i][1]) / 2

            for(let j = 0; j < numbers.length ; j++) {
                result += numbers[j]*(average**(elevate))

                elevate--
            }

            if(result > 0) {
            intervals[i][1] = average
            }
        
            if(result < 0) {
            intervals[i][0] = average
            }
        
            stopCriteria = Math.abs(intervals[i][0] - intervals[i][1])
        }

        roots.push([(intervals[i][0] + intervals[i][1]) / 2])

        stopCriteria = 1 
    }
}

function showResults() {
    let showStrongRoots = document.getElementById("strongRoots")
    let showStrongIntervals = document.getElementById("strongIntervals")
    let showStrongPrecision = document.getElementById("strongPrecision")

    showStrongRoots.innerHTML = "Raízes"
    showStrongIntervals.innerHTML = "Intervalos"
    showStrongPrecision.innerHTML = "Erro"

    let showResultRoots = document.getElementById("resultRoots")
    let showResultIntervals = document.getElementById("resultIntervals")
    let showResultPrecision = document.getElementById("resultPrecision")

    let resultRoots = ""
    let resultIntervals = ""

    for(let i = 0; i < roots.length; i++) {
        resultRoots += `<li>Raíz ${i + 1}:  ${roots[i]}</li> <br />`
    }

    for(let i = 0; i < intervalsDefault.length; i++) {
        resultIntervals += `<li>Intervalo ${i + 1}: [${intervalsDefault[i][0]}, ${intervalsDefault[i][1]}]</li> <br />`
    }
                        
    showResultRoots.innerHTML = resultRoots
    showResultIntervals.innerHTML = resultIntervals
    showResultPrecision.innerHTML = `<li>Erro menor que ${precision}</li>`
}

function calculateAll() {
    getNumbers()
    getPrecision()
    calculateIntervals()
    calculateRoots()
    showResults()
    drawFunction()
}

function addInputs(){
    order = 0

    order = document.getElementById("getOrder").value;
    functionOrder = order
    let numInputContainer = document.getElementById("numInputContainer");

    while (numInputContainer.hasChildNodes()) {
        numInputContainer.removeChild(numInputContainer.lastChild);
    }

    for (let i = 0; i <= order; i++) {
        let letter = String.fromCharCode(i + 65)

        const divElement = document.createElement("div")

        const labelElement = document.createElement("label")
        
        divElement.appendChild(labelElement)
        
        labelElement.innerHTML = "Número " + letter

        let numInput = document.createElement("input");

        numInput.type = "number";
        numInput.name = "number" + letter;
        numInput.id = letter

        divElement.appendChild(numInput);
        numInputContainer.appendChild(divElement)

    }
}

function drawFunction() {
    for(let i = 0; i < numbers.length - 1; i++) {
        if(numbers[i + 1] >= 0) {
             expression += `${numbers[i]}*x^${functionOrder} +`
        }

        if(numbers[i + 1] < 0) {
            expression += `${numbers[i]}*x^${functionOrder}`
        }

        functionOrder--
    }

    expression += `${numbers[numbers.length - 1]}`

    let contentsBounds = document.body.getBoundingClientRect();
    let width = 800;
    let height = 500;
    let ratio = contentsBounds.width / width;
    width *= ratio;
    height *= ratio;
    
    functionPlot({
      target: "#root",
      disableZoom: false,
      width: 800,
      height: 600,
      yAxis: { domain: [-10, 10] },
      grid: true,
      data: [
        {
          fn: expression,
        }
      ]
    });

    expression = ""
}

document.getElementById("generateInputs").addEventListener('click', addInputs)
document.getElementById("calculateAll").addEventListener('click', calculateAll)