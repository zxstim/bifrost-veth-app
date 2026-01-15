"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { formatCurrencyValue } from "@/lib/utils";

export default function VethData() {
  // Queries
  const { data, isLoading, isError } = useQuery({
    queryKey: ["veth-data"],
    queryFn: async () => {
      const response = await fetch("https://dapi.bifrost.io/api/site");
      if (!response.ok) {
        throw new Error("Failed to fetch vETH data");
      }
      return response.json();
    },
  });

  return (
    <div className="grid grid-cols-3 gap-4 border-t-2 border-muted-foreground/20 pt-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-md lg:text-lg text-muted-foreground">Total Value Locked</h1>
        {isLoading ? (
          <Skeleton className="w-full h-4" />
        ) : isError ? (
          <p className="font-bold text-lg lg:text-4xl">$--</p>
        ) : (
          <p className="font-bold text-lg lg:text-4xl">
            {formatCurrencyValue(data?.["vETH"]["tvl"])}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-md lg:text-lg text-muted-foreground">Total stakers</h1>
        {isLoading ? (
          <Skeleton className="w-full h-4" />
        ) : isError ? (
          <p className="font-bold text-lg lg:text-4xl">--</p>
        ) : (
          <p className="font-bold text-lg lg:text-4xl">{data?.["vETH"]["holders"]}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-md lg:text-lg text-muted-foreground">Current APY</h1>
        {isLoading ? (
          <Skeleton className="w-full h-4" />
        ) : isError ? (
          <p className="font-bold text-lg lg:text-4xl">--%</p>
        ) : (
          <p className="font-bold text-lg lg:text-4xl">{data?.["vETH"]["apyBase"]}%</p>
        )}
      </div>
    </div>
  );
}
