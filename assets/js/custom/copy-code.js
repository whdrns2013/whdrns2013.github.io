// Copy code button for Jekyll/Rouge
document.addEventListener("DOMContentLoaded", function() {
  const codeBlocks = document.querySelectorAll('div.highlighter-rouge, div.highlight');

  codeBlocks.forEach(function(codeBlock) {
    // Check if toolbar already exists
    if (codeBlock.querySelector('.code-toolbar')) {
      return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';

    // 1. Prepare Copy Button
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.innerText = 'Copy';
    button.ariaLabel = 'Copy code to clipboard';

    button.addEventListener('click', function() {
      // Try to find the actual code content
      let codeText = '';
      const rougeCode = codeBlock.querySelector('.rouge-code pre');
      if (rougeCode) {
        codeText = rougeCode.innerText;
      } else {
        const codeElement = codeBlock.querySelector('code');
        if (codeElement) {
            codeText = codeElement.innerText;
        } else {
            codeText = codeBlock.innerText;
        }
      }

      navigator.clipboard.writeText(codeText).then(function() {
        button.innerText = 'Copied!';
        button.classList.add('copied');
        setTimeout(function() {
          button.innerText = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      }, function(err) {
        console.error('Could not copy text: ', err);
        button.innerText = 'Error';
      });
    });

    toolbar.appendChild(button);

    // 2. Prepare Language Badge
    let lang = "";
    codeBlock.classList.forEach(cls => {
      if (cls.startsWith('language-')) {
        lang = cls.replace('language-', '');
      }
    });

    if (lang) {
      const badge = document.createElement('span');
      badge.className = 'code-lang-badge';
      badge.innerText = lang.toUpperCase();
      toolbar.appendChild(badge);
    }

    // Append toolbar to code block
    codeBlock.appendChild(toolbar);
  });
});