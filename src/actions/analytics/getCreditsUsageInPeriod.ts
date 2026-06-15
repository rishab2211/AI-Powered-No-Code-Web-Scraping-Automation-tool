import { Period } from "@/app/types/analytics";
import { PeriodToDateRange } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { eachDayOfInterval, format } from "date-fns";
import { Stats } from "./getWorkflowExecutionStats";
import { ExecutionPhaseStatus } from "@/app/types/Workflows";


export async function GetCreditsUsageInPeriod(period: Period) {
    try {

        // authenticate user
        const session = await getServerSession();
        if (!session?.userId) {
            throw new Error("Unauthenticated");
        }
        const userId = session.userId;

        // gets first and last day of the month
        const dateRange = PeriodToDateRange(period);

        // find execution phases run(completed+failed both) in a period
        const executionPhases = await prisma.executionPhase.findMany({
            where: {
                userId,
                startedAt: {
                    gte: dateRange.startDate,
                    lte: dateRange.endDate
                },
                status: {
                    in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED]
                }
            }
        });

        // desired date format
        const dateFormat = "yyyy-MM-dd";

        // creates array of each day of the period --> map that array to format them in a string format --> reduce them into object with additional field
        // something like this 
        /*
        const stats = {
                "2025-01-01": { success: 0, failed: 0 },
                "2025-01-02": { success: 0, failed: 0 },
                "2025-01-03": { success: 0, failed: 0 },
                // ... for every day in January
                "2025-01-31": { success: 0, failed: 0 }
            };*/
        const stats: Stats =
            eachDayOfInterval({ start: dateRange.startDate, end: dateRange.endDate })
                .map((date) => format(date, dateFormat))
                .reduce((acc, date) => {
                    acc[date] = {
                        success: 0,
                        failed: 0
                    };
                    return acc;
                }, {} as any);


        // adding additional field in stats object with execution phase data
        executionPhases.forEach(phase => {

            // format the date at which the workflow started
            const date = format(phase.startedAt!, dateFormat);

            // conditionally increment either completed or failed field in stats object according to the execution phase status
            if (phase.status === ExecutionPhaseStatus.COMPLETED) {
                stats[date].success += phase.creditCost || 0;
            }
            if (phase.status === ExecutionPhaseStatus.FAILED) {
                stats[date].failed += phase.creditCost || 0;
            }
        })

        // converting key:value pairs to an object
        // ["2025-01-01", { success: 5, failed: 3 }] --> { date: "2025-01-01", success: 5, failed: 3 }
        const result = Object.entries(stats).map(([date, infos]) => ({ date, ...infos }));


        return result;
    } catch (error) {
        throw new Error(`Could not get the credits usage in a period, ERROR: ${error}`)
    }
}