import React, {Component} from "react";
import {View, Text, SectionList, TouchableOpacity, Switch, ScrollView, Dimensions, Image, AsyncStorage, Alert} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome, {Icons} from "react-native-fontawesome";
import {NavigationActions, NavigationEvents} from "react-navigation";
import Url from "./reusable/urls";

var imageFile = require('./reusable/QRO.jpg');

class Settings extends Component{

  constructor(props){
    super(props);
    this.state = {
      notifications: false, currentUser: "",
      currentToken: "", email: "",
      lastName: "", firstName: "", imageUri: "a"
    }
  }















































































































































































































































































































































































































































  async getUser(){
      this._isMounted = true;

      const userGet = await AsyncStorage.getItem('username');
      this.setState({ currentUser: userGet});

      const imageGet = await AsyncStorage.getItem('image');
      this.setState({ imageUri: imageGet});

      const tokenGet = await AsyncStorage.getItem('token');
        if (tokenGet) {
          this.setState({ currentToken: tokenGet });
        } else {
          this.setState({ currentToken: false });
      }
      // setTimeout(() => {this.setState({wating: false})}, 4000)

      return fetch(`http://${Url}:8000/users/${this.state.currentUser}/`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "Authorization": `Token ${this.state.currentToken}`
        }
      })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes)
        if(this._isMounted){
          this.setState({
                currentUser: jsonRes.user.username,
                email: jsonRes.user.email,
                lastName: jsonRes.user.last_name,
                firstName: jsonRes.user.first_name,
          })
        }
      })
      .catch(error => console.log(error));
  }


  componentDidMount(){
    this.getUser()
  }

  logoutAlert(){
      return Alert.alert(
          "Seguro que quieres cerrar sesion?",
          "Presiona SI para finalizar sesion",
        [
          {text: 'SI' , onPress: this.handleLogout.bind(this)},
          {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
        ],
        {cancelable: true},
      );
  }


  handleLogout(){
    try {
     AsyncStorage.removeItem("username");
     AsyncStorage.removeItem('token');
    } catch (error) {
    console.log(error.message);
    }

    const navigateAction = NavigationActions.navigate({
        routeName: "Login"
    })
    this.props.navigation.dispatch(navigateAction);
  }

  render(){
    const {currentUser, email, lastName, firstName, token, imageUri} = this.state;
    console.log(this.state.currentToken);

    return(
      <LinearGradient style = {{flex: 1}} start={{x: 0, y: 0}} end={{x: 4 , y: 1}} colors = {[ "white", "gray"]}>
        <View>
          <Text style ={{alignSelf: "center", fontSize: 25, marginTop: 20}}>Serecsin </Text>
        </View>

        <View style= {{flexDirection: "row", marginLeft: 30, marginTop: 40}}>
          <Image style={styles.imageStyle} source={{uri: "https://www.stickpng.com/assets/images/585e4bcdcb11b227491c3396.png"}}/>

          <View style= {{marginLeft: 20, marginTop: 5}}>
            <Text style ={{ fontSize: 20, marginBottom: 10}}> {currentUser}</Text>
          </View>
        </View>

        <TouchableOpacity style = {{position: "absolute", left: 0, bottom: 0, right:0, backgroundColor: "black", padding: 17, margin: 15}} onPress= {this.logoutAlert.bind(this)}>
          <Text style= {{textAlign: "center", color:"white", fontSize: 17}}> Cerrar sesión <FontAwesome style = {{marginRight: 5, fontSize: 20}}>{Icons.signOut}</FontAwesome></Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

const styles = {
  button: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color:"#ffff",
    textAlign: "center",
    fontSize: 20
  },
  imageStyle:{
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    marginRight: 10
  },
}


export default Settings;
