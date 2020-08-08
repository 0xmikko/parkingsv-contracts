"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.num2bin = exports.getPreimage = exports.toHex = exports.signTx = exports.getValidatedHexString = exports.hexStringToBytes = exports.bytesToHexString = exports.bytes2Literal = exports.literal2Asm = exports.int2Asm = exports.bool2Asm = exports.DEFAULT_SIGHASH_TYPE = exports.DEFAULT_FLAGS = exports.bsv = void 0;
var bsv = require("bsv");
exports.bsv = bsv;
var BN = bsv.crypto.BN;
var Interpreter = bsv.Script.Interpreter;
exports.DEFAULT_FLAGS = 
// @ts-ignore
Interpreter.SCRIPT_VERIFY_MINIMALDATA |
    // @ts-ignore
    Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID |
    // @ts-ignore
    Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES |
    // @ts-ignore
    Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES;
// @ts-ignore
exports.DEFAULT_SIGHASH_TYPE = 
// @ts-ignore
bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
function bool2Asm(str) {
    if (str === 'true') {
        return 'OP_TRUE';
    }
    if (str === 'false') {
        return 'OP_FALSE';
    }
    throw new Error("invalid str '" + str + "' to convert to bool");
}
exports.bool2Asm = bool2Asm;
/**
 * decimal int to little-endian signed magnitude
 */
function int2Asm(str) {
    if (!/^-?(0x)?\d+$/.test(str)) {
        throw new Error("invalid str '" + str + "' to convert to int");
    }
    // @ts-ignore
    var number = new BN(str, 10);
    // @ts-ignore
    if (number.eqn(-1)) {
        return 'OP_1NEGATE';
    }
    // @ts-ignore
    if (number.gten(0) && number.lten(16)) {
        return 'OP_' + str;
    }
    // @ts-ignore
    var m = number.toSM({ endian: 'little' });
    return m.toString('hex');
}
exports.int2Asm = int2Asm;
/**
 * convert literals to script ASM format
 */
