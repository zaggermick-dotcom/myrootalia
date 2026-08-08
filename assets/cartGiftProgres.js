
function updateCartDisplay() {
  const isCartPage = window.location.pathname === '/cart';
  const cartDrawer = document.querySelector('cart-drawer');
  const hasDrawer = cartDrawer && cartDrawer.classList.contains('active');

  // If not on cart page and drawer isn't open, don't update
  if (!isCartPage && !hasDrawer) return;

  // Fetch updated cart data
  fetch('/cart.js')
    .then((response) => response.json())
    .then((cartData) => {
      // Update cart drawer if it's open
      if (hasDrawer) {
        cartDrawer.classList.toggle('is-empty', cartData.item_count === 0);

        // Update shipping bars
        const shippingBars = document.querySelectorAll(
          '.drawer__module--free_shipping'
        );
        if (shippingBars) {
          shippingBars.forEach((shippingBar) => {
            const before = shippingBar.querySelector(
              '.free-shipping__left-amount'
            );
            const after = shippingBar.querySelector('.free-shipping__success');
            const amount = shippingBar.querySelector('.free-shipping__amount');
            const drag = shippingBar.querySelector('.free-shipping__drag');
            const current = cartData.total_price / 100;
            const target = shippingBar.dataset.target;
            const formattedAmount = new Intl.NumberFormat(
              document.body.dataset.shopLocale,
              {
                style: 'currency',
                currency: document.body.dataset.shopCurrency,
              }
            ).format(target - current);

            if (target - current > 0) {
              amount.textContent = formattedAmount;
              before.classList.remove('hidden');
              after.classList.add('hidden');
              drag.style.width = `${(current * 100) / target}%`;
            } else {
              after.classList.remove('hidden');
              before.classList.add('hidden');
              drag.style.width = '100%';
            }
          });
        }

        // Update trust slider if exists
        if (document.querySelector('#drawer-trust__swiper')) {
          const trustDrawerCartSlider = new Swiper('#drawer-trust__swiper', {
            autoplay: { delay: 1000 },
            loop: true,
            navigation: {
              nextEl: '.button-next-drawer-trust__swiper',
              prevEl: '.button-prev-drawer-trust__swiper',
            },
          });
        }

        // Update upsell slider if exists
        if (document.querySelector('#drawer-upsell__swiper')) {
          const upsellDrawerCartSlider = new Swiper('#drawer-upsell__swiper', {
            slidesPerView: 1.3,
            spaceBetween: 15,
            autoHeight: true,
          });
        }
      }

      // Update cart page if it's the current page
      if (isCartPage) {
        const cartItemsElement = document.querySelector('cart-items');
        if (cartItemsElement) {
          cartItemsElement.classList.toggle(
            'is-empty',
            cartData.item_count === 0
          );
        }
      }

      // Update cart totals in both drawer and cart page
      updateCartTotals(cartData);

      // Update free gift modules if they exist
      const freeGiftModules = document.querySelectorAll(
        '[data-free-gift-module]'
      );
      if (freeGiftModules.length > 0) {
        freeGiftModules.forEach((moduleEl) => {
          updateFreeGiftUI(moduleEl, cartData);
        });
      }

      // Publish cart update event for other components (if used elsewhere)
      if (typeof publish !== 'undefined') {
        publish(PUB_SUB_EVENTS.cartUpdate, {
          source: 'cart-update-helper',
        });
      }
    })
    .catch((e) => {
      console.error('Error updating cart display:', e);
    });
}

/**
 * Update cart totals (subtotal, savings, total) in cart drawer and page
 */
