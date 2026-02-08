export function getRoomIndex(pathname: string) {
    switch (pathname) {
        case "/":
            return 0;
        case "/corridor":
            return 1;
        case "/gallery":
            return 2;
        case "/playground":
            return 3;
        case "/workshop":
            return 4;
        case "/quiet":
            return 5;
        default:
            return 0;
    }
}