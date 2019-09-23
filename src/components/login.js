import React, {Component} from "react";
import {View, Text, TextInput, TouchableOpacity, Image, Dimensions, AsyncStorage, Modal} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {NavigationActions} from "react-navigation";
import Url from "./reusable/urls";
import Wating from "./wating";
import * as firebase from 'firebase';
import 'firebase/firestore';

class Login extends Component{

	constructor(props){
		super(props);
		this.state= {
			email: "", password_confirmation: "", password: "", username: "", loginUsername: "", loginPassword:"", isSignup: false,
			errorMessage: "", wating: true, name: ""
		}

	    if(!firebase.apps.length){
	      const firebaseConfig = {
	        apiKey: "AIzaSyD3G-zK6USRWEAJy1_dtHdqZZb_GWDmifw",
	        authDomain: "serecsin-1533314943191.firebaseapp.com",
	        databaseURL: "https://serecsin-1533314943191.firebaseio.com",
	        projectId: "serecsin-1533314943191",
	        storageBucket: "",
	        messagingSenderId: "1091946178343",
	        appId: "1:1091946178343:web:68af7c6bb70c4584acab02"
	      };

	      this.dataBase = firebase.initializeApp(firebaseConfig);
	    }
	}

	componentWillMount(){
		setTimeout(() => {this.setState({wating: false})}, 4000)
	}

	onChangeInput = (state) => (event,value) => {
	    this.setState({
	      [state]:event
	    });
 	}

 	sendToHome(){
	    const {username, password, password_confirmation, email} = this.state;
	    this.setState({username: "", password: "", password_confirmation: "", email: "", errorMessage: ""})

		const navigateAction = NavigationActions.navigate({
		      routeName: "Intro"
	    });

	    this.props.navigation.dispatch(navigateAction);
  	}	


  	userSignup(){
	  	const {username, password, password_confirmation, name} = this.state;
	    const dbUser = firebase.firestore().collection('user');

		if(username && password && name){

			dbUser.add({
	        	username: username, password: password, nombre: name
	    	});

	   		try {
			    AsyncStorage.setItem('username', username);
			    AsyncStorage.setItem('name', name);
			        
			} catch (error) {
			    console.log(error.message);
			}

			return this.sendToHome();
		} else {
			this.setState({errorMessage: "Información incompleta", password: "", name: "", username: ""})
		}
	
  	}


  	userLogin(){
	  	const {username, password} = this.state;
	    const dbUser = firebase.firestore().collection('user');

		if(username && password){
			    dbUser.where('username', '==', username).where("password", "==", password).get()
			      .then(snapshot => {
			        snapshot.forEach(doc => {
			        	console.log(doc.data());

			        	if(doc.data().username){
						  	try {
						    	AsyncStorage.setItem('username', username);
							} catch (error) {
						    	console.log(error.message);
							}
							return this.sendToHome();

			        	} else {
			        		this.setState({errorMessage: "Usuario o contraseña incorrectos", username: "", password: ""})
			        	}
			        });
	      		  })
	
  		} else {
  			this.setState({errorMessage: "Datos incompletos", username: "", password: ""})
  		}
  	}
 	// userAction(action){
  //   	const {username, password, password_confirmation, email} = this.state;
  //   	var postArgs = action == "login" ? {"username": username, "password": password} : {"username": username, "email": email, "password": password, "password_confirmation": password_confirmation}

	 //    return fetch(`http://${Url}:8000/users/${action}/`, {
	 //        method: "POST",
	 //        headers: {
	 //          "Accept": "application/json",
	 //          "Content-type": "application/json"
	 //        },
	 //        body: JSON.stringify(postArgs)
	 //    })
	 //    .then(res => res.json())
	 //      	.then(jsonRes => {
	 //          	if(jsonRes.jwt && jsonRes.user){
	 //            try {
	 //              AsyncStorage.setItem('token', jsonRes.jwt);
	 //              AsyncStorage.setItem('username', jsonRes.user.username);
	        
	 //            } catch (error) {
	 //              console.log(error.message);
	 //            }
	 //            this.sendToHome()
	 //          } else {
	 //             	this.handleResponse(jsonRes)
	 //          }
	 //      	}).catch(error => console.log(error))
  // 	}

  // 	handleResponse(response){

  //  		if(response.password || response.username){
  //     		return this.setState({errorMessage: "Can´t have blank fields"})
  //   	} else if(response.non_field_errors){
  //     		return this.setState({errorMessage: "Invalid credentials", username: "", password: ""})
  //   	}
  // 	}

