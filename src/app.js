import React from "react";
import {AsyncStorage} from "react-native";
import {AppNavigatorMain, AppNavigatorLogin} from "./navigation/navigator";
import OneSignal from 'react-native-onesignal'; 

class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			currentUser: ""
		}
		console.log('prueba')
		OneSignal.init("9ed06bcd-4767-4718-998d-804eb0aa5850");
	}


	async componentDidMount(){
		const userGet = await AsyncStorage.getItem('username');
		if(userGet){
			this.setState({ currentUser: userGet});
		} else {
			this.setState({ currentUser: false });
		}
	}

 	render() {
 		const MyNav = this.state.currentUser == false ? AppNavigatorLogin : AppNavigatorMain
 		
 		return <MyNav/> 
  	}
}

export default App;