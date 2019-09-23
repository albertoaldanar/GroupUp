import React, {Component} from "react";
import {View, Text, TouchableOpacity, Alert, AsyncStorage, TextInput, Switch, ScrollView, Modal} from "react-native";
import {NavigationActions} from "react-navigation";
import { RNCamera } from 'react-native-camera';
import { Dropdown } from 'react-native-material-dropdown';
import MyStop from "./reusable/stop";
import Url from "./reusable/urls";
import * as firebase from 'firebase';
import 'firebase/firestore';
import  FontAwesome, {Icons} from "react-native-fontawesome";
import Camera from "./camera";

class QR extends Component{

  constructor(props){
    super(props);
    this.state = {
      registerType: "Manual", routeID: null, lat: 0, lng: 0, client: "", showCamera: false, photos: false, imageUri: "", 
      comments: "", arrivedAt: null, finishedAt: null, comments: "", phone: "", contact: "", email:"", año: "", fallida: false, lat: 0, lng: 0, 
      imagesDB:[], imagesRN: []
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

  // async componentWillMount(){
  //   // this.watchID = navigator.geolocation.watchPosition(
  //   //   (position) => {

  //   //     var lat = parseFloat(position.coords.latitude)
  //   //     var lng = parseFloat(position.coords.longitude)

  //   //     console.log(lat, lng);

  //   //     this.setState({
  //   //       lat, lng
  //   //     });
  //   //   }, (error)=> {
  //   //       console.log(error);
  //   //   }, {enableHighAccuracy: false, timeout: 1, maximumAge: 1, distanceFilter: 1}
  //   // );
  //     const imageGet = await AsyncStorage.getItem('image');
  //     this.setState({ imageUri: imageGet});

  // }

  async componentDidMount(){

    const idGet = await AsyncStorage.getItem('ruta');
    this.setState({ routeID: idGet});
  }

  closeOpenCamera(){
      this.setState({showCamera: !this.state.showCamera});
  }


  sendToMain(){
    const navigateAction = NavigationActions.navigate({
      routeName: "MainScreen"
    })
    this.props.navigation.dispatch(navigateAction);
  }

  onCodeRead(e) {
    const {lat, lng} = this.props.navigation.state.params;

    const navigateAction = NavigationActions.navigate({
      routeName: "Stop",
      params: {
        client: e.data, 
        lat: lat, 
        lng: lng
      }
    })
    this.props.navigation.dispatch(navigateAction);
  }

  onChangeInput = (state) => (event,value) => {
    this.setState({
      [state]:event
    });
  }

  addImages(imgDB, imgRN){
      this.setState({ 
        imagesDB: this.state.imagesDB.concat([imgDB]),
        imagesRN: this.state.imagesRN.concat([imgRN]), 
      })
  }

  postStop(){

    const {client, comments, phone, contact, email, año, fallida} = this.state;
    const {lat, lng} = this.props.navigation.state.params;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    const routeid = Number(this.state.routeID);     
    var year = new Date().getFullYear();
    var month = new Date().getMonth() +1 ;

    const paradaID = Math.floor((Math.random() * 10000000) + 1);
    const dbParada = firebase.firestore().collection("parada");

    if (client && phone && comments && this.state.imagesDB.length > 0) {
        dbParada.add({
          ruta: routeid, id: paradaID, lat: lat, lng: lng, client: client, comments: comments, mes: month, photos: this.state.imagesDB, 
          arrived_at: dateTime, finished_at: dateTime, phone: phone, contact: contact, email: email, año: year, fallida: fallida
        });

        return this.alerts();
    } else {

        return  Alert.alert(
                "Registro invalido",
                "Llene todos los campos para registrar parada",
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
        );
    }
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


  registerType(){
    if(this.state.registerType == "QR"){
      return(
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            onBarCodeRead={this.onCodeRead.bind(this)}
            captureAudio= {false}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
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
      );
    } else {
      return(
        <View style = {{backgroundColor: "#ffff", flex: 1}}>
          <View style = {styles.inputs}>

            <View style= {{flexDirection: "row", justifyContent: "space-between"}}>
              <View style= {{flexDirection: "row"}}>
                <Text>Fallida:  </Text>
                <Switch
                  onValueChange = {() => this.setState({fallida: !this.state.fallida})}
                  value = {this.state.fallida}
                  style= {{marginTop: -7}}
                />
              </View>

              <TouchableOpacity style = {{alignSelf:"center", marginTop: -10}} onPress = {this.closeOpenCamera.bind(this)}>
                  <Text style = {{fontSize: 18}}> Subir fotos <FontAwesome>{Icons.camera}</FontAwesome></Text>
              </TouchableOpacity>
            </View>
  
      
            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, marginBottom: 35, color: "black"}}
              placeholder = "Cliente"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('client')}
              value = {this.state.client}
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Comentarios"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('comments')}
              value = {this.state.comments}
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Telefono"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('phone')}
              value = {this.state.phone}
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Contacto"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('contact')}
              value = {this.state.contact}
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Email"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('email')}
              value = {this.state.email}
            />
          </View>

          <TouchableOpacity style = {styles.startButton} onPress = {this.postStop.bind(this)}>
            <Text style = {{textAlign:"center", fontSize: 15, color: "#ffff"}}>REGISTRAR PARADA</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render(){
    const {lat, lng} = this.props.navigation.state.params;
    console.log(lat, lng, this.state.routeID);

    let data = [{
      value: "QR"
    }, {
      value: 'Manual',
    }];

    return(
      <View style = {styles.container}>
        <Modal visible = {this.state.showCamera}>
          <Camera closeCamera = {this.closeOpenCamera.bind(this)} addImages = {this.addImages.bind(this)}/>
        </Modal>

        <Dropdown
          label='Registro'
          data= {data}
          value = {this.state.registerType}
          containerStyle = {{backgroundColor: "white"}}
          onChangeText = {value => this.setState({registerType: value})}
        />
        {this.registerType()}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: "column",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  inputs: {
    justifyContent: 'center',
    margin: 15,
    marginLeft: 30,
    marginRight: 30,
    position: 'absolute',
    top: 0,left: 0,
    right: 0, bottom: 0,
  },
  startButton: {
      position: "absolute",
      bottom: 15,
      left: 5,
      right: 5,
      padding: 20,
      marginLeft: 10, 
      marginRight: 10,
      backgroundColor: "black",
  }
}

export default QR;

