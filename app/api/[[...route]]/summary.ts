import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import {
  differenceInDays,
  endOfMonth,
  parse,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";

import { db } from "@/db/drizzle";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillMissingMonths } from "@/lib/utils";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const baseDate = from ? parse(from, "yyyy-MM-dd", new Date()) : new Date();
    const baseMonthStart = startOfMonth(baseDate);

    const defaultTo = new Date();
    const defaultFrom = subMonths(defaultTo, 12);

    const periodStart = from
      ? startOfMonth(parse(from, "yyyy-MM-dd", new Date()))
      : startOfMonth(defaultFrom);

    const periodEnd = to
      ? endOfMonth(parse(to, "yyyy-MM-dd", new Date()))
      : endOfMonth(defaultTo);

    const periodLength = differenceInDays(periodEnd, periodStart) + 1;
    const lastPeriodstart = subDays(periodStart, periodLength);
    const lastPeriodend = subDays(periodEnd, periodLength);

    // Aggregates totals over a date range for income/expenses/remaining.
    // Note: expenses are stored as negative amounts; we sum ABS(amount) when amount < 0
    // so charts and summaries can use positive expense magnitudes.
    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      return await db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          expenses:
            // FIX: add missing parentheses to ABS() to correctly compute expenses
            sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
              Number
            ),
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        );
    }

    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      periodStart,
      periodEnd
    );
    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPeriodstart,
      lastPeriodend
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );

    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );

    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, periodStart),
          lte(transactions.date, periodEnd)
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce(
      (sum, current) => sum + current.value,
      0
    );

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Other",
        value: otherSum,
      });
    }

    const activeMonths = await db
      .select({
        date: sql`DATE_TRUNC('month', ${transactions.date})`.mapWith(Date),
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, periodStart),
          lte(transactions.date, periodEnd)
        )
      )
      .groupBy(sql`DATE_TRUNC('month', ${transactions.date})`)
      .orderBy(sql`DATE_TRUNC('month', ${transactions.date})`);
    const months = fillMissingMonths(activeMonths, periodStart, periodEnd);

    let running = 0;
    const monthsWithBalance = months.map((month) => {
      running += month.income - month.expenses;
      return { ...month, remaining: running };
    });

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        months: monthsWithBalance,
      },
    });
  }
);

export default app;
