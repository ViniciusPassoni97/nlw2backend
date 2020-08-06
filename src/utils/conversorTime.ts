export default function conversorTime(time:string){
    const [hours,minutes] = time.split(":").map(Number);
    const minutesTotal = (hours*60) + minutes;
    return minutesTotal;
}