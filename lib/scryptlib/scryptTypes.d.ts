export declare abstract class ScryptType {
    protected _value: number | BigInt | boolean | string;
    protected _literal: string;
    private _asm;
    constructor(value: number | BigInt | boolean | string);
    get value(): number | BigInt | boolean | string;
    get literal(): string;
    toASM(): string;
    abstract toLiteral(): string;
}
export declare class Int extends ScryptType {
    constructor(intVal: number | BigInt);
    toLiteral(): string;
}
export declare class Bool extends ScryptType {
    constructor(boolVal: boolean);
    toLiteral(): string;
}
export declare class Bytes extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
export declare class PrivKey extends ScryptType {
    constructor(intVal: number);
    toLiteral(): string;
}
export declare class PubKey extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
export declare class Sig extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
export declare class Ripemd160 extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
export declare class Sha1 extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
export declare class Sha256 extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
export declare class SigHashType extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
export declare class OpCodeType extends ScryptType {
    constructor(bytesVal: string);
    toLiteral(): string;
}
