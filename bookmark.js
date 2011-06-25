$(document).ready(function() {

    var bookmarkBarId = '';
    var bookmarkParentId = '';
    var bookmarkResearchId = '';
    var researchFolderName = 'research';

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
          if (String(bookmark.title) == "Bookmarks Bar") {
            bookmarkBarId = bookmark.id;
            getFolders(bookmark.children);
          }
          if (String(bookmark.title) == researchFolderName) {
            bookmarkResearchId = bookmark.id;
            getFolders(bookmark.children);
          }
          if (String(bookmark.title) == $('#tag').val()) {
            bookmarkParentId = bookmark.id;
          }
        }
      }
    }
 
  function makeBookmark() {
    if (bookmarkResearchId == '') {
      chrome.bookmarks.create({'parentId': bookmarkBarId,
            'title': researchFolderName, 
            'url': ''}, 
        function(newFolder) {
          console.log("added folder: " + newFolder.title);
          chrome.bookmarks.create({'parentId': newFolder.id,
                'title': $("#tag").val(), 
                'url': ''}, 
            function(newFolder2) {
              console.log("added folder: " + newFolder2.title);
              chrome.bookmarks.create({'parentId': newFolder2.id,
                    'title': $("#name").val(), 
                    'url': $("#url").val()}, 
                function(newBookmark) {
                  console.log("added bookmark: " + newBookmark.title);
                });
            });
        });
    } else if (bookmarkParentId == '') {
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