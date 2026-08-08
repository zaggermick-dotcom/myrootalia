    (function(){
      if (window._manualStockLoaded) return;
      window._manualStockLoaded = true;

      function updateManualStockUI(blockId, stock, limit) {
        var span = document.getElementById('manual-stock-' + blockId);
        var bar = document.getElementById('manual-stock-bar-' + blockId);
        if (!span || !bar) return;
        span.textContent = stock;
        var pct = 0;
        if (limit > 0) pct = (stock / limit) * 100;
        pct = Math.max(0, Math.min(100, pct));
        bar.style.width = pct + '%';
      }

      var bars = Array.prototype.slice.call(document.querySelectorAll('.stock_bar[id^="manual-stock-bar-"]'));
      var urgencyBars = bars.filter(function(b){ return b.getAttribute('data-urgency') === 'true'; });

      urgencyBars.forEach(function(bar){
        try {
          var blockId = bar.getAttribute('data-block-id');
          var initial = parseInt(bar.getAttribute('data-initial') || '0', 10);
          var limit = parseInt(bar.getAttribute('data-limit') || '1', 10);
          var decAmount = parseInt(bar.getAttribute('data-decrement-amount') || '1', 10);
          var decInterval = parseInt(bar.getAttribute('data-decrement-interval') || '10000', 10);
          var minStock = parseInt(bar.getAttribute('data-min-stock') || '1', 10);

          var storageKey = 'manualStock_block_' + blockId;
          var stored = localStorage.getItem(storageKey);
          var current = (stored !== null) ? parseInt(stored, 10) : initial;
          if (isNaN(current)) current = initial;
          if (current < 0) current = 0;
          if (current > limit) current = limit;

          updateManualStockUI(blockId, current, limit);

          var addToCartButtons = document.querySelectorAll('form[action^="/cart"] button[type="submit"], [data-add-to-cart], .add-to-cart, [data-product-form] button[type="submit"]');
          addToCartButtons.forEach(function(btn){
            if (btn._manualStockListenerAdded) return;
            btn._manualStockListenerAdded = true;
            btn.addEventListener('click', function(){
              var newVal = Math.max(minStock, current - decAmount);
              if (newVal !== current) {
                current = newVal;
                localStorage.setItem(storageKey, String(current));
                updateManualStockUI(blockId, current, limit);
              }
            }, { passive: true });
          });

          var intervalId = setInterval(function(){
            if (current > minStock) {
              current = Math.max(minStock, current - decAmount);
              localStorage.setItem(storageKey, String(current));
              updateManualStockUI(blockId, current, limit);
            } else {
              clearInterval(intervalId);
            }
          }, decInterval);

          bar.style.transition = 'width 600ms ease';
        } catch (e) {
          console.error('manual stock script error', e);
        }
      });

      var nonUrgencyBars = bars.filter(function(b){ return b.getAttribute('data-urgency') !== 'true'; });
      nonUrgencyBars.forEach(function(bar){
        try {
          var blockId = bar.getAttribute('data-block-id');
          var initial = parseInt(bar.getAttribute('data-initial') || '0', 10);
          var limit = parseInt(bar.getAttribute('data-limit') || '1', 10);
          updateManualStockUI(blockId, initial, limit);
        } catch (e) {
          console.error('manual stock script error', e);
        }
      });

    })();
