/**
 *
 * @param {string} algorithm
 * @param {...(string | Buffer)} datas
 * @returns {string}
 */
export function commonGenerateDigest(algorithm: string, ...datas: (string | Buffer)[]): string;
