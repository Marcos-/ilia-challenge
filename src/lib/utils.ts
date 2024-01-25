import moment from "moment";

// P1Y1M1DT1H1M1.1S	One year, one month, one day, one hour, one minute, one second, and 100 milliseconds

// Calculate worked hours from a given date
// dia: '2022-01-01',
// pontos: ['09:00:00', '12:00:00', '13:00:00', '18:00:00'],
// returns: 'PT8H'
export const calculateWorkedHours = (date: string, points: string[]): string => {

    if (points.length > 4 || points.length < 2) {
        throw new Error("Invalid number of points");
    }

    if (points.length == 2) {
        const firstPoint = moment(`${date}T${points[0]}`);
        const lastPoint = moment(`${date}T${points[1]}`);
        const workedHours = moment.duration(lastPoint.diff(firstPoint));
        return workedHours.toISOString();
    }

    const firstPoint = moment(`${date}T${points[0]}`);
    const lunchBreakStart = moment(`${date}T${points[1]}`);
    const lunchBreakEnds = moment(`${date}T${points[2]}`);
    const lastPoint = moment(`${date}T${points[points.length - 1]}`);
    const workedHours = moment.duration(lastPoint.diff(firstPoint) - lunchBreakEnds.diff(lunchBreakStart));

    if (lunchBreakEnds.diff(lunchBreakStart) < 3600000){
        throw new Error("Invalid lunch break");
    }
    
    return workedHours.toISOString();
}