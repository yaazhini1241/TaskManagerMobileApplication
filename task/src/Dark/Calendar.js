import url from "../api"
import React from 'react'
import axios from 'axios';
import {ScrollView,View,StyleSheet, Text ,Image,Pressable,BackHandler,ToastAndroid} from 'react-native';
import {Calendar} from 'react-native-calendars';
import home from "../../assets/Navbar/home.png"
import calendar from "../../assets/Navbar/calendaractive.png"
import network from "../../assets/Navbar/network.png"
import profile from "../../assets/Navbar/profile.png"
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Calendar_Page = ({setPage}) => {
   const [task,setTask] = React.useState({})
   const [show,setShow] = React.useState({})
   const [selected, setSelected] = React.useState(Date.name);

   const dateChange = (date)=>{
      const today = []
      task.map((i)=>{
         if(moment(i.rem).format('LL') == moment(date).format('LL')){
            today.push(i)
         }
      })
      setShow(today)
   }


   React.useEffect(() => {
      async function data(){
         const udata = JSON.parse(await AsyncStorage.getItem('user'))
         axios.post(url+`/task?uid=${udata[0].id}`, {})
         .then(function (res) {
            setTask(res.data)
            const today = []
            res.data.map((i)=>{
               if(moment(i.rem).format('LL') == moment(new Date().toISOString()).format('LL')){
                  today.push(i)
               }
            })
            setShow(today)
         })
         .catch(function (error) {
            ToastAndroid.show('Network Error', ToastAndroid.LONG);
         });
      }
      data();
   }, []);

   function backEvent(){
      setPage("Home");
      return true;
   }
   
   React.useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backEvent);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backEvent);
      };
    }, []);

   const marked = React.useMemo(() => ({
      [selected]: {
         selected: true,
         selectedColor: '#8C68DB',
         selectedTextColor: '#ffffff',
      },
   }), [selected]);

   return (
    <>
      <View style={{zIndex:100,flex: 1,height:"100%"}}>
         <View style={{height:"100%",backgroundColor:"#222"}}>
            <Calendar 
               theme={{
                  calendarBackground: '#222',
                  dayTextColor: '#fff',
                  textDisabledColor: '#444',
                  monthTextColor: '#888'
               }} 
               markedDates={marked} onDayPress={(day) =>{setSelected(day.dateString);dateChange(day.dateString)}
            }/>
            <ScrollView>
               
            <View style={{marginTop:10,marginBottom:100}}>
            {(show.length>0)?show.map((i)=>
               <Pressable  key={i.id} style={{borderWidth:1,borderColor:"#ccc",margin:10,borderRadius:5,backgroundColor:i.color,padding:10}}>
                  {
                     (i.type=="completed")?
                     <View>
                        <Text style={{fontSize:22,fontWeight:"600",color:"#fff",textDecorationLine:"line-through"}}>{i.title}</Text>
                        <Text style={{fontSize:16,color:"#fff",paddingTop:10,textDecorationLine:"line-through"}}>{i.content}</Text>
                     </View>
                     :
                     <View>
                        <Text style={{fontSize:22,fontWeight:"600",color:"#fff"}}>{i.title}</Text>
                        <Text style={{fontSize:16,color:"#fff",paddingTop:10}}>{i.content}</Text>
                        {(i.img=="no")?"":
                        <View style={{alignItems:"center",marginTop:10}}>
                           <Image source={{uri:`${url}/${i.img}.jpg`}} style={{width:280,height:210}}/>
                        </View>
                        }
                     </View>
                  }
               </Pressable>
            ):<Text style={{fontSize:22,color:"#aaa",textAlign:"center",paddingTop:50}}>Nothing Found!</Text>}
            </View>

            </ScrollView>
         </View>

         <View style={{backgroundColor:"#8C68DB",height:60,position:"absolute",right: 0, bottom:0}}>
            <View style={{backgroundColor:"#8C68DB",flex:1,flexDirection:"row",alignItems:"center"}}>
               <Pressable onPress={()=>{setPage("Home")}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                  <Image source={home} style={{width:40,height:40}}/>
               </Pressable>
               <Pressable onPress={()=>{setPage("Calendar")}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                  <Image source={calendar} style={{width:40,height:40}}/>
               </Pressable>
               <Pressable onPress={()=>{setPage("Network")}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                  <Image source={network} style={{width:40,height:40}}/>
               </Pressable>
               <Pressable onPress={()=>{setPage("Profile")}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                  <Image source={profile} style={{width:40,height:40}}/>
               </Pressable>
            </View>
         </View>
      </View>
    </>
   )
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       justifyContent: 'center',
   },
});

export default Calendar_Page