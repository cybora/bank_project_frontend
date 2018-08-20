import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleCustomerIdChange = this.handleCustomerIdChange.bind(this);
    this.handleInitialCreditChange = this.handleInitialCreditChange.bind(this);
  }
  state = {
    isLoading: true,
    groups: [],
    isDataFetched: false,
    customerID: '',
    initialCredit: ''
  };
  

  async componentDidMount() {
    this.setState({isLoading: false });
  }

  fetchCustomerDetailsData = () => { // fetch customer details
    if (this.state.customerID !=='') { // if the text input for customerID is filled
    fetch('/customerDetails/' + this.state.customerID, {
      method: "GET",
      dataType: "JSON",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    })
    .then((resp) => {
      return resp.json()
    }) 
    .then((data) => {
      if (data.status === 500 || data.status === 400) { // in case of any error, set the error message to show
        this.setState({ groups: data, isLoading: false, isDataFetched: false, message: data.message }) 
      } else {
        this.setState({ groups: data, isLoading: false, isDataFetched: true });
      }
             
    })
    .catch((error) => {
      this.setState({customerID: ''})
    })
  }
  this.setState({customerID: ''}) // clear the customer id input
  }

  createSecondaryAccount = () => { // create a secondary account for the customer
    /* check if both the customer id and the initial values are set */
    if (this.state.customerID !== '' && this.state.initialCredit !== '') {
    fetch('/createSecondaryAccount/' + this.state.customerID + '/' + this.state.initialCredit , {
      method: "POST",
      dataType: "JSON",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    })
    .then((resp) => {
      return resp.json()
    }) 
    .then((data) => {
      if (data.status === 500 || data.status === 400) {  // in case of any error, set the error message to show
        this.setState({ groups: data, isLoading: false, isDataFetched: false, message: data.message }) 
      } else {
        this.setState({ groups: data, isLoading: false, isDataFetched: false,
           message: 'A secondary account id(' + data.id +
            ') has been created for customer id(' + data.ownerCustomerId + ')' });
      }
             
    })
    .catch((error) => {
      this.setState({customerID: '', initialCredit : ''})
    })
    this.setState({customerID: '', initialCredit : ''}) // clear the customer id and the initial credit inputs
  }
  }

  handleCustomerIdChange({ target }) {
    this.setState({
      customerID: target.value.replace(/\D/,'')  // can input only numeric
    });
  }

  handleInitialCreditChange({ target }) {
    this.setState({
      initialCredit: target.value.replace(/\D/,'')  // can input only numeric
    });
  }
  

  render() {
    const {groups, isLoading} = this.state;
    

    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (this.state.isDataFetched) {

    return (
      <div className="App">
        <div className="App-intro">
        
        <h3>Customer ID</h3>
        <input 
        type="text" 
        name="customerIdBox" 
        placeholder="Enter customer ID here..." 
        value={ this.state.customerID }
        onChange={ this.handleCustomerIdChange } 
      />

        <h3>Initial Credit</h3>
        <input 
        type="text" 
        name="initialCreditBox" 
        placeholder="Enter initial credit here..." 
        value={ this.state.initialCredit }
        onChange={ this.handleInitialCreditChange } 
      />

      <br/> <br/>
        <div className="container center">
                <button onClick={this.fetchCustomerDetailsData}>Get Details</button>
         </div>
         <br/>
         <div className="container center">
                <button onClick={this.createSecondaryAccount}>Create Secondary Account</button>
         </div>
         

          <h1>Customer Details</h1>
          <h3>Name: {groups.name}</h3>
          <h3>Surname: {groups.surname}</h3>
          <h3>Balance: {groups.balance}</h3>
          <h2>Transactions</h2>
          <center>
          <table border = "1">
          <tbody>
          <tr>
            <th>ID</th>
            <th>Other Party ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>

            {groups.transactions.map(function(transaction, idx){
               return (
                <tr key = {idx}>
                <td>{transaction.id}</td>
                <td>{transaction.otherPartyId}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.date}</td>
                </tr>
               )
            })}
          </tbody>
          </table>
          </center>

        </div>
      </div>
    );
  } else {
    return ( <div className="App">
              <div className="App-intro">

 <h3>Customer ID</h3>
        <input 
        type="text" 
        name="customerIdBox" 
        placeholder="Enter customer ID here..." 
        value={ this.state.customerID }
        onChange={ this.handleCustomerIdChange } 
      />
       <h3>Initial Credit</h3>
        <input 
        type="text" 
        name="initialCreditBox" 
        placeholder="Enter initial credit here..." 
        value={ this.state.initialCredit }
        onChange={ this.handleInitialCreditChange } 
      />
      
      <br/> <br/>
        <div className="container center">
                <button onClick={this.fetchCustomerDetailsData}>Get Details</button>
         </div>
         <br/>
         <div className="container center">
                <button onClick={this.createSecondaryAccount}>Create Secondary Account</button>
         </div>
            <h2>{this.state.message}</h2>
          </div>
          </div>  
     );
  }
  }
}

export default App;