function updateCartTotals(cartData) {
  let totalCompareAtPrice = 0;
  let totalSavings = 0;
  let indexItems = 1;

  cartData.items.forEach(function (item) {
    const varID = item.variant_id;
    let itemCompareAtPrice = 0;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/products/' + item.handle + '.js', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const product = JSON.parse(xhr.responseText);
        product.variants.forEach(function (variant) {
          if (variant.id == varID && variant.compare_at_price !== 0) {
            itemCompareAtPrice = variant.compare_at_price;
            return false;
          }
        });
      }
    };
    xhr.send();

    const itemPrice = item.original_line_price / item.quantity;
    const priceDrawerItemContainer = document.querySelector(
      `.priceWrapper${indexItems}`
    );
    const linePriceDrawerItemContainer = document.querySelector(
      `.linePriceWrapper${indexItems}`
    );
    indexItems++;

    const itemCompareAtPriceFormatted = new Intl.NumberFormat(
      document.body.dataset.shopLocale,
      {
        style: 'currency',
        currency: document.body.dataset.shopCurrency,
      }
    ).format(itemCompareAtPrice / 100);
    const itemPriceFormatted = new Intl.NumberFormat(
      document.body.dataset.shopLocale,
      {
        style: 'currency',
        currency: document.body.dataset.shopCurrency,
      }
    ).format(itemPrice / 100);
    const lineItemCompareAtPriceFormatted = new Intl.NumberFormat(
      document.body.dataset.shopLocale,
      {
        style: 'currency',
        currency: document.body.dataset.shopCurrency,
      }
    ).format((itemCompareAtPrice * item.quantity) / 100);
    const lineItemPriceFormatted = new Intl.NumberFormat(
      document.body.dataset.shopLocale,
      {
        style: 'currency',
        currency: document.body.dataset.shopCurrency,
      }
    ).format((itemPrice * item.quantity) / 100);

    const itemOnSaleHTML = `
      <div class="cart-item__discounted-prices">
        <span class="visually-hidden">Sale price</span>
        <s class="cart-item__old-price product-option">${itemCompareAtPriceFormatted}</s>
        <span class="visually-hidden">Regular price</span>
        <strong class="cart-item__final-price product-option">${itemPriceFormatted}</strong>
      </div>
    `;
    const itemRegularHTML = `<div class="product-option">${itemPriceFormatted}</div>`;

    const lineItemOnSaleHTML = `
      <div class="cart-item__discounted-prices">
        <span class="visually-hidden">Sale price</span>
        <s class="cart-item__old-price product-option">${lineItemCompareAtPriceFormatted}</s>
        <span class="visually-hidden">Regular price</span>
        <strong class="cart-item__final-price product-option">${lineItemPriceFormatted}</strong>
      </div>
    `;
    const lineItemRegularHTML = `<span class="product-option">${lineItemPriceFormatted}</span>`;

    if (itemCompareAtPrice == null || itemCompareAtPrice < 1) {
      totalCompareAtPrice += itemPrice + item.line_level_total_discount;
      totalSavings += item.line_level_total_discount;
      itemCompareAtPrice = 0;
      if (item.original_price <= item.final_price) {
        if (priceDrawerItemContainer)
          priceDrawerItemContainer.innerHTML = itemRegularHTML;
        if (linePriceDrawerItemContainer)
          linePriceDrawerItemContainer.innerHTML = lineItemRegularHTML;
      }
    } else {
      if (itemCompareAtPrice > itemPrice) {
        const itemTotalCompareAtPrice = item.quantity * itemCompareAtPrice;
        totalCompareAtPrice +=
          itemTotalCompareAtPrice + item.line_level_total_discount;
        totalSavings +=
          itemTotalCompareAtPrice -
          item.original_line_price +
          item.line_level_total_discount;
        if (item.original_price <= item.final_price) {
          if (priceDrawerItemContainer)
            priceDrawerItemContainer.innerHTML = itemOnSaleHTML;
          if (linePriceDrawerItemContainer)
            linePriceDrawerItemContainer.innerHTML = lineItemOnSaleHTML;
        }
      } else {
        totalCompareAtPrice += itemPrice + item.line_level_total_discount;
        if (item.original_price <= item.final_price) {
          if (priceDrawerItemContainer)
            priceDrawerItemContainer.innerHTML = itemRegularHTML;
          if (linePriceDrawerItemContainer)
            linePriceDrawerItemContainer.innerHTML = lineItemRegularHTML;
        }
      }
    }
  });

  const formattedSubtotalAmount = new Intl.NumberFormat(
    document.body.dataset.shopLocale,
    {
      style: 'currency',
      currency: document.body.dataset.shopCurrency,
    }
  ).format((cartData.total_price + totalSavings) / 100);

  const formattedSavingsAmount = new Intl.NumberFormat(
    document.body.dataset.shopLocale,
    {
      style: 'currency',
      currency: document.body.dataset.shopCurrency,
    }
  ).format(totalSavings / 100);

  const formattedTotalAmount = new Intl.NumberFormat(
    document.body.dataset.shopLocale,
    {
      style: 'currency',
      currency: document.body.dataset.shopCurrency,
    }
  ).format(cartData.total_price / 100);

  const subTotalEl = document.querySelector('.drawer__subtotal--amount');
  const savingsEl = document.querySelector('.drawer__savings--amount');
  const totalEl = document.querySelector('.drawer__total--amount');

  if (subTotalEl) {
    if (totalSavings > 0) {
      subTotalEl.textContent = formattedSubtotalAmount;
      const subtotalRow = document.querySelector('.totals.subtotal');
      if (subtotalRow) subtotalRow.style.display = 'flex';
    } else {
      const subtotalRow = document.querySelector('.totals.subtotal');
      if (subtotalRow) {
        subtotalRow.style.display = 'none';
        if (subtotalRow.nextElementSibling)
          subtotalRow.nextElementSibling.style.marginTop = '0';
      }
    }
  }

  if (savingsEl) {
    if (totalSavings > 0) {
      savingsEl.textContent = '-' + formattedSavingsAmount;
      const savingsRow = document.querySelector('.totals.savings');
      if (savingsRow) savingsRow.style.display = 'flex';
    } else {
      const savingsRow = document.querySelector('.totals.savings');
      if (savingsRow) {
        savingsRow.style.display = 'none';
        if (savingsRow.nextElementSibling)
          savingsRow.nextElementSibling.style.marginTop = '0';
      }
    }
  }

  if (totalEl) totalEl.textContent = formattedTotalAmount;
}

