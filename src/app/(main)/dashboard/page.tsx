// server component

import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/app/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { getServerSession } from "@/lib/auth";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatCard from "./_components/StatCard";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditsUsageChart from "./_components/CreditsUsageChart";

type Prop = {
  searchParams: { month?: string; year?: string };
};

const page = async ({ searchParams }: Prop) => {
  // this should be awaited acc. to nextjs docs
  const searchParamsData = await searchParams;
  const currentDate = new Date(); // current data
  const { month, year } = searchParamsData; // destructuring the data

  // setting Period prop
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* header of the dashboard */}
      <div className="flex justify-between">
        <div className="text-3xl font-bold">Home</div>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>

      {/* stats cards */}
      <Suspense fallback={<StatsCardSkeleton />}>
        <StatsCards selectedPeriod={period} />
      </Suspense>

      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <StatsExecutionStatus selectedPeriod={period} />
      </Suspense>

      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <CreditsUsageInPeriod selectedPeriod={period} />
      </Suspense>
    </div>
  );
};

export default page;

// fetching data and passing in component
const PeriodSelectorWrapper = async ({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) => {
  const periods = await GetPeriods();
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
};

const StatsCards = async ({ selectedPeriod }: { selectedPeriod: Period }) => {
  // authenticating user
  const session = await getServerSession();
  if (!session?.userId) {
    throw new Error("Unauthenticated");
  }

  // fetching stats for selected period
  const data = await GetStatsCardsValues(selectedPeriod);

  // render different data on separate card
  return (
    <div className="grid gap-4 lg:gap-8 lg:grid-cols-3 min-h-[120px">
      <StatCard
        title="Workflow executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
      <StatCard
        title="Phase executions"
        value={data.workflowExecutions}
        icon={WaypointsIcon}
      />
    </div>
  );
};

// skeleton card for loading state
function StatsCardSkeleton() {
  return (
    <div className="grid gap-4 lg:gap-8 lg:grid-cols-3 min-h-[120px ">
      {[1, 2, 3].map((_, index) => (
        <Skeleton key={index} className="w-full h-[120px]" />
      ))}
    </div>
  );
}

// workflow execution status card, showing number of successful and failed executions
async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {

  // fetching execution stats in a period
  const data = await GetWorkflowExecutionStats(selectedPeriod);

  return <ExecutionStatusChart data={data} />;
}


// stats of daily credits spent
async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {

  // fetching credits usage
  const data = await GetCreditsUsageInPeriod(selectedPeriod);

  return <CreditsUsageChart data={data} />;
}