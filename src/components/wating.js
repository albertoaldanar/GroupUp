import React, {Component} from "react";
import {View, Text, ActivityIndicator} from "react-native";
import LinearGradient from "react-native-linear-gradient";

class Wating extends Component{
	render(){
		return(
			<LinearGradient style = {{flex: 1}} start={{x: 0, y: 0}} end={{x: 4 , y: 1}} colors = {[ "white", "gray"]}>
				<View style= {{alignSelf:"center", position: "absolute", top: 0, left: 0, bottom: 0, right: 0, justifyContent: "center"}}>
					<ActivityIndicator size="large" color="black" />
				</View>
			</LinearGradient>
		);
	}
}

export default Wating;