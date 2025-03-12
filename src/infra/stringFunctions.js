export function normalise(str){
    str = str.toLowerCase();
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str;
}