	registrationForm(){
	    const {email, password_confirmation, password, username, loginUsername, loginPassword, name} = this.state;
	    if(this.state.isSignup){
	      return(
	        <View style = {styles.inputs}>
	          <TextInput
	            style={{height: 40, borderBottomColor: 'black', borderBottomWidth: 0.5, marginBottom: 25, color: "black"}}
	            placeholder = "Usuario"
	            placeholderTextColor = "gray"
	            autoCapitalize = 'none'
	            onChangeText ={this.onChangeInput('username')}
	            value = {username}
	          />

	          <TextInput
	            style={{height: 40, borderBottomColor: 'black', borderBottomWidth: 0.5, color:"black", marginBottom: 25,}}
	            placeholder = "Nombre"
	            placeholderTextColor = "gray"
	            autoCapitalize = 'none'
	            onChangeText ={this.onChangeInput('name')}
	            value = {name}
	          />
	          <TextInput
	            style={{height: 40, borderBottomColor: 'black', borderBottomWidth: 0.5, color:"black", marginBottom: 25 }}
	            placeholder = "Contraseña"
	            placeholderTextColor = "gray"
	            secureTextEntry={true}
	            autoCapitalize = 'none'
	            onChangeText ={this.onChangeInput('password')}
	            value = {password}
	          />

	          <View style = {{marginLeft: 15, marginRight: 15, marginTop: 55}}>
	            <TouchableOpacity style = {{backgroundColor: "black", paddingTop: 10, paddingBottom: 10}} onPress = {this.userSignup.bind(this)}>
	              <Text style = {{textAlign: "center", color: "white", fontWeight: "300", fontSize: 16}}>Registrarse</Text>
	            </TouchableOpacity>
	          </View>

	          <View style = {{ position: "absolute", bottom: 15, flexDirection: "row", alignSelf:"center"}}>
	            <Text style= {{fontWeight: "300", color: "gray"}}>Do yoy have an acount? </Text>
	            <TouchableOpacity onPress= {() => this.setState({isSignup: false, username: "", password: "", email: "", password_confirmation: ""})}>
	              <Text style= {{fontWeight: "600", color: "black"}}> Sign in </Text>
	            </TouchableOpacity>
	          </View>
	        </View>
	      )
	    } else{
	      return(
	        <View style = {styles.inputs}>
	          <TextInput
	            style={{height: 40, borderBottomColor: 'black', borderBottomWidth: 0.5, marginBottom: 25, color: "black"}}
	            placeholder = "Username"
	            placeholderTextColor = "gray"
	            autoCapitalize = 'none'
	            onChangeText ={this.onChangeInput('username')}
	            value = {username}
	          />
	          <TextInput
	            style={{height: 40, borderBottomColor: 'black', borderBottomWidth: 0.5, color:"black", color: "black"}}
	            placeholder = "Password"
	            placeholderTextColor = "gray"
	            secureTextEntry={true}
	            autoCapitalize = 'none'
	            onChangeText ={this.onChangeInput('password')}
	            value = {password}
	            multiline = {true}
	          />

	          <View style = {{marginLeft: 15, marginRight: 15, marginTop: 55}}>
	            <TouchableOpacity style = {{backgroundColor: "black", paddingTop: 10, paddingBottom: 10}}  onPress = {this.userLogin.bind(this)}>
	              <Text style = {{textAlign: "center", color: "white", fontWeight: "300", fontSize: 16}}>Iniciar sesión</Text>
	            </TouchableOpacity>

	            <Text style = {{color: "black", alignSelf:"center", margin: 5}}>{this.state.errorMessage}</Text>

	          </View>

	          <View style = {{ position: "absolute", bottom: 15, flexDirection: "row", alignSelf:"center"}}>
	            <Text style= {{fontWeight: "300", color: "gray"}}> No tienes cuenta aún? </Text>
	            <TouchableOpacity onPress= {() => this.setState({isSignup: true, username: "", password: ""})}>
	              <Text style= {{fontWeight: "600", color: "black"}}> Registrarse </Text>
	            </TouchableOpacity>
	          </View>
	        </View>
	      );
	    }
	  }
	render(){
		return(
			<LinearGradient style = {{flex: 1}} start={{x: 0, y: 0}} end={{x: 4 , y: 1}} colors = {[ "white", "gray"]}>
				<Image source = {{uri: "https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/map_marker_base-512.png"}} style = {{width: 120, height: 120, alignSelf: "center", marginTop: 35}}/>
				{this.registrationForm()}

				<Modal visible = {this.state.wating}>
					<Wating/>
				</Modal>
			</LinearGradient>
		);
	}
}

const styles = {
	container: {
		flex: 1
	},
	inputs: {
	    justifyContent: 'center',
	    margin: 15,
	    marginLeft: 30,
	    marginRight: 30,
	    position: 'absolute',
	    top: 0,left: 0,
	    right: 0, bottom: 0,
  	}
}

export default Login;