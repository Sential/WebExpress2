class TabWindow {

  constructor(tab, url) {
    var s = this;
    this.searchInput = null;
    this.webView = null;
    tab.tabWindow = $("<div>").load("browser.html", function() {
      //main section
      var webview = tab.tabWindow.find('.webview')[0];
      var searchInput = $(tab.tabWindow.find('.searchInput')[0]);
      var bar = $(tab.tabWindow.find('.bar')[0]);
      var searchBox = $(tab.tabWindow.find('.searchBox')[0]);
      var refreshBtn = $(tab.tabWindow.find('.refreshBtn')[0]);
      var backBtn = $(tab.tabWindow.find('.backBtn')[0]);
      var forwardBtn = $(tab.tabWindow.find('.forwardBtn')[0]);
      var menuBtn = $(tab.tabWindow.find('.menuBtn')[0]);
      var refreshBtnIcon = $(tab.tabWindow.find('.refreshBtnIcon')[0]);
      var backBtnIcon = $(tab.tabWindow.find('.backBtnIcon')[0]);
      var forwardBtnIcon = $(tab.tabWindow.find('.forwardBtnIcon')[0]);
      var menuBtnIcon = $(tab.tabWindow.find('.menuBtnIcon')[0]);
      var exBtn = $(tab.tabWindow.find('.exBtn')[0]);
      var exBtnIcon = $(tab.tabWindow.find('.exBtnIcon')[0]);
      //suggestions
      var suggestions_ul = $(tab.tabWindow.find('.suggestions-ul')[0]);
      var suggestions = $(tab.tabWindow.find('.suggestions')[0]);
      //menu
      var menu = $(tab.tabWindow.find('.menu')[0]);
      var menuToggled = false;
      var menuItems = $(tab.tabWindow.find('.menu-items')[0]);
      var exMenu = $(tab.tabWindow.find('.ex-menu')[0]);
      var exMenuItem = $(tab.tabWindow.find('.exMenuItem'));
      var exMenuCards = $(tab.tabWindow.find('.ex-menu .ex-cards')[0]);
      var exMenuElements = $(tab.tabWindow.find('.ex-menu .ex-elements')[0]);
      var exMenuElementsItem = $(tab.tabWindow.find('.ex-menu .ex-elements li'));
      var exMenuMove = $(tab.tabWindow.find('.ex-menu .ex-move')[0]);
      var exMenuMoveItem = $(tab.tabWindow.find('.ex-menu .ex-move li'));
      var exMenuToggled = false;
      //menu actions
      var settings = $(tab.tabWindow.find('.menu-item')[0]);
      var history = $(tab.tabWindow.find('.menu-item')[1]);
      var bookmarks = $(tab.tabWindow.find('.menu-item')[2]);
      var downloads = $(tab.tabWindow.find('.menu-item')[3]);
      var extensions = $(tab.tabWindow.find('.menu-item')[4]);
      var newWindow = $(tab.tabWindow.find('.menu-item')[5]);
      var fullscreen = $(tab.tabWindow.find('.menu-item')[6]);
      var devtools = $(tab.tabWindow.find('.menu-item')[7]);
      var screenshot = $(tab.tabWindow.find('.menu-item')[8]);
      var privacy = $(tab.tabWindow.find('.menu-item')[9]);

      //global properties
      var iconRippleTime = 300;
      var rippleTime = 400;
      var firstUrl = url;
      var json = '';
      var lastUrl = '';
      var historyPath = '/userdata/history.json';
      var extensionsPath = '/userdata/extensions';
      var userdataPath = '/userdata';
      s.searchInput = searchInput;
      s.webView = webview;
      //requires
      var fs = require('fs');
      var IsThere = require("is-there");
      var dir = require('node-dir');

      //check if directory called userdata exists
      if (!IsThere(userdataPath)) {
        fs.mkdir(userdataPath);
      }
      //check if directory called extensions exists
      if (!IsThere(extensionsPath)) {
        fs.mkdir(extensionsPath);
      }
      //check if file called history.json exists
      if (!IsThere(historyPath)) {
        fs.writeFile(historyPath, '{"history":[]}');
      }

      //global functions
      function makeRippleMenuItem(menuItem, e) {
        var relX = e.pageX - $(menuItem).offset().left;
        var relY = e.pageY - $(menuItem).offset().top;
        Ripple.makeRipple($(menuItem), relX, relY, $(menuItem).width(), $(menuItem).height(), rippleTime, 0);
      }

      function makeRippleIconButton(item) {
        Ripple.makeRipple(item, item.width() / 2, item.height() / 2, (item.width() - 8) / 2, (item.height() - 8) / 2, iconRippleTime, 0);
      }
      //Extensions system
      function loadExtensions() {
        //get all .JSON files in folder to an array
        var listOfExtensions = [];
        var listOfExtensionsDirs = [];
        dir.subdirs(extensionsPath, function(err, subdirs) {
          if (err) throw err;
          for (var i = 0; i < subdirs.length; i++) {
            dir.files(subdirs[i], function(err, files) {
              if (err) throw err;
              for (var i = 0; i < files.length; i++) {
                if (endsWith(files[i], ".json")) {
                  listOfExtensions.push(files[i]);
                  console.log(files[i]);
                }
              }
              //read json from all files
              for (var i = 0; i < listOfExtensions.length; i++) {
                $.ajax({
                  type: "GET",
                  url: listOfExtensions[i],
                  success: function(data) {
                    var jsonObject = JSON.parse(data);
                    //Deserialize JSON string
                    var jName = jsonObject.name;
                    var jVersion = jsonObject.version;
                    var jDesc = jsonObject.description;
                    var jIcon = jsonObject.icon;
                    var jPopupPage = jsonObject.popuppage;
                    var jSettingsPage = jsonObject.settingspage;
                    var jScripts = jsonObject.scripts;
                    console.log(jName);

                    for (var i = 0; i < jsonObject.scripts.length; i++) {
                      var jFileUrl = subdirs[i] + "/" + jsonObject.scripts[i]["url"];
                      $.ajax({
                        type: "GET",
                        url: jFileUrl,
                        success: function(data) {
                          $('head').append('<script>' + `function a(index) {var currentTab = tabCollection[index]; var currentInstance = currentTab.instance;` + data + `} a(` + tabCollection.indexOf(tab) + `); </script>`);
                        }
                      });

                    }
                  }
                });
              }
            });
          }
        });
      }

      /*function loadThemes() {
          if (jFileType == "stylesheet" || jFileType == "css") {
              $('head').append('<link rel="stylesheet" type="text/css" href="' + jFileUrl + '">')
          }
      } TODO */

      //check if background color of bar is dark or light and then set icons foreground to black or white
      function changeContrast() {
        var brightness = colorBrightness(tab.Color);
        if (brightness < 125) {
          //white icons and text
          tab.Title.removeClass('light').addClass('dark');
          tab.closeBtn.find('.closeBtnImg').css('background-image', 'url("img/close-white.png")');
          searchBox.css('background-color', 'rgba(255,255,255,0.2) ');
          searchInput.css('color', '#fff');
          tab.Foreground = 'white';
          forwardBtnIcon.css('background-image', 'url("img/forward-white.png")');
          backBtnIcon.css('background-image', 'url("img/back-white.png")');
          refreshBtnIcon.css('background-image', 'url("img/refresh-white.png")');
          menuBtnIcon.css('background-image', 'url("img/menu-white.png")');
          refreshBtn.attr('data-ripple-color', '#fff');
          backBtn.attr('data-ripple-color', '#fff');
          forwardBtn.attr('data-ripple-color', '#fff');
          menuBtn.attr('data-ripple-color', '#fff');
          exBtn.attr('data-ripple-color', '#fff');
          exBtnIcon.css('background-image', 'url("img/more-vert-white.png")');
        } else {
          //black icons and text
          tab.Title.removeClass('dark').addClass('light');
          tab.closeBtn.find('.closeBtnImg').css('background-image', 'url("img/close.png")');
          searchInput.css('color', '#444');
          searchBox.css('background-color', '#fff');
          tab.Foreground = 'black';
          forwardBtnIcon.css('background-image', 'url("img/forward.png")');
          backBtnIcon.css('background-image', 'url("img/back.png")');
          refreshBtnIcon.css('background-image', 'url("img/refresh.png")');
          menuBtnIcon.css('background-image', 'url("img/menu.png")');
          refreshBtn.attr('data-ripple-color', '#444');
          backBtn.attr('data-ripple-color', '#444');
          forwardBtn.attr('data-ripple-color', '#444');
          menuBtn.attr('data-ripple-color', '#444');
          exBtn.attr('data-ripple-color', '#444');
          exBtnIcon.css('background-image', 'url("img/more-vert.png")');
        }
      }

      //get color from top of website
      function getColor() {
        webview.capturePage(function(image) {

          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          var img = new Image();
          img.onload = function() {
            context.drawImage(img, 0, 0);
            var myData = context.getImageData(2, 2, img.width, img.height);
            if (myData != null) {
              tab.Color = rgbToHex(myData.data[0], myData.data[1], myData.data[2]);
              tab.Tab.css('background-color', tab.Color);
              bar.css('background-color', tab.Color);
              changeContrast();
            }
          };
          img.src = image.toDataURL();
          canvas.width = img.width;
          canvas.height = img.height;
        });
      }

      //global events
      $(window).click(function() {
        if (menuToggled) {
          menu.css('opacity', 1).animate({
            opacity: 0
          }, 200).css('top', 8).animate({
            top: -32
          }, {
            queue: false,
            complete: function() {
              menu.css('visibility', 'hidden');
            },
            duration: 200
          });
          menuToggled = false;
        }
        suggestions.css('display', 'none');
      });


      //global timer
      setInterval(function() {
        $('#webviewcontainer').css('height', $(window).height() - 74);
        $(webview).css('width', $(window).width());
        $(webview).css('height', $(window).height() - 74);
        if (searchInput.val() == "" || searchInput.val() == null) {
          suggestions.css('display', 'none');
        }
      }, 1);


      //webview section
      //webview ready event
      $(webview).ready(function() {
        $.ajax({
          type: "GET",
          url: "http://google.com/complete/search?client=firefox&q=webexpress",
          success: function(data) {

          }
        });
        var ses = webview.getWebContents().session;
        searchInput.focus();
        ses.on('will-download', (event, item, webContents) => {
          console.log("handled download"); //TODO make download
        });
        webview.loadURL(url);
      });
      //webview page load end event
      webview.addEventListener('did-finish-load', function() {
        tab.Title.empty();
        tab.Title.append("<p style='display: inline; width:50%;'>" + webview.getTitle() + "</p>");
        searchInput.val(webview.getURL());

        //TODO don't change searchInput text when webview url is webexpress://newtab
        if (webview.getURL().startsWith("webexpress://newtab")) {

        } else {

        }

        //prevent duplicates in history
        if (lastUrl != webview.getURL()) {
          var array;
          //get today's date
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1;
          var yyyy = today.getFullYear();
          if (dd < 10) {
            dd = '0' + dd
          }

          if (mm < 10) {
            mm = '0' + mm
          }
          today = mm + '-' + dd + '-' + yyyy;

          //read history.json file and append new history items
          fs.readFile(historyPath, function(err, data) {
            if (err) throw err;
            json = data.toString();
            //replace weird characters in utf-8
            json = json.replace("\ufeff", "");
            var obj = JSON.parse(json);
            if (!webview.getURL().startsWith("webexpress://")) {
              obj['history'].push({
                "link": webview.getURL(),
                "title": webview.getTitle(),
                "date": today
              });
              var jsonStr = JSON.stringify(obj);
              json = jsonStr;
              //append new history item to history.json
              fs.writeFile(historyPath, json, function(err) {
                if (err) {
                  return console.log(err);
                }
              });
              lastUrl = webview.getURL();
            }
          });

        }
        //webview start loading event
        webview.addEventListener('did-start-loading', function() {
          setTimeout(function() {
            suggestions.css('display', 'none');
            searchInput.val(webview.getURL());
          }, 200);
        });
        //webview page favicon updated event
        webview.addEventListener('page-favicon-updated', function(favicon) {
          console.log(favicon.favicons[0]);
          tab.Favicon.empty();
          tab.Favicon.append("<div class='favicon' style='background-image: url(\"" + favicon.favicons[0] + "\");'></div>");
        });
        //wait for 200 milliseconds
        setTimeout(function() {
          //check if <meta name="theme-color" content="..."> tag exists. When it exists then tab gets the color from content="...", otherwise it getting color from top of a website
          webview.executeJavaScript("function s() {var markup = document.documentElement.innerHTML; return markup} s();", false, function(result) {
            var regexp = /<meta name='?.theme-color'?.*>/;
            if (regexp.test(result)) {
              //getting color from <meta name="theme-color" content="...">
              var regex = result.match(regexp).toString();
              tab.Color = regex.match(/content="(.*?)"/)[1];
              tab.Tab.css('background-color', tab.Color);
              bar.css('background-color', tab.Color);
              changeContrast();
            } else {
              //getting color from top of a website
              getColor();
            }
            loadExtensions();
          });
        }, 200);

      });

      //menu section
      menu.css('opacity', 0);

      //menu events
      settings.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      history.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      history.click(function(e) {
        var tab = new Tab();
        var tw = new TabWindow(tab, `webexpress://history`);
        addTab(tw, tab);
      });
      bookmarks.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      downloads.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      extensions.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      newWindow.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      fullscreen.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      devtools.mousedown(function(e) {
        webview.openDevTools();
        makeRippleMenuItem(this, e);
      });
      screenshot.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      privacy.mousedown(function(e) {
        makeRippleMenuItem(this, e);
      });
      menu.mousedown(function(event) {
        event.stopPropagation();
      });

      var menuCard = 0;
      var menuCardC = new Array();

      function createCard() {
        if (menuCardC[menuCard] == null) {
          menuCardC[menuCard] = true;
          var d = "";
          if (menuCard > 0) {
            d = 'style="opacity:0;display:none;"';
          }
          exMenuCards.append('<ul class="ex-list" data-page-num="' + menuCard + '" ' + d + '></ul>');
        }
      }

      function addNewCard() {
        var items = new Array();
        var i = 0;
        exMenuElementsItem.each(function(index) {
          var x = i / 9;
          var y = parseInt(x);
          menuCard = y;

          createCard();

          var icon = $(this).data('icon');
          var page = $(this).data('page');

          var card = $(tab.tabWindow.find('.ex-list'));
          card.each(function() {
            var num = $(this).data('page-num');
            if (num == menuCard) {
              $(this).append('<li class="ripple exMenuItem" data-ripple-color="#444" style="background-image: url(' + icon + ');">' + '</li>');
              exMenuItem = $(tab.tabWindow.find('.exMenuItem'));
            }
          });
          i++;
        });
      }

      addNewCard();

      var exMenuCardsList = $(tab.tabWindow.find('.ex-menu .ex-cards .ex-list'));

      for(var i = 0; i < exMenuCardsList.length; i++) {
        exMenuMove.append('<li class="ex-menuChangeCardBtn" data-page-num="' + i + '"></li>');
      }

      exMenuMoveItem = $(tab.tabWindow.find('.ex-menu .ex-move li'));
      exMenuMoveItem.each(function(index) {
        if (exMenuCardsList.length < 2) {
          if (index == 0) {
            $(this).css('margin-left', '0px');
          }
        }
        $(this).attr('data-page-num', index);
      });
      var result = exMenuCardsList.length * parseInt(exMenuMoveItem.css('width')) + exMenuCardsList.length * parseInt(exMenuMoveItem.css('margin-left'));

      exMenuMove.css('width', result);

      var lastcard = "0";

      var gCard;

      function getCard(n) {
        exMenuCardsList.each(function(index) {
          var num = $(this).data('page-num');
          if (num == parseInt(n)) {
            gCard = $(this);
          }
        });
      }

      $('.ex-menuChangeCardBtn').click(function() {
        var x = $(this).data('page-num');

        getCard(lastcard);

        $(gCard).animate({opacity: 0}, 200, function() {
            $(gCard).css('display', 'none');
            getCard(x);

            $(gCard).css('display', 'block');
            $(gCard).animate({opacity: 1}, 200, function() {

            });

            lastcard = x;
        });
      });

      //bar buttons events

      exMenuItem.mousedown(function() {
        makeRippleIconButton($(this));
      });
      exBtn.mousedown(function() {
        makeRippleIconButton($(this));
      });
      exBtn.click(function() {
        if (!exMenuToggled) {
          //menu fade in animation
          exMenu.css('visibility', 'visible');
          exMenu.css('opacity', 0).animate({
            opacity: 1
          }, 200, function() {
            exMenuToggled = true
          }).css('top', -32).animate({
            top: 8
          }, {
            queue: false,
            duration: 200
          });

        } else {
          //menu fade out animation
          exMenu.css('opacity', 1).animate({
            opacity: 0
          }, 200).css('top', 8).animate({
            top: -32
          }, {
            queue: false,
            complete: function() {
              exMenu.css('visibility', 'hidden');
            },
            duration: 200
          });
          exMenuToggled = false;
        }
      });
      backBtn.click(function() {
        if (webview.canGoBack()) {
          webview.goBack();
        }
      });
      backBtn.mousedown(function() {
        makeRippleIconButton($(this));
      });
      forwardBtn.click(function() {
        if (webview.canGoForward()) {
          webview.goForward();
        }
      });
      forwardBtn.mousedown(function() {
        makeRippleIconButton($(this));
      });
      refreshBtn.click(function() {
        webview.reload();
      });
      refreshBtn.mousedown(function() {
        makeRippleIconButton($(this));
      });
      menuBtn.click(function() {
        if (!menuToggled) {
          //menu fade in animation
          menu.css('visibility', 'visible');
          menu.css('opacity', 0).animate({
            opacity: 1
          }, 200, function() {
            menuToggled = true
          }).css('top', -32).animate({
            top: 8
          }, {
            queue: false,
            duration: 200
          });

        } else {
          //menu fade out animation
          menu.css('opacity', 1).animate({
            opacity: 0
          }, 200).css('top', 8).animate({
            top: -32
          }, {
            queue: false,
            complete: function() {
              menu.css('visibility', 'hidden');
            },
            duration: 200
          });
          menuToggled = false;
        }
      });
      menuBtn.mousedown(function() {
        makeRippleIconButton($(this));
      });

      //searchInput section
      //searchInput events
      searchInput.focusin(function() {
        $(this).select();
      });

      searchInput.on("input", function(e) {
        var key = event.keyCode || event.charCode;
        if (canSuggest) {
          autocomplete(searchInput, searchInput.val(), allLinks);
          canSuggest = false;
        }
      });

      //arrow keys navigating in suggestions box
      searchInput.keydown(function(e) {
        //arrow key up
        if (e.keyCode == 38) {
          var selected = tab.tabWindow.find(".selected");
          console.log("sth");
          if (selected == null) {
            tab.tabWindow.find('li').first().addClass("selected");
            selected = tab.tabWindow.find(".selected");
          }
          if (typeof selected.prev().attr("text") !== "undefined")
            searchInput.val(selected.prev().attr('text'));

          tab.tabWindow.find('.suggestions-li').removeClass("selected");
          if (selected.prev().length == 0) {
            selected.siblings().last().addClass("selected");
            searchInput.val(selected.siblings().last().attr('text'));
          } else {
            selected.prev().addClass("selected");
          }

        }
        //arrow key down
        if (e.keyCode == 40) {
          var selected = tab.tabWindow.find(".selected");
          if (selected == null) {
            tab.tabWindow.find('li').first().addClass("selected");
            selected = tab.tabWindow.find(".selected");
          }
          if (typeof selected.next().attr("text") !== "undefined")
            searchInput.val(selected.next().attr('text'));

          suggestions_ul.focus();

          tab.tabWindow.find('.suggestions-li').removeClass("selected");
          if (selected.next().length == 0) {
            selected.siblings().first().addClass("selected");
            searchInput.val(selected.siblings().first().attr('text'));
          } else {
            selected.next().addClass("selected");
          }
        }
      });

      searchInput.keypress(function(e) {
        //if enter key was pressed
        if (e.which == 13) {
          tab.tabWindow.find('#webviewcontainer').css('visibility', 'visible');
          if (!searchInput.val().startsWith("webexpress://")) {
            if (isURL(searchInput.val())) {
              if (searchInput.val().startsWith("http://") || searchInput.val().startsWith("https://") || searchInput.val().startsWith("file://")) {
                webview.loadURL(searchInput.val());
              } else {
                webview.loadURL("http://" + searchInput.val());
              }
            } else {
              webview.loadURL("http://www.google.com/search?q=" + searchInput.val());
            }
          } else {
            webview.loadURL(searchInput.val());

          }

          return false;
        }
      });

      //suggestions system
      var canSuggest = false;
      searchInput[0].onkeydown = function() {
        var key = event.keyCode || event.charCode;
        if (key != 8 && key != 13 && key != 17 && key != 18 && key != 16 && key != 9 && key != 20 && key != 46 && key != 32) {
          canSuggest = true;
        }
        if (key != 40 && key != 38) {
          //get suggestions from history
          if (searchInput.val() == "") return;
          suggestions_ul.empty();
          var items = 0;
          $.ajax({
            type: "GET",
            url: historyPath,
            success: function(data) {
              suggestions_ul.empty();
              json = data.toString();
              //replace weird characters utf-8
              json = json.replace("\ufeff", "");
              var obj = JSON.parse(json);
              var prevLink;
              var links = [];
              //max limit for items is 3
              var items = 0;
              for (var i = 0; i < obj.history.length; i++) {
                if (items == 3) {
                  return;
                }
                if (obj.history[i].link.indexOf(searchInput.val()) !== -1 && items != 3 && !isInArray(obj.history[i].link, links)) {
                  var str = obj.history[i].link;
                  //remove http://, https:// etc. from item for better suggestions
                  if (obj.history[i].link.startsWith("http://")) {
                    str = str.split("http://")[1];
                    if (str.startsWith("www.")) {
                      str = str.split("www.")[1];
                    }
                  }
                  if (obj.history[i].link.startsWith("https://")) {
                    str = str.split("https://")[1];
                    if (str.startsWith("www.")) {
                      str = str.split("www.")[1];
                    }
                  }

                  var item = $('<li data-ripple-color="#444" class="suggestions-li ripple" text="' + str + '">' + str + '</li>');
                  suggestions_ul.prepend(item);

                  suggestions.css('display', 'block');
                  item.click(function(e) {
                    var curr = $(e.currentTarget);
                    webview.loadURL(curr.attr('text'));
                  });
                  item.mousedown(function(e) {
                    var relX = e.pageX - $(this).offset().left;
                    var relY = e.pageY - $(this).offset().top;
                    Ripple.makeRipple($(this), relX, relY, $(this).width(), $(this).height(), 600, 0);
                  });
                  item.mouseover(function() {
                    tab.tabWindow.find('.suggestions-li').removeClass("selected");
                    $(this).addClass("selected");
                    searchInput.val($(this).attr('text'));
                  });
                  links.push(str);

                  allLinks = links;
                  items += 1;
                }
              }
            },
            complete: function() {
              //load suggestions from Google
              var s = searchInput.val().replace(getSelectionText(), "");
              if (s != "" || s != null || typeof s !== "undefined") {
                $.ajax({
                  type: "GET",
                  url: "http://google.com/complete/search?client=firefox&q=" + searchInput.val().replace(getSelectionText(), ""),
                  success: function(data) {

                    var obj = JSON.parse(data);
                    var arr = obj[1].toString().split(",");
                    var links = [];
                    //remove duplicates from array
                    for (var i = 0; i < arr.length; i++) {
                      if (!isInArray(arr[i], links)) {
                        links.push(arr[i]);
                      }
                    }
                    var uniqueLinks = [];
                    $.each(links, function(i, el) {
                      if ($.inArray(el, uniqueLinks) === -1) uniqueLinks.push(el);
                    });

                    for (var i = 0; i < uniqueLinks.length; i++) {
                      if (items != 3) {
                        var s = $('<li data-ripple-color="#444" class="suggestions-li ripple" text="' + uniqueLinks[i] + '">' + uniqueLinks[i] + '</li>').appendTo(suggestions_ul);
                        suggestions.css('display', 'block');
                        s.click(function(e) {
                          var curr = $(e.currentTarget);
                          webview.loadURL("http://www.google.com/search?q=" + curr.attr('text'));
                        });
                        s.mousedown(function(e) {
                          var relX = e.pageX - $(this).offset().left;
                          var relY = e.pageY - $(this).offset().top;
                          Ripple.makeRipple($(this), relX, relY, $(this).width(), $(this).height(), 600, 0);
                        });
                        s.mouseover(function() {
                          tab.tabWindow.find('.suggestions-li').removeClass("selected");
                          $(this).addClass("selected");
                          searchInput.val($(this).attr('text'));
                        });
                        items += 1;
                      }
                    }

                  },
                  complete: function() {
                    //remove duplicates from ul list
                    var seen = {};
                    tab.tabWindow.find(".suggestions-li").each(function() {
                      var txt = $(this).text();
                      if (seen[txt])
                        $(this).remove();
                      else
                        seen[txt] = true;
                    });
                  }
                });
              }
            }
          });
        }
      }

      //searchInput functions

      function autocomplete(input, text, strings) {
        if (!(strings.length < 1)) {
          strings = strings.reverse();
          if (strings[0].toLowerCase().startsWith(text.toLowerCase())) {
            input.val(strings[0]);
            input[0].setSelectionRange(text.length, strings[0].length);
          }
        }
      }
      var allLinks = [];

      function getSelectionText() {
        var text = "";
        if (window.getSelection) {
          text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
        }
        return text;
      }

    }).appendTo('#instances');

  }
}