function literal2Asm(l) {
    // bool
    if (l === 'false') {
        return ['OP_FALSE', 'bool'];
    }
    if (l === 'true') {
        return ['OP_TRUE', 'bool'];
    }
    // hex int
    if (/^0x[0-9a-fA-F]+$/.test(l)) {
        return [int2Asm(l), 'int'];
    }
    // decimal int
    if (/^-?\d+$/.test(l)) {
        return [int2Asm(l), 'int'];
    }
    // bytes
    var m = /^b'([\da-fA-F]+)'$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'bytes'];
    }
    // PrivKey
    // 1) decimal int
    m = /^PrivKey\((-?\d+)\)$/.exec(l);
    if (m) {
        return [m[1], 'PrivKey'];
    }
    // 2) hex int
    m = /^PrivKey\((0x[0-9a-fA-F]+)\)$/.exec(l);
    if (m) {
        return [m[1], 'PrivKey'];
    }
    // PubKey
    m = /^PubKey\(b'([\da-fA-F]+)'\)$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'PubKey'];
    }
    // Sig
    m = /^Sig\(b'([\da-fA-F]+)'\)$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'Sig'];
    }
    // Ripemd160
    m = /^Ripemd160\(b'([\da-fA-F]+)'\)$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'Ripemd160'];
    }
    // Sha1
    m = /^Sha1\(b'([\da-fA-F]+)'\)$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'Sha1'];
    }
    // Sha256
    m = /^Sha256\(b'([\da-fA-F]+)'\)$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'Sha256'];
    }
    // SigHashType
    m = /^SigHashType\(b'([\da-fA-F]+)'\)$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'SigHashType'];
    }
    // OpCodeType
    m = /^OpCodeType\(b'([\da-fA-F]+)'\)$/.exec(l);
    if (m) {
        return [getValidatedHexString(m[1]), 'OpCodeType'];
    }
    throw new Error("<" + l + "> can't be casted to asm format, only support sCrypt native types");
}
exports.literal2Asm = literal2Asm;
function bytes2Literal(bytearray, type) {
    switch (type) {
        case 'bool':
            // @ts-ignore
            return BN.fromBuffer(bytearray, { endian: 'little' }) > 0 ? 'true' : 'false';
        case 'int':
            // @ts-ignore
            return BN.fromSM(bytearray, { endian: 'little' }).toString();
        case 'bytes':
            return "b'" + bytesToHexString(bytearray) + "'";
        default:
            return "b'" + bytesToHexString(bytearray) + "'";
    }
}
exports.bytes2Literal = bytes2Literal;
function bytesToHexString(bytearray) {
    return bytearray.reduce(function (o, c) { return o += ('0' + (c & 0xFF).toString(16)).slice(-2); }, '');
}
exports.bytesToHexString = bytesToHexString;
function hexStringToBytes(hex) {
    getValidatedHexString(hex);
    return hex.split('')
        .reduce(function (o, c, i) {
        if (i % 2 === 0) {
            o.push(c);
        }
        else {
            o[o.length - 1] += c;
        }
        return o;
    }, new Array())
        .map(function (b) { return parseInt(b, 16); });
}
exports.hexStringToBytes = hexStringToBytes;
function getValidatedHexString(hex, allowEmpty) {
    if (allowEmpty === void 0) { allowEmpty = true; }
    var ret = hex.trim();
    if (ret.length < 1 && !allowEmpty) {
        throw new Error("can't be empty string");
    }
    if (ret.length % 2) {
        throw new Error('should have even length');
    }
    if (ret.length > 0 && !(/^[\da-f]+$/i.test(ret))) {
        throw new Error('should only contain [0-9] or characters [a-fA-F]');
    }
    return ret;
}
exports.getValidatedHexString = getValidatedHexString;
function signTx(tx, privateKey, lockingScriptASM, inputAmount, inputIndex, sighashType, flags) {
    if (inputIndex === void 0) { inputIndex = 0; }
    if (sighashType === void 0) { sighashType = exports.DEFAULT_SIGHASH_TYPE; }
    if (flags === void 0) { flags = exports.DEFAULT_FLAGS; }
    if (!tx) {
        throw new Error('param tx can not be empty');
    }
    if (!privateKey) {
        throw new Error('param privateKey can not be empty');
    }
    if (!lockingScriptASM) {
        throw new Error('param lockingScriptASM can not be empty');
    }
    if (!inputAmount) {
        throw new Error('param inputAmount can not be empty');
    }
    // @ts-ignore
    return bsv.Transaction.sighash.sign(tx, privateKey, sighashType, inputIndex, 
    // @ts-ignore
    bsv.Script.fromASM(lockingScriptASM), new bsv.crypto.BN(inputAmount), flags).toTxFormat();
}
exports.signTx = signTx;
function toHex(x) {
    return x.toString('hex');
}
exports.toHex = toHex;
function getPreimage(tx, inputLockingScriptASM, inputAmount, inputIndex, sighashType, flags) {
    if (inputIndex === void 0) { inputIndex = 0; }
    if (sighashType === void 0) { sighashType = exports.DEFAULT_SIGHASH_TYPE; }
    if (flags === void 0) { flags = exports.DEFAULT_FLAGS; }
    // @ts-ignore
    return bsv.Transaction.sighash.sighashPreimage(tx, sighashType, inputIndex, bsv.Script.fromASM(inputLockingScriptASM), new bsv.crypto.BN(inputAmount), flags);
}
exports.getPreimage = getPreimage;
// Converts a number into a sign-magnitude representation of certain size as a string
// Throws if the number cannot be accommodated
// Often used to append numbers to OP_RETURN, which are read in contracts
// TODO: handle bigint
function num2bin(n, dataLen) {
    if (n === 0) {
        return "00".repeat(dataLen);
    }
    // @ts-ignore
    var num = BN.fromNumber(n);
    var s = num.toSM({ endian: 'little' }).toString('hex');
    var byteLen_ = s.length / 2;
    if (byteLen_ > dataLen) {
        throw new Error(n + " cannot fit in " + dataLen + " byte[s]");
    }
    if (byteLen_ === dataLen) {
        return s;
    }
    var paddingLen = dataLen - byteLen_;
    var lastByte = s.substring(s.length - 2);
    var rest = s.substring(0, s.length - 2);
    var m = parseInt(lastByte, 16);
    if (n < 0) {
        // reset sign bit
        m &= 0x7F;
    }
    var mHex = m.toString(16);
    if (mHex.length < 2) {
        mHex = '0' + mHex;
    }
    var padding = n > 0 ? '00'.repeat(paddingLen) : '00'.repeat(paddingLen - 1) + '80';
    return rest + mHex + padding;
}
exports.num2bin = num2bin;
//# sourceMappingURL=utils.js.map