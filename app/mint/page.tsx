"use client";

import BalancesComponent from "@/components/balances-component";
import MintComponent from "@/components/mint-component";

export default function Page() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BalancesComponent />
      <MintComponent />
    </div>
  );
}
