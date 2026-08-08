if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        if (this.form.querySelector('[name=id]')) this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        const sectionId = this.dataset.sectionId;
        const requiredFields = document.querySelectorAll(`.custom__variant-required-${sectionId} input`);
        let formValid = true;

        requiredFields.forEach(field => {
          if (!field.value) {
            formValid = false;
            field.classList.add('field--error');
          } else {
            field.classList.remove('field--error');
          }
        });

        if (!formValid) {
          this.handleErrorMessage(window.productForm.error);
          this.submitButton.classList.remove('loading');
          return;
        }

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

        const upsellProducts = window.productATCUpsells;
        let variantSelected = '';
        if (this.querySelector('.product-variant-id'))
          variantSelected = this.querySelector('.product-variant-id').value;

        const quantityInput = document.querySelector(`input[name="quantity"][form="${this.form.getAttribute('id')}"]`);
        let quantityValue = '1';
        quantityInput ? (quantityValue = quantityInput.value) : (quantityValue = '1');

        const formData = new FormData(this.form);
        if (this.cart) {
          // Gestion des upsells existants
          if (upsellProducts && upsellProducts.length > 0) {
            upsellProducts.forEach(product => {
              if (product.quantityBehavior === 'equals') {
                if (product.trigger.includes(variantSelected) && product.quantity === quantityValue) {
                  formData.append('items[][id]', product.idToAdd);
                  formData.append('items[][quantity]', product.quantityToAdd);
                }
              } else {
                if (product.trigger.includes(variantSelected) && product.quantity <= quantityValue) {
                  formData.append('items[][id]', product.idToAdd);
                  formData.append('items[][quantity]', product.quantityToAdd);
                }
              }
            });
          }

          // Gestion des produits cross-sell sélectionnés pour drawer/notification
          const crossSellProducts = this.getCrossSellProducts();
          if (crossSellProducts && crossSellProducts.length > 0) {
            crossSellProducts.forEach(product => {
              formData.append('items[][id]', product.variantId);
              formData.append('items[][quantity]', product.quantity);
            });
          }

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
              // Gérer les produits cross-sell avant redirection vers la page panier
              this.handleCrossSellForPageRedirect();
              return;
            }

            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              this.cart.renderContents(response);
            }
            
            // Nettoyer les checkboxes cross-sell après succès
            this.clearCrossSellSelection();
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
            console.log('Ajout des produits cross-sell pour redirection page:', crossSellProducts);

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
              console.log('Produits cross-sell ajoutés au panier:', result);
              
              // Nettoyer les checkboxes
              this.clearCrossSellSelection();
            } else {
              const errorText = await response.text();
              console.error('Erreur API cross-sell:', response.status, errorText);
            }
          } catch (error) {
            console.error('Erreur lors de l\'ajout des produits cross-sell:', error);
          }
        }
        
        // Rediriger vers la page panier (avec ou sans cross-sell)
        window.location = window.routes.cart_url;
      }
    }
  );
}
