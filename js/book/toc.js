/**
 * table of contents
 */
module.exports = ({ document }) => {
    const li = [...document.querySelectorAll('h1, h2:not(:first-child)')].map((header, index) => {
        headerText = header.innerHTML;
        header.innerHTML = `<a id="${index}"><span class="chap-num">${headerText}</span></a>`;
        return `<li${ header.tagName === 'H2' ? ' class="sub"' : ''}><a href="#${index}">${headerText}</a></li>`;
    });
    const ol = document.createElement('ol');
    ol.innerHTML = li.join('');
    document.getElementById('toc').appendChild(ol);
}
