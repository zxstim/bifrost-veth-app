import { BaseError } from "viem";
import { Ban, LoaderCircle, CircleCheck, X } from "lucide-react";
import CopyButton from "@/components/copy-button";
import { truncateHash } from "@/lib/utils";

interface TransactionStatusProps {
  hash?: string;
  isPending?: boolean;
  isConfirming?: boolean;
  isConfirmed?: boolean;
  error?: Error | null;
  config: {
    chains?: readonly {
      id: number;
      blockExplorers?: {
        default?: {
          url: string;
        };
      };
    }[];
  };
  chainId?: number;
}

export function TransactionStatus({
  hash,
  isPending,
  isConfirming,
  isConfirmed = false,
  error,
  config,
  chainId,
}: TransactionStatusProps) {
  const getStatusIcon = () => {
    if (error) return <X className="w-4 h-4 text-red-500" />;
    if (isConfirmed) return <CircleCheck className="w-4 h-4 text-green-500" />;
    if (isConfirming)
      return <LoaderCircle className="w-4 h-4 animate-spin text-yellow-500" />;
    return <Ban className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (error) return (error as BaseError).shortMessage || error.message;
    if (isConfirmed) return "Confirmed";
    if (isConfirming) return "Confirming...";
    return null;
  };

  const blockExplorerUrl =
    config.chains?.find((chain) => chain.id === chainId)?.blockExplorers
      ?.default?.url || config.chains?.[0]?.blockExplorers?.default?.url;

  // No transaction yet
  if (!hash && !isPending && !isConfirming && !isConfirmed && !error) {
    return (
      <div className="flex flex-row gap-2 items-center">
        <Ban className="w-4 h-4" /> No transaction
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      {getStatusIcon()}
      {hash ? (
        <>
          <a
            className="underline underline-offset-4"
            href={`${blockExplorerUrl}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncateHash(hash)}
          </a>
          <CopyButton copyText={hash} />
          {getStatusText() && (
            <span
              className={
                error
                  ? "text-red-500"
                  : isConfirmed
                  ? "text-green-500"
                  : "text-yellow-500"
              }
            >
              · {getStatusText()}
            </span>
          )}
        </>
      ) : (
        <span>{getStatusText()}</span>
      )}
    </div>
  );
}
