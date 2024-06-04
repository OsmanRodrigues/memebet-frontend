/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

interface Window {
    ethereum?: import('viem').EIP1193Provider & { isConnected: () => boolean };
}
