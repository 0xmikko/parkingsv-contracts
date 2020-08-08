import { ABIEntity } from './abi';
export declare enum CompileErrorType {
    SyntaxError = "SyntaxError",
    SemanticError = "SemanticError",
    ImportError = "ImportError"
}
export interface CompileErrorBase {
    type: string;
    filePath: string;
    position: {
        line: number;
        column: number;
    };
    message: string;
}
export interface SyntaxError extends CompileErrorBase {
    type: CompileErrorType.SyntaxError;
    unexpected: string;
    expecting: string;
}
export interface SemanticError extends CompileErrorBase {
    type: CompileErrorType.SemanticError;
}
export interface ImportError extends CompileErrorBase {
    type: CompileErrorType.ImportError;
    file: string;
}
export declare type CompileError = SyntaxError | SemanticError | ImportError;
export interface CompileResult {
    asm?: string;
    debugAsm?: DebugModeAsmWord[];
    ast?: Record<string, unknown>;
    dependencyAsts?: Record<string, unknown>;
    abi?: Array<ABIEntity>;
    errors: CompileError[];
    compilerVersion?: string;
    contract?: string;
    md5?: string;
}
export declare enum DebugModeTag {
    FuncStart = "F0",
    FuncEnd = "F1",
    LoopStart = "L0"
}
export interface DebugModeAsmWord {
    file?: string;
    line?: number;
    endLine?: number;
    column?: number;
    endColumn: number;
    opcode: string;
    stack: string[];
    debugTag?: DebugModeTag;
}
export declare function compile(source: {
    path: string;
    content?: string;
}, settings?: {
    ast?: boolean;
    asm?: boolean;
    debug?: boolean;
    desc?: boolean;
    outputDir?: string;
    outputToFiles?: boolean;
    cmdArgs?: string;
}): CompileResult;
export declare function compilerVersion(): string;
