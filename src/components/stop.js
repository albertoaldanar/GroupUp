import React, {Component} from "react";
import {View, Text, TouchableOpacity, Alert, TextInput, AsyncStorage, Modal, Switch, Dimensions, Image} from "react-native";
import {NavigationActions} from "react-navigation";
import MyStop from "./reusable/stop";
import FontAwesome, {Icons} from "react-native-fontawesome";
import Url from "./reusable/urls";
import * as firebase from 'firebase';
import 'firebase/firestore';
import Camera from "./camera";

class Stop extends Component{

  constructor(props){
    super(props);
    this.state = {lat: 0, lng: 0, comments: "", routeID: null, showCamera: false, fallida: false, imagesDB: [], imagesRN: []}

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
      const idGet = await AsyncStorage.getItem('ruta');
      this.setState({ routeID: idGet});
  }

  onChangeInput = (state) => (event,value) => {
    this.setState({
      [state]:event
    });
  }


  closeOpenCamera(){
      this.setState({showCamera: !this.state.showCamera});
  }


  addImages(imgDB, imgRN){
     this.setState({ 
        imagesDB: this.state.imagesDB.concat([imgDB]),
        imagesRN: this.state.imagesRN.concat([imgRN]), 
      })
  }

  async postStop(){

    const {lat, lng, client} = this.props.navigation.state.params;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    const routeid = await AsyncStorage.getItem('ruta');    
    var year = new Date().getFullYear();
    var month = new Date().getMonth() +1 ;

    const paradaID = Math.floor((Math.random() * 10000000) + 1);
    const dbParada = firebase.firestore().collection("parada");


    if(this.state.imagesDB.length > 0){
        dbParada.add({
          ruta: Number(routeid), id: paradaID, lat: lat, lng: lng, client: client, comments: this.state.comments,
          arrived_at: dateTime, finished_at: dateTime, mes: month, photos: this.state.imagesDB, año: year
        });

        return this.alerts();
    } else {

        return  Alert.alert(
                "Registro invalido",
                "La parada debe contener fotos",
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
        );
    }

  }

  backToMap(){
    const navigateAction = NavigationActions.navigate({
      routeName: "Intro"
    })
    this.props.navigation.dispatch(navigateAction);
  }

  alerts(){
    return Alert.alert(
          "Parada registrada!",
          "Presiona OK para volver al mapa",
        [
          {text: 'OK' , onPress: this.backToMap.bind(this)},
        ],
        {cancelable: false},
      );
  }

  renderImages(){
    return this.state.imagesRN.map(x => {
      return <Image source = {{uri: x}} style = {styles.imageStyle}/>
    })
  }

  render(){
    const {lat, lng, client} = this.props.navigation.state.params;

    return(
      <View style ={{flex: 1, backgroundColor: "#ffff"}}>
          <View>

            <View style= {styles.card}>
              <Text style = {{alignSelf: "center", margin: 15, borderBottomColor: "gray", borderBottomWidth: 0.4, fontSize: 25}}>{client}</Text>

              <View>
                <Text style = {{color: "gray", marginBottom: 20, marginLeft: 5}}> <FontAwesome>{Icons.mapMarker}</FontAwesome>  {this.state.routeID} </Text>
              </View>
            </View>

            <View style= {{flexDirection: "row", justifyContent: "space-between"}}>
              <View style= {{flexDirection: "row"}}>
                <Text style = {{marginLeft: 5}}>Fallida:  </Text>
                <Switch
                  onValueChange = {() => this.setState({fallida: !this.state.fallida})}
                  value = {this.state.fallida}
                  style= {{marginTop: -7}}
                />
              </View>

              <TouchableOpacity style = {{alignSelf:"center", marginTop: -10, marginRight: 5}} onPress = {this.closeOpenCamera.bind(this)}>
                  <Text style = {{fontSize: 18}}> Subir fotos <FontAwesome>{Icons.camera}</FontAwesome></Text>
              </TouchableOpacity>
            </View>


            <View>  
              <Text style = {{marginLeft: 5, marginTop: 15}}>Fotos: </Text>
              <View style = {{justifyContent: "space-around", flexDirection: "row", marginTop: 22}}>
                {this.renderImages()}
              </View>
            </View>

            <TextInput
              style={{height: 70, borderColor: 'gray', borderWidth: 0.5, marginTop: 35, color: "black", borderRadius: 5, margin: 5}}
              placeholder = "Comentarios"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('comments')}
              value = {this.state.comments}
              returnKeyType={ 'done' }
            />
          </View>


          <Modal visible = {this.state.showCamera}>
            <Camera closeCamera = {this.closeOpenCamera.bind(this)} addImages = {this.addImages.bind(this)}/>
          </Modal>
          
          <TouchableOpacity style = {styles.startButton} onPress = {this.postStop.bind(this)}>
            <Text style = {{textAlign:"center", fontSize: 15, color:"white"}}>REGISTRAR PARADA</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  inputs: {
    justifyContent: 'center',
    margin: 15,
    marginLeft: 30,
    marginRight: 30,
    position: 'absolute',
    top: 0,left: 0,
    right: 0, bottom: 0,
  },
  card: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    margin: 15,
    marginBottom: 25
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
  imageStyle:{
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
  },
}

export default Stop;