/**
 * Update free gift UI elements with current cart data
 * Handles 1-tier (only gift 1) or 2-tier (gift 1 + gift 2) setups
 */
function updateFreeGiftUI(moduleEl, cartData) {
  if (!moduleEl || !cartData) return;

  const threshold1 = Number(moduleEl.dataset.threshold1 || 0);
  const threshold2 = Number(moduleEl.dataset.threshold2 || 0);
  const cartTotal = cartData.total_price / 100;

  const gift1Icon = moduleEl.querySelector('[data-gift-1-icon]');
  const gift2Icon = moduleEl.querySelector('[data-gift-2-icon]');

  const hasFirstTier = threshold1 > 0 && !!gift1Icon;
  const hasSecondTier = threshold2 > 0 && !!gift2Icon;

  const topThreshold = hasSecondTier ? threshold2 : threshold1;

  // Progress bar fill
  //   let progress = 0;
  //   if (topThreshold > 0) {
  //     if (progress > 100) progress = 100;
  //   }

  // const progressBar = moduleEl.querySelector('[data-progress-bar]');
  // const liquidProgress = Number(moduleEl.dataset.finalProgress || 0);

  // if (progressBar) {
  //   progressBar.style.width = liquidProgress + '%';
  // }


  // // Message
  // const messageEl = moduleEl.querySelector('[data-gift-message]');
  // if (messageEl && hasFirstTier) {
  //   const formatter = new Intl.NumberFormat(document.body.dataset.shopLocale, {
  //     style: 'currency',
  //     currency: document.body.dataset.shopCurrency,
  //   });

  //   const amountLeft1 = Math.max(threshold1 - cartTotal, 0);
  //   const amountLeft2 = Math.max(threshold2 - cartTotal, 0);

  //   let message = '';

  //   if (!hasSecondTier) {
  //     // Single tier
  //     if (cartTotal >= threshold1) {
  //       message =
  //         moduleEl.dataset.congratsMessage ||
  //         'Congratulations! You unlocked your free gift.';
  //     } else {
  //       const formatted = formatter.format(amountLeft1);
  //       message =
  //         moduleEl.dataset.message1 ||
  //         'Only [amount] left to get your 1st free gift';
  //       message = message
  //         .replace('[amount]', formatted)
  //         .replace('[number]', '1');
  //     }
  //   } else {
  //     // Two tiers
  //     if (cartTotal >= threshold2) {
  //       message =
  //         moduleEl.dataset.congratsMessage ||
  //         "Congratulations! You've unlocked all free gifts!";
  //     } else if (cartTotal >= threshold1) {
  //       const formatted = formatter.format(amountLeft2);
  //       message =
  //         moduleEl.dataset.message2 ||
  //         'Only [amount] left to get your 2nd free gift';
  //       message = message
  //         .replace('[amount]', formatted)
  //         .replace('[number]', '2');
  //     } else {
  //       const formatted = formatter.format(amountLeft1);
  //       message =
  //         moduleEl.dataset.message1 ||
  //         'Only [amount] left to get your 1st free gift';
  //       message = message
  //         .replace('[amount]', formatted)
  //         .replace('[number]', '1');
  //     }
  //   }

  //   messageEl.textContent = message;
  // }

  // // Icon unlocked state
  // if (gift1Icon) {
  //   gift1Icon.classList.toggle('unlocked', hasFirstTier && cartTotal >= threshold1);
  // }
  // if (gift2Icon) {
  //   gift2Icon.classList.toggle('unlocked', hasSecondTier && cartTotal >= threshold2);
  // }
}

