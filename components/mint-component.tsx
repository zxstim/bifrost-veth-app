"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Token } from "@/types/token";
import Image from "next/image";
import { TOKEN_LIST } from "@/lib/constants";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { parseEther, formatEther, Address, erc20Abi } from "viem";
import { useMediaQuery } from "@/hooks/use-media-query";
import { roundLongDecimals } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { TransactionStatus } from "@/components/transaction-status";
import { vethAbi } from "@/lib/abis";

const tokens: Token[] = TOKEN_LIST.filter(
  (token) => token.symbol === "vDOT" || token.symbol === "vETH"
);

export default function MintComponent() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const config = useConfig();
  const chainId = useChainId();
  const { address } = useAccount();

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

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const form = useForm({
    defaultValues: {
      amount: "",
    },
    onSubmit: async ({ value }) => {
      if (selectedToken?.symbol === "vETH") {
        writeContract({
          address: "0xc3997ff81f2831929499c4eE4Ee4e0F08F42D4D8",
          abi: vethAbi,
          functionName: "depositWithETH",
          value: parseEther(value.amount),
        });
      }
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Mint</h1>
        <p className="text-muted-foreground">Mint Liquid Staking Tokens</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <Select
            onValueChange={(value) => {
              const token = tokens.find((token) => token.symbol === value);
              if (token) {
                setSelectedToken(token);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectMintToken key={token.symbol} token={token} />
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-2 rounded-lg border p-4">
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
                      : parseEther(value) >
                        (selectedToken?.symbol === "vETH"
                          ? nativeBalance?.value ?? BigInt(0)
                          : tokenBalances?.[0]?.result ?? BigInt(0))
                      ? "Amount must be less than or equal to your balance"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center justify-between">
                      <p className="text-muted-foreground">Minting</p>
                      <button className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-0.5 hover:cursor-pointer">
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
                        {selectedToken?.symbol === "vETH"
                          ? "ETH"
                          : selectedToken?.symbol === "vDOT"
                          ? "DOT"
                          : "-"}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      {selectedToken?.symbol === "vETH" ? (
                        <p className="text-muted-foreground">
                          {roundLongDecimals(
                            formatEther(nativeBalance?.value ?? BigInt(0)),
                            6
                          )}{" "}
                          ETH
                        </p>
                      ) : selectedToken?.symbol === "vDOT" ? (
                        <p className="text-muted-foreground">
                          {roundLongDecimals(
                            formatEther(tokenBalances?.[0]?.result ?? BigInt(0)),
                            6
                          )}{" "}
                          DOT
                        </p>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                size="lg"
                className="hover:cursor-pointer text-lg font-bold"
                type="submit"
                disabled={
                  !canSubmit ||
                  isSubmitting ||
                  isPending
                }
              >
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please confirm in wallet
                  </>
                ) :  (
                  <>Mint</>
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

function SelectMintToken({ token }: { token: Token }) {
  return (
    <SelectItem value={token.symbol}>
      <div className="flex flex-row gap-2 items-center justify-center">
        <Image src={token.image} alt={token.symbol} width={24} height={24} />
        <p className="text-lg">{token.name}</p>
        <p className="text-lg text-muted-foreground">{token.symbol}</p>
      </div>
    </SelectItem>
  );
}
