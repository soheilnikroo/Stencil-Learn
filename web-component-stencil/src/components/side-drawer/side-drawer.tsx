import { Component, h, Method, Prop, State } from '@stencil/core';

@Component({
  tag: 'sn-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @State() showContactInfo = false;

  @Prop({ reflect: true }) titleText: string;
  @Prop({ reflect: true, mutable: true }) opened: boolean;

  onCloseDrawer(): void {
    this.opened = false;
  }

  onContentChangeHandler(content: string) {
    this.showContactInfo = content === 'contact';
  }

  @Method()
  async open() {
    this.opened = true;
  }

  render() {
    let mainContent = <slot />;
    if (this.showContactInfo) {
      mainContent = (
        <div id="contact-info">
          <h2>Contact Information</h2>
          <p>Youy can reach us via phone or email</p>
          <ul>
            <li>Phone: 64544545544</li>
            <li>
              E-Mail: <a href="">sosois@kdjdsj.com</a>
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div>
        <div onClick={this.onCloseDrawer.bind(this)} class="backdrop"></div>
        <aside>
          <header>
            <h1>{this.titleText}</h1>
            <button onClick={this.onCloseDrawer.bind(this)}>X</button>
          </header>
          <section id="tabs">
            <button onClick={this.onContentChangeHandler.bind(this, 'nav')} class={!this.showContactInfo ? 'active' : ''}>
              Navigation
            </button>
            <button onClick={this.onContentChangeHandler.bind(this, 'contact')} class={this.showContactInfo ? 'active' : ''}>
              Contact
            </button>
          </section>
          <main>{mainContent}</main>
        </aside>
      </div>
    );
  }
}