/**
 * Validate and ensure gifts have quantity = 1
 */
function validateGiftQuantities(cartItems) {
  if (!cartItems || !Array.isArray(cartItems)) return;

  const giftVariantIds = [
    window.giftProgressData?.cart_1st_gift,
    window.giftProgressData?.cart_2nd_gift,
  ].filter(Boolean);

  const changesNeeded = [];

  cartItems.forEach((item, idx) => {
    const isGift = item?.properties?.__is_free_gift === 'true';
    const isGiftVariant = giftVariantIds.includes(item.variant_id);

    if ((isGift || isGiftVariant) && item.quantity > 1) {
      changesNeeded.push({
        line: idx + 1,
        variant_id: item.variant_id,
      });
    }
  });

  if (!changesNeeded.length) return;

  changesNeeded.forEach((change, i) => {
    setTimeout(() => {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line: change.line,
          quantity: 1,
        }),
      })
        .then((r) => r.json())
        .then(() => {
          console.log(
            `Gift quantity corrected to 1 for variant ${change.variant_id}`
          );
        })
        .catch((e) => console.error('Error correcting gift quantity:', e));
    }, i * 250);
  });
}

/**
 * Main cart update function - determines when to add/remove gifts
 */
const cart_update_function = () => {

  if (!window.giftProgressData) return;

  fetch('/cart.js')
    .then((response) => response.json())
    .then((cartData) => {
      // total excluding free gifts
      const cartTotalExcludingGifts =
        cartData.items.reduce((total, item) => {
          if (item?.properties?.__is_free_gift === 'true') return total;
          return total + item.original_line_price;
        }, 0) / 100;

      const threshold1 =
        Number(window.giftProgressData.free_gift_threshold_price_1) || 0;
      const threshold2 =
        Number(window.giftProgressData.free_gift_threshold_price_2) || 0;
      const gift1VariantId = window.giftProgressData.cart_1st_gift || null;
      const gift2VariantId = window.giftProgressData.cart_2nd_gift || null;

      const gift1InCart =
        gift1VariantId &&
        cartData.items.find(
          (item) =>
            item.variant_id == gift1VariantId &&
            item?.properties?.__is_free_gift === 'true'
        );
      const gift2InCart =
        gift2VariantId &&
        cartData.items.find(
          (item) =>
            item.variant_id == gift2VariantId &&
            item?.properties?.__is_free_gift === 'true'
        );

      // Gift 1
      if (gift1VariantId && threshold1 > 0) {
        if (cartTotalExcludingGifts >= threshold1 && !gift1InCart) {
          addFreeGiftToCart(gift1VariantId);
        } else if (cartTotalExcludingGifts < threshold1 && gift1InCart) {
          removeFreeGiftFromCart(gift1InCart);
        }
      }

      // Gift 2
      if (gift2VariantId && threshold2 > 0) {
        if (cartTotalExcludingGifts >= threshold2 && !gift2InCart) {
          addFreeGiftToCart(gift2VariantId);
        } else if (cartTotalExcludingGifts < threshold2 && gift2InCart) {
          removeFreeGiftFromCart(gift2InCart);
        }
      }

      // Update progress UI and quantities
      const freeGiftModules = document.querySelectorAll(
        '[data-free-gift-module]'
      );
      freeGiftModules.forEach((moduleEl) => {
        updateFreeGiftUI(moduleEl, cartData);
      });

      validateGiftQuantities(cartData.items);
    })
    .catch((e) => {
      console.error('Error running cart_update_function:', e);
    });
};

