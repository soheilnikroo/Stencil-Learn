class Modal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
          #backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.75);
            opacity: 0;
            pointer-events: none;
          }

          :host([opened]) #backdrop{
            opacity: 1;
            pointer-events: all;
          }

          :host([opened]) #modal{
            opacity: 1;
            pointer-events: all;
            top:15vh;
          }

          #modal {
            position: fixed;
            top: 10vh;
            left: 25%;
            background-color: white;
            border-radius: 3px;
            width: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
            z-index:100;
            display:flex;
            flex-direction:column;
            justify-content:space-between;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease-out;
            
          }

          header{
            padding: 1rem;
            border-bottom: 1px solid #ccc;
          }

          header h1{
            font-size:1.25rem;
          }

          #main{
            padding:1rem;
          }

          ::slotted(h1){
            ffont-size:1.25rem;
            margin:0;
          }

          #actions{
            border-top: 1px solid #ccc;
            padding:1rem;
            display:flex;
            justify-content:flex-end;
          }

          #actions button{
            margin:0 0.25rem
          }

        </style>
        <div id="backdrop"></div>
        <div id="modal">
          <header>
            <slot name="title">Please Confirm Payment</slot>
          </header>
          <section id="main">
            <slot></slot>
          </section>
          <section id="actions">
            <button id="cancle-btn">Cancle</button>
            <button id="confirm-btn">Okay</button>
          </section>
        </div>
        `;

    const slots = this.shadowRoot.querySelectorAll("slot");
    slots[1].addEventListener("slotchange", () => {
      console.dir(slots[1].assignedNodes());
    });

    const cancleButton = this.shadowRoot.querySelector("#cancle-btn");
    const confirmButton = this.shadowRoot.querySelector("#confirm-btn");

    cancleButton.addEventListener("click", this._cancle.bind(this));
    confirmButton.addEventListener("click", this._confirm.bind(this));

    const backdrop = this.shadowRoot.querySelector("#backdrop");

    backdrop.addEventListener("click", this._cancle.bind(this));

    // cancleButton.addEventListener("cancle", () => {
    //   console.log("cancle in component");
    // });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "opened") {
      if (this.hasAttribute("opened")) {
        this.isOpen = true;
        // this.shadowRoot.querySelector("#backdrop").style.opacity = 1;
        // this.shadowRoot.querySelector("#backdrop").style.pointerEvents = "all";
        // this.shadowRoot.querySelector("#modal").style.pointerEvents = "all";
        // this.shadowRoot.querySelector("#modal").style.opacity = 1;
      } else {
        this.isOpen = false;
      }
    }
  }

  static get observedAttributes() {
    return ["opened"];
  }

  open() {
    this.setAttribute("opened", "");
    this.isOpen = true;
  }

  hide() {
    if (this.hasAttribute("opened")) {
      this.removeAttribute("opened");
    }
    this.isOpen = false;
  }

  _cancle(event) {
    this.hide();
    const cancleEvent = new Event("cancle", { bubbles: true, composed: true });
    event.target.dispatchEvent(cancleEvent);
  }

  _confirm() {
    this.hide();
    const confrimEvent = new Event("confirm");
    this.dispatchEvent(confrimEvent);
  }
}

customElements.define("sn-modal", Modal);
