import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { API_KEY } from '../../global/global';

@Component({
  tag: 'sn-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: { symbol: string; name: string }[];
  @State() loading: boolean = false;

  @Event({ bubbles: true, composed: true }) snSymbolSelected: EventEmitter<string>;

  onFindStocks(event: Event) {
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    this.loading = true;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${API_KEY}`)
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        this.searchResults = parsedRes['bestMatches'].map(item => {
          return {
            name: item['2. name'],
            symbol: item['1. symbol'],
          };
        });
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  }

  onSelectSymbol(symbol: string) {
    this.snSymbolSelected.emit(symbol);
  }

  render() {
    let content = this.searchResults?.map(item => (
      <li onClick={this.onSelectSymbol.bind(this, item.symbol)}>
        <strong>{item.symbol}</strong> - {item.name}
      </li>
    ));

    if (this.loading) {
      content = <sn-spinner></sn-spinner>;
    }

    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input ref={el => (this.stockNameInput = el)} id="stock-symbol" />
        <button type="submit">Find!</button>
      </form>,
      <ul>{content}</ul>,
    ];
  }
}
