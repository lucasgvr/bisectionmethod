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

    for(let i = -6; i < 6; i++) {
        let elevate = order

        let numA = 0
        let numB = 0

        let k = i + 1

        while(elevate >= 1) {
            for(let j = 0; j < numbers.length ; j++) {
                numA += numbers[j]*(i**(elevate))
                numB += numbers[j]*(k**(elevate))

                if(numA < 0 && numB > 0) {
                    intervals.push([i, k])
            
                    if (i < j) {
                        intervalsDefault.push([i, k])
                    }
            
                    if (i > j) {
                        intervalsDefault.push([j, k])
                    }
                }
            
                if(numA > 0 && numB < 0) {
                    intervals.push([k, i])
            
                    if (i < j) {
                        intervalsDefault.push([i, k])
                    }
            
                    if (i > j) {
                        intervalsDefault.push([j, k])
                    }
                }

                elevate--
            }
        }
    }
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
}

document.getElementById("generateInputs").addEventListener('click', addInputs)
document.getElementById("calculateAll").addEventListener('click', calculateAll)