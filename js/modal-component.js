export class ModalComponent extends HTMLElement {
  #shadow;
  #backdrop;
  #closeBtn;
  #modalContainer;
  #isOpen = false;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.#setupEventListener();
    requestAnimationFrame(() => {
      this.hidden = false;
    });
  }

  #init() {
    const template = this.#createTemplate();
    this.#shadow.appendChild(template);

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/modal.css");

    this.#shadow.prepend(linkElem);
    this.#backdrop = this.#shadow.querySelector(".modal-backdrop");
    this.#modalContainer = this.#shadow.querySelector(".modal-container");
    this.#closeBtn = this.#shadow.querySelector(".modal-close");
  }

  #createTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-container">
         <button class="modal-close" type="button" aria-label="Close modal" title="Close">&times;</button>
          <div class="modal-heading">
            <slot name="heading"></slot>
             
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
    return template.content.cloneNode(true);
  }

  #handleKeyDown(e) {
    if (!this.#isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
    }
  }

  #setupEventListener() {
    this.#backdrop?.addEventListener("click", (e) => {
      if (e.target === this.#backdrop) {
        this.close();
      }
    });
    this.#closeBtn.addEventListener("click", (e) => {
      this.close();
    });
    document.addEventListener("keydown", this.#handleKeyDown.bind(this));
  }

  open() {
    if (!this.#backdrop) {
      this.#init(); //Bấm rồi mới tải chư xog
      this.#setupEventListener();
    }
    this.#isOpen = true;
    this.#backdrop?.classList.add("show");
    this.hidden = false;
    this.dispatchEvent(new CustomEvent("modal:open"));
  }

  close() {
    requestAnimationFrame(() => {
      this.#shadow.innerHTML = "";
      this.#backdrop = null;
      this.#modalContainer = null;
      this.#closeBtn = null;
    });
    this.#isOpen = false;
    this.#backdrop?.classList.remove("show");
    this.hidden = true;
    this.dispatchEvent(new CustomEvent("modal:close"));
  }
}
