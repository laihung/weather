import { Observable } from "rxjs";

export class Storage {

    private static storage = {};
    private static _isValid: boolean;

    static get(key: string, isJsStore = false) {
        if (isJsStore) {
            return this[key];
        }

        return this.isValid()
            ? JSON.parse(sessionStorage.getItem(key))
            : this.storage[key];
    }

    static set(key: string, value: any, isJsStore = false) {
        if (isJsStore) {
            this.storage[key] = value;
            return;
        }
        this.isValid()
            ? sessionStorage.setItem(key, JSON.stringify(value))
            : this.storage[key] = value;
    }


    static clear(key: string) {
        this.isValid()
            ? sessionStorage.removeItem(key)
            : delete this.storage[key];
    }

    static isValid() {
        try {
            if (this._isValid !== undefined) {
                return this._isValid;
            }
            if (!window.sessionStorage) {
                return this._isValid = false;
            }
            // Safari Private Browsing Solution : Set testing code to test whether window.sessionStorage can be used 
            window.sessionStorage.setItem('isSessionValid', 'true');
            // Safari Private Browsing Solution : Remove testing session if window.sessionStorage can be used
            window.sessionStorage.removeItem('isSessionValid');

            return this._isValid = true;
        } catch (e) {
            return false;
        }
    }


}