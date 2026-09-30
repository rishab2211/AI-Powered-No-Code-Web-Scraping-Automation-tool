"use client";

import { Workflow } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  FileTextIcon,
  Pencil,
  PlayIcon,
  TimerIcon,
  Clock,
  Copy,
} from "lucide-react";
import {
  WorkflowExecutionStatus,
  WorkflowStatus,
} from "@/app/types/Workflows";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import WorkflowActions from "./WorkflowActions";
import { useMemo } from "react";
import RunBtn from "./RunBtn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SchedulerDialog from "./SchedulerDialog";
import cronstrue from "cronstrue";
import ExecutionBadgeIndicator from "@/app/workflow/runs/[workflowId]/[executionId]/_components/ExecutionBadgeIndicator";
import { format, formatDistanceToNow } from "date-fns";
import DuplicateWorkflowDialog from "./DuplicateWorkflowDialog ";



const STATUS_CONFIG = {
  [WorkflowStatus.DRAFT]: {
    icon: FileTextIcon,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  [WorkflowStatus.PUBLISHED]: {
    icon: PlayIcon,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
} as const;

interface WorkflowCardProps {
  workflow: Workflow;
}

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  const config = STATUS_CONFIG[workflow.status as WorkflowStatus];

  const cronInfo = useMemo(() => {
    if (!workflow.cron) return { isCron: false, readableCron: "" };

    try {
      return {
        isCron: true,
        readableCron: cronstrue.toString(workflow.cron),
      };
    } catch {
      return { isCron: false, readableCron: "" };
    }
  }, [workflow.cron]);

  return (
    <Card className="border hover:shadow-sm transition-shadow">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <StatusIcon config={config} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
                >
                  {workflow.name}
                </Link>
                {isDraft && (
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    DRAFT
                  </span>
                )}

                <DuplicateWorkflowDialog workflowId={workflow.id} />

              </div>
              <div className="text-sm text-gray-500">
                {workflow.creditCost} credits • Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}
              </div>
            </div>
          </div>
          <WorkflowActions workflowId={workflow.id} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isDraft && (
              <>
                <ScheduleButton {...cronInfo} workflowId={workflow.id} creditsRequired={workflow.creditCost} />
                <RunBtn workflowId={workflow.id} />
              </>
            )}
          </div>
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs"
            )}
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Link>
        </div>

        {/* Execution info */}
        <ExecutionInfo workflow={workflow} />
      </CardContent>
    </Card>
  );
};

const StatusIcon = ({ config }: { config: typeof STATUS_CONFIG[WorkflowStatus] }) => {
  const Icon = config.icon;
  return (
    <div className={cn("p-1.5 rounded border", config.bg, config.border)}>
      <Icon className={cn("w-4 h-4", config.color)} />
    </div>
  );
};

interface ScheduleButtonProps {
  isCron: boolean;
  readableCron: string;
  workflowId: string;
  creditsRequired: number;
}

const ScheduleButton = ({ isCron, readableCron, workflowId, creditsRequired }: ScheduleButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded text-xs border",
          isCron
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-gray-50 border-gray-200 text-gray-600"
        )}>
          <TimerIcon className="w-3 h-3" />
          <SchedulerDialog workflowId={workflowId} creditsRequired={creditsRequired} isCron={isCron} />
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-xs">
        {isCron ? readableCron : `Schedule for ${creditsRequired} credits`}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ExecutionInfo = ({ workflow }: { workflow: Workflow }) => {
  const { lastRun, lastRunStatus, lastRunId, nextRunAt } = workflow;

  const dates = useMemo(() => ({
    lastRun: lastRun ? formatDistanceToNow(lastRun, { addSuffix: true }) : null,
    nextRun: nextRunAt ? format(nextRunAt, "MMM d, HH:mm") : null,
  }), [lastRun, nextRunAt]);

  if (!lastRun && !nextRunAt) {
    return (
      <div className="text-xs text-gray-400 py-2 border-t">
        No executions yet
      </div>
    );
  }

  return (
    <div className="text-xs space-y-2 pt-2 border-t">
      {lastRun && lastRunId && (
        <Link
          href={`/workflow/runs/${workflow.id}/${lastRunId}`}
          className="flex items-center justify-between hover:text-blue-600 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Last run</span>
            <ExecutionBadgeIndicator status={lastRunStatus as WorkflowExecutionStatus} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">{dates.lastRun}</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      )}

      {nextRunAt && (
        <div className="flex items-center justify-between text-blue-600">
          <div className="flex items-center gap-2">
            <TimerIcon className="w-3 h-3" />
            <span>Next run</span>
          </div>
          <span>{dates.nextRun}</span>
        </div>
      )}
    </div>
  );
};

export default WorkflowCard;