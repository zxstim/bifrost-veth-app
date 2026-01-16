"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";

interface DepositRow {
  block_timestamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
}

interface IndexSupplyResponse {
  cursor: string;
  columns: Array<{ name: string; pgtype: string }>;
  rows: Array<[string, string, string, string, string]>;
}

const VETH_CONTRACT = "0xc3997ff81f2831929499c4eE4Ee4e0F08F42D4D8";
const MINT_SELECTOR = "0x1166dab6";

const CHAIN_EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io",
  8453: "https://basescan.org",
  42161: "https://arbiscan.io",
  10: "https://optimistic.etherscan.io",
};

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  8453: "Base",
  42161: "Arbitrum",
  10: "Optimism",
};

async function fetchRecentDeposits(chainId: number): Promise<DepositRow[]> {
  const query = `SELECT block_timestamp, hash, "from", "to", value FROM txs WHERE chain = ${chainId} AND "to" = ${VETH_CONTRACT} AND "input" = ${MINT_SELECTOR} ORDER BY block_timestamp DESC LIMIT 10`;

  const params = new URLSearchParams({
    query,
  });

  const response = await fetch(
    `https://api.indexsupply.net/v2/query?api-key=secret&${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recent deposits");
  }

  const data: IndexSupplyResponse[] = await response.json();
  
  if (!data[0]?.rows) {
    return [];
  }

  // Transform rows array into DepositRow objects
  // Row format: [block_timestamp, hash, from, to, value]
  return data[0].rows.map((row) => ({
    block_timestamp: row[0],
    hash: row[1],
    from: row[2],
    to: row[3],
    value: row[4],
  }));
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: string): string {
  // API returns format like "2025-12-12 11:57:34.0 +00:00:00"
  // Extract just the date and time parts
  const match = timestamp.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2}):(\d{2})/);
  if (!match) {
    return timestamp;
  }
  const [, datePart, hours, minutes, seconds] = match;
  const date = new Date(`${datePart}T${hours.padStart(2, "0")}:${minutes}:${seconds}Z`);
  return date.toLocaleString();
}

export default function RecentDeposits() {
  const chainId = useChainId();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-deposits", chainId],
    queryFn: () => fetchRecentDeposits(chainId)
  });

  const explorerUrl = CHAIN_EXPLORERS[chainId] || "https://etherscan.io";
  const chainName = CHAIN_NAMES[chainId] || "Unknown";

  return (
    <div className="flex flex-col gap-4 border-t-2 border-primary border-dotted pt-8">
      <h2 className="text-lg font-semibold">Recent Deposits ({chainName})</h2>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-muted-foreground">Failed to load recent deposits</p>
      ) : data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-muted-foreground/20">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                  Time
                </th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                  From
                </th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium">
                  Amount
                </th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium">
                  Tx
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((deposit) => (
                <tr
                  key={deposit.hash}
                  className="border-b border-muted-foreground/10 hover:bg-muted/50"
                >
                  <td className="py-2 px-2 text-muted-foreground">
                    {formatTimestamp(deposit.block_timestamp)}
                  </td>
                  <td className="py-2 px-2 font-mono">
                    <a
                      href={`${explorerUrl}/address/${deposit.from}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {truncateAddress(deposit.from)}
                    </a>
                  </td>
                  <td className="py-2 px-2 text-right font-medium">
                    {parseFloat(formatUnits(BigInt(deposit.value), 18)).toFixed(
                      4
                    )}{" "}
                    ETH
                  </td>
                  <td className="py-2 px-2 text-right">
                    <a
                      href={`${explorerUrl}/tx/${deposit.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-mono"
                    >
                      {truncateAddress(deposit.hash)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground">No recent deposits found</p>
      )}
    </div>
  );
}
