import { Timestamp } from "firebase/firestore";

//vars
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


//funcs
export function extractUrl(res: string) {
    const match = res.match(/https?:\/\/\S+/);
    if (match) {
        return match[0];
    } else {
        return "";
    }
}


export function extractTime(time: Timestamp, short = true) {
    if (short) {
        const datetime = time.toDate();
        const hr = datetime.getHours();
        const mins = datetime.getMinutes();

        const hr12 = hr % 12 === 0 ? 12 : hr % 12;
        const ampm = hr >= 12 ? "pm" : "am";
        const minuteStr = mins < 10 ? `0${mins}` : mins;

        return `${hr12}:${minuteStr} ${ampm}`

    } else {
        const datetime = time.toDate();
        const month = datetime.getMonth();
        const date = datetime.getDate();
        const year = datetime.getFullYear();
        const hr = datetime.getHours();
        const mins = datetime.getMinutes();

        const hr12 = hr % 12 === 0 ? 12 : hr % 12;
        const ampm = hr >= 12 ? "pm" : "am";
        const minuteStr = mins < 10 ? `0${mins}` : mins;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const dateOnly = new Date(year, month, date);

        if (dateOnly.getTime() === today.getTime()) {
            return `Today at ${hr12}:${minuteStr} ${ampm}`;
        } else if (dateOnly.getTime() === yesterday.getTime()) {
            return `Yesterday at ${hr12}:${minuteStr}${ampm}`;
        } else {
            function ordinal(d: number) {
                if (d > 3 && d < 21) return 'th';
                switch (d % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            };
            const monthName = monthNames[month];
            return `${monthName} ${date}${ordinal(date)} ${year}, at ${hr12}:${minuteStr} ${ampm}`
        }

    }
}


export function calcTime(time: Timestamp) {
    const dateSeconds = time.toDate().getTime();
    const now = (new Date()).getTime();

    const seconds = Math.floor((now - dateSeconds) / 1000);

    const intervals = {
        year: 365 * 24 * 60 * 60,
        month: 30 * 24 * 60 * 60,
        day: 86400,
        hr: 3600,
        minute: 60,
        second: 1
    }
    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1) {
            return `${count} ${unit}${count >= 1 ? "s" : ""} ago`
        }
    }
    return "just now";

}


export function genPostTitle(email: string) {
    const userName = email.split("@")[0];
    const dateTime = new Date();
    const hr = dateTime.getHours();
    const mn = dateTime.getMinutes();
    const sec = dateTime.getSeconds();
    const day = dateTime.getDate();
    const month = dateTime.getMonth();
    const year = dateTime.getFullYear();

    return `${userName}-${day}-${month}-${year}_${hr}_${mn}_${sec}`;

}