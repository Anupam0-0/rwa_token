import { createClient } from '@connect2ic/core';
import { useConnect } from '@connect2ic/react';
import { InternetIdentity } from '@connect2ic/core/providers/internet-identity';
import { PlugWallet } from '@connect2ic/core/providers/plug-wallet';

const client = createClient({
  providers: [
    new InternetIdentity(),
    new PlugWallet(),
  ],
});

export function useWalletConnect() {
  const { connect, disconnect, isConnected, principal, activeProvider } = useConnect();
  return {
    connect,
    disconnect,
    isConnected,
    principal,
    activeProvider,
  };
}

export { client }; 