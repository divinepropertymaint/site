var McMode = (function (jQ, win, doc) {
   "use strict";
   var McMode = {
      AppInfo: {
         name: "McStudy",
         package: "1.0.0",
         version: "1.0.0",
         author: "froxtheme",
      },
   },
   components = {
      docReady: [],
      docReadyDefer: [],
      winLoad: [],
      winLoadDefer: [],
   };

   jQ(doc).ready(docReady);
   jQ(win).on("load", winLoad);

   function docReady(stmt) {
      stmt = typeof stmt === typeof undefined ? jQ : stmt;
      components.docReady.concat(components.docReadyDefer).forEach(function (component) {
         component(stmt);
      });
   }

   function winLoad(stmt) {
      stmt = typeof stmt === "object" ? jQ : stmt;
      components.winLoad.concat(components.winLoadDefer).forEach(function (component) {
         component(stmt);
      });
   }

   McMode.components = components;
   McMode.docReady = docReady;
   McMode.winLoad = winLoad;

   return McMode;
})(jQuery, window, document);

McMode = (function (McMode, $, window, document) {
   "use strict";

   var $win = $(window),
      $doc = $(document),
      $body = $("body"),
      $header = $(".header-main");

   var _navBreak = 992,
      _mobBreak = 768,
      _mobMenu = "menu-mobile",
      _open_menu = "menu-shown",
      _open_nav = "open-nav",
      _navOpenClass = "nav-open", // 🔥 NEW CLASS
      _currentURL = window.location.href,
      _splitURL = _currentURL.split("#");

   $.fn.exists = function () {
      return this.length > 0;
   };

   McMode.Win = {
      height: $win.height(),
      width: $win.width(),
   };

   McMode.getStatus = {
      isRTL: $body.hasClass("has-rtl") || $body.attr("dir") === "rtl",
      isTouch: "ontouchstart" in document.documentElement,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent),
      asMobile: $win.width() < _mobBreak,
   };

   $win.on("resize", function () {
      McMode.Win.height = $win.height();
      McMode.Win.width = $win.width();
      McMode.getStatus.asMobile = McMode.Win.width < _mobBreak;

      if ($win.width() >= _navBreak) {
         $body.removeClass(_navOpenClass);
      }
   });

   /* ===============================
      UTILITIES
   =============================== */

   McMode.Util = {};
   McMode.Util.classInit = function () {
      $body.addClass(McMode.getStatus.isTouch ? "has-touch" : "no-touch");

      if (McMode.getStatus.asMobile) {
         $body.addClass("as-mobile");
      } else {
         $body.removeClass("as-mobile");
      }

      if ($body.attr("dir") === "rtl") {
         $body.addClass("has-rtl");
         McMode.getStatus.isRTL = true;
      }
   };
   McMode.components.docReady.push(McMode.Util.classInit);

   /* ===============================
      MAIN MENU
   =============================== */

   McMode.MainMenu = function () {
      var $navbar_toggle = $(".navbar-toggle"),
         $main_navbar = $(".header-navbar"),
         $main_navbar_classic = $(".header-navbar-classic"),
         $menu_toggle = $(".menu-toggle"),
         $menu_link = $(".menu-link"),
         _main_menu = ".header-menu",
         _menu_drop = ".menu-drop",
         _nav_overlay = ".header-navbar-overlay";

      var MenuInit = {};

      /* NAV TOGGLE */
      MenuInit.navToggle = function () {
         if (!$navbar_toggle.exists()) return;

         $navbar_toggle.on("click", function (e) {
            var $self = $(this),
               targetID = $self.data("menu-toggle");

            $self.toggleClass("active");
            $body.toggleClass(_navOpenClass); // ✅ CLASS ADDED

            if ($main_navbar_classic.exists()) {
               $("#" + targetID).slideToggle().toggleClass(_open_menu);
            } else {
               $("#" + targetID).parent().toggleClass(_open_menu);
            }

            e.preventDefault();
         });
      };

      /* NAV CLOSE */
      MenuInit.navClose = function () {
         $doc.on("click", function (e) {
            if (
               !$header.is(e.target) &&
               $header.has(e.target).length === 0 &&
               !$navbar_toggle.is(e.target) &&
               $navbar_toggle.has(e.target).length === 0 &&
               $win.width() < _navBreak
            ) {
               $navbar_toggle.removeClass("active");
               $main_navbar.removeClass(_open_menu);
               $main_navbar_classic.find(_main_menu).slideUp();
               $body.removeClass(_navOpenClass); // ✅ REMOVE
            }
         });
      };

      /* SUBMENU TOGGLE */
      MenuInit.menuToggle = function () {
         if (!$menu_toggle.exists()) return;

         $menu_toggle.on("click", function (e) {
            var $parent = $(this).parent();

            if ($win.width() < _navBreak) {
               $parent.children(_menu_drop).slideToggle(300);
               $parent.siblings().children(_menu_drop).slideUp(300);
               $parent.toggleClass(_open_nav);
               $parent.siblings().removeClass(_open_nav);
            }
            e.preventDefault();
         });
      };

      /* MOBILE MODE */
      MenuInit.mobileNav = function () {
         if ($win.width() < _navBreak) {
            $main_navbar.addClass(_mobMenu);
         } else {
            $main_navbar.removeClass(_mobMenu + " " + _open_menu);
            $body.removeClass(_navOpenClass);
         }
      };

      /* CURRENT PAGE */
      MenuInit.currentPage = function () {
         if (!$menu_link.exists()) return;

         $menu_link.each(function () {
            if (_currentURL === this.href && _splitURL[1] !== "") {
               $(this).parents("li").addClass("active");
            }
         });
      };

      MenuInit.navToggle();
      MenuInit.navClose();
      MenuInit.menuToggle();
      MenuInit.mobileNav();
      MenuInit.currentPage();

      $win.on("resize", MenuInit.mobileNav);
   };

   McMode.components.docReady.push(McMode.MainMenu);

   return McMode;
})(McMode, jQuery, window, document);
