import React, {Component} from "react";
import {View, Text, SectionList, TouchableOpacity, Switch, ScrollView, TextInput, Slider, Alert, AsyncStorage} from "react-native";
import FontAwesome, {Icons} from "react-native-fontawesome";
import Url from "./urls";
import * as firebase from 'firebase';
import 'firebase/firestore';

class RouteModal extends Component{

  constructor(props){
    super(props);
    this.state = {
      notifications: false,
      bus: "", km: 0, helper:"", helper2: "", gas: 1, gasStirng: "Vacio a 1/4"
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


  postBusroute(){
    const {bus, km, helper, helper2, gasStirng} = this.state;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var month = new Date().getMonth() +1 ;

    var year = new Date().getFullYear();



    if(bus && helper && km > 0){

      const rutaID = Math.floor((Math.random() * 10000000) + 1);
      const dbRuta = firebase.firestore().collection('ruta');


      dbRuta.add({
          user: this.props.currentUser, bus: bus, km: km, helper: helper, helper_b: helper2,
          gas: gasStirng, start: dateTime, año: year, id: rutaID, mes: month
      });

      try {
          AsyncStorage.setItem('ruta', rutaID.toString());
          AsyncStorage.setItem('started', "True");
          
      } catch (error) {
              console.log(error.message);
          }


      this.props.formFilled
      
      return this.alerts(rutaID)

      // return fetch(`http://${Url}:8000/post_busroute/`, {
      //   method: "POST",
      //   headers: {
      //       "Accept": "application/json",
      //       "Content-type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     user: this.props.currentUser, bus: bus, km: km, helper: helper, helper_b: helper2,
      //     gas: gasStirng, start: dateTime, 
      //   })
      // })
      // .then(res => res.json())
      // .then(jsonRes => {
      //   console.log(jsonRes)
        
      // })
      // .catch(error => console.log(error));
    } else {
        return  Alert.alert(
                "Registro invalido",
                "Llene todos los campos para iniciar ruta",
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
        );
      }
  }

  onChangeInput = (state) => (event,value) => {
    this.setState({
      [state]:event
    });
  }

  alerts(id){
    
    return Alert.alert(
          "Listo",
          "Presiona OK para iniciar ruta",
        [
          {text: 'OK' , onPress: this.props.formFilled},
        ],
        {cancelable: false},
    );

  }

  changeGas(gas){
    this.setState({gas})
    if(gas== 1){
      this.setState({gasStirng: "Vacio a 1/4"})
    } else if(gas== 2){
        this.setState({gasStirng: "1/4 a mitad"})
    } else if(gas== 3){
        this.setState({gasStirng: "Mitad a 3/4"})
    } else if(gas== 4){
        this.setState({gasStirng: "3/4 a lleno"})
    }
  }

  render(){
    const {bus, helper2, helper, km} = this.state;
    console.log(this.props.currentUser);

    return(
      <View style = {{backgroundColor: "white", flex: 1}}>
          <TouchableOpacity style = {styles.button} onPress = {this.props.showRegisterForm}>
            <Text style = {{color: "black", fontSize: 25}}> X </Text>
          </TouchableOpacity>

          <Text style = {{alignSelf: "center", fontSize: 19, marginTop: 10}}>Registro para iniciar ruta</Text>

          <View style = {styles.inputs}>
            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, marginBottom: 35, color: "black"}}
              placeholder = "Nombre de unidad"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('bus')}
              value = {bus}
              returnKeyType={ 'done' }
            />

            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35,}}
              placeholder = "Ayudante"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('helper')}
              value = {helper}
              returnKeyType={ 'done' }
            />
            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35 }}
              placeholder = "Ayudante 2 (Si hay)"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              onChangeText ={this.onChangeInput('helper2')}
              value = {helper2}
              returnKeyType={ 'done' }
            />
            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 0.5, color:"white", color: "black", marginBottom: 35}}
              placeholder = "Kilometraje"
              placeholderTextColor = "gray"
              autoCapitalize = 'none'
              keyboardType='numeric'
              onChangeText ={this.onChangeInput('km')}
              value = {km}
              returnKeyType={ 'done' }
            />
            <View>
              <Text style = {{ color: "gray"}}> Nivel de gasolina</Text>
              <Slider
                step= {1}
                style ={{marginLeft: 5, marginRight: 5, marginTop: 10, marginBottom: 4}}
                maximumValue={4}
                minimumValue = {1}
                thumbTintColor = "rgba(185,216,230 ,0.8)"
                minimumTrackTintColor = "rgba(185,216,230 ,0.8)"
                onValueChange={this.changeGas.bind(this)}
                value={this.state.gas}
                thumbStyle ={{color: "rgba(185,216,230 ,0.8)"}}
              />
              <Text style = {{alignSelf: "center", color: "gray"}}> {this.state.gasStirng} <FontAwesome>{Icons.bus}</FontAwesome></Text>
            </View>
          </View>

          <TouchableOpacity style = {styles.startButton} onPress = {this.postBusroute.bind(this)}>
            <Text style = {{textAlign:"center", fontSize: 19, color: "white"}}>Iniciar</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  button: {
      marginLeft:20,
      marginTop:15
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "black",
    margin: 15
  }
}

export default RouteModal;
