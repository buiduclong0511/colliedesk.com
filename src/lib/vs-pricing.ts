// Price-by-team-size comparison for /vs pages: one competitor's per-agent plans against the flat
// Colliedesk Cloud Team price. The HTML chart and the Markdown twin both render from this.
import { PRICE } from './site';

export interface VsPlan {
  name: string;
  /** List price per agent per month, USD. */
  perAgent: number;
  /** AI add-on per agent per month, USD, when the plan's total includes one. */
  aiPerAgent?: number;
}

export interface VsPricing {
  competitor: string;
  /** ISO date the competitor's pricing page was read. */
  readOn: string;
  /** How the competitor bills the listed price, e.g. "billed annually". */
  billing: string;
  plans: readonly VsPlan[];
  /** Who Colliedesk fits and who it does not, beyond the price-derived lines. */
  forYou: readonly string[];
  notForYou: readonly string[];
}

export interface VsRow {
  name: string;
  usd: number;
  seatUsd: number;
  aiUsd: number;
  math: string;
  ours?: boolean;
}

export const TEAM_SIZES = [1, 3, 5, 10] as const;
export const DEFAULT_TEAM_SIZE = 5;
/** Cloud Team covers up to this many agents for one flat price. */
export const MAX_AGENTS = 10;
const OURS_USD = Number(PRICE.monthly.replace('$', ''));

export const usd = (n: number): string =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

export function rowsAt(p: VsPricing, agents: number): VsRow[] {
  const theirs = p.plans.map((plan) => {
    const seatUsd = plan.perAgent * agents;
    const aiUsd = (plan.aiPerAgent ?? 0) * agents;
    const math = plan.aiPerAgent
      ? `${agents} × (${usd(plan.perAgent)} + ${usd(plan.aiPerAgent)})`
      : `${agents} × ${usd(plan.perAgent)}`;
    return { name: plan.name, usd: seatUsd + aiUsd, seatUsd, aiUsd, math };
  });
  const ours: VsRow = {
    name: 'Colliedesk Cloud Team',
    usd: OURS_USD,
    seatUsd: OURS_USD,
    aiUsd: 0,
    math: `one workspace, up to ${MAX_AGENTS} agents`,
    ours: true,
  };
  return [...theirs, ours].sort((a, b) => a.usd - b.usd);
}

/** Smallest team size at which Colliedesk costs less than every competitor plan. */
export function cheaperFrom(p: VsPricing): number | undefined {
  for (let n = 1; n <= MAX_AGENTS; n++) {
    if (p.plans.every((plan) => (plan.perAgent + (plan.aiPerAgent ?? 0)) * n > OURS_USD)) return n;
  }
  return undefined;
}

export const teamLabel = (n: number): string => (n === 1 ? '1 agent' : `${n} agents`);
const belowLabel = (from: number): string => (from === 2 ? '1 agent' : `1–${from - 1} agents`);
const cheapestPlan = (p: VsPricing): string =>
  [...p.plans].sort((a, b) => a.perAgent - b.perAgent)[0]?.name ?? p.competitor;

/** One line under the chart: where the flat price wins and where it does not. */
export function fitLine(p: VsPricing): string {
  const from = cheaperFrom(p);
  if (from === undefined) return `${p.competitor} costs less than Colliedesk at every team size up to ${MAX_AGENTS} agents.`;
  if (from === 1) return `Colliedesk costs less at every team size from 1 to ${MAX_AGENTS} agents.`;
  return `Colliedesk costs less from ${from} to ${MAX_AGENTS} agents. With ${belowLabel(from)}, ${cheapestPlan(p)} is cheaper.`;
}

/** The yearly saving against the most expensive plan at a team size, or undefined if none. */
export function savingAt(p: VsPricing, agents: number): { name: string; perMonth: number } | undefined {
  const top = rowsAt(p, agents).at(-1);
  if (!top || top.ours) return undefined;
  return { name: top.name, perMonth: top.usd - OURS_USD };
}

export const readOnLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const chartCaption = (p: VsPricing): string =>
  `${p.competitor} list prices per month, ${p.billing}, read on ${readOnLabel(p.readOn)}. Colliedesk Cloud Team is ${PRICE.monthly} a month, or ${PRICE.yearly} a year. AI usage on Colliedesk is extra, at cost +30% or with your own key.`;

export function notForYouLines(p: VsPricing): string[] {
  const from = cheaperFrom(p);
  const price = from !== undefined && from > 1 ? [`Your team has ${belowLabel(from)}: ${cheapestPlan(p)} is cheaper.`] : [];
  return [...price, `Your team has more than ${MAX_AGENTS} agents: Cloud Team stops at ${MAX_AGENTS}; email us for a quote.`, ...p.notForYou];
}

export function vsMarkdown(p: VsPricing): string {
  const head = `| Team | ${p.plans.map((plan) => plan.name).join(' | ')} | Colliedesk Cloud Team |`;
  const sep = `|---|${p.plans.map(() => '---|').join('')}---|`;
  const rows = TEAM_SIZES.map((n) => {
    const cells = p.plans.map((plan) => usd((plan.perAgent + (plan.aiPerAgent ?? 0)) * n));
    return `| ${teamLabel(n)} | ${cells.join(' | ')} | ${PRICE.monthly} |`;
  });
  const list = (items: readonly string[]): string => items.map((i) => `- ${i}`).join('\n');
  return `## Price by team size

${chartCaption(p)}

${head}
${sep}
${rows.join('\n')}

${fitLine(p)}

## Who Colliedesk fits

**Colliedesk is for you if**

${list(p.forYou)}

**Not for you yet if**

${list(notForYouLines(p))}`;
}
