var TinyTemplate = {
    filters: {
        first (list) {
            return list[0];
        }
    },
    _filterd (str) {
        let splits = str.split('|');
        let arg = splits[0];
        let fns = splits.slice(1);
        let filterCallStackStr = arg;
        fns.forEach(function(fn) {
            filterCallStackStr = `filters.${fn}(${filterCallStackStr})`;
        });
        return filterCallStackStr;
    },
    compile (str, options) {
        let open = options.open || '<%';
        let close = options.close || '%>';
        let functionBody = '';
        let buf = '';
    
        buf += `
            var buf = [];
            with(locals) { (function(){`;
        buf += "buf.push('";
    
        for (let i = 0; i < str.length ; i++) {
            let s = str[i];
            if (str.slice(i,  open.length + i) === open) {
                i += open.length;
                let prefix = "');";
                let postfix = "buf.push('";
                if (str[i] === '=') {
                    ++i;
                    prefix += 'buf.push(';
                    postfix = ");" + postfix;
                }
                let end = str.indexOf(close, i);
                let content = str.substring(i, end);
                if (content.indexOf('|') !== -1) {
                    content = this._filterd(content);
                }
                buf += prefix;
                buf += content;
                buf += postfix;
                i += content.length + close.length;
            } else {
                buf += s;
            }
        }
        buf += "');";
        buf += `
            })();
         }
         return buf.join('');
        `
        functionBody = buf.replace(/\n/g, '');
        return new Function('locals, filters', functionBody);
    },
    render (str, options) {
        let compiled = this.compile(str, options);
        return compiled.call(this, options, this.filters);
    }
}
 