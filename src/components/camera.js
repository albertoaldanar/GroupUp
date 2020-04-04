import React, {Component} from "react";
import {View, Text, ActivityIndicator, TouchableOpacity, Alert, AsyncStorage} from "react-native";
import { RNCamera } from 'react-native-camera'; 
import FontAwesome, {Icons} from "react-native-fontawesome";

class Camera extends Component{

	constructor(props){
		super(props);

		this.state= {
			filePath: {}
		}
	}	

	async takePicture() {
	    if (this.camera) {
	      const options = { quality: 0.5, base64: true };
	      const data = await this.camera.takePictureAsync(options);

	      return this.props.addImages(data.base64, data.uri);

	    } else {
	    	 return  Alert.alert(
                "Error en camara",
                "Ha habido un error en la camara, reinicie la app",
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
        	);
	    }
  	};


	render(){
		return(
			<View style = {styles.container}>
				<RNCamera
			          ref={ref => {
			            this.camera = ref;
			          }}
			          style={styles.preview}
			          type={RNCamera.Constants.Type.back}
			          flashMode={RNCamera.Constants.FlashMode.off}
			          androidCameraPermissionOptions={{
			            title: 'Permission to use camera',
			            message: 'We need your permission to use your camera',
			            buttonPositive: 'Ok',
			            buttonNegative: 'Cancel',
			          }}
			          androidRecordAudioPermissionOptions={{
			            title: 'Permission to use audio recording',
			            message: 'We need your permission to use your audio',
			            buttonPositive: 'Ok',
			            buttonNegative: 'Cancel',
			          }}
	        	/>

	        	<TouchableOpacity style= {styles.closeButton} onPress ={this.props.closeCamera}>
		            <Text style={{ fontSize: 24, color: "red" }}> X  </Text>
		        </TouchableOpacity>

	        	<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
		          	<TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
		            	<Text style={{ fontSize: 14 }}> <FontAwesome>{Icons.camera}</FontAwesome> </Text>
		         	 </TouchableOpacity>
        		</View>
        	</View>
		);
	}
}

const styles = {
	 container: {
	    flex: 1,
	    flexDirection: 'column',
	    backgroundColor: 'black',
  	},
	preview: {
	    flex: 1,
	    justifyContent: "flex-end",
	    alignItems: "center"
  	},
  	capture: {
	    flex: 0,
	    backgroundColor: '#fff',
	    borderRadius: 5,
	    padding: 15,
	    paddingHorizontal: 20,
	    alignSelf: 'center',
	    margin: 20,
  	},
  	closeButton:{
  		position: "absolute", 
  		top: 5, right: 5
  	}
}

export default Camera;
