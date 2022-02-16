import { Component, Element, h, Listen, Prop, State, Watch } from '@stencil/core';
import { API_KEY } from '../../global/global';

@Component({
  tag: 'sn-stock-price',
  shadow: true,
  styleUrl: './stock-price.css',
})
export class StockPrice {
  stockInput: HTMLInputElement;
  // intialStockSymbol: string;

  @Element() el: HTMLElement;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() StockInputValid: boolean = false;
  @State() error: string;
  @State() loading: boolean = false;

  @Prop({ mutable: true, reflect: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }

  stockInputChangeHandler(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    if (this.stockUserInput.trim() !== '') {
      this.StockInputValid = true;
    } else {
      this.StockInputValid = false;
    }
  }

  componentWillLoad() {
    console.log('componentWillLoad');
    console.log(this.stockSymbol);
    this.fetchedPrice = 0;
  }

  componentDidLoad() {
    if (this.stockSymbol) {
      // this.intialStockSymbol = this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.StockInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    // if (this.stockSymbol !== this.intialStockSymbol) {
    //   this.intialStockSymbol = this.stockSymbol;
    //   this.fetchStockPrice(this.stockSymbol);
    // }
  }

  componentDidUnLoad() {
    console.log('componentDidUnLoad');
  }

  @Listen('snSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent) {
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail;
      this.StockInputValid = true;
    }
  }

  onFetchStockPrice(event: Event) {
    this.stockSymbol = this.stockInput.value;
    event.preventDefault();
    // this.fetchStockPrice(stockSymbol);
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`)
      .then(response => {
        if (response.status !== 200) {
          this.error = 'Invalid!';
        }
        response.json().then(data => {
          if (!data['Global Quote']['05. price']) {
            this.error = 'Invalid Symbol!';
          }
          this.fetchedPrice = +data['Global Quote']['05. price'];
          this.loading = false;
        });
      })
      .catch(err => {
        this.error = err.message;
        this.fetchedPrice = null;
        this.loading = false;
      });
  }

  hostData() {
    return { class: this.error ? 'error' : '' };
  }

  render() {
    let dataConetent = <p>Please Enter a Symbol</p>;

    if (this.error) {
      dataConetent = <p>{this.error}</p>;
    }

    if (this.fetchedPrice) {
      this.error = null;

      dataConetent = <p>Price: ${this.fetchedPrice}</p>;
    }

    if (this.loading) {
      dataConetent = <sn-spinner></sn-spinner>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input onInput={this.stockInputChangeHandler.bind(this)} value={this.stockUserInput} ref={el => (this.stockInput = el)} id="stock-symbol" />
        <button disabled={!this.StockInputValid || this.loading} type="submit">
          Fetch
        </button>
      </form>,
      <div>{dataConetent}</div>,
    ];
  }
}
