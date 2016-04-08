import moment from 'moment';
const weekday = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
]
export default function(date) {
    if (date.constructor === Date) {
        date = moment(date);
    } else if (typeof date === 'number') {
        date = moment(date, 'X');
    } else if (moment.isMoment(date)) {
        date = date;
    } else {
        date = moment(new Date);
    }
    const now = moment(new Date());
    let ret = '';
    if (now.year() === date.year() &&
        now.month() === date.month() &&
        now.date() === date.date()) {
        ret = date.format('HH:mm');
    } else if (now.year() === date.year() &&
        now.month() === date.month() &&
        now.date() === date.date() + 1) {
        ret = '昨天';
    } else if (now.year() === date.year() &&
            now.week() === date.week()) {
        ret = weekday[date.weekday()];
    } else {
        ret = date.format('MM/DD/YY');
    }   
    return ret; 
}