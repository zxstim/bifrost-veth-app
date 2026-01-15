"use client";

import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
  useChainId,
  useConfig,
  useBalance,
  useReadContracts,
} from "wagmi";
import Image from "next/image";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { parseEther, formatEther, Address, erc20Abi } from "viem";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Loader2, RefreshCcw, ChevronRight } from "lucide-react";
import { TransactionStatus } from "@/components/transaction-status";
import { vethAbi } from "@/lib/abis";

export default function MintComponent() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const config = useConfig();
  const chainId = useChainId();
  const { address } = useAccount();
  // const MIN_MINT_AMOUNT = 0.0001;

  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    isRefetching: isRefetchingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address: address,
  });

  const {
    data: vethData,
    isLoading: isLoadingVethData,
    isRefetching: isRefetchingVethData,
    refetch: refetchVethData,
  } = useReadContracts({
    contracts: [
      // vETH
      {
        abi: erc20Abi,
        address: "0xc3997ff81f2831929499c4eE4Ee4e0F08F42D4D8",
        functionName: "balanceOf",
        args: [address as Address],
      },
      // Exchange rate
      {
        abi: vethAbi,
        address: "0xc3997ff81f2831929499c4eE4Ee4e0F08F42D4D8",
        functionName: "convertToShares",
        args: [parseEther("1")],
      },
    ],
  });

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const form = useForm({
    defaultValues: {
      amount: "",
    },
    onSubmit: async ({ value }) => {
      writeContract({
        address: "0xc3997ff81f2831929499c4eE4Ee4e0F08F42D4D8",
        abi: vethAbi,
        functionName: "depositWithETH",
        value: parseEther(value.amount),
      });
    },
  });

  function convertChainIdToName(chainId: number) {
    switch (chainId) {
      case 1:
        return "Ethereum";
      case 10:
        return "Optimism";
      case 8453:
        return "Base";
      case 42161:
        return "Arbitrum";
      default:
        return "Unknown";
    }
  }

  function refetchAllData() {
    refetchNativeBalance();
    refetchVethData();
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="flex flex-col gap-4 w-full p-4 border-2 border-primary rounded-none">
      <div className="flex flex-col gap-2 pb-8">
        <div className="flex flex-row gap-2 items-center justify-between">
          <h1 className="text-2xl font-bold">Stake ETH for vETH</h1>
          <Button
            className="hover:cursor-pointer"
            size="icon"
            variant="ghost"
            onClick={refetchAllData}
            disabled={isRefetchingNativeBalance || isRefetchingVethData}
          >
            {isRefetchingNativeBalance || isRefetchingVethData ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center lg:justify-between">
            <div className="flex flex-row gap-2 items-center justify-center">
              <Image src="/eth.svg" alt="ETH" width={24} height={24} />
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <p className="text-lg">ETH</p>
                  {chainId ? (
                    <p className="border border-muted-foreground bg-muted-foreground/10 rounded-none px-2 py-0.5 text-muted-foreground text-sm">
                      {convertChainIdToName(chainId)}
                    </p>
                  ) : (
                    <Skeleton className="w-12 h-4" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center text-left lg:text-right gap-2">
              <ChevronRight className="w-4 h-4 lg:hidden" />
              {isLoadingNativeBalance ? (
                <Skeleton className="w-12 h-4" />
              ) : (
                <p>{formatEther(nativeBalance?.value ?? BigInt(0))}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center lg:justify-between">
            <div className="flex flex-row gap-2 items-center justify-center">
              <Image src="/veth.svg" alt="vETH" width={24} height={24} />
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <p className="text-lg">vETH</p>
                  {chainId ? (
                    <p className="border border-muted-foreground bg-muted-foreground/10 rounded-none px-2 py-0.5 text-muted-foreground text-sm">
                      {convertChainIdToName(chainId)}
                    </p>
                  ) : (
                    <Skeleton className="w-12 h-4" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center text-left lg:text-right gap-2">
              <ChevronRight className="w-4 h-4 lg:hidden" />
              {isLoadingVethData ? (
                <Skeleton className="w-12 h-4" />
              ) : (
                <p>{formatEther(vethData?.[0]?.result ?? BigInt(0))}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-none border border-muted-foreground p-4">
            <div>
              {/* A type-safe field component*/}
              <form.Field
                name="amount"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Please enter an amount to mint"
                      : parseEther(value) < 0
                      ? "Amount must be greater than 0"
                      : parseEther(value) > (nativeBalance?.value ?? BigInt(0))
                      ? "Amount must be less than or equal to your balance"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center justify-between">
                      <p className="text-muted-foreground">You stake</p>
                      <button
                        type="button"
                        className="bg-transparent rounded-none border border-muted-foreground text-muted-foreground px-2 py-0.5 hover:cursor-pointer"
                      >
                        Max
                      </button>
                    </div>
                    <div className="flex flex-row gap-2">
                      {isDesktop ? (
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="bg-transparent text-4xl outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          type="number"
                          placeholder="0"
                          required
                        />
                      ) : (
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="bg-transparent text-4xl outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          type="number"
                          inputMode="decimal"
                          pattern="[0-9]*"
                          placeholder="0"
                          required
                        />
                      )}
                      <p className="place-self-end text-lg text-muted-foreground">
                        ETH
                      </p>
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          <form.Subscribe selector={(state) => state.values.amount}>
            {(amount) => {
              const exchangeRate = vethData?.[1]?.result as bigint | undefined;
              const receivingAmount =
                amount && exchangeRate
                  ? formatEther(
                      (parseEther(amount) * exchangeRate) / parseEther("1")
                    )
                  : "";
              return (
                <div className="flex flex-col gap-2 rounded-none border border-muted-foreground p-4">
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <p className="text-muted-foreground">You receive</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <input
                      id="receivingAmount"
                      name="receivingAmount"
                      value={receivingAmount}
                      className="bg-transparent text-4xl outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      placeholder="0"
                      readOnly
                    />
                    <p className="place-self-end text-lg text-muted-foreground">
                      vETH
                    </p>
                  </div>
                </div>
              );
            }}
          </form.Subscribe>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center text-muted-foreground">
              1 ETH ={" "}
              {isLoadingVethData ? (
                <Skeleton className="w-12 h-4" />
              ) : (
                formatEther((vethData?.[1]?.result as bigint) ?? BigInt(0))
              )}{" "}
              vETH
            </div>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                size="lg"
                className="hover:cursor-pointer text-lg font-bold rounded-none"
                type="submit"
                disabled={
                  !canSubmit || isSubmitting || isPending || isConfirming
                }
              >
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please confirm in wallet
                  </>
                ) : (
                  <>Stake</>
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error as BaseError}
        config={config}
        chainId={chainId}
      />
    </div>
  );
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {!field.state.meta.isTouched ? (
        <em>Please enter an amount to mint</em>
      ) : field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={`${
            field.state.meta.errors.join(",") ===
            "Please enter an amount to mint"
              ? ""
              : "text-red-500"
          }`}
        >
          {field.state.meta.errors.join(",")}
        </em>
      ) : (
        <em className="text-green-500">ok!</em>
      )}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
