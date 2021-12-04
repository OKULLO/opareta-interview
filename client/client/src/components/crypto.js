import React from "react";
import axios from "axios";


class Crypto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      result: null,
      Currency: this.toCurrency,
      toCrypto: this.fromCurrency,
      amount: 1,
      currencies: [],
      crypto:[]
    };
  }
  componentDidMount() {
            
           const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
          };

    
    fetch("http://localhost:3377/proxy/get_currency",requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data)
        const currencyAr = ["USD"];
        for (const key in res.data) {

          currencyAr.push(res.data[key].name);
        }
        this.setState({ currencies: currencyAr });
      });


      fetch("http://localhost:3377/proxy/get_crypto",requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data)
        const cryptoAr = ["BTC"];
        for (const key in res.data) {
          cryptoAr.push(res.data[key].name);
        }
        this.setState({ crypto: cryptoAr });
      });

  }

  //handles conversion 
  convertHandler = () => {

    if (this.state.fromCurrency !== this.state.toCurrency) {
      fetch(
          `"http://localhost:3377/proxy/convert"`,{
            convert: this.state.toCurrency,
            
            amount: this.state.amount,
          }
              )
        .then(response => {
          const result =
          this.state.amount * response.data.rate;
          this.setState({ result: result.toFixed(5) });
        })
        .catch(error => {
          console.log("Opps", error.message);
        });
    } else {
      this.setState({ result: "You cant convert the same currency!" });
    }
  };

  selectHandler = event => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
      }
    }
  };

  render() {

    return (
      <div className="container py-4 ">
    <div className='row wid px-5 justify-content-center'>
    <div className="bg-light">

       <form className="row gy-2 gx-3 align-items-center py-4">
        <div className="row">
         <div className="col-5">
          <input className="form-control" 
            name="amount"
            type="number"
            value={this.state.amount}
            onChange={event => this.setState({ amount: event.target.value })}
          />
        </div>
        </div>

        <div className="row py-3">
            <div className="col-5">
               <select className="form-select"
                name="from"
                onChange={event => this.selectHandler(event)}
                value={this.state.fromCurrency}
              >
                {this.state.currencies.map(cur => (
                  <option key={cur}>{cur}</option>
                ))}
          </select>
            </div>
            <div className="col-2">
              <button className="btn btn-primary mb-3" onClick={this.convertHandler}><i className="fa fa-exchange" aria-hidden="true"/></button>
            </div>

            <div className="col-5">
               <select className="form-select"
                name="to"
                onChange={event => this.selectHandler(event)}
                value={this.state.toCurrency}
              >
                {this.state.crypto.map(c => (
                  <option key={c}>{c}</option>
                ))}
          </select>
            </div>
            
        </div>
        {this.state.result && <h3>{this.state.result}</h3>}

      </form>

    </div>
      
    </div>

      
    </div>
    );
  }
}

export default Crypto;
