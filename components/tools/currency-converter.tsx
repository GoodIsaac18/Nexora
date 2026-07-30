"use client"

import { useState, useEffect } from "react"
import { DollarSign, ArrowRightLeft, RefreshCw } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "CLP", name: "Chilean Peso", symbol: "$" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
]

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [result, setResult] = useState("")
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsConverting(true)
    
    try {
      // Using free exchange rate API
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      )
      const data = await response.json()
      
      if (data.rates && data.rates[toCurrency]) {
        const rate = data.rates[toCurrency]
        const convertedAmount = (parseFloat(amount) * rate).toFixed(2)
        setResult(convertedAmount)
        setExchangeRate(rate)
        setLastUpdated(new Date().toLocaleTimeString())
      } else {
        setResult("Error: Moneda no soportada")
      }
    } catch (error) {
      setResult("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsConverting(false)
    }
  }

  const swapCurrencies = () => {
    const tempCurrency = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tempCurrency)
    if (result) {
      setAmount(result)
      setResult("")
    }
  }

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      convertCurrency()
    }
  }, [fromCurrency, toCurrency])

  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find(c => c.code === code)
    return currency?.symbol || code
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <Panel>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="size-5" />
          <h3 className="text-lg font-semibold">Convertidor de Divisa</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <FieldLabel htmlFor="amount">Monto</FieldLabel>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.00"
              className={inputClass()}
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <FieldLabel htmlFor="from-currency">De</FieldLabel>
              <select
                id="from-currency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={swapCurrencies}
              className="h-11 w-11 flex items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              title="Intercambiar monedas"
            >
              <ArrowRightLeft className="size-5" />
            </button>
            <div className="flex-1">
              <FieldLabel htmlFor="to-currency">A</FieldLabel>
              <select
                id="to-currency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <ActionButton onClick={convertCurrency} disabled={!amount || parseFloat(amount) <= 0 || isConverting}>
          {isConverting ? (
            <>
              <RefreshCw className="size-4 animate-spin" /> Convirtiendo…
            </>
          ) : (
            <>
              <DollarSign className="size-4" /> Convertir
            </>
          )}
        </ActionButton>

        {result && (
          <div className="mt-6 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Resultado</p>
              <div className="text-4xl font-bold text-primary mb-2">
                {getCurrencySymbol(toCurrency)}{result}
              </div>
              <p className="text-sm text-muted-foreground">
                {getCurrencySymbol(fromCurrency)}{amount} = {getCurrencySymbol(toCurrency)}{result}
              </p>
              {exchangeRate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tasa de cambio: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </p>
              )}
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Actualizado: {lastUpdated}
                </p>
              )}
            </div>
          </div>
        )}
      </Panel>

      <p className="text-xs text-muted-foreground">
        Tasas de cambio proporcionadas por ExchangeRate-API. Las tasas pueden variar según el mercado. Para transacciones reales, verifica con tu banco o servicio financiero.
      </p>
    </div>
  )
}
