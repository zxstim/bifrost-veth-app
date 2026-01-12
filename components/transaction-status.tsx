import { BaseError } from "viem";
import { Hash, ExternalLink, Ban, LoaderCircle, CircleCheck, X } from "lucide-react";
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
  return (
    <div className="flex flex-col gap-2">
      {hash && (isConfirmed || isConfirming) ? (
        <div className="flex flex-row gap-2 items-center">
          <Hash className="w-4 h-4" />
          Transaction Hash
          <a
            className="flex flex-row gap-2 items-center underline underline-offset-4"
            href={`${config.chains?.find(chain => chain.id === chainId)?.blockExplorers?.default?.url || config.chains?.[0]?.blockExplorers?.default?.url}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncateHash(hash)}
            <ExternalLink className="w-4 h-4" />
          </a>
          <CopyButton copyText={hash} />
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <Hash className="w-4 h-4" />
          No transaction hash
        </div>
      )}

      {!isPending && !isConfirmed && !isConfirming && (
        <div className="flex flex-row gap-2 items-center">
          <Ban className="w-4 h-4" /> No transaction submitted
        </div>
      )}

      {isConfirming && (
        <div className="flex flex-row gap-2 items-center text-yellow-500">
          <LoaderCircle className="w-4 h-4 animate-spin" /> Waiting for confirmation...
        </div>
      )}

      {hash && isConfirmed && !isPending && !isConfirming && (
        <div className="flex flex-row gap-2 items-center text-green-500">
          <CircleCheck className="w-4 h-4" /> Transaction confirmed!
        </div>
      )}

      {error && (
        <div className="flex flex-row gap-2 items-center text-red-500">
          <X className="w-4 h-4" /> Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
}
