export const transformHexToUTF8 = (str: string) =>
    decodeURIComponent(
        str
            .replace('0x', '')
            .replace(/\s+/g, '')
            .replace(/[0-9a-f]{2}/g, '%$&')
    );
