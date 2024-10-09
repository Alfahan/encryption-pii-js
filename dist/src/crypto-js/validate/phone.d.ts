export function parsePhone(v: any): {
    v: string;
};
export function getPhoneValue(phone: any): Promise<any>;
export function phoneToString(phone: any): string;
export function phoneToStringP(phone: any): Promise<string>;
export function phoneToSlice(phone: any): Promise<string[]>;
export function isValidPhone(phone: any): boolean;
export function numbersOnly(v: any): any;
export function correctLength(length: any, minLength: any, maxLength: any): boolean;
