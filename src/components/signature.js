import React, {Component} from "react";
import {View, Text, SectionList, TouchableOpacity, Switch, ScrollView, Dimensions, Image, AsyncStorage, Alert, TouchableHighlight} from "react-native";
import FontAwesome, {Icons} from "react-native-fontawesome";
import {NavigationActions, NavigationEvents} from "react-navigation";
import SignatureCapture from 'react-native-signature-capture';

class Signature extends Component{

  constructor(props){
    super(props);
    this.state ={ show: false}
  }

  onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
      return Alert.alert(
          "Listo!",
          "Firma guardada.",
        [
          {text: 'Continuar' , onPress: this.props.saveSignature.bind(this, result.encoded)},
        ],
        {cancelable: false},
      );
  }

  sendConsole(){
    console.log("OLAAAAA")
  }


  onDragEvent() {
         // This callback will be called when the user enters signature
    console.log("dragged");
  }

  render(){
    return(
      <View style = {{flex: 1, backgroundColor: "white", flexDirection: "column"}}>
            <SignatureCapture
              style={[{flex:1},styles.signature]}
              ref="sign"
              onSaveEvent={this.onSaveEvent.bind(this)}
              onDragEvent={this.onDragEvent}
              saveImageFileInExtStorage={false}
              showNativeButtons={true}
              showTitleLabel={false}
              viewMode={"portrait"}
            />

           <View style={{position: "absolute", bottom: 10, left: 0, right: 0}}>
              <TouchableOpacity onPress={this.props.closeModal}>
                <Text style ={{fontSize: 18, alignSlef: "center"}}>Cerrar  <FontAwesome>{Icons.times}</FontAwesome></Text>
              </TouchableOpacity>
          </View>
      </View>
    );
  }

  saveSign() {
      this.refs["sign"].saveImage();
  }

  resetSign() {
      this.refs["sign"].resetImage();
  }
}

const styles = {

  signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
  },
  buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
  }
}


export default Signature;