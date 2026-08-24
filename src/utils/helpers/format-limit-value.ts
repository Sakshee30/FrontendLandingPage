export default function fmtLimitVal(n: number | undefined | null) {
    if (n == null) return "—";
    return n === -1 ? "Unlimited" : n.toLocaleString();
}