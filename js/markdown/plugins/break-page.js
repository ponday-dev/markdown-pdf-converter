function break_page(state, startLine, endLine, silent) {
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    const marker = state.src.charCodeAt(pos);
    if (marker !== 0x3B/* ; */) { return false; }

    const cnt = state.src.slice(pos, max + 1)
        .split('')
        .map(c => c.charCodeAt())
        .filter(c => !isSpace(c))
        .filter(c => c === marker)
        .length;
    
    if (cnt < 3) { return false; }

    if (silent) { return true; }

    state.line = startLine + 1;

    const token = state.push('break_page', 'break_page', 0);
    token.map    = [ startLine, state.line ];
    token.markup = Array(cnt + 1).join(String.fromCharCode(marker));

    return true;
}

function isSpace(code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}
  

module.exports = function break_page_plugin(md) {
    md.block.ruler.before('paragraph', 'break_page', break_page);
    md.renderer.rules.break_page = function (tokens, idx, options, env, self) {
        return  '<p style="break-after: page;"></p>';
    };
}
