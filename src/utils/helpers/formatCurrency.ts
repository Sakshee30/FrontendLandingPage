export default function fmtCurrency(amount: number, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: 0,
    }).format(amount);
}