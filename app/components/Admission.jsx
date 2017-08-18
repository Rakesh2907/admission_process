import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import {Step,Stepper,StepLabel,StepContent} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DatePicker from 'material-ui/DatePicker';
import Snackbar from 'material-ui/Snackbar';
import Razorpayment from 'Razorpayment';
import LoginForm from 'LoginForm';
import ForgotPassword from 'ForgotPassword';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

var applicant_id = 0;
var applicant_class_id = 0;
var classId = 0;
var menuItems1 = [];
var menuItems2 = [];
var menuItems3 = [];

class ApplicantForm extends React.Component
{
		constructor(props) {
        super(props);
        this.state={
        	applicant_email:'',
        	applicant_name: '',
        	applicant_mobile: '',
        	applicant_adhar_card: '',
          open:false,
          msg:''
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMobile = this.handleChangeMobile.bind(this);
        this.handleChangeCard = this.handleChangeCard.bind(this);
    }
    handleChangeEmail(event) {
        const email = event.target.value;
        this.setState({ applicant_email: email});
    }

    handleChange(event){
    	this.setState({ applicant_name: event.target.value});
    }

    handleChangeMobile(event){
    	this.setState({ applicant_mobile: event.target.value});
    }

    handleChangeCard(event){
    	this.setState({ applicant_adhar_card: event.target.value});
    }

    handleSubmit() 
    {
       $.ajax({
                type: 'POST',
                url: base_url+'admission_con/insert_admission_data?mydata=applicant_details&steps=1',
                data: $('#myform1').serialize(),
                dataType: 'json',
                success: function (resdata) {
                  if(resdata.is_login)
                  {
                      applicant_id = resdata.applicant_id
                      sessionStorage.setItem('sess_applicantId',applicant_id);
                      document.getElementById("next_button_0").click();
                  }else{
                    this.setState({
                        open: true,
                        msg:resdata.message
                    })
                  }
                }.bind(this),
                  error: function(xhr, status, err) {
                    console.error(err.toString());
                  }.bind(this)
        });
    }
    componentWillMount()
    {
        if(sessionStorage.getItem('sess_applicantId')!=null)
        {
            $.ajax({
                    type: 'POST',
                    url: base_url+'admission_con/get_applicant_details',
                    data: {
                      applicant_id: sessionStorage.getItem('sess_applicantId') 
                    },
                    dataType: 'json',
                    success: function (resdata) {
                      if(resdata.length > 0)
                      {
                          applicant_id = resdata[0]['applicant_id'];
                          sessionStorage.setItem('sess_applicantId',applicant_id);
                          this.setState({ 
                              applicant_email: resdata[0]['applicant_email'],
                              applicant_name: resdata[0]['applicant_name'], 
                              applicant_mobile: resdata[0]['applicant_mobile'],
                              applicant_adhar_card: resdata[0]['applicant_adhar_card']  
                          })
                      }else{
                      }
                    }.bind(this),
                      error: function(xhr, status, err) {
                        console.error(err.toString());
                      }.bind(this)
            });
        }  
    }
    handleRequestClose = () => {
      this.setState({
        open: false,
      });
    };
    render() {
        const { applicant_email, applicant_name, applicant_mobile, applicant_adhar_card } = this.state;
        const styles = {
          snakebarStyle: {
            top:0
          }
        };
        return (
            <ValidatorForm
                id="myform1"
 				        ref="form"
                onSubmit={this.handleSubmit.bind(this)}
                onError={errors => console.log(errors)}
            >
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
	      			    floatingLabelText="Name"
	      			    onChange={this.handleChange}
	      			    name="applicant_name"
	      			    type="text"
	      			    value={applicant_name}
	      			    validators={['required']}
                  errorMessages={['this field is required']}
                  id="applicant_name"
                  fullWidth={true}
	    		   /><br/>
	    		  <TextValidator
	      			floatingLabelText="Mobile"
	      			onChange={this.handleChangeMobile}
	      			name="applicant_mobile"
	      			type="text"
	      			value={applicant_mobile}
	      			validators={['required', 'isNumber']}
                    errorMessages={['this field is required', 'enter number only']}
                    id="applicant_mobile"
                    fullWidth={true}
	    		/><br/>
	    		<TextValidator
	      			floatingLabelText="Aadhar Card"
	      			onChange={this.handleChangeCard}
	      			name="applicant_adhar_card"
	      			type="text"
	      			value={applicant_adhar_card}
	      			validators={['required', 'isNumber']}
                    errorMessages={['this field is required', 'enter number only']}
                    id="applicant_adhar_card"
                    fullWidth={true}
	    		/><br/>
          <RaisedButton 
                  style={{marginRight: 12}}	
                  primary={true}
                  type="submit"
                  label="Next" 
          />
          <FlatButton
                      style={{marginRight: 12}} 
                      label="Login"
                      href="#login"
          />
          <Snackbar
                  open={this.state.open}
                  message={this.state.msg}
                  style={styles.snakebarStyle}
                  autoHideDuration={3000}
                  onRequestClose={this.handleRequestClose}
          />
        </ValidatorForm>
        );
    }	
}

class ChooseClass extends React.Component 
{
	 constructor(props) 
     {
     	 super(props);
     	 this.state={
     	 	 myclass: '2'
     	 }
     	 this.handleChange = this.handleChange.bind(this)
     }
     handleChange(event, index, value)
     {
     	  this.setState({myclass:value});
     	  sessionStorage.setItem('sess_class', value);
     }
     componentDidMount()
     {
          menuItems1 = [];
           $.ajax({
                type: 'POST',
                url: base_url+'admission_con/get_class',
                dataType:'json',
                 success: function (resdata) {
                  if(resdata.length > 0)
                  {
                      for(var i = 0;i < resdata.length;i++)
                      {
                          menuItems1.push(<MenuItem value={resdata[i]['class_id']} primaryText={resdata[i]['class_name']} />)
                      }
                  }
                 }.bind(this),
                    error: function(xhr, status, err) {
                      console.error(err.toString());
                }.bind(this)
           });

     }
     componentWillMount()
     {
      	 let value = sessionStorage.getItem('sess_class');
     	   this.setState({myclass:value});
     }
     handleSubmit()
     {
        classId = sessionStorage.getItem('sess_class'); 
        applicant_class_id = sessionStorage.getItem('sess_applicant_class_id'); 
        //alert(applicant_class_id); 
        if(applicant_class_id == 0 || applicant_class_id == null)
        {
            $.ajax({
                  type: 'POST',
                  url: base_url+'admission_con/insert_admission_data?mydata=choose_class&steps=2&applicant_id='+applicant_id+'&class_id='+classId,
                  data: $('#myform2').serialize(),
                  dataType: 'json',
                  success: function (resdata) {
                    if(resdata.applicant_id)
                    { 
                        sessionStorage.setItem('sess_applicant_class_id', resdata.applicant_class_id);
                        document.getElementById("next_button_1").click();
                    }else{

                    }
                  }.bind(this),
                    error: function(xhr, status, err) {
                      console.error(err.toString());
                    }.bind(this)
                 });
        }else{
             $.ajax({
                  type: 'POST',
                  url: base_url+'admission_con/update_admission_data?edit=choose_class&applicant_id='+applicant_id+'&class_id='+classId+'&applicant_class_id='+applicant_class_id,
                  data: $('#myform2').serialize(),
                  dataType: 'json',
                  success: function (resdata) {
                    if(resdata.success)
                    { 
                        sessionStorage.setItem('sess_applicant_class_id', resdata.applicant_class_id);
                        document.getElementById("next_button_1").click();
                    }else{

                    }
                  }.bind(this),
                    error: function(xhr, status, err) {
                      console.error(err.toString());
                  }.bind(this)
             })
        }       
     		
     }
     handleBack(){
        document.getElementById("back_button_1").click();
     }
     render() {
      		console.log(this.state.myclass);
      		return (
      			<ValidatorForm
                  id="myform2"
 					        ref="form"
                	onSubmit={this.handleSubmit}
                	onError={errors => console.log(errors)}
            	>
            		<SelectValidator 
            			name="class_id" 
            			value={this.state.myclass}
            			defaultValue={this.state.myclass}
          				onChange={this.handleChange}
            			validators={['required']}
            			errorMessages={['this field is required']}
            			id="class_id"
            			fullWidth={true}
            		>
            			{menuItems1}
            		</SelectValidator> <br/>
            		<RaisedButton 
                  		style={{marginRight: 12}}	
                  		primary={true}
                  		type="submit"
                  		label="Next" 
                />
            	</ValidatorForm>
      		);
      }

}
class CandidateForm extends React.Component 
{
	 constructor(props) 
    {
     	super(props);
      this.state = {
        first_name: '',
        last_name: '',
        adhar_card_number: '',
        mobile: '',
        gender: 'male',
        address1: '',
        city: '',
        pin: '',
        states: 'Maharashtra',
        dob: '',
        email: ''
      }
      this.handleChangeFname = this.handleChangeFname.bind(this);
      this.handleChangeLname = this.handleChangeLname.bind(this);
      this.handleChangeAcard = this.handleChangeAcard.bind(this);
      this.handleChangeMobile = this.handleChangeMobile.bind(this);
      this.handleChangeGender = this.handleChangeGender.bind(this);
      this.handleChangeAddress1 = this.handleChangeAddress1.bind(this);
      this.handleChangeCity = this.handleChangeCity.bind(this);
      this.handleChangePin = this.handleChangePin.bind(this);
      this.handleChangeState = this.handleChangeState.bind(this);
      this.handleChangeDob = this.handleChangeDob.bind(this);
      this.handleChangeEmail =this.handleChangeEmail.bind(this);
      this.handleBack = this.handleBack.bind(this);
    }	
    handleChangeFname(event){
        this.setState({first_name:event.target.value})
    }
    handleChangeLname(event){
        this.setState({last_name:event.target.value})
    }
    handleChangeAcard(event){
        this.setState({adhar_card_number:event.target.value})
    }
    handleChangeMobile(event){
        this.setState({mobile:event.target.value})
    }
    handleChangeGender(event,index,value){
        this.setState({gender:value})
    }
    handleChangeAddress1(event){
      this.setState({address1:event.target.value})
    }
    handleChangeCity(event){
      this.setState({city:event.target.value})
    }
    handleChangeState(event,index,value){
        this.setState({states:value})
    }
    handleChangePin(event){
        this.setState({pin:event.target.value})
    }
    handleChangeDob(event,date){
        this.setState({dob:date})
    }
    handleChangeEmail(event){
        this.setState({email:event.target.value})
    }
    handleBack(){
      document.getElementById("back_button_2").click();
    }
    handleSubmit()
    {
        var saveType = sessionStorage.getItem('sess_save');
        applicant_class_id = sessionStorage.getItem('sess_applicant_class_id'); 
        var mystate = this.state.states;
        var mygender = this.state.gender;
        if(saveType == 'edit')
        {
             var my_url = base_url+'admission_con/update_admission_data?edit=childs&steps=3&applicant_id='+applicant_id+'&applicant_class_id='+applicant_class_id;
        }else{
            var my_url = base_url+'admission_con/insert_admission_data?mydata=child_form&steps=3&applicant_id='+applicant_id+'&applicant_class_id='+applicant_class_id+'&class_id='+classId;
        }
            $.ajax({
                      type: 'POST',
                      url: my_url,
                      data: $('#myform3').serialize()+'&states='+mystate+'&gender='+mygender,
                      dataType: 'json',
                      success: function (resdata) {
                        if(resdata.applicant_id)
                        { 
                            sessionStorage.setItem('sess_applicant_class_id', resdata.applicant_class_id)
                            document.getElementById("next_button_2").click();
                            sessionStorage.setItem('sess_save','edit');
                        }else{

                        }
                      }.bind(this),
                        error: function(xhr, status, err) {
                          console.error(err.toString());
                        }.bind(this)
            });
        
    }
    componentDidMount()
    {
          menuItems2 = [];
           $.ajax({
                type: 'POST',
                url: base_url+'admission_con/get_states',
                dataType:'json',
                 success: function (resdata) {
                  if(resdata.length > 0)
                  {
                      for(var i = 0;i < resdata.length;i++)
                      {
                          menuItems2.push(<MenuItem value={resdata[i]['states']} primaryText={resdata[i]['states']} />)
                      }
                  }
                 }.bind(this),
                    error: function(xhr, status, err) {
                      console.error(err.toString());
                }.bind(this)
           });
    }
    componentWillMount()
    {
            if(sessionStorage.getItem('sess_applicantId')!=null)
            {
              $.ajax({
                    type: 'POST',
                    url: base_url+'admission_con/get_child_details',
                    data: {
                      applicant_id: sessionStorage.getItem('sess_applicantId'),
                      applicant_class_id: sessionStorage.getItem('sess_applicant_class_id')
                    },
                    dataType: 'json',
                    success: function (resdata) {
                      if(resdata.length > 0)
                      {
                          applicant_id = resdata[0]['applicant_id']
                          sessionStorage.setItem('sess_applicantId',applicant_id);
                          this.setState({ 
                              first_name: resdata[0]['child_firstname'],
                              last_name: resdata[0]['child_lastname'], 
                              adhar_card_number: resdata[0]['child_adhar_card'],
                              mobile: resdata[0]['mobile'],
                              dob: resdata[0]['child_dob'],
                              address1: resdata[0]['address_line1'],
                              city: resdata[0]['city'], 
                              states: resdata[0]['states'],
                              pin: resdata[0]['pin'],
                              email: resdata[0]['email'],
                              gender: resdata[0]['gender'] 
                          })
                          this.handleChangeGender.bind(this);
                      }else{
                      }
                    }.bind(this),
                      error: function(xhr, status, err) {
                        console.error(err.toString());
                      }.bind(this)
            });
          } 
    }

