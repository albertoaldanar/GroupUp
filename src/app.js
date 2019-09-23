import React from "react";
import {AsyncStorage} from "react-native";
import {AppNavigatorMain, AppNavigatorLogin} from "./navigation/navigator";

class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			currentUser: ""
		}
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