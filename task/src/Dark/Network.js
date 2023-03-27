import url from "../api"
import React from 'react'
import axios from 'axios';
import {ScrollView,View, Text,TextInput ,Image,Pressable,BackHandler,ToastAndroid} from 'react-native';
import home from "../../assets/Navbar/home.png"
import calendar from "../../assets/Navbar/calendar.png"
import network from "../../assets/Navbar/networkactive.png"
import profile from "../../assets/Navbar/profile.png"
import AsyncStorage from '@react-native-async-storage/async-storage';


function Friend({data}){
   return(
      <View style={{flex:1,flexDirection:"row",justifyContent:"center",height:80,width:"100%",backgroundColor:"#666",borderWidth:1,borderColor:"#aaa",alignItems:"center",borderRadius:10,marginBottom:10}}>
         <View style={{flex:1,alignItems:"center",flexDirection:"row",position:"absolute",left:10}}>
            <Image source={{uri:`${url}/${data.profile}.jpg`}} style={{backgroundColor:"#fff",borderWidth:1,height:50,width:50,borderColor:"#aaa",borderRadius:50}}/>
            <Text style={{fontSize:18,color:"#fff",paddingLeft:10}}>{data.fname+" "+data.lname}</Text>
         </View>
         <View style={{flex:1,alignItems:"center",position:"absolute",right:10}}>
            <Text style={{fontSize:12,color:"#ccc"}}>Credits</Text>
            <Text style={{fontSize:22,color:"#fff"}}>{data.credit}</Text>
         </View>
      </View>
   )
}

function Result({data,netre,user,setNewList}){
   async function addFriend(fid){
      axios.post(url+`/network/add?uid=${user.id}&fid=${fid}`, {})
      .then(function (res) {
         ToastAndroid.show('Friend Added', ToastAndroid.LONG);
         setNewList([])
         netre()
         setSearch("")
      })
      .catch(function (error) {
         ToastAndroid.show('Network Error', ToastAndroid.LONG);
      });
   }
   return(
      <View style={{flex:1,flexDirection:"row",justifyContent:"center",height:80,width:"100%",backgroundColor:"#666",borderWidth:1,borderColor:"#aaa",alignItems:"center",borderRadius:10,marginBottom:10}}>
         <View style={{flex:1,alignItems:"center",flexDirection:"row",position:"absolute",left:10}}>
            <Image source={{uri:`${url}/${data.profile}.jpg`}} style={{backgroundColor:"#fff",borderWidth:1,height:50,width:50,borderColor:"#aaa",borderRadius:50}}/>
            <Text style={{fontSize:18,color:"#fff",paddingLeft:10}}>{data.fname+" "+data.lname}</Text>
         </View>
         <Pressable onPress={()=>{addFriend(data.id)}} style={{flex:1,alignItems:"center",position:"absolute",right:10}}>
            <Text style={{fontSize:22,color:"#ccc",padding:10,backgroundColor:"#8C68DB",borderRadius:5,color:"#fff"}}>Add</Text>
         </Pressable>
      </View>
   )
}

const Network = ({setPage}) => {
   const [user,setUser] = React.useState({})
   const [net,setNet] = React.useState({})
   const [newList,setNewList] = React.useState([])
   const [search,setSearch] = React.useState()
   React.useEffect(() => {
      async function data(){
         const udata = JSON.parse(await AsyncStorage.getItem('user'))
         setUser(udata[0]);
         axios.post(url+`/network?uid=${udata[0].id}`, {})
         .then(function (res) {
            setNet(res.data);
         })
         .catch(function (error) {
            ToastAndroid.show('Network Error', ToastAndroid.LONG);
         });
      }
      data();
      axios.post(url+`/network?uid=${user.id}`, {})
      .then(function (res) {
         setNet(res.data);
      })
      .catch(function (error) {
         ToastAndroid.show('Network Error', ToastAndroid.LONG);
      });
   }, []);
   async function netre(){
      axios.post(url+`/network?uid=${user.id}`, {})
      .then(function (res) {
         setNet(res.data);
      })
      .catch(function (error) {
         ToastAndroid.show('Network Error', ToastAndroid.LONG);
      });
   }
   async function CallSearch(text){
      setSearch(text);
      axios.post(url+`/search?name=${search}&uid=${user.id}`, {})
      .then(function (res) {
         setNewList(res.data)
      })
      .catch(function (error) {
         ToastAndroid.show('Network Error', ToastAndroid.LONG);
      });
   }
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
   
   return (
    <>
      <ScrollView style={{zIndex:100,backgroundColor:"#222",height:"auto",width:"100%",marginBottom:60}}>
         <View style={{margin:15}}>
            <TextInput onChangeText={text=>{CallSearch(text)}} placeholder='Search' style={{marginBottom:15,borderWidth:1,borderColor:"#8C68DB",borderRadius:5,padding:10,backgroundColor:"#444",color:"#fff",fontSize:20}}/>

            {(newList.length>0)?newList.map((i)=><Result key={i.id} setSearch={setSearch}  setNewList={setNewList} user={user} netre={netre} data={i}/>):""}
         
            {(net.length>0)?net.map((i)=><Friend key={i.id} data={i}/>):""}

            {(net.length==0)?<Text style={{fontSize:22,color:"#aaa",textAlign:"center"}}>Nothing Found!</Text>:""}
         </View>
      </ScrollView>

      <View style={{zIndex:100,backgroundColor:"#8C68DB",height:60,position:"absolute",right: 0, bottom:0}}>
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
    </>
   )
}
export default Network