type CssModuleType = {
    [key: string]: string;
} | {
    readonly [key: string]: string;
};

interface ModsType {
    [key: string]: boolean | string | number;
}

interface StatesType {
    [key: string]: boolean;
}

interface IBlock {
    (element?: string, mods?: ModsType | null, states?: StatesType | null): string;
    (mods?: ModsType | null, states?: StatesType | null): string;
}

interface IOptions {
    throwOnError?: boolean;
}

interface IModule {
    (cssModule: CssModuleType, name?: string): IBlock;
    setSettings(options: IOptions): void;
}

declare var bemModule: IModule;

export default bemModule;
