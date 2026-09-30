import React, { Suspense } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Coins, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { CreditsPurchase } from "./_components/CreditsPurchase";
import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface UserBalanceData {
  available: number;
  total_purchased: number;
  total_used: number;
}

async function GetUserBalance(userId: string): Promise<UserBalanceData> {
  const balance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  const executions = await prisma.workflowExecution.aggregate({
    where: { userId },
    _sum: {
      creditsConsumed: true,
    },
  });

  const available = balance?.credits ?? 0;
  const totalUsed = executions._sum.creditsConsumed ?? 0;
  const totalPurchased = available + totalUsed;

  return {
    available,
    total_purchased: totalPurchased,
    total_used: totalUsed,
  };
}

const CreateCountupWrapper: React.FC<{ value: number }> = ({ value }) => {
  return <span>{value.toLocaleString()}</span>;
};

async function BalanceCard() {
  const session = await getServerSession();
  if (!session?.userId) {
    redirect("/sign-in");
  }

  const userBalance = await GetUserBalance(session.userId);
  const usagePercentage = userBalance.total_purchased > 0
    ? ((userBalance.total_used / userBalance.total_purchased) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Balance Card */}
      <Card className="md:col-span-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-0 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <CardContent className="p-8 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-700">Available Credits</h3>
              </div>
              
              <div className="space-y-1">
                <p className="text-4xl font-bold text-neutral-900">
                  <CreateCountupWrapper value={userBalance.available} />
                </p>
                <p className="text-sm text-neutral-500">
                  Ready to use • {usagePercentage}% utilized
                </p>
              </div>

              {/* Usage Stats */}
              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-neutral-600">
                    {userBalance.total_purchased.toLocaleString()} purchased
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-neutral-600">
                    {userBalance.total_used.toLocaleString()} used
                  </span>
                </div>
              </div>
            </div>
            
            {/* Decorative Icon */}
            <div className="relative">
              <Coins className="w-20 h-20 text-blue-200" />
              <Sparkles className="w-6 h-6 text-blue-500 absolute -top-1 -right-1" />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-neutral-50/50 border-t border-neutral-100 px-8 py-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              Workflows will pause when credits reach zero. Purchase more to keep automations running.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>

      {/* Quick Stats Card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-neutral-700">Usage Insights</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Efficiency</span>
                <span className="text-sm font-semibold text-emerald-600">Excellent</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Usage Rate</span>
                  <span className="font-semibold">{usagePercentage}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(parseFloat(usagePercentage), 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="pt-2 border-t border-emerald-100">
                <p className="text-xs text-neutral-500">
                  Estimated {Math.floor(userBalance.available / 10)} workflows remaining
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-neutral-900">Billing & Credits</h1>
        <p className="text-lg text-neutral-600">
          Manage your credits and view usage analytics for your automation workflows.
        </p>
      </div>

      {/* Balance Cards with Loading */}
      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        }
      >
        <BalanceCard />
      </Suspense>

      {/* Credits Purchase */}
      <CreditsPurchase />
    </div>
  );
}