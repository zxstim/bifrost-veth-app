"use client";

import Image from "next/image";
import {
  useChainId,
  useAccount,
  useBalance,
  useReadContracts,
  useChains,
} from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEther, erc20Abi, Address } from "viem";
import { roundLongDecimals } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Loader2 } from "lucide-react";
import { TOKEN_LIST } from "@/lib/constants";

export default function BalancesComponent() {
  const chainId = useChainId();
  const { address } = useAccount();
  const chains = useChains();

  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    isRefetching: isRefetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address: address,
  });

  const {
    data: tokenBalances,
    isLoading: isTokenBalancesLoading,
    isRefetching: isRefetchingTokenBalances,
    refetch: refetchTokenBalances,
  } = useReadContracts({
    contracts: [
      // DOT
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
      // vETH
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
      // vDOT
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
    ],
  });

  async function handleRefetchAllBalances() {
    await refetchNativeBalance();
    await refetchTokenBalances();
  }

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-2">
          <h1 className="text-2xl font-bold">Tokens</h1>
          <Button
            className="hover:cursor-pointer"
            size="icon"
            onClick={handleRefetchAllBalances}
            disabled={isRefetchingNativeBalance || isRefetchingTokenBalances}
          >
            {isRefetchingNativeBalance || isRefetchingTokenBalances ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-muted-foreground">Current wallet balances</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Image src="/eth.svg" alt="Ethereum" width={48} height={48} />
            <div className="flex flex-col">
              <p className="text-xl font-semibold">Ethereum</p>
              <p className="text-muted-foreground">
                {chains?.find((chain) => chain.id === chainId)?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="text-xl">
              {isLoadingNativeBalance ? (
                <Skeleton className="w-12 h-4" />
              ) : (
                roundLongDecimals(
                  formatEther(nativeBalance?.value ?? BigInt(0)),
                  6
                )
              )}
            </div>
            <p className="text-muted-foreground">ETH</p>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Image src="/dot.svg" alt="Polkadot" width={48} height={48} />
            <div className="flex flex-col">
              <p className="text-xl font-semibold">Polkadot</p>
              <p className="text-muted-foreground">
                {chains?.find((chain) => chain.id === chainId)?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="text-xl">
              {isTokenBalancesLoading ? (
                <Skeleton className="w-12 h-4" />
              ) : (
                roundLongDecimals(
                  formatEther(
                    tokenBalances?.[0]?.result ?? BigInt(0)
                  ),
                  6
                )
              )}
            </div>
            <p className="text-muted-foreground">DOT</p>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Image
              src="/veth.svg"
              alt="Voucher Ethereum"
              width={48}
              height={48}
            />
            <div className="flex flex-col">
              <p className="text-xl font-semibold">Voucher ETH</p>
              <p className="text-muted-foreground">
                {chains?.find((chain) => chain.id === chainId)?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="text-xl">
              {isTokenBalancesLoading ? (
                <Skeleton className="w-12 h-4" />
              ) : (
                roundLongDecimals(
                  formatEther(
                    tokenBalances?.[1]?.result ?? BigInt(0)
                  ),
                  6
                )
              )}
            </div>
            <p className="text-muted-foreground">vETH</p>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Image
              src="/vdot.svg"
              alt="Voucher Polkadot"
              width={48}
              height={48}
            />
            <div className="flex flex-col">
              <p className="text-xl font-semibold">Voucher DOT</p>
              <p className="text-muted-foreground">
                {chains?.find((chain) => chain.id === chainId)?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="text-xl">
              {isTokenBalancesLoading ? (
                <Skeleton className="w-12 h-4" />
              ) : (
                roundLongDecimals(
                  formatEther(
                    tokenBalances?.[2]?.result ?? BigInt(0)
                  ),
                  6
                )
              )}
            </div>
            <p className="text-muted-foreground">vDOT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
