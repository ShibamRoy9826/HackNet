export function chunkArray(arr: string[], chunkSize: number) {
    const newArr = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        newArr.push(arr.slice(i, i + chunkSize));
    }
    return newArr;
}