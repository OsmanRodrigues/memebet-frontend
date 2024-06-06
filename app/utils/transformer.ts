import { utils } from 'web3';

export const transformHexToUTF8 = (str: string): string => utils.toUtf8(str);
export const transformUTF8toHex = (string: string): string => {
    const hex = utils.fromUtf8(string);
    return utils.padRight(hex, 66 - '0x'.length);
};
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
