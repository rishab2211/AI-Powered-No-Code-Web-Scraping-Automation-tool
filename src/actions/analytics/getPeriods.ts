"use server"

import { Period } from "@/app/types/analytics";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";


// returns array of periods, the number of months between first time the user's workflow started and current year
export async function GetPeriods() {

    // authenticate user
    const session = await getServerSession();
    if (!session?.userId) {
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;

    // getting first time the workflow started
    // it returns something like this
    // { _min: { startedAt: 2025-01 - 29T16: 12: 40.113Z } }
    const firstRun = await prisma.workflowExecution.aggregate({
        where: {
            userId
        },
        _min: { startedAt: true }
    });


    // gets current year
    const currentYear = new Date().getFullYear();

    // extracting the value
    const minYear = firstRun._min.startedAt ? firstRun._min.startedAt.getFullYear() : currentYear;

    // this the period - month wise( the number of months between minYear and current year)
    const periods: Period[] = [];
    for (let yr = minYear; yr <= currentYear; yr++) {
        for (let mon = 0; mon <= 11; mon++) {
            periods.push({ year: yr, month: mon })
        }
    }

    return periods;
}

// returns something like this
/*
[
  { year: 2025, month: 0 },
  { year: 2025, month: 1 },
  { year: 2025, month: 2 },
  { year: 2025, month: 3 },
  { year: 2025, month: 4 },
  { year: 2025, month: 5 },
  { year: 2025, month: 6 },
  { year: 2025, month: 7 },
  { year: 2025, month: 8 },
  { year: 2025, month: 9 },
  { year: 2025, month: 10 },
  { year: 2025, month: 11 }
]
*/