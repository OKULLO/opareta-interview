import React from "react";



class Crypto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      result: null,
      Currency: 'USD',
      Cryptovalue:'BTC',
      amount: null,
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

        const currencyAr = ["USD"];
        for (const key in res.data) {

          currencyAr.push(res.data[key]);
        }
        this.setState({ currencies: currencyAr });
      });

    fetch("http://localhost:3377/proxy/crypto",requestOptions)
        .then((res) => res.json())
        .then((res) => {
          const cryptoAr = ["BTC"];
          for (const key in res.data) {
            cryptoAr.push(res.data[key]);
          }
          this.setState({ crypto: cryptoAr });
        }).catch(e=>console.log(e));

  }


  //handles conversion 
  convertHandler = (e) => {
    e.preventDefault();

    // if (this.state.fromCurrency===null || this.state.toCurrency===null) {

       const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
     // Secure your API Key by routing calls through your own backend service.
     //proxy requests to the api->http://localhost:3377
      fetch(
          "http://localhost:3377/proxy/convert?"+ new URLSearchParams({
            convert:this.state.Cryptovalue,
            id:this.state.currency,
                    
            amount: this.state.amount,
        }),requestOptions)
        .then((res) => res.json())
        .then(response => {
          console.log(response.data)
          this.setState({ result: `${response.data.amount } ${response.data.name}(${response.data.symbol}) = ${response.data.quote[this.state.Cryptovalue].price.toFixed(6)} ${this.state.Cryptovalue}` });
        })
        .catch(error => {
          console.log("Opps", error.message);
        });
    // } else {
    //   this.setState({ result: "Please choose a field to convert!" });
    // }
  };

  selectHandler = e => {
    if (e.target.name === "from") {
      this.setState({ currency: e.target.value });
      this.convertHandler(e)
    } else {
      if (e.target.name === "to") {
        this.setState({ Cryptovalue: e.target.value });
        this.convertHandler(e)
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
                onChange={e => this.selectHandler(e)}
                value={this.state.currency}
              >
                {this.state.currencies.map(cur => (
                  <option value={cur.id}>{cur.name}</option>
                ))}
          </select>
            </div>
            <div className="col-2">
              <button className="btn btn-primary mb-3" onClick={this.convertHandler}><i className="fa fa-exchange" aria-hidden="true"/></button>
            </div>

            <div className="col-5">
               <select className="form-select"
                name="to"
                onChange={e => this.selectHandler(e)}
                value={this.state.Cryptovalue}
              >
                {this.state.crypto.map(c => (
                  <option key={c.id} value={c.symbol}>{c.name}</option>
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
