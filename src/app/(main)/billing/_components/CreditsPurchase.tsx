"use client";

import { CreditsPack, PackId } from "@/app/types/billing";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Coins, CreditCard, Sparkles, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseCredits } from "@/actions/billing/purchaseCredits";
import { toast } from "sonner";

export const CreditsPurchase: React.FC = () => {
  const [selectedPack, setSelectedPack] = useState<PackId>(PackId.MEDIUM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        setSuccess(true);
        toast.success("Payment successful! Your credits have been updated.");
      }
    }
  }, []);

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await PurchaseCredits(selectedPack);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment processing failed";
      // Next.js redirect in server actions throws NEXT_REDIRECT which is expected
      if (msg.includes("NEXT_REDIRECT")) {
        return;
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPackData = CreditsPack.find((pack) => pack.id === selectedPack);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Coins className="w-6 h-6 text-blue-600" />
          </div>
          Purchase Credits
        </CardTitle>
        <CardDescription className="text-base">
          Choose the credit pack that best fits your workflow requirements. Purchases are processed securely via Stripe.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack}
          className="space-y-3"
        >
          {CreditsPack.map((pack) => (
            <div
              key={pack.id}
              className={`relative flex items-center space-x-4 rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedPack === pack.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
              onClick={() => setSelectedPack(pack.id)}
            >
              {pack.popular && (
                <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Most Popular
                </Badge>
              )}

              <RadioGroupItem value={pack.id} id={pack.id} className="mt-1" />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={pack.id} className="text-lg font-semibold cursor-pointer">
                    {pack.name}
                  </Label>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-900">
                      ${(pack.price / 100).toFixed(2)}
                    </div>
                    {pack.bonus && pack.bonus > 0 ? (
                      <div className="text-sm text-emerald-600 font-medium">
                        +{pack.bonus.toLocaleString()} bonus credits
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">{pack.label}</span>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Zap className="w-4 h-4" />
                    ${((pack.price / 100) / pack.credits).toFixed(4)} per credit
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        {/* Summary Card */}
        {selectedPackData && (
          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-neutral-900">Purchase Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Base Credits:</span>
                <span className="font-medium">{selectedPackData.credits.toLocaleString()}</span>
              </div>
              {selectedPackData.bonus && selectedPackData.bonus > 0 ? (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Bonus Credits:</span>
                  <span className="font-medium text-emerald-600">
                    +{selectedPackData.bonus.toLocaleString()}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-neutral-200 pt-2">
                <span className="text-neutral-600">Total Credits:</span>
                <span className="font-bold">
                  {(selectedPackData.credits + (selectedPackData.bonus || 0)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Total Amount:</span>
                <span className="font-bold text-lg">
                  ${(selectedPackData.price / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment completed successfully! Your credit balance has been updated.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isLoading}
          onClick={handlePurchase}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Redirecting to Stripe...
            </>
          ) : (
            <>
              <CreditCard className="mr-2" />
              Purchase {(selectedPackData?.credits ?? 0).toLocaleString()} Credits
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
