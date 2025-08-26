---
layout: none
---

var idx = lunr(function () {
  this.field('title')
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')

  this.pipeline.remove(lunr.trimmer)

  for (var item in store) {
    this.add({
      title: store[item].title,
      excerpt: store[item].excerpt,
      categories: store[item].categories,
      tags: store[item].tags,
      id: item
    })
  }
});

// $(document).ready(function() {
//   $('input#search').on('keyup', function () {
//     var resultdiv = $('#results');
//     var query = $(this).val().toLowerCase();
//     var result =
//       idx.query(function (q) {
//         query.split(lunr.tokenizer.separator).forEach(function (term) {
//           q.term(term, { boost: 100 })
//           if(query.lastIndexOf(" ") != query.length-1){
//             q.term(term, {  usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 })
//           }
//           if (term != ""){
//             q.term(term, {  usePipeline: false, editDistance: 1, boost: 1 })
//           }
//         })
//       });
//     resultdiv.empty();
//     resultdiv.prepend('<p class="results__found">'+result.length+' {{ site.data.ui-text[site.locale].results_found | default: "Result(s) found" }}</p>');
//     for (var item in result) {
//       var ref = result[item].ref;
//       if(store[ref].teaser){
//         var searchitem =
//           '<div class="list__item">'+
//             '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
//               '<h2 class="archive__item-title" itemprop="headline">'+
//                 '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
//               '</h2>'+
//               '<div class="archive__item-teaser">'+
//                 '<img src="'+store[ref].teaser+'" alt="">'+
//               '</div>'+
//               '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
//             '</article>'+
//           '</div>';
//       }
//       else{
//     	  var searchitem =
//           '<div class="list__item">'+
//             '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
//               '<h2 class="archive__item-title" itemprop="headline">'+
//                 '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
//               '</h2>'+
//               '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
//             '</article>'+
//           '</div>';
//       }
//       resultdiv.append(searchitem);
//     }
//   });
// });

$(document).ready(function() {
  var searchInput = $('input#search');
  var resultDiv = $('#results');
  var timeout = null; // Debounce를 위한 타이머 변수

  searchInput.on('keyup', function () {
    // 키보드 입력이 있을 때마다 이전 타이머는 취소
    clearTimeout(timeout);

    // 0.3초 후에 검색을 실행하도록 새로운 타이머 설정
    timeout = setTimeout(function () {
      performSearch(searchInput.val());
    }, 300); // 300ms = 0.3초
  });

  function performSearch(query) {
    // 검색어가 없으면 결과창을 비우고 함수 종료
    if (!query) {
      resultDiv.empty();
      return;
    }

    var lowerCaseQuery = query.toLowerCase();
    var result = idx.query(function (q) {
      lowerCaseQuery.split(lunr.tokenizer.separator).forEach(function (term) {
        if (term) { // 빈 단어 검색 방지
          q.term(term, { boost: 100 });
          q.term(term, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 });
          // 성능 저하가 심한 editDistance는 단어 길이가 3 이상일 때만 적용
          if (term.length > 2) {
            q.term(term, { usePipeline: false, editDistance: 1, boost: 1 });
          }
        }
      });
    });

    resultDiv.empty();
    resultDiv.prepend('<p class="results__found">' + result.length + ' {{ site.data.ui-text[site.locale].results_found | default: "Result(s) found" }}</p>');

    for (var i = 0; i < result.length; i++) {
      var item = result[i];
      var ref = item.ref;
      var storeItem = store[ref];
      var excerpt = storeItem.excerpt.split(" ").slice(0, 20).join(" ") + '...';

      // 가독성을 위해 Template Literal (``) 사용
      var searchItemHtml = `
        <div class="list__item">
          <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
            <h2 class="archive__item-title" itemprop="headline">
              <a href="${storeItem.url}" rel="permalink">${storeItem.title}</a>
            </h2>
            ${storeItem.teaser ? `<div class="archive__item-teaser"><img src="${storeItem.teaser}" alt=""></div>` : ''}
            <p class="archive__item-excerpt" itemprop="description">${excerpt}</p>
          </article>
        </div>`;
      resultDiv.append(searchItemHtml);
    }
  }
});