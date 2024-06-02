type DateStringFormat = 'dd/mm/yyyy hh:mm' | 'mm/dd/yyyy hh:mm';
type DateStringSeparator = '/' | '-';
type DateUtilOption = {
    separator?: DateStringSeparator;
    format?: DateStringFormat;
    shouldResetTime?: boolean;
};

export const isDateISOStrCheck = (dateStr: string): boolean =>
    !!dateStr.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+/);
export const getDateStr = (
    currentDate: string | Date,
    option?: DateUtilOption
): string => {
    const separatorFallback = option?.separator ?? '/';
    const formatFallback = option?.format ?? 'dd/mm/yyyy hh:mm';

    if (typeof currentDate === 'string' && isDateISOStrCheck(currentDate)) {
        const dateISOStrSplit = currentDate.split('T');
        const dateStrSplit = dateISOStrSplit[0].split('-');
        const timeStr = dateISOStrSplit[1].slice(0, 5);
        const day = dateStrSplit[2];
        const month = dateStrSplit[1];
        const year = dateStrSplit[0];

        if (formatFallback === 'dd/mm/yyyy hh:mm')
            return `${day}${separatorFallback}${month}${separatorFallback}${year} ${timeStr}`;
        else if (formatFallback === 'mm/dd/yyyy hh:mm')
            return `${month}${separatorFallback}${day}${separatorFallback}${year} ${timeStr}`;
    }
    const roudDateTimeNumber = (dateTimeNumber: number) =>
        `${dateTimeNumber >= 10 ? dateTimeNumber : `0${dateTimeNumber}`}`;
    const date =
        typeof currentDate === 'string'
            ? new Date(Number.isNaN(+currentDate) ? currentDate : +currentDate)
            : currentDate;
    const day = date.getDate();
    const month = date.getMonth() + 1; //NOTE: JS Date consider month count from 0
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const timeStr = `${roudDateTimeNumber(hour)}:${roudDateTimeNumber(minute)}`;
    let dateStr = '';

    if (formatFallback === 'dd/mm/yyyy hh:mm')
        dateStr = `${roudDateTimeNumber(day)}${separatorFallback}${roudDateTimeNumber(month)}${separatorFallback}${year} ${timeStr}`;
    else if (formatFallback === 'mm/dd/yyyy hh:mm')
        dateStr = `${roudDateTimeNumber(month)}${separatorFallback}${roudDateTimeNumber(day)}${separatorFallback}${year} ${timeStr}`;

    return dateStr;
};
