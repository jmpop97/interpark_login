;(function($) {
  $.extend($.fn, {
    inputClear: function() {
      var input = $(this);

      input.each(function() {
        var $this = $(this);
        var clearBt = $this.next('.delBtn');

        $(window).on('load', function() {
          clearBt.hide();
        });

        $this.keyup(function() {
          clearBt.toggle(Boolean($(this).val()));
        });

        $this.focusin(function() {
          clearBt.toggle(Boolean($(this).val()));
        });

        $this.focusout(function() {
          setTimeout(function(){clearBt.hide();}, 100);
        });

        clearBt.toggle(Boolean($this.val()));
        clearBt.on('click', function() {
          $(this).prev().val('').focus();
          $(this).hide();
        });
      });
    },

    checkNoti: function() {
      var $checkWrap = $(this);
      var $checkStyle = $checkWrap.find('.checkStyle:first-child');
      var $checkInput = $checkStyle.children('input:checkbox');
      var $showCheck = $checkWrap.find('.maintain');

      $checkInput.on('click', function() {
        if ($checkInput.prop('checked')) {
          $showCheck.show();
        } else {
          $showCheck.hide();
        }
      });
    },

    popIframe: function() {
      popiframeResize = function() {
        var $this = $('.iframeBox');
        var targetFrame = $this.find('iframe');
        var scrollHeight = targetFrame.contents().find('body').prop('scrollHeight');

        targetFrame.css({
          'height': scrollHeight + 40
        });

      };

      $(window).on({
        load: function() {
          popiframeResize();
        }
      });
    },

    loginIframe: function() {
      iframeHeight = function() {
        var $this = $('.leftIframeBox');
        var target = $this.find('iframe');
        var scrollHeight = target.contents().find('body').prop('scrollHeight');

        target.css({
          'height': scrollHeight
        });
      };

      $(window).on({
        load: function() {
          iframeHeight();
        },
        resize: function() {
          iframeHeight();
        }
      });
    }

  });

  $('.iInput').inputClear();
  $('.loginCheck').checkNoti();

  $('.iframeBox').popIframe();

  $('.leftIframeBox').loginIframe();
  
  // �ݱ��ư ����
  $('.popHeaderWrap .btnClose a').filter(function(){return ($(this).attr('href') == '' || $(this).attr('href') == '#');})
  .removeAttr('href').css('cursor','pointer')
  .click(function(){ 
    window.close();
  });

})(jQuery);

//# sourceMappingURL=../../../map/scripts/projects/openid/login.js.map
