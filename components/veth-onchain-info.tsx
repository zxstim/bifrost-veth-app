export default function VethOnchainInfo() {
  return (
    <div className="grid grid-cols-3 border-t-2 border-muted-foreground/20 pt-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg text-muted-foreground">Total Value Locked</h1>
        <p className="font-bold text-4xl">$2M+</p>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg text-muted-foreground">Total stakers</h1>
        <p className="font-bold text-4xl">628</p>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg text-muted-foreground">Current APY</h1>
        <p className="font-bold text-4xl">21%</p>
      </div>
    </div>
  );
}