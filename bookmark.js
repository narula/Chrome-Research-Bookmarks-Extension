$(document).ready(function() {
    
    var bookmarkParentId = '';
    var bookmarkResearchId = '';

    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id, function (response) {
            tabUrl = response.url;
            $("#url").attr('value',tabUrl);
            tabTitle = response.title;
            $("#name").attr('value',tabTitle);
          });
      });


    function getFolders(bookmarks) {
      for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.children) {
          if (bookmark.title == '') {
            getFolders(bookmark.children);
          }
          if (String(bookmark.title).indexOf("Bookmarks Bar") == 0) {
            getFolders(bookmark.children);
          }
          if (String(bookmark.title).indexOf("research") == 0) {
            bookmarkResearchId = bookmark.id;
            getFolders(bookmark.children);
          }
          if (String(bookmark.title).indexOf($('#tag').val()) == 0) {
            bookmarkParentId = bookmark.id;
          }
        }
      }
    }
 
  function makeBookmark() {
    if (bookmarkParentId == '') {
      chrome.bookmarks.create({'parentId': bookmarkResearchId,
            'title': $("#tag").val(), 
            'url': ''}, 
        function(newFolder) {
          console.log("added folder: " + newFolder.title);
          chrome.bookmarks.create({'parentId': newFolder.id,
                'title': $("#name").val(), 
                'url': $("#url").val()}, 
            function(newBookmark) {
              console.log("added bookmark: " + newBookmark.title);
            });
        });
    } else {
      chrome.bookmarks.create({'parentId': bookmarkParentId,
            'title': $("#name").val(), 
            'url': $("#url").val()}, 
        function(newFolder) {
          console.log("added bookmark: " + newFolder.title);
        });
    }
  }

  $("form").submit(function(){
      chrome.bookmarks.getTree(function(bookmarks) {
          getFolders(bookmarks);
          makeBookmark(); 
          self.close();
        });
      return false;
    });
});