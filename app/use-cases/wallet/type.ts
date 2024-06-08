export type SubmitTokenDepositData = {
    amount: bigint;
};
export type WalletData = {
    address?: string;
    ethBalance?: string;
    isDAOMember?: boolean;
};
export type GetWalletResponse = WalletData & { error?: any };
export type WalletFormData = SubmitTokenDepositData;
