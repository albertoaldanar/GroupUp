import React, {Component} from "react";
import {View, Text, TouchableOpacity, Alert, AsyncStorage, TextInput, Switch, ScrollView, Modal, Picker} from "react-native";
import {NavigationActions} from "react-navigation";
import { RNCamera } from 'react-native-camera';
import { Dropdown } from 'react-native-material-dropdown';
import MyStop from "./reusable/stop";
import Url from "./reusable/urls";
import * as firebase from 'firebase';
import 'firebase/firestore';
import  FontAwesome, {Icons} from "react-native-fontawesome";
import Camera from "./camera";
import Signature from "./signature";

class QR extends Component{

  constructor(props){
    super(props);
    this.state = {
      registerType: "Registro manual", routeID: null, lat: 0, lng: 0, client: "", showCamera: false, photos: false, imageUri: "", showSignature: false, 
      comments: "", arrivedAt: null, finishedAt: null, comments: "", phone: "", contact: "", email:"", año: "", fallida: false, lat: 0, lng: 0, 
      imagesDB:[], imagesRN: [], signature: "--", company: "", companies: []
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


  async componentDidMount(){

    var d = new Date()

    var day = d.getDay();

    const days = [ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];

    const db = firebase.firestore();

    const arrayI= ["Escoje un client"];

    let ingRef = db.collection('itinerario').where('day', '==', days[day]).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.data());

          arrayI.push(doc.data().client);
          this.setState({companies: arrayI});
        });
      })

    const idGet = await AsyncStorage.getItem('ruta');
    this.setState({ routeID: idGet});
  }


  saveSignature(signature){
    this.setState({ showSignature: false, signature })
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
    const dbImages = firebase.firestore().collection("imagenes");

    if (client && phone && comments && this.state.imagesDB.length > 0) {
        dbParada.add({
          ruta: routeid, id: paradaID, lat: lat, lng: lng, client: client, comments: comments, mes: month,
          arrived_at: dateTime, finished_at: dateTime, phone: phone, contact: contact, email: email, año: year, fallida: fallida
        });

        dbImages.add({
          photos: this.state.imagesDB, ruta: routeID, client: client
        })

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

  showQR(){
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
    )

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

    const companies = [
      "Ecoje un cliente", "Oxxo", "Walmart", "Plaza del sol", "Aldana", "Coppel", "Ley", "La lomita", "El kiosko"
    ];

    let renderCompanies = this.state.companies.map((l, i) => {
        return <Picker.Item key = {i} label = {l} value ={l}/>

    });

    const pick = {
          inputIOS: {
            color: '#F5F5F5',
            paddingTop: 13,
            paddingHorizontal: 10,
            paddingBottom: 12,
          },
          inputAndroid: {
            color: '#F5F5F5',
          },
          placeholderColor: '#F5F5F5',
          underline: { borderTopWidth: 0 },
          icon: {
            position: 'absolute',
            backgroundColor: '#F5F5F5',
            borderTopWidth: 5,
            borderTopColor: '#00000099',
            borderRightWidth: 5,
            borderRightColor: 'transparent',
            borderLeftWidth: 5,
            borderLeftColor: 'transparent',
            width: 0,
            height: 0,
            top: 20,
            right: 15,
          },
    };

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
              returnKeyType={ 'done' }
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Comentarios"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('comments')}
              value = {this.state.comments}
              returnKeyType={ 'done' }
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Telefono"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('phone')}
              keyboardType='numeric'
              value = {this.state.phone}
              returnKeyType={ 'done' }
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Contacto"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('contact')}
              value = {this.state.contact}
              returnKeyType={ 'done' }
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Email"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('email')}
              value = {this.state.email}
              returnKeyType={ 'done' }
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
    console.log(this.state.companies);

    let data = [{
      value: "Registro Manual"
    }, {
      value: 'QR',
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
  },
  pickerStyle: {
    color: "#F5F5F5",
    textAlign: "left",
    height: 300,
    fontSize: 20,
    borderBottomColor: "#F5F5F5",
    borderBottomWidth:1,
    underline: { borderWidth: 0, borderColor: "#F5F5F5" },
  },
  pickerContainer: {
    justifyContent: 'center',
    marginLeft: 27,
    position: 'absolute',
    top: 0,left: 0,
    right: 0, bottom: 0,
  },
}

export default QR;

