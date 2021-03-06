import React, {Component} from "react";
import {View, Text, TouchableOpacity, Image, Dimensions, StatusBar, Modal, AsyncStorage, Alert, PermissionsAndroid, ScrollView} from "react-native";
import RouteModal from "./reusable/routeModal";
import ImageSlider from 'react-native-image-slider';
import { addNavigationHelpers, NavigationActions, NavigationEvents } from 'react-navigation';
import MapView, { PROVIDER_GOOGLE,  Marker, Polyline} from 'react-native-maps';
import SideMenu from "react-native-side-menu";
import FontAwesome, {Icons} from "react-native-fontawesome";
import MapStyle from "./reusable/mapStyle";
import Url from "./reusable/urls";
import MyStop from "./reusable/stop";
import * as firebase from 'firebase';
import 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import DialogInput from 'react-native-dialog-input';
import MultiSelect from 'react-native-multiple-select';


const {width, height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.07913
const LONGITUDE_DELTA = 0.066987


class Intro extends Component{
  
  constructor(props){
    super(props)
    this.state = {
      isOpen: false,
      showRegisterForm: false,
      formFilled: false,
      region: {
        latitude: 24.80664999917974,
        longitude: -107.3964986262915,
        latitudeDelta: 0.16251275933643683,
        longitudeDelta: 0.10970118399998796
      },
      markers: [],
      startedRoute: false,
      QS: false,
      routeID: null,
      lat: 0,
      lng: 0,
      currentUser: "",
      wating: true, quickID: 0, isDialogVisible: false, endRouteDialog: false, selectedItems: [], showList: false, companies: []
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


  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Permiso de ubicación',
          'message': 'Serecsin quiere acceder a tu ubicación',
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }


  getStops(ruta){

    var d = new Date()
    var day = d.getDay();

    const db = firebase.firestore()

    var idNumber = Number(this.state.routeID);

    const days = [ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];

    const arrayI= [];
    const arrayII = [];

    let ingRef = db.collection('parada').where('ruta', '==', idNumber).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.data());

          arrayI.push(doc.data());
          this.setState({markers: arrayI});
        });
      })


    let itineRef = db.collection('itinerario').where('day', '==', days[day]).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.data());

          arrayII.push(doc.data().client);
          this.setState({companies: arrayII});
        });
      })
  }

  async componentDidMount(){ 

    await this.requestLocationPermission();

    const userGet = await AsyncStorage.getItem('username');
    this.setState({ currentUser: userGet});

    const startedGet = await AsyncStorage.getItem('started');
      this.setState({ startedRoute: startedGet});

    const idGet = await AsyncStorage.getItem('ruta');
      this.setState({ routeID: idGet});

    const currentUserGet = await AsyncStorage.getItem('username');
      this.setState({ currentUser: currentUserGet});

    this.watchID = navigator.geolocation.watchPosition(
      (position) => {

        var lat = parseFloat(position.coords.latitude)
        var lng = parseFloat(position.coords.longitude)
        this.setState({
          lat, lng
        });
      }, (error)=> {
          console.log(error);
      }, {enableHighAccuracy: false, timeout: 1, maximumAge: 1, distanceFilter: 1}
    );

      return this.getStops(idGet);
  }

  async postTrashOrGas(input, type){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    const routeid = await AsyncStorage.getItem('ruta'); 

    var year = new Date().getFullYear();
    var month = new Date().getMonth() +1 ;

    const paradaID = Math.floor((Math.random() * 10000000) + 1);
    const dbParada = firebase.firestore().collection('parada');


    this.watchID = navigator.geolocation.watchPosition(
      (position) => {

        var lat = parseFloat(position.coords.latitude);
        var lng = parseFloat(position.coords.longitude);

        this.setState({
          lat, lng
        });
      }, (error)=> {
          console.log(error);
      }, {enableHighAccuracy: false, timeout: 1, maximumAge: 1, distanceFilter: 1}
    );

    if(type == "trash"){
        dbParada.add({
          id: paradaID, ruta: Number(routeid), lat: this.state.lat, lng: this.state.lng, arrived_at: dateTime, 
          finished_at: dateTime, client: "BASURA", phone: "", email: "", contact: "", comments: "", año: year, mes: month
        });
    } else {
        dbParada.add({
          id: paradaID, ruta: Number(routeid), lat: this.state.lat, lng: this.state.lng, arrived_at: dateTime, 
          finished_at: dateTime, client: "GASOLINA", phone: "", email: "", contact: "", comments: "", año: year, mes: month, lt: Number(input)
        });

        this.setState({isDialogVisible: false})
    }

      return this.getStops(Number(routeid));
  }

  finishRoute(input){
    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = date+' '+time;

    const rId = Number(this.state.routeID);

    const db = firebase.firestore();


    // let ingRef = db.collection('parada').where('ruta', '==', rID).get()
    //   .then(snapshot => {
    //     snapshot.forEach(doc => {
    //       console.log(doc.data());

    //       arrayI.push(doc.data());
    //       this.setState({markers: arrayI});
    //     });
    //   })
     let rutaRef = db.collection("ruta").where("id", "==", rId).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              console.log(doc.id, " => ", doc.data());
              // Build doc ref from doc.id
              db.collection("ruta").doc(doc.id).update({lt: Number(input), done: true});
         });
      })

      this.setState({markers: [], endRouteDialog: false})

      var start = AsyncStorage.removeItem("started");
      var id = AsyncStorage.removeItem('ruta');

      return this.setState({ markers: [], startedRoute: false, routeID: null, endRouteDialog: false }); 

  }

  // endRouteAlert(){
  //     return Alert.alert(
  //         "Quieres terminar la ruta de hoy?",
  //         "Presiona SI para finalizar ruta",
  //       [
  //         {text: 'SI' , onPress: this.finishRoute.bind(this)},
  //         {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
  //       ],
  //       {cancelable: true},
  //     );
  // }

   customAlert(input, type){
      if(type == "trash"){
          return Alert.alert(
              "Quieres registrar una parada de basura?",
              "Presiona SI para registrar",
            [
              {text: 'SI' , onPress: this.postTrashOrGas.bind(this, null, "trash")},
              {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ],
            {cancelable: true},
          );
      }
  }


  async validateForm(){

    const idGet = await AsyncStorage.getItem('ruta');
    const startedGet = await AsyncStorage.getItem('started');
    
    this.setState({ routeID: idGet, showRegisterForm: !this.state.showRegisterForm, startedRoute: startedGet});
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  routeOrQR(){
    if(this.state.startedRoute){
      return(
        <View style = {styles.buttons}>
          <TouchableOpacity style = {{backgroundColor: "rgba(185,216,230 ,0.7)", borderRadius: 50, padding: 20}} onPress = {this.sendToQR.bind(this)}>
              <FontAwesome style = {{fontSize: 30}}>{Icons.mapMarker}</FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity style = {{backgroundColor: "rgba(102,204,153,0.5)", borderRadius: 50, padding: 20}} onPress= {this.customAlert.bind(this, null, "trash")} >
              <FontAwesome style = {{fontSize: 30}}>{Icons.trash}</FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity style = {{backgroundColor: "rgba(102,204,153,0.5)", borderRadius: 50, padding: 20}} onPress= {() => this.setState({isDialogVisible: true})}>
              <FontAwesome style = {{fontSize: 30}}>{Icons.tint}</FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity style = {{backgroundColor: "#F5F5F5", borderRadius: 50, padding: 20}} onPress = {this.sendToIncident.bind(this)}>
              <FontAwesome style = {{fontSize: 30}}>{Icons.times}</FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity style = {{backgroundColor: "rgba(215, 44, 0, 0.7)", borderRadius: 50, padding: 20}} onPress = {() => this.setState({endRouteDialog: true})}>
            <FontAwesome style = {{fontSize: 30}}>{Icons.checkCircle}</FontAwesome>
          </TouchableOpacity>
        </View>
      )
    } else {
      return(
          <TouchableOpacity style = {styles.button} onPress = {this.showRegisterForm.bind(this)}>
            <Text style = {{textAlign:"center", fontSize: 15, color: "white"}}> INICIAR RUTA  <FontAwesome style = {{fontSize: 20}}>{Icons.rocket}</FontAwesome> </Text>
          </TouchableOpacity>
      );
    }
  }

  sendToQR(){
    const navigateAction = NavigationActions.navigate({
        routeName: "QR", 
        params: {
          lat: this.state.lat, 
          lng: this.state.lng
        }
    });

    this.props.navigation.dispatch(navigateAction);
  }

  sendToIncident(){
    const navigateAction = NavigationActions.navigate({
        routeName: "Incident", 
        params: {
          lat: this.state.lat, 
          lng: this.state.lng,
        }
    });

    this.props.navigation.dispatch(navigateAction);
  }

  showRegisterForm(){
    this.setState({showRegisterForm: !this.state.showRegisterForm})
  }

  showMap(){
      // const mark = this.state.markers.map(x => {
      //   return {latitude: x.lat, longitude: x.lng}
      // });


      return (
        <MapView
            showsUserLocation
            customMapStyle = {MapStyle}
            style={ styles.map}
            initialRegion={this.state.region}
            onRegionChange={this.onRegionChange.bind(this)}
        >
         {this.state.markers.map(marker => (
              <View>
                <Marker
                    coordinate={{
                      latitude: marker.lat,
                      longitude: marker.lng
                    }}
                    pinColor = {marker.client == "BASURA" ? "green" : marker.fallida ?  "red" : "black"}
                    title={marker.client}
                />
              </View>
          ))}
        </MapView>
      )
  }
  
  handleLogout(){
    setTimeout(()=> {
        this.setState({showModal: true})
    }, 3000)
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  renderCheckBox(){
      const {companies} = this.state;

      return companies.map(x => {
        return(
          <ScrollView style = {{flex: 1, marginTop: 10}}>
            <Text style = {{color: "gray", marginLeft: 15, marginBottom: 10, fontSize: 18}}> {x} </Text>
          </ScrollView>
        );
      })
  }

  render(){
    const {latitudeDelta, longitudeDelta, latitude, longitude} = this.state;
    console.log(this.state.routeID);
    console.log(this.state.markers);
    console.log(this.state.region);

    return(
        <View style = {{flex: 1}}>

          <StatusBar hidden= {true} />
          {this.showMap()}
          { this.state.startedRoute ?
            <View style = {{marginTop: 20, flexDirection: "row", justifyContent: "space-between"}}>
              <TouchableOpacity style ={{marginLeft: 16}} onPress = {() => this.setState({showList: true})}>
                <FontAwesome style = {{fontSize: 26}}>{Icons.list}</FontAwesome>
              </TouchableOpacity>

              <TouchableOpacity style ={{marginRight: 16}} onPress= {this.getStops.bind(this, this.state.routeID)}>
                <FontAwesome style = {{fontSize: 26}}>{Icons.repeat}</FontAwesome>
              </TouchableOpacity>
            </View> :
            null
          }

          <View style = {{marginTop: 25}}>
            <Text>{this.state.lat}, {this.state.lng}</Text>
            <Text>{this.state.routeID}, {this.state.startedRoute}</Text>
            <Text>{this.state.markers.length}</Text>
          </View>

          {this.routeOrQR()}

          <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={"Cantidad de gasolina"}
            message={"Que cantidad de gasolina se deposito al vehiculo?"}
            hintInput ={"Litros de gasolina"}
            cancelText ="Cancelar"
            submitText = "Registrar"
            initValueTextInput = {0}
            submitInput={ (input) => this.postTrashOrGas(input)}
            closeDialog={ () => this.setState({isDialogVisible: false})}>
          </DialogInput>


          <DialogInput isDialogVisible={this.state.endRouteDialog}
            title={"Gasolina total"}
            message={"Cuanta gaolina tiene el camión?"}
            hintInput ={"Litros de gasolina"}
            cancelText ="Cancelar"
            submitText = "Registrar"
            initValueTextInput = {0}
            submitInput={ (input) => this.finishRoute(input)}
            closeDialog={ () => this.setState({endRouteDialog: false})}>
          </DialogInput>

          <Modal
            animationType="slide"
            visible = {this.state.showRegisterForm}
          >
              <RouteModal 
                formFilled = {this.validateForm.bind(this)} 
                showRegisterForm= {this.showRegisterForm.bind(this)}
                currentUser = {this.state.currentUser}
              />
          </Modal>
          
          <Modal visible = {this.state.showList}>
            <View style = {{flex: 1}}>
              <TouchableOpacity style = {{margin: 15}} onPress = {() => this.setState({showList: false})}>
                <Text style = {{fontSize: 20}}>X</Text>
              </TouchableOpacity>

              {this.renderCheckBox()}
            </View>
          </Modal>
        </View>
    );
  }
}

const styles = {
  images: {
    height: 200
  },
  albumImage:{
    height: 220,
    flex: 1,
    width: null
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    backgroundColor: "black",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginLeft: 45,
    marginRight: 45,
    padding: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
}

export default Intro;

