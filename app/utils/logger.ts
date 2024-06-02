const baseCSS =
    'color: #000000; font-style: italic; background-color: $color;padding: 2px';
const applyTimestamp = (msg: string) => `[${new Date().toISOString()}]` + msg;

export const logError = (msg: string) =>
    console.error(
        '%c'.concat(applyTimestamp(msg)),
        baseCSS.replace('$color', '#f35b69')
    );
export const logInfo = (msg: string) =>
    console.info(
        '%c'.concat(applyTimestamp(msg)),
        baseCSS.replace('$color', '#4d76ee')
    );
export const logSuccess = (msg: string) =>
    console.log(
        '%c'.concat(applyTimestamp(msg)),
        baseCSS.replace('$color', '#43c358')
    );
