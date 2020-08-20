const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
let cart = [];
let buttonsDOM = [];

class UI {
  constructor() {}

  hidePreloader() {
    document.querySelector('.preloader').style.display = 'none';
  }

  showNav() {
    document.querySelector('.nav').classList.toggle('nav--show');
  }

  videoControls() {
    let btn = document.querySelector('.video__switch-btn');
    if (!btn.classList.contains('btnSlide')) {
      btn.classList.add('btnSlide');
      document.querySelector('.video__item').pause();
    } else {
      btn.classList.remove('btnSlide');
      document.querySelector('.video__item').play();
    }
  }

  checkEmpty(
    name,
    lastName,
    email,
    telephone = 'DGv^d5LxmWGNu16cRZ8d',
    message = 'DGv^d5LxmWGNu16cRZ8d'
  ) {
    if (telephone !== '' && message !== '') {
      let result;
      return (result =
        name === '' || lastName === '' || email === '' ? false : true);
    }
    return false;
  }

  showFeedback(text, type) {
    const feedback = document.querySelector('.common-form__feedback');
    if (type === 'success') {
      feedback.classList.add('common-form__success');
      feedback.innerText = text;
      this.removeAlert('common-form__success');
    } else if (type === 'error') {
      feedback.classList.add('common-form__error');
      feedback.innerText = text;
      this.removeAlert('common-form__error');
    }
  }

  // remove alert
  removeAlert(type) {
    setTimeout(() => {
      document.querySelector('.common-form__feedback').classList.remove(type);
    }, 3000);
  }

  // add customer
  addCustomer(customer) {
    const images = [1, 2, 3, 4, 5];
    let random = Math.floor(Math.random() * images.length);

    const div = document.createElement('div');
    div.classList.add('person');
    div.innerHTML = `
      <img src="img/person/person-${random}.jpeg" alt="person" class="person_thumbnail">
      <h4 class="person__name">${customer.name}</h4>
      <h4 class="person__last-name">${customer.lastName}</h4>
    `;
    document.querySelector('.drink-card__list').appendChild(div);
  }

  sendFormData(method, url, data) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        this.showFeedback('Message Sent', 'success');
        this.clearFields();
      } else {
        this.showFeedback('Failed To Sent Message', 'error');
      }
    };
    xhr.send(data);
  }

  clearFields() {
    document.querySelector('.input-name').value = '';
    document.querySelector('.input-last-name').value = '';
    document.querySelector('.input-email').value = '';
    if (
      document.querySelector('.input-telephone') &&
      document.querySelector('.input-message')
    ) {
      document.querySelector('.input-telephone').value = '';
      document.querySelector('.input-message').value = '';
    }
  }

  showModal(event) {
    const item = event.target.parentElement.parentElement;
    if (item.classList.contains('work-item__icon')) {
      let id = item.dataset.id;
      const modal = document.querySelector('.work-modal');
      const modalItem = document.querySelector('.work-modal__item');

      modal.classList.add('work-modal__show');
      modalItem.style.backgroundImage = `url(img/home/work-${id}.jpg)`;
    }
  }

  closeModal() {
    document.querySelector('.work-modal').classList.remove('work-modal__show');
  }

  /* Products */
  displayProducts(products) {
    let result = '';
    products.forEach((product) => {
      result += `
      <article class="product">
        <div class="img-container">
          <img src=${product.image} alt="product" class="product-img" />
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            Add To Cart
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      `;
    });

    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }

      button.addEventListener('click', (event) => {
        event.target.innerText = 'In Cart';
        event.target.disabled = true;
        // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // add product to the cart
        cart = [...cart, cartItem];
        // save cart in local storage
        Storage.saveCart(cart, cartTotal, cartItems);
        // set cart values
        this.setCartValues(cart);
        // add cart item
        this.addCartItem(cartItem);
        // show the cart
        // this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src=${item.image} alt="product" />
      <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>Remove</span>
      </div>
      <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
      </div>
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }

  hideCart() {
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    });
    cartContent.addEventListener('click', (event) => {
      if (event.target.classList.contains('remove-item')) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains('fa-chevron-up')) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains('fa-chevron-down')) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
    // this.showNav();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    if (button) {
      button.disabled = false;
      button.innerHTML = `
      <i class="fas fa-shopping-cart"></i>Add To Cart
    `;
    }
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

class People {
  constructor(name, lastName, email) {
    this.name = name;
    this.lastName = lastName;
    this.email = email;
  }
}

class Products {
  async getProducts() {
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}

eventListener = () => {
  const ui = new UI();
  const products = new Products();

  // setup app
  ui.setupAPP();

  // hide preloader
  window.addEventListener('load', () => {
    ui.hidePreloader();
  });

  // nav btn
  document.querySelector('.navBtn').addEventListener('click', () => {
    ui.showNav();
  });

  // control video playback
  if (document.querySelector('.video__switch')) {
    document.querySelector('.video__switch').addEventListener('click', () => {
      ui.videoControls();
    });
  }

  // drink form
  if (document.getElementById('drink-form')) {
    document
      .querySelector('.common-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.querySelector('.input-name').value;
        const lastName = document.querySelector('.input-last-name').value;
        const email = document.querySelector('.input-email').value;
        let value = ui.checkEmpty(name, lastName, email);

        if (value) {
          let customer = new People(name, lastName, email);
          ui.addCustomer(customer);
          ui.showFeedback('Today is your lucky day!', 'success');
          ui.clearFields();
        } else {
          ui.showFeedback('Some form values are empty', 'error');
        }
      });
  }

  // contact form
  if (document.getElementById('contact-form')) {
    document
      .querySelector('.common-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.querySelector('.input-name').value;
        const lastName = document.querySelector('.input-last-name').value;
        const email = document.querySelector('.input-email').value;
        const telephone = document.querySelector('.input-telephone').value;
        const message = document.querySelector('.input-message').value;
        let value = ui.checkEmpty(name, lastName, email, telephone, message);

        if (value) {
          const form = document.getElementById('contact-form');
          const data = new FormData(form);
          ui.sendFormData(form.method, form.action, data);
        } else {
          ui.showFeedback('Some form values are empty', 'error');
        }
      });
  }

  // display modals
  const links = document.querySelectorAll('.work-item__icon');
  links.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      ui.showModal(event);
    });
  });

  // hide modals
  if (document.querySelector('.work-modal__close')) {
    document
      .querySelector('.work-modal__close')
      .addEventListener('click', () => {
        ui.closeModal();
      });
  }

  /* products */
  // get all products
  if (document.getElementById('products')) {
    products
      .getProducts()
      .then((products) => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
      })
      .then(() => {
        ui.getBagButtons();
        ui.cartLogic();
      });
  } else {
    ui.cartLogic();
  }
};

eventListener();
