import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Snackbar from 'material-ui/Snackbar';

export default class ForgotPassword extends React.Component 
{
	 constructor(props) {
	 	super(props);
	 	this.state = {
	 		applicant_email: '',
	 		open:false
	 	}
	 	this.handleChangeEmail = this.handleChangeEmail.bind(this);
	 	this.handleRequestClose = this.handleRequestClose.bind(this);
	 }
	 handleChangeEmail(event){
	 	const email = event.target.value;
        this.setState({ applicant_email: email});
	 }
	 handleRequestClose(){
	 	 this.setState({
      		open: false,
    	 });
	 }
	 handleSubmit(){

	 	 $.ajax({
                type: 'POST',
                url: base_url+'admission_con/forgot_password',
                data: {
                	'applicant_email': $("#applicant_email").val()
                },
                dataType: 'json',
                success: function (resdata) {
                  if(resdata.success)
                  {
                  	  this.setState({
                 	  		open:true,
                 	  		msg: resdata.message
                 	  });
                  }else{
                 	  this.setState({
                 	  		open:true,
                 	  		msg:resdata.message
                 	  });	    	
                  }
                }.bind(this),
                  error: function(xhr, status, err) {
                    console.error(err.toString());
                  }.bind(this)
         });
	 }
	 render () {
	    const { applicant_email } = this.state;
	 	return(
	 		<div className="row">
	 			<ValidatorForm id="myform_login" ref="form" onSubmit={this.handleSubmit.bind(this)} onError={errors => console.log(errors)}>
         		  <TextValidator
                    floatingLabelText="Email"
                    onChange={this.handleChangeEmail}
                    name="applicant_email"
                    type="email"
                    value={applicant_email}
                    validators={['required', 'isEmail']}
                    errorMessages={['this field is required', 'email is not valid']}
                    id="applicant_email"
                    fullWidth={true}
                 /><br/>
                 <RaisedButton 
                  style={{marginRight: 12}}	
                  primary={true}
                  type="submit"
                  label="RESET PASSWORD" 
                />
                <FlatButton
                      style={{marginRight: 12}} 
                      label="LOGIN"
                      href="#login"
          		/>
                <Snackbar
                  open={this.state.open}
                  message={this.state.msg}
                  autoHideDuration={5000}
                  onRequestClose={this.handleRequestClose}
          		/>
                </ValidatorForm>
	 		</div>
	 	);
	 }
}	 
