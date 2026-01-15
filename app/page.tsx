import MintComponent from "@/components/mint-component";
import VethData from "@/components/veth-data";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16">
        <div className="flex flex-col gap-6">
          <p className="border-2 border-primary rounded-none px-2 py-1 w-fit">
            INSTITUTIONAL GRADE
          </p>
          <h1 className="scroll-m-20 text-5xl md:text-7xl font-extrabold tracking-loose text-balance">
            Crosschain Liquid Staking for <br />{" "}
            <span className="underline underline-offset-4">Ethereum</span>
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl">
            Secure the Ethereum network and earn optimized staking rewards by
            minting vETH. Permissionlessly crosschain.
          </p>
          <VethData />
        </div>
        <MintComponent />
      </div>
    </div>
  );
}
