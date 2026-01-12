"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet, injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { mainnet, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { ThemeProvider } from "@/components/theme-provider";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "Bifrost SLPX App", // Name your app
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // Enter your WalletConnect Project ID here
  wallets: [
    {
      groupName: "Installed",
      wallets: [injectedWallet],
    },
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [mainnet, base, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL_MAINNET!),
    [base.id]: http(process.env.NEXT_PUBLIC_RPC_URL_BASE!),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_RPC_URL_ARBITRUM!),
    [optimism.id]: http(process.env.NEXT_PUBLIC_RPC_URL_OPTIMISM!),
  },
  ssr: true, // Because it is Nextjs's App router, you need to declare ssr as true
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
