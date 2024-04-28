// -- fraction helpers ------------------------------------------------------->
class Fraction {
    constructor(numerator, denominator) {
        this.numerator = numerator;
        this.denominator = denominator;
    }

    invert() {
        [this.numerator, this.denominator] = [this.denominator, this.numerator];
        return this;
    }

    complement() {
        this.numerator = this.denominator - this.numerator;
        return this;
    }

    multiply(a) {
        this.numerator *= a.numerator;
        this.denominator *= a.denominator;
        return this;
    }

    evaluate() {
        return this.numerator / this.denominator;
    }
}


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

