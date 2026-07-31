"use client"

import { useState } from "react"
import { Calculator as CalculatorIcon, RotateCcw } from "lucide-react"
import { ActionButton } from "@/components/tools/ui"

export function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [scientificMode, setScientificMode] = useState(false)
  const [memory, setMemory] = useState(0)

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(display)
    } else if (operation) {
      const currentValue = previousValue || "0"
      const newValue = calculate(currentValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(String(newValue))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: string, secondValue: number, operation: string): number => {
    const first = parseFloat(firstValue)
    switch (operation) {
      case "+":
        return first + secondValue
      case "-":
        return first - secondValue
      case "×":
        return first * secondValue
      case "÷":
        return secondValue !== 0 ? first / secondValue : 0
      case "^":
        return Math.pow(first, secondValue)
      case "%":
        return first % secondValue
      default:
        return secondValue
    }
  }

  const calculateScientific = (func: string) => {
    const value = parseFloat(display)
    let result: number

    switch (func) {
      case "sin":
        result = Math.sin(value * Math.PI / 180)
        break
      case "cos":
        result = Math.cos(value * Math.PI / 180)
        break
      case "tan":
        result = Math.tan(value * Math.PI / 180)
        break
      case "log":
        result = Math.log10(value)
        break
      case "ln":
        result = Math.log(value)
        break
      case "sqrt":
        result = Math.sqrt(value)
        break
      case "square":
        result = value * value
        break
      case "cube":
        result = value * value * value
        break
      case "factorial":
        result = factorial(value)
        break
      case "pi":
        result = Math.PI
        break
      case "e":
        result = Math.E
        break
      default:
        return
    }

    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  const factorial = (n: number): number => {
    if (n < 0) return 0
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display))
    setWaitingForOperand(true)
  }

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display))
    setWaitingForOperand(true)
  }

  const memoryRecall = () => {
    setDisplay(String(memory))
    setWaitingForOperand(true)
  }

  const memoryClear = () => {
    setMemory(0)
  }

  const equals = () => {
    if (!operation || previousValue === null) return

    const inputValue = parseFloat(display)
    const newValue = calculate(previousValue, inputValue, operation)
    setDisplay(String(newValue))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100))
  }

  const buttons = [
    { label: "C", action: clear, className: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
    { label: "±", action: toggleSign, className: "bg-muted hover:bg-muted/80" },
    { label: "%", action: percentage, className: "bg-muted hover:bg-muted/80" },
    { label: "÷", action: () => performOperation("÷"), className: "bg-primary text-primary-foreground hover:bg-primary/90" },
    { label: "7", action: () => inputDigit("7"), className: "bg-background hover:bg-muted" },
    { label: "8", action: () => inputDigit("8"), className: "bg-background hover:bg-muted" },
    { label: "9", action: () => inputDigit("9"), className: "bg-background hover:bg-muted" },
    { label: "×", action: () => performOperation("×"), className: "bg-primary text-primary-foreground hover:bg-primary/90" },
    { label: "4", action: () => inputDigit("4"), className: "bg-background hover:bg-muted" },
    { label: "5", action: () => inputDigit("5"), className: "bg-background hover:bg-muted" },
    { label: "6", action: () => inputDigit("6"), className: "bg-background hover:bg-muted" },
    { label: "-", action: () => performOperation("-"), className: "bg-primary text-primary-foreground hover:bg-primary/90" },
    { label: "1", action: () => inputDigit("1"), className: "bg-background hover:bg-muted" },
    { label: "2", action: () => inputDigit("2"), className: "bg-background hover:bg-muted" },
    { label: "3", action: () => inputDigit("3"), className: "bg-background hover:bg-muted" },
    { label: "+", action: () => performOperation("+"), className: "bg-primary text-primary-foreground hover:bg-primary/90" },
    { label: "0", action: () => inputDigit("0"), className: "bg-background hover:bg-muted col-span-2" },
    { label: ".", action: inputDecimal, className: "bg-background hover:bg-muted" },
    { label: "=", action: equals, className: "bg-primary text-primary-foreground hover:bg-primary/90" },
  ]

  const scientificButtons = [
    { label: "sin", action: () => calculateScientific("sin"), className: "bg-muted/50 hover:bg-muted" },
    { label: "cos", action: () => calculateScientific("cos"), className: "bg-muted/50 hover:bg-muted" },
    { label: "tan", action: () => calculateScientific("tan"), className: "bg-muted/50 hover:bg-muted" },
    { label: "log", action: () => calculateScientific("log"), className: "bg-muted/50 hover:bg-muted" },
    { label: "ln", action: () => calculateScientific("ln"), className: "bg-muted/50 hover:bg-muted" },
    { label: "√", action: () => calculateScientific("sqrt"), className: "bg-muted/50 hover:bg-muted" },
    { label: "x²", action: () => calculateScientific("square"), className: "bg-muted/50 hover:bg-muted" },
    { label: "x³", action: () => calculateScientific("cube"), className: "bg-muted/50 hover:bg-muted" },
    { label: "n!", action: () => calculateScientific("factorial"), className: "bg-muted/50 hover:bg-muted" },
    { label: "π", action: () => calculateScientific("pi"), className: "bg-muted/50 hover:bg-muted" },
    { label: "e", action: () => calculateScientific("e"), className: "bg-muted/50 hover:bg-muted" },
    { label: "^", action: () => performOperation("^"), className: "bg-primary/50 text-primary-foreground hover:bg-primary/60" },
    { label: "M+", action: memoryAdd, className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    { label: "M-", action: memorySubtract, className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    { label: "MR", action: memoryRecall, className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    { label: "MC", action: memoryClear, className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
  ]

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalculatorIcon className="size-5" />
            Calculadora
          </h3>
          <button
            onClick={() => setScientificMode(!scientificMode)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {scientificMode ? "Básica" : "Científica"}
          </button>
        </div>

        <div className="mb-4 rounded-2xl border-2 border-border bg-muted/30 p-4 text-right">
          <div className="text-3xl font-mono font-bold truncate">{display}</div>
          {memory !== 0 && (
            <div className="text-sm text-muted-foreground mt-1">M: {memory}</div>
          )}
        </div>

        <div className="grid gap-2">
          {scientificMode && (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {scientificButtons.map((btn, index) => (
                <button
                  key={index}
                  onClick={btn.action}
                  className={`h-10 rounded-lg text-sm font-medium transition-colors ${btn.className}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.action}
                className={`h-12 rounded-lg text-lg font-medium transition-colors ${btn.className} ${
                  btn.label === "0" ? "col-span-2" : ""
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={clear}
          className="mt-4 inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-border bg-background text-sm font-medium transition-colors hover:bg-muted"
        >
          <RotateCcw className="size-4" />
          Reiniciar
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {scientificMode ? "Modo científico activado" : "Modo básico"}
      </p>
    </div>
  )
}
