// Copy code button for Jekyll/Rouge
document.addEventListener("DOMContentLoaded", function() {
  const codeBlocks = document.querySelectorAll('div.highlighter-rouge, div.highlight');

  codeBlocks.forEach(function(codeBlock) {
    // Check if a button already exists
    if (codeBlock.querySelector('.copy-code-button')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.innerText = 'Copy';
    button.ariaLabel = 'Copy code to clipboard';

    button.addEventListener('click', function() {
      // Try to find the actual code content
      // If line numbers are present (table structure), we need to handle it.
      // Rouge with line numbers usually has: .rouge-code > pre
      let codeText = '';
      const rougeCode = codeBlock.querySelector('.rouge-code pre');
      if (rougeCode) {
        codeText = rougeCode.innerText;
      } else {
        // Fallback for no line numbers or different structure
        const codeElement = codeBlock.querySelector('code');
        if (codeElement) {
            codeText = codeElement.innerText;
        } else {
             // Ultimate fallback
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

    // Ensure the container has relative positioning for the button
    // codeBlock.style.position = 'relative'; // This is already in _custom.scss for .highlight

    codeBlock.appendChild(button);
  });
});
