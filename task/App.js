import {StatusBar,View} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import Welcome from "./src/Welcome";
import Login from "./src/Login"
import Signup from "./src/Signup"
import Home from "./src/Pages/Home"
import DarkHome from "./src/Dark/Home";
import Calendar from "./src/Pages/Calendar"
import DarkCalendar from "./src/Dark/Calendar"
import Network from "./src/Pages/Network"
import DarkNetwork from "./src/Dark/Network"
import Profile from "./src/Pages/Profile"
import DarkProfile from "./src/Dark/Profile"

export default function App() {
  const [page,setPage] = React.useState("Welcome");
  const [mode,setMode] = React.useState(true);

  if(mode){
    return (
      <View style={{paddingTop:StatusBar.currentHeight,backgroundColor:"#f0f0f0",height:"100%"}}>
        <StatusBar translucent={true} backgroundColor={'#A58AE0'}/>
        {page=="Welcome" && <Welcome setPage={setPage}/>}
        {page=="Login" && <Login setPage={setPage}/>}
        {page=="Signup" && <Signup setPage={setPage}/>}
        {page=="Home" && <DarkHome setPage={setPage}/>}
        {page=="Calendar" && <DarkCalendar setPage={setPage}/>}
        {page=="Network" && <DarkNetwork setPage={setPage}/>}
        {page=="Profile" && <DarkProfile setPage={setPage} setMode={setMode} mode={mode}/>}
        <LinearGradient
          colors={['#ffffff','#f9f9f9','#f5f5f5','#A58AE0']}
          style={{position: 'absolute',left: 0,right: 0,top: 0,height: "150%",zIndex:10}}
          start={[0, 0]}
          end={[1, 0.5]}
        />
      </View>
    );
  }else{
    return (
      <View style={{paddingTop:StatusBar.currentHeight,backgroundColor:"#f0f0f0",height:"100%"}}>
        <StatusBar translucent={true} backgroundColor={'#A58AE0'}/>
        {page=="Welcome" && <Welcome setPage={setPage}/>}
        {page=="Login" && <Login setPage={setPage}/>}
        {page=="Signup" && <Signup setPage={setPage}/>}
        {page=="Home" && <Home setPage={setPage}/>}
        {page=="Calendar" && <Calendar setPage={setPage}/>}
        {page=="Network" && <Network setPage={setPage}/>}
        {page=="Profile" && <Profile setPage={setPage} setMode={setMode} mode={mode}/>}
        <LinearGradient
          colors={['#ffffff','#f9f9f9','#f5f5f5','#A58AE0']}
          style={{position: 'absolute',left: 0,right: 0,top: 0,height: "150%",zIndex:10}}
          start={[0, 0]}
          end={[1, 0.5]}
        />
      </View>
    );
  }
}
