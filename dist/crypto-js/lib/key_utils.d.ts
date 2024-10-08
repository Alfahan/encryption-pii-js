/// <reference types="node" />
export const KEY_SIZE_1KB: number;
export const KEY_SIZE_2KB: number;
export const KEY_SIZE_4KB: number;
export const HMAC_MINIMUM_KEY_SIZE: 8;
export const AES_128_KEY_SIZE: 16;
export const AES_192_KEY_SIZE: 24;
export const AES_256_KEY_SIZE: 32;
export const MIN_CUSTOM_KEY_LEN: 32;
export const IV_SIZE: 12;
export function generateRandomIV(size?: number): string;
export function checkKeyInput(key: string | Buffer): void | Error;
import { Buffer } from "buffer";