// --- Surgical additions: debounce wrapper and active add-guard ---
const debouncedCartUpdate =
  typeof debounce === 'function' ? debounce(cart_update_function, 300) : cart_update_function;

// Prevent duplicate concurrent "add free gift" requests for the same variant
const _activeGiftAdds = new Set();
// --- end additions ---


/**
 * Add a free gift variant to cart with __is_free_gift property
 */
function addFreeGiftToCart(variantId) {
  // Prevent concurrent duplicate adds for the same variant
  if (_activeGiftAdds.has(variantId)) return;
  _activeGiftAdds.add(variantId);

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          id: variantId,
          quantity: 1,
          properties: {
            __is_free_gift: 'true',
          },
        },
      ],
    }),
  };

  fetch('/cart/add.js', config)
    .then((response) => response.json())
    .then(() => {
      // remove guard immediately on success (existing console.log kept)
      _activeGiftAdds.delete(variantId);
      console.log('Free gift added to cart:', variantId);

      // Trigger native updateQuantity to refresh UI
      setTimeout(() => {
        const cartItemsElement =
          document.querySelector('cart-items') ||
          document.querySelector('cart-drawer-items');
        if (cartItemsElement && cartItemsElement.updateQuantity) {
          fetch('/cart.js')
            .then((response) => response.json())
            .then((updatedCart) => {
              const validLineItem = updatedCart.items.findIndex(
                (item) => item?.properties?.__is_free_gift !== 'true'
              );
              if (validLineItem >= 0) {
                const lineNum = validLineItem + 1;
                const quantity = updatedCart.items[validLineItem].quantity;
                cartItemsElement.updateQuantity(lineNum, quantity);
              }
            })
            .catch((e) =>
              console.error('Error triggering cart refresh:', e)
            );
        }
      }, 400);
    })
    .catch((e) => {
      // ensure guard is cleared on error too
      _activeGiftAdds.delete(variantId);
      console.error('Error adding free gift to cart:', e);
    });
}

/**
 * Remove a free gift item from cart
 */
function removeFreeGiftFromCart(giftItem) {
  fetch('/cart.js')
    .then((response) => response.json())
    .then((cartData) => {
      const lineNumber =
        cartData.items.findIndex(
          (item) =>
            item.variant_id == giftItem.variant_id &&
            item?.properties?.__is_free_gift === 'true'
        ) + 1;

      if (!lineNumber || lineNumber < 1) return;

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line: lineNumber,
          quantity: 0,
        }),
      };

      fetch('/cart/change.js', config)
        .then((response) => response.json())
        .then(() => {
          console.log('Free gift removed from cart:', giftItem.variant_id);

          setTimeout(() => {
            const cartItemsElement =
              document.querySelector('cart-items') ||
              document.querySelector('cart-drawer-items');

            if (cartItemsElement && cartItemsElement.updateQuantity) {
              fetch('/cart.js')
                .then((response) => response.json())
                .then((updatedCart) => {
                  if (updatedCart.item_count === 0) {
                    console.log('Cart is now empty, reloading page. \n');
                    window.location.reload();
                    return;
                  }
                  const validLineItem = updatedCart.items.findIndex(
                    (item) => item?.properties?.__is_free_gift !== 'true'
                  );
                  if (validLineItem >= 0) {
                    const lineNum = validLineItem + 1;
                    const quantity =
                      updatedCart.items[validLineItem].quantity;
                    cartItemsElement.updateQuantity(lineNum, quantity);
                  }
                })
                .catch((e) =>
                  console.error('Error triggering cart refresh:', e)
                );
            }
          }, 400);
        })
        .catch((e) => {
          console.error('Error removing free gift from cart:', e);
        });
    })
    .catch((e) => {
      console.error('Error finding gift item to remove:', e);
    });
}