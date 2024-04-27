// todo: graph die hit chance rather that at least on of 3 hit chance
// -- data generation -------------------------------------------------------->
let data = []
let data2 = []
let labels = []
for (let i = 0; i < 40; i++) {
    let pvsGreater = i - 30;
    data.push(evaluateFraction(f2(pvsGreater)) * 100)
    data2.push(evaluateFraction(dsc2(pvsGreater)) * 100)
    labels.push(pvsGreater)
}

// -- calculation ------------------------------------------------------------>
function g() {
}


function f2(pvsGreater) {
    let dsc = dsc2(pvsGreater);
    let dieFailureChance = complementFraction(dsc)

    let penetrationFailureChance = multiplyFraction(multiplyFraction(dieFailureChance, dieFailureChance), dieFailureChance)
    return complementFraction(penetrationFailureChance)
}

// minReqDieRoll: the lowest number you can roll on teh d10 in order to penetrate
// num8sReq: the number of 10s you must roll on the d10 in order for minReqDieRoll to be above 0
function dsc2(pvsGreater) {
    let minimumPenetratingDieRoll = 3 - pvsGreater;

    // if we are gaurenteed to roll the number required, the chance is 100%
    if (minimumPenetratingDieRoll <= 1) {
        return { numerator: 1, denominator: 1 };
    }

    // calcule how many eights are neded to be rolled in order to get a penetration 
    let numEightsRequiredToPenetrate = Math.floor((minimumPenetratingDieRoll - 2) / 8);
    minimumPenetratingDieRoll -= numEightsRequiredToPenetrate * (10 - 2);
    let baseMultiplier = { numerator: 1, denominator: Math.pow(10, numEightsRequiredToPenetrate) }
    
    return multiplyFraction({ numerator: 11 - minimumPenetratingDieRoll, denominator: 10 }, baseMultiplier)
}

// -- fraction helpers ------------------------------------------------------->
function invertFraction(a) {
    console.assert(validateFraction(a))
    return {
        numerator: a.denominator,
        denominator: a.numerator
    };
}

function complementFraction(a) {
    console.assert(validateFraction(a))
    return {
        numerator: a.denominator - a.numerator,
        denominator: a.denominator
    };
}

function multiplyFraction(a, b) {
    console.assert(validateFraction(a))
    console.assert(validateFraction(b))
    return {
        numerator: a.numerator * b.numerator,
        denominator: a.denominator * b.denominator
    };
}

function evaluateFraction(a) {
    console.assert(validateFraction(a))
    console.assert(a.numerator && a.denominator)
    return a.numerator / a.denominator;
}

function validateFraction(a) {
    return (
        'numerator' in a &&
        'denominator' in a &&
        Number.isInteger(a.numerator) &&
        Number.isInteger(a.denominator)
    )
}

// -- graphs ----------------------------------------------------------------->
let ctx1 = document.getElementById('canvas1')

console.log(data2)

new Chart(ctx1, {
    type: 'line',
    data: {
        labels,
        datasets: [
            {
                label: 'Chance for triplet penetrate',
                data: data,
                borderWidth: 1
            },
            {
                label: 'Chance for singlet to penetrate',
                data: data2,
                borderWidth: 2
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        animation: false
    }
});

