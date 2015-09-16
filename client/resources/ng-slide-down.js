(function () {
  'use strict';
  angular.module('ng-slide-down', []).directive('ngSlideDown', [
    '$timeout',
    function ($timeout) {
      var getTemplate, link;
      getTemplate = function (tElement, tAttrs) {
        if (tAttrs.lazyRender !== void 0) {
          return '<div ng-if=\'lazyRender\' ng-transclude></div>';
        } else {
          return '<div ng-transclude></div>';
        }
      };
      link = function (scope, element, attrs, ctrl, transclude) {
        var closePromise, duration, elementScope, emitOnClose, getHeight, hide, lazyRender, onClose, openPromise, show, timingFunction;
        duration = attrs.duration || 1;
        timingFunction = attrs.timingFunction || 'ease-in-out';
        elementScope = element.scope();
        emitOnClose = attrs.emitOnClose;
        onClose = attrs.onClose;
        lazyRender = attrs.lazyRender !== void 0;
        closePromise = null;
        openPromise = null;
        getHeight = function (passedScope) {
          var c, children, height, _i, _len;
          height = 500;
          // children = element.children();
          // for (_i = 0, _len = children.length; _i < _len; _i++) {
          //   c = children[_i];
          //   height += c.clientHeight;
          // }
          return '' + height + 'px';
        };
        show = function () {
          if (closePromise) {
            $timeout.cancel(closePromise);
          }
          if (lazyRender) {
            scope.lazyRender = true;
          }
          return $timeout(function () {
            if (openPromise) {
              $timeout.cancel(openPromise);
            }
            element.css({
              overflow: 'hidden',
              transitionProperty: 'height',
              transitionDuration: '' + duration + 's',
              transitionTimingFunction: timingFunction,
              height: getHeight()
            });
            return openPromise = $timeout(function () {
              return element.css({
                overflow: 'visible',
                transition: 'none',
                height: '500px'
              });
            }, duration * 1000);
          });
        };
        hide = function () {
          if (openPromise) {
            $timeout.cancel(openPromise);
          }
          element.css({
            overflow: 'hidden',
            transitionProperty: 'height',
            transitionDuration: '' + duration + 's',
            transitionTimingFunction: timingFunction,
            height: '0px'
          });
          if (emitOnClose || onClose || lazyRender) {
            return closePromise = $timeout(function () {
              if (emitOnClose) {
                scope.$emit(emitOnClose, {});
              }
              if (onClose) {
                elementScope.$eval(onClose);
              }
              if (lazyRender) {
                return scope.lazyRender = false;
              }
            }, duration * 1000);
          }
        };
        return scope.$watch('expanded', function (value, oldValue) {
          if (value) {
            return $timeout(show);
          } else {
            if (value != null) {
              element.css({ height: getHeight() });
              element[0].clientHeight;
            }
            return $timeout(hide);
          }
        });
      };
      return {
        restrict: 'A',
        scope: { expanded: '=ngSlideDown' },
        transclude: true,
        link: link,
        template: function (tElement, tAttrs) {
          return getTemplate(tElement, tAttrs);
        }
      };
    }
  ]);
}.call(this));