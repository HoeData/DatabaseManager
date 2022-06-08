
const IsChar = (a) => {
    if (a >= 'a' && a <= 'z')
        return true;
    else if (a >= 'A' && a <= 'Z')
        return true;
    return false;
}
const IsNumber = (a) => {
    if (a >= '0' && a <= '9')
        return true;
    return false;
}


export { IsChar, IsNumber }