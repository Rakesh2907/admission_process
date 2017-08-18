import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Snackbar from 'material-ui/Snackbar';

export default class LoginForm extends React.Component 
{
	 constructor(props) {
	 	super(props);
	 	this.state = {
	 		applicant_email:'',
	 		applicant_password:'',
	 		open:false,
	 		msg:''
	 	}
	 	this.handleChangeEmail = this.handleChangeEmail.bind(this);
	 	this.handleChange = this.handleChange.bind(this);
	 	this.handleRequestClose = this.handleRequestClose.bind(this);
	 }
	 handleChange(event){
	 	this.setState({ applicant_password: event.target.value});
	 }
	 handleChangeEmail(event)
	 {
	    const email = event.target.value;
        this.setState({ applicant_email: email});
	 }
	 handleRequestClose(){
	 	 this.setState({
      		open: false,
    	 });
	 }
	 handleSubmit()
	 {
	 	  $.ajax({
                type: 'POST',
                url: base_url+'admission_con/admission_login',
                data: {
                	'applicant_email': $("#applicant_email").val(),
					'applicant_password': $("#applicant_password").val(),
                },
                dataType: 'json',
                success: function (resdata) {
                  if(resdata.is_login)
                  {
                  	  this.setState({
                 	  		open:true,
                 	  		msg: 'Login Successfully...'
                 	  });
                      location.href = base_url+'admission_con/profile/'+resdata.applicant_id;
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
	 	const { applicant_email, applicant_password } = this.state;
    const styles = {
        snakebarStyle: {
          top:0
        }
    };
	 	return (
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
                 <TextValidator
	      			floatingLabelText="Password"
	      			onChange={this.handleChange}
	      			name="applicant_password"
	      			type="text"
	      			value={applicant_password}
	      			validators={['required']}
                    errorMessages={['this field is required']}
                    id="applicant_password"
                    fullWidth={true}
	    		/><br />
	    		<RaisedButton 
                  style={{marginRight: 12}}	
                  primary={true}
                  type="submit"
                  label="Submit" 
                />
                <FlatButton
                      style={{marginRight: 12}} 
                      label="Forgot Password"
                      href="#forgot"
          		/>
                <Snackbar
                  open={this.state.open}
                  message={this.state.msg}
                  style={styles.snakebarStyle}
                  autoHideDuration={3000}
                  onRequestClose={this.handleRequestClose}
          		/>
         		</ValidatorForm>
         	</div>
        );
	 }		
}