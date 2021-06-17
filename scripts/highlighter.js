const input = document.querySelector('#chatInput');

const isHighlight = (word) => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(word) || /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(word) || /^#/.test(word) || /^@/.test(word);

const highlightWords = (e) => {
  if (e.code === 'Space') {
    input.focus();
    const sel = document.getSelection();

    const nodes = [...input.childNodes].filter((node) => node.length > 0);
    const lastNode = nodes[nodes.length - 1];
    const words = lastNode.textContent.trim().split(' ');
    const lastWord = words[words.length - 1];
    const ran = new Range();

    ran.setStart(lastNode, lastNode.length - lastWord.length);
    ran.setEnd(lastNode, lastNode.length);

    sel.addRange(ran);

    if (isHighlight(ran.toString())) {
      ran.deleteContents();

      const el = document.createElement('a');
      el.classList.add('highlight');
      el.setAttribute('href', lastWord);
      el.innerText = lastWord.trim();

      ran.insertNode(el);

      sel.removeAllRanges();
      sel.addRange(ran);
    }

    ran.collapse();
  }
};

input.addEventListener('keydown', highlightWords);
