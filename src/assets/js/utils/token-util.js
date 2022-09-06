import jsCookie from "js-cookie";
const CookieKey = "Admin-Token"
const TokenPrefix = "Bearer "

/**
 * 获取Token
 * @returns {string}        Token
 */
export function getToken() {
    return jsCookie.get(CookieKey);
}

/**
 * 设置Token
 * @param token         Token
 */
export function setToken(token) {
    return jsCookie.set(CookieKey, TokenPrefix.concat(token));
}

/**
 * 删除Token
 */
export function removeToken() {
    return jsCookie.remove(CookieKey);
}

export {CookieKey, TokenPrefix} // 导出常量