const baseCSS =
    'color: #000000; font-style: italic; background-color: $color;padding: 2px';

export const logError = (msg: string) =>
    console.error('%c'.concat(msg), baseCSS.replace('$color', '#f35b69'));
export const logInfo = (msg: string) =>
    console.info('%c'.concat(msg), baseCSS.replace('$color', '#4d76ee'));
export const logSuccess = (msg: string) =>
    console.log('%c'.concat(msg), baseCSS.replace('$color', '##43c358'));
