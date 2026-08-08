if (document.querySelectorAll('component-pack').length === 0) {
  document.querySelectorAll('.pack__wrapper .pack').forEach(pack => {
    pack.addEventListener('click', function () {
      resetSelectedPack();
      pack.classList.add('pack__selected');
      document.querySelector('input[name=quantity].quantity__input').value = pack.dataset.quantity;
    });
  });

  function resetSelectedPack() {
    document.querySelectorAll('.pack__wrapper .pack').forEach(pack => {
      pack.classList.remove('pack__selected');
    });
  }
}

/**
 * @param {string} element
 * @returns {boolean}
 */
function isStringNullish(element) {
  return element === null || element === undefined || element === '';
}

if (!customElements.get('product-pack')) {
  class ProductPack extends HTMLElement {
    constructor() {
      super();

      this.packStyle = this.dataset.style;
      this.sectionId = this.dataset.sectionId;
      this.packs = this.querySelectorAll('.pack__wrapper component-pack');
      this.addToCartButton = this.querySelector('#product-pack-submit');
      this.form = this.querySelector('form');
      this.cartDrawer = document.querySelector('cart-drawer');
      this.cartNotification = document.querySelector('cart-notification');
      this.cart = this.cartDrawer || this.cartNotification;
      this.submitButton = this.querySelector('[type="submit"]');
      this.priceContainers = document.querySelectorAll(`#ProductInfo-${this.sectionId} [data-price-container]`);
      // Gift feature Start
      this.autoAddGifts = this.dataset.autoAddGifts === 'true';
      this._addedGiftMarker = '_gift_from_pack';
      // Gift feature End

      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
      document.body.classList.add('packPresentOnPage');
    }

    connectedCallback() {
      this.listenEvents();
    }

    listenEvents() {
      this.onPackSelection();
      let array = [];

      document.addEventListener('component-pack:array-initialized', event => {
        array = event.detail.array;
      });

      this.form.addEventListener('submit', event => {
        this.addToCart(event, array);
      });
    }

    resetSelectedPack() {
      document.querySelectorAll('.pack__wrapper .pack').forEach(pack => {
        pack.classList.remove('pack__selected');
      });
    }

    onPackSelection() {
      this.packs.forEach(pack => {
        pack.addEventListener('click', () => {
          this.updatePrice(pack);
          this.resetSelectedPack();
          pack.classList.add('pack__selected');
          pack.onPackSelection();
          if (this.packStyle === 'stack') this.updateSelectsDisplay(pack);
        });
      });
    }

    // Gift feature methods

    readGiftCount(packIndex) {
      // Try dataset first (data-gift-count-0 => dataset.giftCount0)
      const dsKey = 'giftCount' + packIndex;
      let val = null;

      if (this.dataset && typeof this.dataset[dsKey] !== 'undefined') {
        val = this.dataset[dsKey];
      } else if (this.getAttribute) {
        val = this.getAttribute('data-gift-count-' + packIndex);
      }

      // Normalize to integer >= 0
      if (val === null || typeof val === 'undefined' || val === '') return 0;
      const n = parseInt(val, 10);
      return Number.isFinite(n) ? Math.max(0, n) : 0;
    }
    // End Gift feature methods

    updateSelectsDisplay(pack) {
      const selects = document.querySelectorAll('.pack__stack--selects');
      const selectsActive = document.querySelectorAll(`.${pack.dataset.stack}`);
      selects.forEach(select => select.classList.remove('stack-active'));
      selectsActive.forEach(select => select.classList.add('stack-active'));
    }

    updatePrice(pack) {
      this.priceContainers.forEach(priceContainer => {
        const comparePrice = priceContainer.querySelector('.price__sale span s');
        const salePrice = priceContainer.querySelector('.price-item--sale');
        const regularPrice = priceContainer.querySelector('.price-item');

        if (comparePrice && salePrice) {
          comparePrice.innerHTML = pack.dataset.comparePrice;
          salePrice.innerHTML = pack.dataset.regularPrice;
        } else {
          regularPrice.innerHTML = pack.dataset.regularPrice;
        }
      });
    }


    addToCart(event, array) {
      event.preventDefault();
      let items = this.filterItems(array);

      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append(
          'sections',
          this.cart.getSectionsToRender().map(section => section.id)
        );
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      for (let i = 0; i < items.length; i++) {
        config.body.set(`items[${i}][id]`, items[i].id);
        config.body.set(`items[${i}][quantity]`, items[i].quantity);
      }

      const upsellProducts = window.productATCUpsells;
      const idList = items.map(item => item.id.toString());

      const quantityInput = document.querySelector('component-pack.pack__selected');
      let quantityValue = '1';
      quantityInput ? (quantityValue = quantityInput.dataset.quantity) : (quantityValue = '1');

      let upsellProductsIndex = 0;
      if (upsellProducts && upsellProducts.length > 0) {
        upsellProducts.forEach(product => {
          const triggerArray = product.trigger.split(',');
          const hasMatchingTrigger = triggerArray.some(trigger => idList.includes(trigger.trim()));

          if (product.quantityBehavior === 'equals') {
            if (hasMatchingTrigger && product.quantity === quantityValue) {
              config.body.append(`items[${upsellProductsIndex + items.length}][id]`, product.idToAdd);
              config.body.append(`items[${upsellProductsIndex + items.length}][quantity]`, product.quantityToAdd);
              upsellProductsIndex += 1;
            }
          } else {
            if (hasMatchingTrigger && product.quantity <= quantityValue) {
              config.body.append(`items[${upsellProductsIndex + items.length}][id]`, product.idToAdd);
              config.body.append(`items[${upsellProductsIndex + items.length}][quantity]`, product.quantityToAdd);
              upsellProductsIndex += 1;
            }
          }
        });
      }

      // Gestion des produits cross-sell sélectionnés (uniquement pour drawer/notification)
      if (this.cart) {
        const crossSellProducts = this.getCrossSellProducts();
        if (crossSellProducts && crossSellProducts.length > 0) {
          crossSellProducts.forEach(product => {
            config.body.append(`items[${upsellProductsIndex + items.length}][id]`, product.variantId);
            config.body.append(`items[${upsellProductsIndex + items.length}][quantity]`, product.quantity);
            upsellProductsIndex += 1;
          });
        }
      }

      if (items.length === 0) {
        config.body.set(`items[product_id][id]`, parseInt(this.dataset.productId));

        if (document.querySelectorAll('component-pack').length === 0) {
          config.body.set(
            `items[product_id][quantity]`,
            parseInt(document.querySelector('input[name=quantity].quantity__input').value)
          );
        } else {
          config.body.set(
            `items[product_id][quantity]`,
            parseInt(this.querySelector('component-pack.pack__selected').dataset.quantity)
          );
        }
      }



      // ----------------- START: safe append gifts (PLACE THIS AFTER items[...] LOGIC, BEFORE fetch) -----------------
      if (this.autoAddGifts) {
        try {
          // If single-product branch used items[product_id][id], convert to items[] so gifts can be appended safely
          const singleProdId = config.body.get && config.body.get('items[product_id][id]');
          if (singleProdId) {
            const singleQty = (config.body.get('items[product_id][quantity]') || '1').toString();
            try { config.body.delete('items[product_id][id]'); } catch (e) {/*ignore*/ }
            try { config.body.delete('items[product_id][quantity]'); } catch (e) {/*ignore*/ }

            config.body.append('items[0][id]', singleProdId.toString());
            config.body.append('items[0][quantity]', singleQty);
          }

          // Determine how many items already appended (items[] + upsells + cross-sells)
          const existingItemsCount = (typeof items !== 'undefined' ? items.length : 0) + (typeof upsellProductsIndex !== 'undefined' ? upsellProductsIndex : 0);

          let idxToAppend = existingItemsCount;

          // compute selected pack index safely
          const selectedPackEl = this.querySelector('component-pack.pack__selected') || document.querySelector('.pack__wrapper .pack.pack__selected');
          let packIndex = 0;
          if (selectedPackEl) {
            packIndex = (typeof selectedPackEl.dataset.packIndex !== 'undefined' && selectedPackEl.dataset.packIndex !== '')
              ? parseInt(selectedPackEl.dataset.packIndex, 10)
              : Array.prototype.indexOf.call(selectedPackEl.parentElement.querySelectorAll('.pack'), selectedPackEl);
          }

          // number of gifts to add for this pack
          const giftCount = (typeof this.readGiftCount === 'function') ? this.readGiftCount(packIndex) : 0;
          for (let g = 1; g <= giftCount; g++) {
            const variantId = (this.dataset && this.dataset['giftVariant' + g]) ? this.dataset['giftVariant' + g] : (this.getAttribute ? this.getAttribute('data-gift-variant-' + g) : null);
            if (!variantId) continue;

            config.body.append(`items[${idxToAppend}][id]`, variantId.toString());
            config.body.append(`items[${idxToAppend}][quantity]`, '1');
            config.body.append(`items[${idxToAppend}][properties][_gift_from_pack]`, 'pack-' + packIndex);

            idxToAppend++;
          }
        } catch (err) {
          console.error('Error appending gifts to addToCart request:', err);
        }
      }
      // ----------------- END: safe append gifts -----------------


      fetch(`${routes.cart_add_url}`, config)
        .then(response => response.json())
        .then(response => {
          if (response.status) {
            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;

            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            // Gérer les produits cross-sell avant redirection vers la page panier
            this.handleCrossSellForPageRedirect();
            return;
          }

          if (this.cart) {
            if (this.cartNotification) {
              // Pour la notification cart, on a besoin de la clé du produit
              const itemKey = response.key || (response.items && response.items[0] ? response.items[0].key : '');

              if (!itemKey) {
                console.error('No item key found in response:', response);
                return;
              }

              // On prépare les sections nécessaires
              const sectionsToRender = this.cartNotification.getSectionsToRender();
              const sectionIds = sectionsToRender.map(section => section.id);

              // On fait un fetch des sections
              fetch(`${routes.cart_url}?view=notification&sections=${sectionIds.join(',')}`)
                .then((response) => response.json())
                .then((sectionsResponse) => {
                  // On passe la clé du produit et les sections
                  this.cartNotification.renderContents({
                    key: itemKey,
                    sections: sectionsResponse
                  });
                })
                .catch((error) => {
                  console.error('Error fetching cart sections:', error);
                });
            } else if (this.cartDrawer) {
              // Pour le cart drawer
              this.cartDrawer.renderContents(response);
            }
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) {
            this.submitButton.removeAttribute('aria-disabled');
            // Nettoyer les checkboxes cross-sell après ajout réussi
            this.clearCrossSellSelection();
          }
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    /**
     * @param {Array} array
     * @returns Array
     */
    filterItems(array) {
      const countMap = array.reduce((acc, item) => {
        if (item.id != null) {
          acc[item.id] = (acc[item.id] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.keys(countMap).map(key => ({
        id: Number(key),
        quantity: countMap[key],
      }));
    }

    getCrossSellProducts() {
      const selectedProducts = [];
      const checkboxes = document.querySelectorAll('.product-card__checkbox:checked');

      checkboxes.forEach(checkbox => {
        const productId = checkbox.dataset.productId;
        const variantId = checkbox.dataset.variantId;

        if (productId && variantId) {
          selectedProducts.push({
            productId: productId,
            variantId: parseInt(variantId),
            quantity: 1
          });
        }
      });

      return selectedProducts;
    }

    clearCrossSellSelection() {
      document.querySelectorAll('.product-card__checkbox:checked').forEach(checkbox => {
        checkbox.checked = false;
      });
    }

    async handleCrossSellForPageRedirect() {
      const crossSellProducts = this.getCrossSellProducts();

      if (crossSellProducts && crossSellProducts.length > 0) {
        try {
          console.log('Ajout des produits cross-sell pour redirection page (product-pack):', crossSellProducts);

          // Préparer les données pour l'API cart/add.js (UNIQUEMENT les cross-sell)
          const items = crossSellProducts.map(product => ({
            id: product.variantId,
            quantity: product.quantity
          }));

          // Envoyer la requête avec le bon format
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: items
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Produits cross-sell ajoutés au panier (product-pack):', result);

            // Nettoyer les checkboxes
            this.clearCrossSellSelection();
          } else {
            const errorText = await response.text();
            console.error('Erreur API cross-sell (product-pack):', response.status, errorText);
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout des produits cross-sell (product-pack):', error);
        }
      }

      // Rediriger vers la page panier (avec ou sans cross-sell)
      window.location = window.routes.cart_url;
    }
  }
  customElements.define('product-pack', ProductPack);
}

if (!customElements.get('component-pack')) {
  class ComponentPack extends HTMLElement {
    constructor() {
      super();
      (this.template = this.closest('product-pack').querySelector('template#product-pack-variants').content),
        (this.options = Array.from(this.template.querySelectorAll('option'))),
        (this.selectedVariants = []);
      this.trueButtonText = document.querySelector('product-pack [name="add"] .addbtntext').innerHTML;
    }

    connectedCallback() {
      this.listenEvents(), this.initializeSelectedVariants(), this.onPackSelection();
    }

    listenEvents() {
      this.onOptionSelection();
    }

    initializeSelectedVariants() {
      if (this.querySelectorAll('.pack__select--container').length === 0) return;

      this.querySelectorAll('.pack__select--container').forEach((container, index) => {
        const selectedOptions = Array.from(container.querySelectorAll('select')).map(select =>
          select.value.trim()
        );

        const selectedVariant = this.options.find(variant => {
          const variantOptions = JSON.parse(variant.dataset.options);

          return selectedOptions.every((value, i) => variantOptions[i].trim() === value);
        });

        if (!selectedVariant) {
          console.error('No variant matches the selected options.');
          return;
        }

        this.selectedVariants.push({
          index: index,
          id: parseInt(selectedVariant.dataset.id),
          available: selectedVariant.dataset.available === 'true',
        });
      });

      this.classList.contains('pack__selected') ? this.dispatchSelectedVariants() : null;
    }

    onPackSelection() {
      if (this.classList.contains('pack__selected')) {
        this.toggleSelectedVariantsAvailability();
        this.dispatchSelectedVariants();
      }
    }

    toggleSelectedVariantsAvailability() {
      if (this.selectedVariants.some(variant => variant.available === false)) {
        this.toggleAddButton(true, window.variantStrings.soldOut, false);
      } else {
        this.toggleAddButton(false, '', false);
      }
    }

    onOptionSelection() {
      this.querySelectorAll('.pack__select--container').forEach((container, index) => {
        this.findOptions(container, index);
      });
    }

    dispatchSelectedVariants() {
      document.dispatchEvent(
        new CustomEvent('component-pack:array-initialized', {
          detail: {
            array: this.selectedVariants,
          },
        })
      );
    }

    findOptions(container, index) {
      container.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
          this.onOptionChanged(container, index);

          if (!this.classList.contains('pack__selected')) return;
          this.dispatchSelectedVariants();
        });
      });
    }

    onOptionChanged(container, index) {
      const selectedOptions = Array.from(container.querySelectorAll('select')).map(select =>
        select.value.trim()
      );

      const selectedVariant = this.options.find(variant => {
        const variantOptions = JSON.parse(variant.dataset.options);

        return selectedOptions.every((value, i) => variantOptions[i].trim() === value);
      });

      if (!selectedVariant) {
        console.error('No variant matches the selected options.');
        return;
      }

      this.selectedVariant = selectedVariant;

      let foundIndex = this.selectedVariants.findIndex(variant => variant.index === index);

      if (foundIndex !== -1) {
        this.selectedVariants[foundIndex] = {
          index: index,
          id: parseInt(this.selectedVariant.dataset.id),
          available: this.selectedVariant.dataset.available === 'true',
        };
      } else {
        this.selectedVariants.push({
          index: index,
          id: parseInt(this.selectedVariant.dataset.id),
          available: this.selectedVariant.dataset.available === 'true',
        });
      }

      this.toggleSelectedVariantsAvailability();
    }

    toggleAddButton(disable = true, text, modifyClass = true) {
      const productPack = this.closest('product-pack');
      const addButton = productPack.querySelector('[name="add"]');
      const addButtonText = productPack.querySelector('[name="add"] .addbtntext');
      if (!addButton) return;

      if (disable) {
        addButton.setAttribute('disabled', 'disabled');
        if (text) addButtonText.textContent = text;
      } else {
        addButton.removeAttribute('disabled');
        addButtonText.innerHTML = this.trueButtonText;
      }

      if (!modifyClass) return;
    }
  }
  customElements.define('component-pack', ComponentPack);
}

/**
 * une suite de pseudos tests pour les packs
 * @test {product-pack} au chargement de la page, sélectionner le pack par défaut et mettre à jour la quantité
 * @test {product-pack} au changement de pack, selection du pack sélectionné et mise à jour de la quantité
 * @test {product-pack} au changement de pack, selection du pack sélectionné et mise à jour de l'input id
 * @test {component-pack} au changement d'option, mise à jour de la variante sélectionnée et de l'input id
 * @test {component-pack} si la variante sélectionnée est indisponible, désactiver le bouton ajouter au panier
 * @test {component-pack} si la variante sélectionnée est disponible, activer le bouton ajouter au panier
 * @test {component-pack} si la variante sélectionnée est indisponible, afficher le message de stock épuisé
 * @test {component-pack} si la variante sélectionnée est disponible, afficher le texte par défaut du bouton ajouter au panier
 * @test {component-pack} si la variante sélectionnée est indisponible, ajouter l'attribut disabled au bouton ajouter au panier
 * @test {component-pack} si la variante sélectionnée est disponible, supprimer l'attribut disabled au bouton ajouter au panier
 */
