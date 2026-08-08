const getFormattedAmount = amount => {
  return new Intl.NumberFormat(document.body.dataset.shopLocale, {
    style: 'currency',
    currency: document.body.dataset.shopCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

if (!customElements.get('bundle-form')) {
  customElements.define(
    'bundle-form',
    class BundleForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');

        this.checkboxes = this.querySelectorAll('.bundle__meta--checked input');
        this.checkboxesEnabled = this.checkboxes.length > 0;

        if (this.checkboxesEnabled) {
          this.checkboxes.forEach(input => {
            input.addEventListener('change', () => this.changeChecked(input));
          });
        }

        this.updateTotalPrice();
      }

      changeChecked(input) {
        const product = input.closest('.bundle__product');

        if (input.checked) {
          product.classList.add('checked');
        } else {
          product.classList.remove('checked');
        }

        this.updateTotalPrice();
      }

      updateTotalPrice() {
        const discountType = (this.dataset.discountType || this.dataset.discount_type || 'entire').toString().toLowerCase().trim();
        const triggerHandle = (this.dataset.triggerHandle || this.dataset.trigger_handle || '').toString().toLowerCase().trim();

        const pctEntire = parseFloat(this.dataset.percentageEntire || this.dataset.percentage_entire || this.dataset.percentageOffer || this.dataset.percentage_offer || 0) || 0;
        const pctTrigger = parseFloat(this.dataset.percentageTrigger || this.dataset.percentage_trigger || this.dataset.percentageOfferTrigger || this.dataset.percentage_offer_trigger || 0) || 0;


  const freeLabel = (this.dataset.freeLabel || this.dataset.free_label) ? (this.dataset.freeLabel || this.dataset.free_label) : getFormattedAmount(0);



        const allProducts = Array.from(this.querySelectorAll('.bundle__product'));
        const checkedProducts = Array.from(this.querySelectorAll('.bundle__product.checked'));

        const parseCents = v => {
          const n = parseInt(v, 10);
          return Number.isNaN(n) ? 0 : n;
        };

        const allProductsSelected = allProducts.length > 0 && allProducts.length === checkedProducts.length;

        let baseTotal = 0;
        let compareAtTotal = 0;
        let triggerIncluded = false;

        // sum totals for checked products
        checkedProducts.forEach(product => {
          const price = parseCents(product.dataset.price || product.getAttribute('data-price'));
          const compare = parseCents(product.dataset.compareAtPrice || product.getAttribute('data-compare-at-price') || product.dataset.compareatprice || 0);

          baseTotal += price;
          compareAtTotal += (compare > price ? compare : price);

          const handle = (product.dataset.productHandle || product.getAttribute('data-product-handle') || '').toString().toLowerCase().trim();
          if (handle && triggerHandle && handle === triggerHandle) triggerIncluded = true;
        });

        // calculate discount amount (in cents)
        let discountAmount = 0;
        if (discountType === 'single') {
          // IMPORTANT CHANGE: apply single-trigger discount ONLY if trigger is included AND ALL products are selected
          if (triggerIncluded && allProductsSelected && pctTrigger > 0) {
            const triggerNode = checkedProducts.find(p => {
              const handle = (p.dataset.productHandle || p.getAttribute('data-product-handle') || '').toString().toLowerCase().trim();
              return handle === triggerHandle;
            });
            if (triggerNode) {
              const triggerPrice = parseCents(triggerNode.dataset.price || triggerNode.getAttribute('data-price'));
              discountAmount = Math.round(triggerPrice * (pctTrigger / 100));
            }
          } else {
            discountAmount = 0;
          }
        } else {
          // entire: only apply if all products are selected (keeps original behavior)
          if (allProductsSelected && pctEntire > 0) {
            discountAmount = Math.round(baseTotal * (pctEntire / 100));
          } else {
            discountAmount = 0;
          }
        }

        const finalPrice = Math.max(0, Math.round(baseTotal - discountAmount));

        // update bundle compare (under button)
        const compareDel = this.querySelector('.bundle__compare-at-price del');
        if (compareDel) {
          const showCompare = compareAtTotal > finalPrice;
          compareDel.style.display = showCompare ? 'inline-block' : 'none';
          if (showCompare) compareDel.textContent = getFormattedAmount(compareAtTotal);
        }

        // update bundle main price
        const priceEl = this.querySelector('.bundle__price--regular');
        const priceWrapper = this.querySelector('.bundle__price');
        if (priceEl) {
          priceEl.textContent = getFormattedAmount(finalPrice);
          if (priceWrapper) {
            if (compareAtTotal > finalPrice) priceWrapper.classList.add('bundle__on-sale');
            else priceWrapper.classList.remove('bundle__on-sale');
          }
        }

        const discountText = this.querySelector('.bundle__text');
        if (discountText) {
          if (discountType === 'single') {
            discountText.style.display = (triggerIncluded && allProductsSelected) ? 'block' : 'none';
          } else {
            discountText.style.display = allProductsSelected ? 'block' : 'none';
          }
        }

        allProducts.forEach(product => {
          const priceElLocal = product.querySelector('.bundle__product--price');
          const origPrice = parseCents(product.dataset.price || product.getAttribute('data-price'));
          const origCompare = parseCents(product.dataset.compareAtPrice || product.getAttribute('data-compare-at-price') || product.dataset.compareatprice || 0);
          const isChecked = product.classList.contains('checked');
          const handle = (product.dataset.productHandle || product.getAttribute('data-product-handle') || '').toString().toLowerCase().trim();
          const isTriggerProduct = (handle && triggerHandle && handle === triggerHandle);

          const badgeEl = product.querySelector('.bundle__product--badge');
          if (badgeEl) {
            const shouldShowBadge = (discountType === 'single' && isTriggerProduct && isChecked && allProductsSelected && pctTrigger > 0);
            badgeEl.classList.toggle('hidden', !shouldShowBadge);
          }

          if (priceElLocal) {
            if (discountType === 'single' && isTriggerProduct && isChecked && allProductsSelected && pctTrigger > 0) {
              const applied = Math.round(origPrice * (pctTrigger / 100));
              const discounted = Math.max(0, origPrice - applied);

              let html = '';
              if (origCompare > origPrice) {
                html += '<span class="price--compare"><del>' + getFormattedAmount(origCompare) + '</del></span>';
              } else {
                html += '<span class="price--compare"><del>' + getFormattedAmount(origPrice) + '</del></span>';
              }


                            if (discounted === 0) html += '<span class="price--regular price--sale">' + freeLabel + '</span>';
              else html += '<span class="price--regular price--sale">' + getFormattedAmount(discounted) + '</span>';
            

              priceElLocal.innerHTML = html;
            } else if (discountType === 'entire' && isChecked && allProductsSelected && pctEntire > 0) {
              const applied = Math.round(origPrice * (pctEntire / 100));
              const discounted = Math.max(0, origPrice - applied);

              let html = '';
              if (origCompare > origPrice) html += '<span class="price--compare"><del>' + getFormattedAmount(origCompare) + '</del></span>';
              html += '<span class="price--regular price--sale">' + (discounted === 0 ? freeLabel : getFormattedAmount(discounted)) + '</span>';
              priceElLocal.innerHTML = html;
            } else {
              let html = '';
              if (origCompare > origPrice) html += '<span class="price--compare"><del>' + getFormattedAmount(origCompare) + '</del></span>';
              html += '<span class="price--regular' + (origCompare > origPrice ? ' price--sale' : '') + '">' + getFormattedAmount(origPrice) + '</span>';
              priceElLocal.innerHTML = html;
            }
          }
        });

        return { baseTotal, compareAtTotal, discountAmount, finalPrice, discountType, triggerHandle };
      }

      changeChecked(input) {
        const parent = input.closest('.bundle__product');
        if (!parent) return;
        parent.classList.toggle('checked');
        this.updateTotalPrice();
      }
      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        let protection = false;
        if (this.submitButton.classList.contains('button__drawer--protection')) protection = true;
        if (protection && this.submitButton.classList.contains('active')) return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        if (!protection) this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData();

        this.querySelectorAll('.bundle__product.checked').forEach(product => {
          formData.append('items[][id]', product.id);
          formData.append('items[][quantity]', 1);
        });

        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map(section => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }

        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then(response => response.json())
          .then(response => {
            if (response.status) {
              this.handleErrorMessage(response.description);
              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButton.querySelector('span').classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            this.error = false;
            this.cart.renderContents(response);
          })
          .catch(e => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) {
              this.submitButton.removeAttribute('aria-disabled');
              if (protection) this.submitButton.classList.add('active');
            }
            if (!protection) this.querySelector('.loading-overlay__spinner').classList.add('hidden');
          });
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      changeVariant(select, event) {
        const selectElement = event.target;
        const selectedOption = selectElement.options[selectElement.selectedIndex];

        const parent = this.querySelector(`.bundle__product--${select.dataset.productId}`);
        parent.id = select.value;
        this.updatePrice(parent, selectedOption.dataset.price, selectedOption.dataset.compareAtPrice);
      }

      changeChecked(input) {
        const parent = this.querySelector(`.bundle__product--${input.dataset.productId}`);
        parent.classList.toggle('checked');
        this.updateTotalPrice();
      }
    }
  );
}