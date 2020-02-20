"use strict";

function input(value) {
    if (typeof value != "string") return;

    var display = document.getElementById("calc-display");
    if (display == null || display == undefined || !(display instanceof HTMLInputElement)) return;
    
    var current = display.value;

    // Disallow entry of multiple decimal points in single term
    var last = current.lastIndexOf(".");
    if (value == "." && last != -1 &&
        current.substr(last).match("[÷×−+]") == null) {
        return;
    }

    // If operator is entered
    if (value == "÷" || value == "×" || value == "−" || value == "+") {
        var char = current.substr(-1);

        // Disallow operator immediately after decimal point
        if (char == ".") return;

        // Replace last operator if another inserted immediately after
        if (char == "÷" || char == "×" || char == "−" || char == "+") {
            display.value = current.substr(0, current.length - 1) + value;
            return;
        }
    }

    // Append input
    display.value += value;
}

function backspace() {
    var display = document.getElementById("calc-display");
    if (display == null || display == undefined || !(display instanceof HTMLInputElement)) return;
    
    var current = display.value;
    
    // Don't backspace when empty
    if (current == "") return;
    
    // Take off last character of input
    display.value = current.substr(0, current.length - 1);
}

function calculate() {
    var display = document.getElementById("calc-display");
    if (display == null || display == undefined || !(display instanceof HTMLInputElement)) return;
    var current = display.value;

    // Verify input is valid expression
    var matches = current.match("^[0-9]*\.[0-9]*([÷×−+][0-9]*\.[0-9]*)*$");
    if (matches == null || matches[0] != current) {
        console.warn("Expression did not match regex");
        console.warn(matches);
        return;
    }

    // Replace special characters for operators
    current = current.replace("÷", "/").replace("×", "*").replace("−", "-");

    // Evaluate expression and display value
    display.value = evaluate(current);
}

function evaluate(expression) {
    if (typeof expression != "string") return NaN;
    
    // For each operator, in order of decreasing precedence
    var operators = ["*", "/", "+", "-"];
    for (var i = 0; i < 4; i++) {
        var operator = operators[i];
        var found = false,
            lhs = "",
            rhs = "";

        // Scan across each character in expression
        var j = -1;
        while (++j < expression.length) {
            var char = expression.charAt(j);

            // If current operator has been found
            if (found) {
                // If current character is a number
                if (char != "/" && char != "*" && char != "-" && char != "+") {
                    // Add character to right hand side of current operation
                    // console.log("F");
                    rhs += char;
                    if (j < expression.length - 1) continue;
                }

                // Character is an operator
                var l = parseFloat(lhs), r = parseFloat(rhs);
                var result = NaN;
                
                switch (operator) {
                    case "*":
                        result = l * r;
                        break;
                    case "/":
                        result = l / r;
                        break;
                    case "+":
                        result = l + r;
                        break;
                    case "-":
                        result = l - r;
                        break;
                }

                result = result.toString();
                var replace = lhs + operator + rhs;

                expression = expression.replace(replace, result);
                lhs = result;
                rhs = "";
                j += result.length - replace.length;

                continue;
            }
            // Current operator hasn't been found yet

            // If current character is a number
            if (char != "/" && char != "*" && char != "-" && char != "+") {
                // Add character to left hand side of current operation
                lhs += char;
                continue;
            }
            
            // If character is an operator, but not the right one
            if (char != operator) {
                // Reset variables and keep scanning
                lhs = "";
                continue;
            }
            
            // Character is the current operator
            found = true;
        }
    }
    return expression;
}