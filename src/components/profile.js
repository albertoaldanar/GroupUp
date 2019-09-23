import React, {Component} from "react";
import {View, Text, Dimensions, Image, TouchableOpacity} from "react-native";
import Header from "./reusable/header";
import FontAwesome, {Icons} from "react-native-fontawesome";
import LinearGradient from "react-native-linear-gradient";
import { NavigationActions } from 'react-navigation';
import Calendar from 'react-native-calendar-select';

class Profile extends Component{
  constructor(props){
    super(props);
    this.state= {
      startDate: null,
      endDate: null,
      open: false
    }

    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  confirmDate({startDate, endDate, startMoment, endMoment}) {
    this.setState({
      startDate,
      endDate
    });
  }

  sendToSteps(){
    const navigateAction = NavigationActions.navigate({
      routeName: "CustomBooking"
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render(){
    console.log(this.state.startDate, this.state.endDate);
    let customI18n = {
      'w': ['', 'Lun', 'Mar', 'Mie', 'Juev', 'Vie', 'Sab', 'Dom'],
      'weekday': ['', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
      'text': {
        'start': 'Inicio',
        'end': 'Fin',
        'date': 'Fecha',
        'save': 'Confirmar',
        'clear': 'Borrar'
      },
      'date': 'DD / MM'
    };

    let color = {
      subColor: '#f0f0f0'
    };

    return(
      <View>
        <Header awesome ={Icons.bell}>
          Mi perfil
        </Header>

        <LinearGradient colors= {["#FF8C00", "#FFA500"]}>
          <View style = {styles.container}>
            <Image
              style = {styles.image}
              source ={{uri: "https://img.kpopmap.com/2017/09/chorry.jpg"}}
            />
            <View>
              <Text style = {styles.firstText}>Alejandra Jimenez</Text>
              <Text style = {styles.secondText}>@alejandrajimenez</Text>
              <Text style = {styles.location}>Veracruz, VER, MX</Text>
            </View>
          </View>
        </LinearGradient>

        <TouchableOpacity onPress = {this.openCalendar}>
          <Text>CALENDAR</Text>
        </TouchableOpacity>

        <View>
          <Calendar
              i18n="en"
              ref={(calendar) => {this.calendar = calendar;}}
              customI18n={customI18n}
              color={color}
              format="YYYYMMDD"
              minDate="20170510"
              maxDate="20180312"
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onConfirm={this.confirmDate}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width*4.5/7,
    flexDirection: "column",
    padding: 10,
    paddingBottom: 20,
    alignItems: "center"
  },
  image: {
    alignSelf: "center",
    width: 100,
    height: 100,
    marginBottom: 20,
    paddingTop: 10
  },
  firstText: {
    color: "#ffff",
    fontWeight: "bold",
    fontSize: 20
  },
  secondText: {
    color: "#ffff",
    textAlign: "center"
  },
  location: {
    fontWeight: "100",
    color: "#ffff",
    textAlign: "center"
  }
}

export default Profile;
