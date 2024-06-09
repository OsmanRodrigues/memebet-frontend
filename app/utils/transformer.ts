import { stringToHex, hexToString } from 'viem';

export const transformHexToUTF8 = (str: string): string =>
    hexToString(str as `0x${string}`);
export const transformUTF8toHex = (string: string): string =>
    stringToHex(string, {
        size: string.length < 32 ? 32 : undefined
    });

export const textShortener = (text: string, maxSize = 8): string => {
    const offsetSize = 3;
    if (text.length <= maxSize || text.length < offsetSize) return text;

    return `${text.slice(0, maxSize - offsetSize)}...${text.slice(-offsetSize)}`;
};
export const transformBalanceStrIntoNum = (balanceStr?: string): number => {
    if (balanceStr?.includes?.('wei')) {
        const balanceStrSplit = balanceStr.split('wei');
        const validBalanceStr =
            balanceStrSplit[0].trim() ?? balanceStrSplit[1].trim();

        return Number(validBalanceStr);
    }
    return 0;
};
