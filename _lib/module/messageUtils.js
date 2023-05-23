import moment from "moment";

export const protectFromXSS = (text) => {
    return text.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;");
};

export const timestampToTime = (timestamp) => {
    const now = new Date().getTime();
    const nowDate = moment.unix(now.toString().length === 13 ? now / 1000 : now).format("MM/DD");
    let date = moment.unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp).format("MM/DD");
    if (date === "Invalid date") {
        date = "";
    }
    return nowDate === date ? moment.unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp).format("HH:mm") : date;
};

let processing = false;

export const handleEnterPress = async (e, callback) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
        processing = true;
        console.log("handleEnterPress");
        callback();
        await (processing = false);
    }
};
