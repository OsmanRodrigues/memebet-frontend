import { utils } from 'web3';

export const transformHexToUTF8 = (str: string): string => utils.toUtf8(str);
export const transformUTF8toHex = (string: string): string => {
    const hex = utils.fromUtf8(string);
    return utils.padRight(hex, 66 - '0x'.length);
};
