export class ModalComponent extends HTMLElement {
  #shadow;
  #backdrop;
  #closeBtn;
  #modalContainer;
  #isOpen = false;
  #handleKey;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.hidden = true;
  }

  #init() {
    const template = this.#createTemplate();
    this.#shadow.appendChild(template);

    this.#backdrop = this.#shadow.querySelector(".modal-backdrop");
    this.#modalContainer = this.#shadow.querySelector(".modal-container");
    this.#closeBtn = this.#shadow.querySelector(".modal-close");
  }

  #createTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          position: relative;
          background: white;
          border-radius: 12px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          max-width: 500px;
          max-height: 90vh;
          width: 90%;
          overflow-y: scroll;
          transform: scale(1);
          opacity: 1;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #9ca3af;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 1;
        }

        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
          transform: scale(1.1);
        }

        .modal-body {
          overflow-y: auto;
        }

        @keyframes modalBackdropFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes modalBackdropFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes modalFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalFadeOut {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.5) translateY(-50px);
          }
        }
      </style>

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

    this.#closeBtn?.addEventListener("click", () => {
      this.close();
    });

    document.addEventListener("keydown", this.#handleKeyDown.bind(this));
  }

  open() {
    if (!this.#backdrop) {
      this.#init(); //khởi tạo lại
      this.#setupEventListener();
      this.#backdrop.style.animation = "modalBackdropFadeIn 0.4s";
      this.#modalContainer.style.animation = "modalFadeIn 0.4s";
    }
    this.#isOpen = true;
    this.hidden = false;
    this.dispatchEvent(new CustomEvent("modal:open"));
  }

  close() {
    this.#isOpen = false;

    this.#modalContainer.style.animation = "modalFadeOut 0.4s";
    this.#backdrop.style.animation = "modalBackdropFadeOut 0.4s";
    const handleAnimationEnd = () => {
      this.#modalContainer.removeEventListener(
        "animationend",
        handleAnimationEnd
      );
      this.#shadow.innerHTML = "";
      this.#backdrop = null;
      this.#modalContainer = null;
      this.#closeBtn = null;
      this.hidden = true;
    };

    this.#modalContainer.addEventListener("animationend", handleAnimationEnd);
    this.dispatchEvent(new CustomEvent("modal:close"));
  }
}
