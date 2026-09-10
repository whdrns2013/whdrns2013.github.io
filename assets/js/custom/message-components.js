(function () {
  function type(element, selector, text, speed, onComplete) {
    var output = element.querySelector(selector);
    if (!output) return;
    output.textContent = '';
    var index = 0;
    function next() {
      if (index >= text.length) { element.classList.add('is-complete'); if (onComplete) onComplete(); return; }
      var character = text.charAt(index++);
      output.textContent += character;
      var delay = speed;
      if (/[.!?。！？]/.test(character)) delay += 220;
      else if (/[,，]/.test(character)) delay += 90;
      else if (character === ' ') delay *= 0.45;
      window.setTimeout(next, Math.max(8, delay + Math.round(Math.random() * 16 - 8)));
    }
    next();
  }

  function itemText(item) {
    var html = item.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    var holder = document.createElement('div');
    holder.innerHTML = html;
    return holder.textContent.trim();
  }

  function buildConversation(list, reduced) {
    var items = Array.prototype.slice.call(list.children).map(function (item) {
      return itemText(item);
    }).filter(Boolean);
    var title = list.getAttribute('data-title') || 'CONVERSATION';
    var channel = list.getAttribute('data-channel') || '';
    function getAttribute(names, fallback) {
      for (var i = 0; i < names.length; i += 1) {
        var value = list.getAttribute(names[i]);
        if (value !== null) return value;
      }
      return fallback;
    }
    var repeat = getAttribute(['data-repeat', 'repeat'], 'false') === 'true';
    var repeatDelay = Number(getAttribute(['data-repeat-delay', 'repeat_delay', 'repeat-dalay'], 3)) || 3;
    list.innerHTML = '<div class="conversation-box__header"><span class="conversation-box__status" aria-hidden="true"></span><span class="conversation-box__title"></span><span class="conversation-box__channel"></span></div><div class="conversation-box__body"></div>';
    list.querySelector('.conversation-box__title').textContent = title;
    list.querySelector('.conversation-box__channel').textContent = channel;
    var body = list.querySelector('.conversation-box__body');
    function renderConversation() {
      body.innerHTML = '';
      var entries = [];
      items.forEach(function (item) {
        var match = item.match(/^(\S+)[ \t]+([\s\S]*)$/);
        var descriptor = match ? match[1].replace(/`/g, '') : item.replace(/`/g, '');
        var text = match ? match[2] : '';
        if (descriptor === 'system') {
          var system = document.createElement('div');
          system.className = 'conversation-system';
          system.textContent = text;
          body.appendChild(system);
          entries.push({ element: system, system: true, text: text });
          return;
        }
        var fields = descriptor.split('|');
        var side = fields[0] === 'right' ? 'right' : 'left';
        var message = document.createElement('div');
        message.className = 'conversation-message conversation-message--' + side;
        message.innerHTML = '<div class="conversation-message__group"><div class="conversation-message__meta"><span class="conversation-message__name"></span><span class="conversation-message__time"></span></div><div class="conversation-message__bubble"><span class="conversation-message__reserve" aria-hidden="true"></span><span class="conversation-message__text"></span><span class="conversation-message__cursor" aria-hidden="true"></span></div></div>';
        message.querySelector('.conversation-message__name').textContent = fields[1] || 'SPEAKER';
        message.querySelector('.conversation-message__time').textContent = fields[2] || '';
        message.querySelector('.conversation-message__reserve').textContent = text;
        body.appendChild(message);
        entries.push({ element: message, system: false, text: text });
      });

      function playNext(index) {
        if (index >= entries.length) return;
        var entry = entries[index];
        var isLast = index === entries.length - 1;
        var onComplete = isLast && repeat && !reduced ? function () {
          window.setTimeout(renderConversation, repeatDelay * 1000);
        } : function () { playNext(index + 1); };
        window.setTimeout(function () {
          entry.element.classList.add('is-visible');
          if (entry.system) {
            if (reduced) onComplete();
            else window.setTimeout(onComplete, 300);
          } else if (reduced) {
            entry.element.classList.add('is-complete');
            onComplete();
          } else {
            type(entry.element, '.conversation-message__text', entry.text, 34, onComplete);
          }
        }, reduced ? 0 : 100);
      }
      playNext(0);
    }
    renderConversation();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-message-box]').forEach(function (element) {
      var text = element.getAttribute('data-text') || '';
      if (!reduced) {
        var repeat = element.getAttribute('data-repeat') === 'true';
        var repeatDelay = Number(element.getAttribute('data-repeat-delay')) || 3;
        var run = function () {
          element.classList.remove('is-complete');
          type(element, '.message-box__text', text, Number(element.getAttribute('data-speed')) || 38, repeat ? function () { window.setTimeout(run, repeatDelay * 1000); } : null);
        };
        run();
      } else element.classList.add('is-complete');
    });
    document.querySelectorAll('.conversation-box').forEach(function (list) {
      if (list.tagName === 'UL' && !list.querySelector('.conversation-box__body')) {
        buildConversation(list, reduced);
      }
    });
  });
}());
