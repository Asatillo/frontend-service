export function formatDateString(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}

export function convertPeriodToDate(period) {
    if(period === 'ZERO') {
        return 'No duration';
    }

    // Remove the 'P' prefix
    period = period.substring(1);

    // Define time units
    const units = {
        'Y': ' year',
        'M': ' month',
        'D': ' day'
    };

    // Initialize result
    let result = '';

    // Process each unit
    for (let unit in units) {
        let index = period.indexOf(unit);
        if (index !== -1) {
            let value = period.substring(0, index);
            result += value + (value == 1 ? units[unit] : units[unit] + 's') + ', ';
            period = period.substring(index + 1);
        }
    }

    // Remove trailing comma and space
    result = result.substring(0, result.length - 2);

    return result;
}

export function convertDateToPeriod(days, months, years) {
    if(days + months + years === 0) {
        return 'ZERO';
    }

    let period = 'P';
    if (years > 0) {
        period += years + 'Y';
    }

    if (months > 0) {
        period += months + 'M';
    }

    if (days > 0) {
        period += days + 'D';
    }
    return period;
}

export function periodToNumbers(period){
    if(period === 'ZERO') {
        return [0, 0, 0];
    }

    // Remove the 'P' prefix
    period = period.substring(1);

    const units = {
        'Y': 'years',
        'M': 'months',
        'D': 'days'
    };

    let result = [];
    for (let unit in units) {
        let index = period.indexOf(unit);
        if (index !== -1) {
            let value = period.substring(0, index);
            result[units[unit]] = value;
            period = period.substring(index + 1);
        }
    }

    return result;
}