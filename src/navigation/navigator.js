import React, {Component} from "react";
import { addNavigationHelpers, StackNavigator, createBottomTabNavigator, NavigationActions, TabBarBottom} from 'react-navigation';
import Intro from "../components/intro";
import QR from "../components/qr";
import Stop from "../components/stop";
import Login from "../components/login";
import Wating from "../components/wating";
import Settings from "../components/settings";
import Signature from "../components/signature";
import Incident from "../components/incident";
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {View, Modal} from "react-native";

export const MainScreen = createBottomTabNavigator({

  Intro: {
    screen: Intro,
    navigationOptions: {
      title: "Map",
      tabBarLabel: "RUTA",
      tabBarIcon: ({focused, tintColor}) => <FontAwesome style = {{color: tintColor, fontSize: 25}}>{Icons.mapMarker}</FontAwesome>
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      tabBarLabel: "USUARIO",
      tabBarIcon: ({focused, tintColor}) => <FontAwesome style = {{color: tintColor, fontSize: 25}}>{Icons.user}</FontAwesome>
    }
  },
},
  //Diseño custom del tabBar
    {
      tabBarOptions: {
          showLabel: true,
          activeTintColor: 'black',
          inactiveTintColor: 'gray',
          showIcon : true,
          style: {
              backgroundColor: "white",
              height: 55,
              borderTopColor: 'transparent',
              borderTopWidth: 0,
              paddingRight: 10,
              paddingLeft: 10,
              borderTopColor: "grayPlaceHolder",
          },
      }
    }
);

export const AppNavigatorLogin = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  MainScreen: {
    screen: MainScreen,
      navigationOptions:{
        gesturesEnabled: false,
      // title: "",
      // headerStyle: {
      //   backgroundColor: "black",
      //   borderBottomColor: "black",
      //   elevation: 3
      // },
      // headerTintColor: "#7DDECC",
        header: null
      }
  },
  Wating: {
    screen: Wating,
    navigationOptions: {
      header: null
    }
  },
  QR: {
    screen: QR,
    navigationOptions: {
      title: "Registro"
    }
  },
  Stop: {
    screen: Stop,
    navigationOptions: {
      title: "Registro de parada"
    }
  }, 
  Incident: {
    screen: Incident, 
    navigationOptions: {
      title: "Registro de incidentes"
    }
  }

});

export const AppNavigatorMain = StackNavigator({

  MainScreen: {
    screen: MainScreen,
      navigationOptions:{
        gesturesEnabled: false,
      // title: "",
      // headerStyle: {
      //   backgroundColor: "black",
      //   borderBottomColor: "black",
      //   elevation: 3
      // },
      // headerTintColor: "#7DDECC",
        header: null
      }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  Wating: {
    screen: Wating,
    navigationOptions: {
      header: null
    }
  },
  QR: {
    screen: QR,
    navigationOptions: {
      title: "Registro"
    }
  },
  Stop: {
    screen: Stop,
    navigationOptions: {
      title: "Registro de parada"
    }
  }, 
  Signature:{
    screen: Signature,
    navigationOptions: {
      title: "Signature"
    }
  },
  Incident: {
    screen: Incident, 
    navigationOptions: {
      title: "Registro de incidentes"
    }
  }

});


