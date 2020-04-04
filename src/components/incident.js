import React, {Component} from "react";
import {View, Text, TextInput, TouchableOpacity, Alert, Modal, AsyncStorage, ScrollView, Dimensions, Image} from "react-native";
import FontAwesome, {Icons} from "react-native-fontawesome";
import Camera from "./camera";
import * as firebase from 'firebase';
import 'firebase/firestore';
import { addNavigationHelpers, NavigationActions  } from 'react-navigation';
import FontAwesome, {Icons} from "react-native-fontawesome";

class Incident extends Component{

	constructor(props){
		super(props);
		this.state= { comments: "", photos: false, showCamera: false, imagesDB: [], routeID: null, imagesRN: []}

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
	};

	onChangeInput = (state) => (event,value) => {
	    this.setState({
	      [state]:event
	    });
  };

  closeOpenCamera(){
  	this.setState({showCamera: !this.state.showCamera});
  };

  addImages(imgDB, imgRN){
    this.setState({
        imagesDB: this.state.imagesDB.concat([imgDB]),
        imagesRN: this.state.imagesRN.concat([imgRN]),
    })
  };

  async postFail(){

		    const {comments, imagesDB} = this.state;
		    const {lat, lng} = this.props.navigation.state.params;

		    var today = new Date();
		    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		    var dateTime = date+' '+time;


		    const routeid = await AsyncStorage.getItem("ruta");

		    var year = new Date().getFullYear();
		    var month = new Date().getMonth() +1 ;

		    const paradaID = Math.floor((Math.random() * 10000000) + 1);
		    const dbParada = firebase.firestore().collection("parada");
		    const dbImages = firebase.firestore().collection("imagenes");

		    if (imagesDB.length > 0 && comments) {

		        dbParada.add({
		          ruta: Number(routeid), id: paradaID, lat: lat, lng: lng, client: "INCIDENTE", comments: comments, mes: month,
		          arrived_at: dateTime, finished_at: dateTime, phone: "", contact: "", email: "", año: year, fallida: false
		        });

		        dbImages.add({
		          ruta: Number(routeid), photos: this.state.imagesDB, client: "INCIDENTE"
		        });

		        return this.alerts();
		    } else {

		        return  Alert.alert(
		                "Registro invalido",
		                "Especifique cual fue el incidente y añada una foto",
		                [
		                  {text: 'OK'},
		                ],
		                {cancelable: false},
		        );
	   		}
	}

	showFiles(){
		return this.state.imagesRN.map(x => {
			return <Image style = {styles.imageStyle} source = {{uri: x}}/>
		})
	}

	sendToMain(){
	    const navigateAction = NavigationActions.navigate({
	      routeName: "MainScreen"
	    })
	    this.props.navigation.dispatch(navigateAction);
  	}

	alerts(){
	    return Alert.alert(
	          "Parada registrada!",
	          "Presiona OK para volver al mapa",
	        [
	          {text: 'OK' , onPress: this.sendToMain.bind(this)},
	        ],
	        {cancelable: false},
	      );
  	}

	render(){
		return(
			<View style = {{backgroundColor: "#ffff", flex: 1}}>
         	 	<View style = {{marginTop: 25}}>
	            	<TextInput
		              style={{height: 60, borderBottomColor: 'gray', borderBottomWidth: 0.5, marginBottom: 35, color: "black"}}
		              placeholder = "Cual fue la falla?"
		              placeholderTextColor = "gray"
		              autoCapitalize = 'none'
		              onChangeText ={this.onChangeInput('comments')}
		              value = {this.state.comments}
		              returnKeyType={ 'done' }
	            	/>
	            </View>

				<View style = {{justifyContent: "space-around", flexDirection: "row"}}>
	            	{this.showFiles()}
	            </View>


	            { this.state.photos ?
	          		<Text style = {{fontSize: 18}}> Fotos <FontAwesome>{Icons.check}</FontAwesome></Text>
	          		:
	          		<TouchableOpacity style = {{marginTop: 20, alignSelf:"center"}} onPress = {this.closeOpenCamera.bind(this)}>
	            		<Text style = {{fontSize: 18}}> Subir fotos <FontAwesome>{Icons.camera}</FontAwesome></Text>
	          		</TouchableOpacity>
				}

				<Modal
					visible = {this.state.showCamera}
				>
					<Camera closeCamera = {this.closeOpenCamera.bind(this)} addImages = {this.addImages.bind(this)}/>
				</Modal>


	            <TouchableOpacity style = {styles.startButton} onPress = { this.postFail.bind(this) }>
            		<Text style = {{textAlign:"center", fontSize: 18, color: "white"}}>REGISTRAR FALLA</Text>
          		</TouchableOpacity>
	        </View>
		);
	}
}


const styles= {
	startButton: {
	    position: "absolute",
	    bottom: 15,
	    left: 5,
	    right: 5,
	    padding: 20,
	    marginLeft: 10,
	    marginRight: 10,
	    backgroundColor: "black",
  	},
  	imageStyle:{
	    width: Dimensions.get('window').width * 0.15,
	    height: Dimensions.get('window').width * 0.15,
  	},
}

export default Incident;
