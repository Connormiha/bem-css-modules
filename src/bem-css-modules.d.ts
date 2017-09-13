declare interface CssModuleType {
    [key: string]: string;
}

declare interface ModsType {
    [key: string]: boolean | string | number;
}

declare interface StatesType {
    [key: string]: boolean;
}

declare function Block(element?: string, mods?: ModsType | null, states?: StatesType | null): string;
export default (cssModule: CssModuleType) => Block;
