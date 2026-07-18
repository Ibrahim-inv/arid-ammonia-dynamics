export interface Debt {
  id: string;
  name: string;
  balance: number;
  /** Annual percentage rate, e.g. 18 for 18%. Use 0 for interest-free debts. */
  apr: number;
  minPayment: number;
}

export type Strategy = "snowball" | "avalanche";

export interface MonthPoint {
  month: number;
  totalBalance: number;
  interestThisMonth: number;
  paidThisMonth: number;
}

export interface PayoffEvent {
  debtId: string;
  name: string;
  month: number;
}

export interface PlanResult {
  /** Months until debt-free. */
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: MonthPoint[];
  payoffOrder: PayoffEvent[];
  /** True when payments never cover accruing interest — balance grows forever. */
  neverPaysOff: boolean;
}

export interface PlanComparison {
  plan: PlanResult;
  /** Same debts paid with minimum payments only (no extra, no rollover). */
  baseline: PlanResult;
  monthsSaved: number;
  interestSaved: number;
}

const MAX_MONTHS = 12 * 60;

function orderDebts(debts: Debt[], strategy: Strategy): Debt[] {
  const sorted = [...debts];
  if (strategy === "snowball") {
    sorted.sort((a, b) => a.balance - b.balance || b.apr - a.apr);
  } else {
    sorted.sort((a, b) => b.apr - a.apr || a.balance - b.balance);
  }
  return sorted;
}

/**
 * Simulate month-by-month payoff. Minimum payments go to every open debt;
 * `extraMonthly` plus every closed debt's freed minimum roll into the first
 * open debt in strategy order.
 */
export function simulatePlan(
  debts: Debt[],
  strategy: Strategy,
  extraMonthly: number,
  rollover = true,
): PlanResult {
  const order = orderDebts(
    debts.filter((d) => d.balance > 0),
    strategy,
  );
  const balances = new Map(order.map((d) => [d.id, d.balance]));
  const schedule: MonthPoint[] = [];
  const payoffOrder: PayoffEvent[] = [];

  let totalInterest = 0;
  let totalPaid = 0;
  let freedMinimums = 0;
  let month = 0;

  const totalBalance = () => [...balances.values()].reduce((s, b) => s + b, 0);

  schedule.push({ month: 0, totalBalance: totalBalance(), interestThisMonth: 0, paidThisMonth: 0 });

  while (totalBalance() > 0.005 && month < MAX_MONTHS) {
    month++;
    let interestThisMonth = 0;
    let paidThisMonth = 0;

    for (const d of order) {
      const bal = balances.get(d.id)!;
      if (bal <= 0) continue;
      const interest = (bal * d.apr) / 100 / 12;
      interestThisMonth += interest;
      balances.set(d.id, bal + interest);
    }
    totalInterest += interestThisMonth;

    // Minimum payment on every open debt.
    for (const d of order) {
      const bal = balances.get(d.id)!;
      if (bal <= 0) continue;
      const pay = Math.min(d.minPayment, bal);
      balances.set(d.id, bal - pay);
      paidThisMonth += pay;
    }

    // Extra + freed minimums attack debts in strategy order.
    let attack = extraMonthly + (rollover ? freedMinimums : 0);
    for (const d of order) {
      if (attack <= 0) break;
      const bal = balances.get(d.id)!;
      if (bal <= 0) continue;
      const pay = Math.min(attack, bal);
      balances.set(d.id, bal - pay);
      paidThisMonth += pay;
      attack -= pay;
    }

    for (const d of order) {
      if (balances.get(d.id)! <= 0.005 && !payoffOrder.some((p) => p.debtId === d.id)) {
        balances.set(d.id, 0);
        payoffOrder.push({ debtId: d.id, name: d.name, month });
        if (rollover) freedMinimums += d.minPayment;
      }
    }

    totalPaid += paidThisMonth;
    schedule.push({ month, totalBalance: totalBalance(), interestThisMonth, paidThisMonth });
  }

  return {
    months: month,
    totalInterest,
    totalPaid,
    schedule,
    payoffOrder,
    neverPaysOff: totalBalance() > 0.005,
  };
}

export function comparePlan(
  debts: Debt[],
  strategy: Strategy,
  extraMonthly: number,
): PlanComparison {
  const plan = simulatePlan(debts, strategy, extraMonthly, true);
  const baseline = simulatePlan(debts, strategy, 0, false);
  return {
    plan,
    baseline,
    monthsSaved: Math.max(0, baseline.months - plan.months),
    interestSaved: Math.max(0, baseline.totalInterest - plan.totalInterest),
  };
}

export function addMonths(from: Date, months: number): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
}
