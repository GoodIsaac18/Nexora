"use client"

import { useState } from "react"
import { DollarSign, Users, Percent, Calculator, Info, CheckCircle2, ArrowRight } from "lucide-react"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState("")
  const [tipPercentage, setTipPercentage] = useState<number | "custom">(15)
  const [customTip, setCustomTip] = useState("")
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [discount, setDiscount] = useState("")
  const [step, setStep] = useState(1)

  const bill = parseFloat(billAmount) || 0
  const discountAmount = parseFloat(discount) || 0
  const finalBill = Math.max(0, bill - discountAmount)
  const tipPercent = tipPercentage === "custom" ? parseFloat(customTip) || 0 : tipPercentage
  const tipAmount = finalBill * (tipPercent / 100)
  const totalAmount = finalBill + tipAmount
  const amountPerPerson = numberOfPeople > 0 ? totalAmount / numberOfPeople : 0
  const tipPerPerson = numberOfPeople > 0 ? tipAmount / numberOfPeople : 0
  const billPerPerson = numberOfPeople > 0 ? finalBill / numberOfPeople : 0

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const reset = () => {
    setBillAmount("")
    setTipPercentage(15)
    setCustomTip("")
    setNumberOfPeople(1)
    setDiscount("")
    setStep(1)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-2 sm:mb-4 px-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`flex size-6 sm:size-8 items-center justify-center rounded-full text-xs sm:text-sm font-medium ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <CheckCircle2 className="size-3 sm:size-4" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 ${step > s ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Bill Amount */}
      {step === 1 && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex size-6 sm:size-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="size-3 sm:size-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Paso 1: Ingresa el monto de la cuenta</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Escribe el total de tu cuenta antes de la propina
              </p>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <FieldLabel htmlFor="bill-amount">Monto de la cuenta</FieldLabel>
            <div className="relative mt-2">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">$</span>
              <input
                id="bill-amount"
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-background pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 sm:p-4 rounded-lg bg-muted/50">
            <Info className="size-3 sm:size-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Este es el monto total de tu cuenta antes de aplicar propinas o descuentos.
            </p>
          </div>

          <ActionButton onClick={nextStep} disabled={!billAmount} className="w-full mt-4 sm:mt-6 h-10 sm:h-auto">
            Continuar <ArrowRight className="size-3 sm:size-4 ml-2" />
          </ActionButton>
        </div>
      )}

      {/* Step 2: Tip Percentage */}
      {step === 2 && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex size-6 sm:size-8 items-center justify-center rounded-lg bg-primary/10">
              <Percent className="size-3 sm:size-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Paso 2: Selecciona el porcentaje de propina</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Elige el porcentaje que deseas dejar como propina
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {[10, 15, 20].map((percent) => (
              <button
                key={percent}
                onClick={() => setTipPercentage(percent)}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  tipPercentage === percent
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold">{percent}%</span>
              </button>
            ))}
            <button
              onClick={() => setTipPercentage("custom")}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                tipPercentage === "custom"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-xs sm:text-sm font-medium">Personalizado</span>
            </button>
          </div>

          {tipPercentage === "custom" && (
            <div className="mb-4 sm:mb-6">
              <FieldLabel htmlFor="custom-tip">Porcentaje personalizado</FieldLabel>
              <div className="relative mt-2">
                <input
                  id="custom-tip"
                  type="number"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-background pl-3 sm:pl-4 pr-7 sm:pr-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  step="1"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">%</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 sm:p-4 rounded-lg bg-muted/50">
            <Info className="size-3 sm:size-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              10% para servicio básico, 15% para buen servicio, 20% para servicio excelente.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
            <ActionButton onClick={prevStep} variant="outline" className="flex-1 h-10 sm:h-auto">
              Atrás
            </ActionButton>
            <ActionButton onClick={nextStep} disabled={tipPercentage === "custom" && !customTip} className="flex-1 h-10 sm:h-auto">
              Continuar <ArrowRight className="size-3 sm:size-4 ml-2" />
            </ActionButton>
          </div>
        </div>
      )}

      {/* Step 3: Number of People */}
      {step === 3 && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex size-6 sm:size-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-3 sm:size-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Paso 3: ¿Cuántas personas van a pagar?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Divide la cuenta entre varias personas
              </p>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <FieldLabel htmlFor="people">Número de personas</FieldLabel>
            <div className="flex items-center gap-3 sm:gap-4 mt-2">
              <button
                onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                className="flex size-8 sm:size-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
              >
                -
              </button>
              <input
                id="people"
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 sm:w-20 rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-center text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
              <button
                onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                className="flex size-8 sm:size-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 sm:p-4 rounded-lg bg-muted/50">
            <Info className="size-3 sm:size-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Si pagas solo tú, deja el valor en 1. La cuenta se dividirá equitativamente.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
            <ActionButton onClick={prevStep} variant="outline" className="flex-1 h-10 sm:h-auto">
              Atrás
            </ActionButton>
            <ActionButton onClick={nextStep} className="flex-1 h-10 sm:h-auto">
              Continuar <ArrowRight className="size-3 sm:size-4 ml-2" />
            </ActionButton>
          </div>
        </div>
      )}

      {/* Step 4: Discount (Optional) */}
      {step === 4 && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex size-6 sm:size-8 items-center justify-center rounded-lg bg-primary/10">
              <Calculator className="size-3 sm:size-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Paso 4: ¿Tienes algún descuento? (Opcional)</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Si tienes cupón o descuento, ingrésalo aquí
              </p>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <FieldLabel htmlFor="discount">Monto del descuento</FieldLabel>
            <div className="relative mt-2">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">$</span>
              <input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-background pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 sm:p-4 rounded-lg bg-muted/50">
            <Info className="size-3 sm:size-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              El descuento se aplicará antes de calcular la propina.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
            <ActionButton onClick={prevStep} variant="outline" className="flex-1 h-10 sm:h-auto">
              Atrás
            </ActionButton>
            <ActionButton onClick={() => setStep(5)} className="flex-1 h-10 sm:h-auto">
              Ver resultados <ArrowRight className="size-3 sm:size-4 ml-2" />
            </ActionButton>
          </div>
        </div>
      )}

      {/* Results */}
      {step === 5 && (
        <>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Calculator className="size-4 sm:size-5 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold">Resultados</h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <span className="text-xs sm:text-sm text-muted-foreground">Monto original</span>
                <span className="text-sm sm:text-base font-semibold">${bill.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-green-500/10">
                  <span className="text-xs sm:text-sm text-green-700">Descuento</span>
                  <span className="text-sm sm:text-base font-semibold text-green-700">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <span className="text-xs sm:text-sm text-muted-foreground">Monto después de descuento</span>
                <span className="text-sm sm:text-base font-semibold">${finalBill.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-primary/10">
                <span className="text-xs sm:text-sm text-primary">Propina ({tipPercent}%)</span>
                <span className="text-sm sm:text-base font-semibold text-primary">${tipAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-primary">
                <span className="text-sm sm:text-base font-semibold text-primary-foreground">Total a pagar</span>
                <span className="text-lg sm:text-xl font-bold text-primary-foreground">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {numberOfPeople > 1 && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Users className="size-4 sm:size-5 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold">División por persona ({numberOfPeople} personas)</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-muted/50">
                  <span className="text-xs sm:text-sm text-muted-foreground">Cuenta por persona</span>
                  <span className="text-sm sm:text-base font-semibold">${billPerPerson.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-primary/10">
                  <span className="text-xs sm:text-sm text-primary">Propina por persona</span>
                  <span className="text-sm sm:text-base font-semibold text-primary">${tipPerPerson.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-primary">
                  <span className="text-sm sm:text-base font-semibold text-primary-foreground">Total por persona</span>
                  <span className="text-lg sm:text-xl font-bold text-primary-foreground">${amountPerPerson.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 sm:gap-3">
            <ActionButton onClick={prevStep} variant="outline" className="flex-1 h-10 sm:h-auto">
              Ajustar valores
            </ActionButton>
            <ActionButton onClick={reset} className="flex-1 h-10 sm:h-auto">
              Nueva cuenta
            </ActionButton>
          </div>
        </>
      )}
    </div>
  )
}
