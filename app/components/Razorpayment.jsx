import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

export default class Razorpayment extends React.Component {
  state = {
    amount: 0,
    applicant_id: 0,
    applicant_name: '',
    applicant_email: '',
    key:''
  };

  constructor(props) {
    super(props)
    this.openCheckout = this.openCheckout.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }
  componentWillMount()
  {
      $.ajax({
                url: base_url+'admission_con/get_razorpay_details',
                dataType: 'json',
                type: 'POST',
                data: {
                  id: 1
                },
                success: function(resdata) {
                  if(resdata.length > 0)
                  {
                     this.setState({
                        amount:resdata[0]['application_form_amount'],
                        key:resdata[0]['razorpay_key']
                     });
                  }else{
                      
                  }
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(err.toString());
              }.bind(this)  
          });
  }
  componentWillReceiveProps(props) 
  {
        $.ajax({
              	url: base_url+'admin_con/get_applicant',
              	dataType: 'json',
              	type: 'POST',
              	data: {
                	applicant_id: props.applicantId
              	},
              	success: function(resdata) {
                	if(resdata.length > 0)
                	{
                		this.setState({
                			applicant_name:resdata[0]['applicant_name'],
                			applicant_email:resdata[0]['applicant_email']
                		});
                	}else{
                  		
                	}
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(err.toString());
              }.bind(this)  
          });
  }
  handleBack()
  {
        document.getElementById("back_button_5").click();
  }
  openCheckout() 
  {
    let applicant_id = this.props.applicantId;
    let options = {
      "key": this.state.key,
      "amount": this.state.amount, // 2000 paise = INR 20, amount in paisa
      "name": "Customer",
      "description": "School Admission Process Amount",
      "image": "/your_logo.png",
      "handler": function (response){
        	alert(response.razorpay_payment_id);
        	if(response.razorpay_payment_id)
        	{
	        		$.ajax({
	              	url: base_url+'admission_con/profile_razorpay',
	              	dataType: 'json',
	              	type: 'POST',
	              	data: {
	                	applicant_id: applicant_id,
	                	payment_id:response.razorpay_payment_id,

	              	},
	              	success: function(resdata) {
	              		if(resdata.success){
	              			  document.getElementById("next_button_5").click();
	              		}
	                	
	              }.bind(this),
	              error: function(xhr, status, err) {
	                console.error(err.toString());
	              }.bind(this)  
	          });
        	}
      },
      "prefill": {
        "name": this.state.applicant_name,
        "email": this.state.applicant_email
      },
      "notes": {
        "address": ""
      },
      "theme": {
        "color": "#F37254"
      }
    };
    
    let rzp = new Razorpay(options);
    rzp.open();
  }
  
  render () {
    const styles = {
      button: {
        margin: 12,
      }
    }
    return (
      <div>
        <RaisedButton
          label={"Rozorpay Rs. "+this.state.amount/100}
          primary={true}
          style={styles.button}
          onClick={this.openCheckout}
          icon={<FontIcon className="muidocs-icon-custom-github" />}
        />
        <FlatButton
              style={{marginRight: 12}} 
              label="Back"
              onClick={this.handleBack}
        />
      </div>
    )
  }
}