    render() 
    {
        const {first_name, last_name, adhar_card_number, mobile, dob ,address1, city, states, pin, email, gender} = this.state;
        console.log(this.state.dob);
       	const styles = {
    			  radioButton: {
    			    marginTop:16,
    			    marginLeft:10,
              width: 'auto',
              display: 'flex'
    			  }
  		  };

     	return (
     		<ValidatorForm id="myform3" ref="form" onSubmit={this.handleSubmit.bind(this)} onError={errors => console.log(errors)}>
            <TextValidator
                      floatingLabelText="First Name"
                      onChange={this.handleChangeFname}
                      name="first_name"
                      type="text"
                      value={first_name}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      id="first_name"
                      fullWidth={true}
            /><br/>
            <TextValidator
                      floatingLabelText="Last Name"
                      onChange={this.handleChangeLname}
                      name="last_name"
                      type="text"
                      value={last_name}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      id="last_name"
                      fullWidth={true}
            /><br/>
            <TextValidator
                floatingLabelText="Aadhar Card"
                onChange={this.handleChangeAcard}
                name="adhar_card_number"
                type="text"
                value={adhar_card_number}
                id="adhar_card_number"
                validators={['isNumber']}
                errorMessages={['enter only number']}
                fullWidth={true}
            /><br />
            <TextValidator
                floatingLabelText="Parent Mobile Number"
                onChange={this.handleChangeMobile}
                name="mobile"
                type="text"
                value={mobile}
                id="mobile"
                validators={['isNumber']}
                errorMessages={['enter only number']}
                fullWidth={true}
            /><br />
            <DatePicker 
              hintText="Birth Date" 
              onChange={this.handleChangeDob}
              openToYearSelection={true} 
              fullWidth={true} 
              name="dob" 
              id="dob" 
              value={this.state.dob}
              defaultDate={dob}
              autoOk={true}
            />
       			<label>Nationality</label>
       			<RadioButtonGroup name="nationality" defaultSelected="indian">
         				 <RadioButton
                    value="indian"
                    label="Indian"
                    style={styles.radioButton}
                 />
            	   <RadioButton
                    value="other"
                    label="Other"
                    style={styles.radioButton}
                 />
       			</RadioButtonGroup>
            <label>Is this your first born child?</label>
            <RadioButtonGroup name="first_born">
                 <RadioButton
                    value="yes"
                    label="Yes"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="no"
                    label="No"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>  
            <SelectValidator 
                  name="gender" 
                  floatingLabelText="Gender"
                  value={gender}
                  defaultValue={gender}
                  onChange={this.handleChangeGender}
                  validators={['required']}
                  errorMessages={['this field is required']}
                  id="gender"
                  fullWidth={true}
                >
                  <MenuItem value="male" primaryText="Male" />
                  <MenuItem value="female" primaryText="Female" />
            </SelectValidator>
            <TextValidator
              floatingLabelText="Address Line1"
              onChange={this.handleChangeAddress1}
              name="address1"
              type="text"
              value={address1}
              validators={['required']}
              errorMessages={['this field is required']}
              id="address1"
              fullWidth={true}
            /><br/>
            <TextValidator
              floatingLabelText="Address Line2"
              name="address2"
              type="text"
              id="address2"
              fullWidth={true}
            /><br/>
            <SelectValidator 
                  name="states" 
                  floatingLabelText="States"
                  value={this.state.states}
                  defaultValue={this.state.states}
                  onChange={this.handleChangeState}
                  validators={['required']}
                  errorMessages={['this field is required']}
                  id="states"
                  fullWidth={true}
                >
                {menuItems2}
            </SelectValidator>
            <TextValidator
              floatingLabelText="City"
              onChange={this.handleChangeCity}
              name="city"
              type="text"
              value={city}
              validators={['required']}
              errorMessages={['this field is required']}
              id="city"
              fullWidth={true}
            /><br/>
            <TextValidator
              floatingLabelText="Pin Code"
              onChange={this.handleChangePin}
              name="pin"
              type="text"
              value={pin}
              validators={['required','isNumber']}
              errorMessages={['this field is required', 'enter only number']}
              id="pin"
              fullWidth={true}
            /><br/>
            <TextValidator
                    floatingLabelText="Email"
                    onChange={this.handleChangeEmail}
                    name="email"
                    type="email"
                    id="email"
                    fullWidth={true}
                    value={email}
            />
            <label>Nationality</label>
            <RadioButtonGroup name="nationality" defaultSelected="indian">
                 <RadioButton
                    value="indian"
                    label="Indian"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="other"
                    label="Other"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>
            <label>Is there any medical information about your ward which the school should be aware of?</label>
            <RadioButtonGroup name="medicalinfo">
                 <RadioButton
                    value="Asthma"
                    label="Asthma"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="Heart"
                    label="Heart"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="Disorder"
                    label="Disorder"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="Juvenile"
                    label="Juvenile"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="Diabetes"
                    label="Diabetes"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="Epilepsy"
                    label="Epilepsy"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="None"
                    label="None"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>
            <label>School transport required?</label>
            <RadioButtonGroup name="school_transport">
                <RadioButton
                    value="yes"
                    label="Yes"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="no"
                    label="No"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>
            <RaisedButton 
                  style={{marginRight: 12}} 
                  primary={true}
                  type="submit"
                  label="Next" 
            />
            <FlatButton
              style={{marginRight: 12}} 
              label="Back"
              onClick={this.handleBack}
            />
     		</ValidatorForm>
     	);
     }
}
class FatherForm extends React.Component
{
    constructor(props) 
    {
        super(props); 
        this.state={
          father_full_name:'',
          father_adhar_card: '',
          father_education: 'null',
          father_occupation:'Others',
          father_state: 'Maharashtra',
          father_mobile: '',
          father_email: '',
          father_designation: '',
          office_address1: '',
          office_address2: '',
          father_city: ''
        }
        this.handleBack = this.handleBack.bind(this);
        this.handleChangeFaName = this.handleChangeFaName.bind(this);   
        this.handleChangeAcard = this.handleChangeAcard.bind(this);
        this.handleChangeEducation = this.handleChangeEducation.bind(this);
        this.handleChangeOccupation = this.handleChangeOccupation.bind(this);
        this.handleChangeStates = this.handleChangeStates.bind(this);
        this.handleChangeMobile = this.handleChangeMobile.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeDesignation = this.handleChangeDesignation.bind(this);
        this.handleChangeAddress1 = this.handleChangeAddress1.bind(this);
        this.handleChangeAddress2 = this.handleChangeAddress2.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
    }  
    handleBack()
    {
        document.getElementById("back_button_3").click();
    }
    handleChangeCity(event){
        this.setState({father_city:event.target.value})
    }
    handleChangeAddress1(event){
        this.setState({office_address1:event.target.value})
    }
    handleChangeAddress2(event){
        this.setState({office_address2:event.target.value})
    }
    handleChangeDesignation(event){
        this.setState({father_designation:event.target.value})
    }
    handleChangeFaName(event){
        this.setState({father_full_name:event.target.value})
    }
    handleChangeAcard(event){
        this.setState({father_adhar_card:event.target.value})
    }
    handleChangeEducation(event,index,value){
        //alert(value)
        this.setState({father_education:value})
    }
    handleChangeOccupation(event,index,value){
        this.setState({father_occupation:value})
    }
    handleChangeStates(event,index,value){
        this.setState({father_state:value})
    }
    handleChangeMobile(event){
        this.setState({father_mobile:event.target.value})
    }
    handleChangeEmail(event){
        this.setState({father_email:event.target.value})
    }
    handleSubmit(){
        var saveType = sessionStorage.getItem('sess_fsave');
        applicant_class_id = sessionStorage.getItem('sess_applicant_class_id'); 
        var fstates = this.state.father_state;
        var feducation = this.state.father_education;
        var foccupation = this.state.father_occupation;

        if(saveType == 'edit')
        {
              var my_url = base_url+'admission_con/update_admission_data?edit=father&steps=4&applicant_id='+applicant_id+'&applicant_class_id='+applicant_class_id;
        }else{
             var my_url = base_url+'admission_con/insert_admission_data?mydata=father_form&steps=4&applicant_id='+applicant_id+'&applicant_class_id='+applicant_class_id;
        }

        $.ajax({
                      type: 'POST',
                      url: my_url,
                      data: $('#myform4').serialize()+'&father_state='+fstates+'&father_education='+feducation+'&father_occupation='+foccupation,
                      dataType: 'json',
                      success: function (resdata) {
                        if(resdata.applicant_id)
                        { 
                            sessionStorage.setItem('sess_applicant_class_id', resdata.applicant_class_id)
                            document.getElementById("next_button_3").click();
                            sessionStorage.setItem('sess_fsave','edit');
                        }else{

                        }
                      }.bind(this),
                        error: function(xhr, status, err) {
                          console.error(err.toString());
                      }.bind(this)
            });
    }
    componentDidMount()
    {
        menuItems3 = [];
           $.ajax({
                type: 'POST',
                url: base_url+'admission_con/get_occupations',
                dataType:'json',
                 success: function (resdata) {
                  if(resdata.length > 0)
                  {
                      for(var i = 0;i < resdata.length;i++)
                      {
                          menuItems3.push(<MenuItem value={resdata[i]['occupations']} primaryText={resdata[i]['occupations']} />)
                      }
                  }
                 }.bind(this),
                    error: function(xhr, status, err) {
                      console.error(err.toString());
                }.bind(this)
           });
    }
    componentWillMount()
    {
        if(sessionStorage.getItem('sess_applicantId')!=null)
        {
              $.ajax({
                    type: 'POST',
                    url: base_url+'admission_con/get_father_details',
                    data: {
                      applicant_id: sessionStorage.getItem('sess_applicantId'),
                      applicant_class_id: sessionStorage.getItem('sess_applicant_class_id')
                    },
                    dataType: 'json',
                    success: function (resdata) {
                      if(resdata.length > 0)
                      {
                          applicant_id = resdata[0]['applicant_id']
                          sessionStorage.setItem('sess_applicantId',applicant_id);
                          this.setState({ 
                              father_full_name: resdata[0]['father_full_name'],
                              father_adhar_card: resdata[0]['father_adhar_card'], 
                              father_mobile: resdata[0]['father_mobile'],
                              father_email: resdata[0]['father_email'],
                              father_education: resdata[0]['father_qualification'],
                              father_occupation: resdata[0]['father_occupation'],
                              father_designation: resdata[0]['father_designation'],
                              office_address1: resdata[0]['office_address1'], 
                              office_address2: resdata[0]['office_address2'],
                              father_state: resdata[0]['state'],
                              father_city: resdata[0]['city']
                          })
                          this.handleChangeStates.bind(this);
                          this.handleChangeEducation.bind(this);
                          this.handleChangeOccupation.bind(this);
                      }else{
                      }
                    }.bind(this),
                      error: function(xhr, status, err) {
                        console.error(err.toString());
                      }.bind(this)
            });
       }
    }
    render() {
        const {father_full_name,father_adhar_card,father_mobile,father_email,father_education,father_occupation,father_designation,office_address1,office_address2,father_state,father_city} = this.state;
        const styles = {
            radioButton: {
              marginTop:16,
              marginLeft:10,
              width: 'auto',
              display: 'flex'
            }
        };
        return (  
            <ValidatorForm id="myform4" ref="form" onSubmit={this.handleSubmit.bind(this)} onError={errors => console.log(errors)}>
               <TextValidator
                      floatingLabelText="Father Full Name"
                      onChange={this.handleChangeFaName}
                      name="father_full_name"
                      type="text"
                      value={father_full_name}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      id="father_full_name"
                      fullWidth={true}
              /><br/>
              <label>Nationality</label>
              <RadioButtonGroup name="father_nationality" defaultSelected="indian">
                 <RadioButton
                    value="indian"
                    label="Indian"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="other"
                    label="Other"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>
            <TextValidator
                floatingLabelText="Aadhar Card"
                onChange={this.handleChangeAcard}
                name="father_adhar_card"
                type="text"
                value={father_adhar_card}
                id="father_adhar_card"
                validators={['isNumber']}
                errorMessages={['enter only number']}
                fullWidth={true}
            /><br />
            <SelectValidator 
                  name="father_education" 
                  floatingLabelText="Education"
                  value={this.state.father_education}
                  defaultValue={this.state.father_education}
                  onChange={this.handleChangeEducation}
                  id="father_education"
                  fullWidth={true}
                >
                  <MenuItem value={null} primaryText="" />
                  <MenuItem value="ssc" primaryText="SSC" />
                  <MenuItem value="hsc" primaryText="HSC" />
                  <MenuItem value="graduation" primaryText="Graduate" />
                  <MenuItem value="post_graduation" primaryText="Post Graduate" />
                  <MenuItem value="doctorate" primaryText="Doctorate" />
            </SelectValidator>
            <SelectValidator 
                  name="father_occupation" 
                  floatingLabelText="Occupation"
                  value={this.state.father_occupation}
                  defaultValue={this.state.father_occupation}
                  onChange={this.handleChangeOccupation}
                  id="father_occupation"
                  fullWidth={true}
                >
                  {menuItems3}
            </SelectValidator>
            <TextField
                  name="txt_father_desigantion"
                  onChange={this.handleChangeDesignation}
                  floatingLabelText="Desigantion"
                  id="txt_father_desigantion"
                  value={father_designation}
                  fullWidth={true}
            /><br />
            <label>Is the job Transferable</label>
              <RadioButtonGroup name="father_transferred">
                 <RadioButton
                    value="yes"
                    label="Yes"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="no"
                    label="No"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>
            <TextField
                  name="father_office_add1"
                  floatingLabelText="Office Address1"
                  onChange={this.handleChangeAddress1}
                  id="father_office_add1"
                  value={office_address1}
                  fullWidth={true}
            /><br />
            <TextField
                  name="father_office_add2"
                  floatingLabelText="Office Address2"
                  onChange={this.handleChangeAddress2}
                  id="father_office_add2"
                  value={office_address2}
                  fullWidth={true}
            /><br />
            <SelectValidator 
                  name="father_state" 
                  floatingLabelText="States"
                  value={father_state}
                  defaultValue={father_state}
                  onChange={this.handleChangeStates}
                  id="father_state"
                  fullWidth={true}
                >
                {menuItems2}
            </SelectValidator>
            <TextField
                  name="father_city"
                  floatingLabelText="City"
                  id="father_city"
                  value={father_city}
                  onChange={this.handleChangeCity}
                  fullWidth={true}
            /><br />
            <TextValidator
                    floatingLabelText="Email"
                    onChange={this.handleChangeEmail}
                    name="father_email"
                    type="email"
                    value={father_email}
                    id="father_email"
                    validators={['isEmail']}
                    errorMessages={['enter valid email']}
                    fullWidth={true}
            />
            <TextValidator
                floatingLabelText="Mobile Number"
                onChange={this.handleChangeMobile}
                name="father_mobile"
                type="text"
                value={father_mobile}
                id="father_mobile"
                validators={['isNumber']}
                errorMessages={['enter only number']}
                fullWidth={true}
            /><br />
            <RaisedButton 
                  style={{marginRight: 12}} 
                  primary={true}
                  type="submit"
                  label="Next" 
            />
            <FlatButton
              style={{marginRight: 12}} 
              label="Back"
              onClick={this.handleBack}
            />
            </ValidatorForm>
        )
    }  
}
class MotherForm extends React.Component
{
    constructor(props) 
    {
        super(props); 
        this.state={
          mother_full_name:'',
          mother_adhar_card: '',
          mother_education: 'null',
          mother_occupation:'Others',
          mother_state: 'Maharashtra',
          mother_mobile: '',
          mother_email: '',
          mother_education: '',
          mother_occupation: '',
          mother_designation: '',
          office_address1:'',
          office_address2:'',
          mother_state:'',
          mother_city:''
        }
        this.handleBack = this.handleBack.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);   
        this.handleChangeAcard = this.handleChangeAcard.bind(this);
        this.handleChangeEducation = this.handleChangeEducation.bind(this);
        this.handleChangeOccupation = this.handleChangeOccupation.bind(this);
        this.handleChangeStates = this.handleChangeStates.bind(this);
        this.handleChangeMobile = this.handleChangeMobile.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeAddress1 = this.handleChangeAddress1.bind(this);
        this.handleChangeAddress2 = this.handleChangeAddress2.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
        this.handleChangeDesignation = this.handleChangeDesignation.bind(this);
    }  
    handleBack()
    {
        document.getElementById("back_button_4").click();
    }
    handleChangeAddress1(event){
        this.setState({office_address1:event.target.value})
    }
    handleChangeAddress2(event){
        this.setState({office_address2:event.target.value})
    }
    handleChangeCity(event){
        this.setState({mother_city:event.target.value})
    }
    handleChangeDesignation(event){
        this.setState({mother_designation:event.target.value})
    }
    handleChangeName(event){
        this.setState({mother_full_name:event.target.value})
    }
    handleChangeAcard(event){
        this.setState({mother_adhar_card:event.target.value})
    }
    handleChangeEducation(event,index,value){
        //alert(value)
        this.setState({mother_education:value})
    }
    handleChangeOccupation(event,index,value){
        this.setState({mother_occupation:value})
    }
    handleChangeStates(event,index,value){
        this.setState({mother_state:value})
    }
    handleChangeMobile(event){
        this.setState({mother_mobile:event.target.value})
    }
    handleChangeEmail(event){
        this.setState({mother_email:event.target.value})
    }
    handleSubmit(){
       var saveType = sessionStorage.getItem('sess_msave');
       applicant_class_id = sessionStorage.getItem('sess_applicant_class_id'); 
       var mstate = this.state.mother_state;
       var moccupation = this.state.mother_occupation;
       var meducation  = this.state.mother_education;
        if(saveType == 'edit')
        {
              var my_url = base_url+'admission_con/update_admission_data?edit=mother&steps=5&applicant_id='+applicant_id+'&applicant_class_id='+applicant_class_id;
        }else{
             var my_url = base_url+'admission_con/insert_admission_data?mydata=mother_form&steps=5&applicant_id='+applicant_id+'&applicant_class_id='+applicant_class_id;
        }

        $.ajax({
                      type: 'POST',
                      url: my_url,
                      data: $('#myform5').serialize()+'&mother_state='+mstate+'&mother_occupation='+moccupation+'&mother_education='+meducation,
                      dataType: 'json',
                      success: function (resdata) {
                        if(resdata.applicant_id)
                        { 
                            sessionStorage.setItem('sess_applicant_class_id', resdata.applicant_class_id)
                            document.getElementById("next_button_4").click();
                            sessionStorage.setItem('sess_msave','edit');
                        }else{

                        }
                      }.bind(this),
                        error: function(xhr, status, err) {
                          console.error(err.toString());
                      }.bind(this)
            });
    }
    componentWillMount()
    {
        if(sessionStorage.getItem('sess_applicantId')!=null)
        {
              $.ajax({
                    type: 'POST',
                    url: base_url+'admission_con/get_mother_details',
                    data: {
                      applicant_id: sessionStorage.getItem('sess_applicantId'),
                      applicant_class_id: sessionStorage.getItem('sess_applicant_class_id')
                    },
                    dataType: 'json',
                    success: function (resdata) {
                      if(resdata.length > 0)
                      {
                          applicant_id = resdata[0]['applicant_id']
                          sessionStorage.setItem('sess_applicantId',applicant_id);
                          this.setState({ 
                              mother_full_name: resdata[0]['mother_full_name'],
                              mother_adhar_card: resdata[0]['mother_adhar_card'], 
                              mother_mobile: resdata[0]['mother_mobile'],
                              mother_email: resdata[0]['mother_email'],
                              mother_education: resdata[0]['mother_qualification'],
                              mother_occupation: resdata[0]['mother_occupation'],
                              mother_designation: resdata[0]['mother_designation'],
                              office_address1: resdata[0]['office_address1'], 
                              office_address2: resdata[0]['office_address2'],
                              mother_state: resdata[0]['state'],
                              mother_city: resdata[0]['city']
                          })
                          this.handleChangeEducation.bind(this);
                          this.handleChangeOccupation.bind(this);
                          this.handleChangeStates.bind(this);
                      }else{
                      }
                    }.bind(this),
                      error: function(xhr, status, err) {
                        console.error(err.toString());
                      }.bind(this)
            });
       }
    }
    render() {
        const {mother_full_name,mother_adhar_card,mother_mobile,mother_email,mother_education,mother_occupation,mother_designation,office_address1,office_address2,mother_state,mother_city} = this.state;
        const styles = {
            radioButton: {
              marginTop:16,
              marginLeft:10,
              width: 'auto',
              display: 'flex'
            }
        };
        return (  
            <ValidatorForm id="myform5" ref="form" onSubmit={this.handleSubmit.bind(this)} onError={errors => console.log(errors)}>
               <TextValidator
                      floatingLabelText="Mother Full Name"
                      onChange={this.handleChangeName}
                      name="mother_full_name"
                      type="text"
                      value={mother_full_name}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      id="mother_full_name"
                      fullWidth={true}
              /><br/>
              <label>Nationality</label>
              <RadioButtonGroup name="mother_nationality" defaultSelected="indian">
                 <RadioButton
                    value="indian"
                    label="Indian"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="other"
                    label="Other"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>
            <TextValidator
                floatingLabelText="Aadhar Card"
                onChange={this.handleChangeAcard}
                name="mother_adhar_card"
                type="text"
                value={mother_adhar_card}
                id="mother_adhar_card"
                validators={['isNumber']}
                errorMessages={['enter only number']}
                fullWidth={true}
            /><br />
            <SelectValidator 
                  name="mother_education" 
                  floatingLabelText="Education"
                  value={this.state.mother_education}
                  defaultValue={this.state.mother_education}
                  onChange={this.handleChangeEducation}
                  id="mother_education"
                  fullWidth={true}
                >
                  <MenuItem value={null} primaryText="" />
                  <MenuItem value="ssc" primaryText="SSC" />
                  <MenuItem value="hsc" primaryText="HSC" />
                  <MenuItem value="graduate" primaryText="Graduate" />
                  <MenuItem value="post_graduate" primaryText="Post Graduate" />
                  <MenuItem value="doctorate" primaryText="Doctorate" />
            </SelectValidator>
            <SelectValidator 
                  name="mother_occupation" 
                  floatingLabelText="Occupation"
                  value={this.state.mother_occupation}
                  defaultValue={this.state.mother_occupation}
                  onChange={this.handleChangeOccupation}
                  id="mother_occupation"
                  fullWidth={true}
                >
                  {menuItems3}
            </SelectValidator>
            <TextField
                  name="txt_mother_desigantion"
                  floatingLabelText="Designation"
                  onChange={this.handleChangeDesignation}
                  id="txt_mother_desigantion"
                  value={mother_designation}
                  fullWidth={true}
            /><br />
            <label>Is the job Transferable</label>
              <RadioButtonGroup name="mother_transferred">
                 <RadioButton
                    value="yes"
                    label="Yes"
                    style={styles.radioButton}
                 />
                 <RadioButton
                    value="no"
                    label="No"
                    style={styles.radioButton}
                 />
            </RadioButtonGroup>
            <TextField
                  name="mother_office_add1"
                  floatingLabelText="Office Address1"
                  onChange={this.handleChangeAddress1}
                  id="mother_office_add1"
                  value={office_address1}
                  fullWidth={true}
            /><br />
            <TextField
                  name="mother_office_add2"
                  floatingLabelText="Office Address2"
                  onChange={this.handleChangeAddress2}
                  id="mother_office_add2"
                  value={office_address2}
                  fullWidth={true}
            /><br />
            <SelectValidator 
                  name="mother_state" 
                  floatingLabelText="States"
                  value={this.state.mother_state}
                  defaultValue={this.state.mother_state}
                  onChange={this.handleChangeStates}
                  id="mother_state"
                  fullWidth={true}
                >
                {menuItems2}
            </SelectValidator>
            <TextField
                  name="mother_city"
                  floatingLabelText="City"
                  onChange={this.handleChangeCity}
                  id="mother_city"
                  value={mother_city}
                  fullWidth={true}
            /><br />
            <TextValidator
                    floatingLabelText="Email"
                    onChange={this.handleChangeEmail}
                    name="mother_email"
                    type="email"
                    value={mother_email}
                    id="mother_email"
                    validators={['isEmail']}
                    errorMessages={['enter valid email']}
                    fullWidth={true}
            />
            <TextValidator
                floatingLabelText="Mobile Number"
                onChange={this.handleChangeMobile}
                name="mother_mobile"
                type="text"
                value={mother_mobile}
                id="mother_mobile"
                validators={['isNumber']}
                errorMessages={['enter only number']}
                fullWidth={true}
            /><br />
            <RaisedButton 
                  style={{marginRight: 12}} 
                  primary={true}
                  type="submit"
                  label="Next" 
            />
            <FlatButton
              style={{marginRight: 12}} 
              label="Back"
              onClick={this.handleBack}
            />
            </ValidatorForm>
        )
    }
}

