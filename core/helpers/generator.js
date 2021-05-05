const keys = { key: 0 };

class Generator {
    randomStr(str = "", len = 8) {
        let isNum = Math.random() < 0.5,
            min = isNum ? 48 : 97,
            max = isNum ? 57 : 122,
            symb = String.fromCharCode(this.randomNumber(min, max));
        return len <= str.length ? str : this.randomStr(`${str}${symb}`, len);
    }

    genKey(str = "key", len = 8) {
        if(!keys.hasOwnProperty(str)) keys[str] = 0;
        keys[str]++;
        const increment = keys[str];
        let randStr = this.randomStr("", len);
        return `${str.toUpperCase()}-${increment}-${new Date().getTime() + increment}-${randStr.toUpperCase()}`;
    }

    randomNumber(min, max, isInteger = true) {
        let num = Math.random() * (max + 1 - min);
        return isInteger ? Math.floor(num) + min : num + min;
    }
}

export default new Generator();