class ApplicationPrint extends React.Component
{
    constructor(props) 
    {
        super(props);
    } 
    render(){
         const styles = {
            button: {
              margin: 12,
            }
         }
         let dowload_url = base_url+"admission_con/download_form/"+applicant_id
         return (
           <div>
                <RaisedButton
                    href={dowload_url}
                    target="_blank"
                    label="Downpload Application"
                    primary={true}
                    style={styles.button}
               />
           </div>
         );
      } 
}

class Admission extends React.Component 
{
	constructor(props) 
  {
        super(props);
        this.state = {
          finished: false,
          stepIndex: 0,
          open: false
        }
  }      
  componentWillMount()
  {
        sessionStorage.clear();
  }
  componentWillReceiveProps(props)
  {
        console.log(props.location.pathname);
  }
  getChildContext() {
    return {
      muiTheme: getMuiTheme(darkBaseTheme)
    };
  }
  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 5,
      open: true
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  renderStepActions(step) {
    const {stepIndex} = this.state;
    let mynext = 'next_button_'+step;
    let myback = 'back_button_'+step
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label={stepIndex === 7 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          onClick={this.handleNext}
          style={{marginRight: 12,display:"none"}}
          id={mynext}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
            onClick={this.handlePrev}
            style={{display:"none"}}
            id={myback}
          />
        )}
      </div>
    );
  }

  render() {
    const {finished, stepIndex} = this.state;
    const styles = {
        labelStyle: {
          color:'#FFF',
        },
        snakebarStyle: {
          top:0
        }
    };
    let loadContent;
    if(this.props.location.pathname=='/')
    {
        loadContent =(    
          <div className="row">
            <div style={{maxHeight: 400, margin: 'auto'}}>
              <Stepper activeStep={stepIndex} orientation="vertical">
                <Step>
                  <StepLabel style={styles.labelStyle}>APPLICANT DETAILS</StepLabel>
                  <StepContent>
                    <ApplicantForm />
                    {this.renderStepActions(0)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel style={styles.labelStyle}>SELECT CLASS</StepLabel>
                  <StepContent>
                    <ChooseClass />               
                    {this.renderStepActions(1)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel style={styles.labelStyle}>CANDIDATE DETAILS</StepLabel>
                  <StepContent>
                    <CandidateForm />
                    {this.renderStepActions(2)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel style={styles.labelStyle}>FATHER DETAILS</StepLabel>
                  <StepContent>
                     <FatherForm />
                    {this.renderStepActions(3)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel style={styles.labelStyle}>MOTHER DETAILS</StepLabel>
                  <StepContent>
                    <MotherForm />
                    {this.renderStepActions(4)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel style={styles.labelStyle}>PAYMENT</StepLabel>
                  <StepContent>
                    <Razorpayment applicantId={applicant_id}/>
                    {this.renderStepActions(5)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel style={styles.labelStyle}>DOWNLOAD</StepLabel>
                  <StepContent>
                    <ApplicationPrint applicantId={applicant_id} />
                  </StepContent>
                </Step>
              </Stepper>
              {finished && (
                <p style={{margin: '20px 0', textAlign: 'center'}}>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      sessionStorage.clear();
                      this.setState({stepIndex: 0, finished: false});
                    }}
                  >
                    New Application
                  </a>
                </p>
              )}
              <Snackbar
                open={this.state.open}
                message="Save Successfully"
                style={styles.snakebarStyle}
                autoHideDuration={2000}
                onRequestClose={this.handleRequestClose}
              />
            </div>  
          </div>
        );
    }else if(this.props.location.pathname=='/forgot')
    {
        loadContent =(
            <ForgotPassword />
        );  
    }else{
        loadContent =(
            <LoginForm />
        );
    }
    return (
      <div className="container">
        {loadContent}
      </div>  
    );
  }
}

Admission.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default Admission;