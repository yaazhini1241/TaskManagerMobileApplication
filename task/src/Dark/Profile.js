import url from "../api"
import React from 'react'
import axios from 'axios';
const FormData = require('form-data');
import {Modal,ScrollView,View,Switch, TextInput,Text ,Image,Pressable,BackHandler,ToastAndroid} from 'react-native';
import home from "../../assets/Navbar/home.png"
import calendar from "../../assets/Navbar/calendar.png"
import network from "../../assets/Navbar/network.png"
import profile from "../../assets/Navbar/profileactive.png"
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({setPage , setMode , mode}) => {
   const [isEnabled, setIsEnabled] = React.useState(mode);
   const toggleSwitch = () =>{
      setMode(!mode)
   };
   const [modalVisible, setModalVisible] = React.useState(false);
   const [fname,setFname] = React.useState("")
   const [lname,setLname] = React.useState("")
   const [email,setEmail] = React.useState("")
   const [image, setImage] = React.useState(null);

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 4],
         quality: 1,
      });

      if (!result.canceled) {
         setImage(result.assets[0].uri);
      }
   };
   const [user,setUser] = React.useState({})
   const storeData = async (res) => {
      try {
        const data = JSON.stringify(res.data)
        await AsyncStorage.setItem('user', data);
      } catch (e) {
         ToastAndroid.show('Network Error', ToastAndroid.LONG);
      }
   }
   React.useEffect(() => {
      async function data(){
         const jsonValue = JSON.parse(await AsyncStorage.getItem('user'))
         axios.post(url+`/login?email=${jsonValue[0].email}&password=${jsonValue[0].password}`, {})
         .then(function (res) {
            storeData(res)
         })
         .catch(function (error) {
            ToastAndroid.show('Network Error', ToastAndroid.LONG);
         });
         const udata = JSON.parse(await AsyncStorage.getItem('user'))
         setUser(udata[0]);
         setFname(udata[0].fname)
         setLname(udata[0].lname)
         setEmail(udata[0].email)
         setImage(`${url}/${udata[0].profile}.jpg`)
      }
      data();
   }, []);

   async function logout(){
      await AsyncStorage.removeItem('user');
      setPage("Welcome");
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

   const profileUpdate =()=>{
      const formData = new FormData();
      formData.append('img',{
         uri : image,
         type : 'image/jpeg',
         name : 'image.jpg'
     });
      const unique =new Date().valueOf();
      axios.post(`${url}/update?fname=${fname}&lname=${lname}&email=${email}&unique=p${unique}${user.id}&id=${user.id}`, 
      formData,{
         headers: {"Content-Type":"multipart/form-data"}
      }
      ).then(function (res) {
         ToastAndroid.show('Profile Updated!', ToastAndroid.LONG);
         setPage("Home")
      })
      .catch(function (error) {
         ToastAndroid.show("Network Error", ToastAndroid.LONG)
      });

   }
   return (
    <>
      <Modal
         animationType="slide"
         transparent={false}
         visible={modalVisible}
         onRequestClose={() => {
            setModalVisible(!modalVisible);
         }}
      >
         <View style={{height:"100%"}}>
            <ScrollView style={{backgroundColor:"#222",borderRadius:10,borderWidth:1,borderColor:"#aaa",padding:10}}>
               <Text style={{fontSize:28,fontWeight:"600",color:"#8C68DB",marginBottom:40,marginTop:20,textAlign:"center"}}>Edit Profile</Text>
               <TextInput 
                  style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
                  onChangeText={setFname}
                  placeholder="First Name"
                  keyboardType="text"
                  defaultValue={fname}
               />
               <TextInput 
                  style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
                  placeholder="Last Name"
                  keyboardType="text"
                  defaultValue={lname}
                  onChangeText={setLname}
               />
               <TextInput 
                  style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
                  placeholder="Email"
                  keyboardType="text"
                  defaultValue={email}
                  onChangeText={setEmail}
               />
               <Pressable onPress={pickImage} style={{marginBottom:300}} >
                  <Text style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#aaa"}} >Set Image</Text>
                  <View style={{alignItems:"center"}}>
                     {image && <Image source={{ uri: image }} style={{ width:200, height: 200 }} />}
                  </View>
               </Pressable>

            </ScrollView>
            <View style={{position:"absolute",bottom:0,right:0,left:0,paddingLeft:20,paddingRight:20,backgroundColor:"#222"}}>
               <Pressable style={{marginTop:20}} onPress={profileUpdate}>
                  <Text style={{marginBottom:10,backgroundColor:"#8C68DB",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#fff",textAlign:"center"}} >Update</Text>
               </Pressable>
               <Pressable  >
                  <Text onPress={() => setModalVisible(false)} style={{marginBottom:20,backgroundColor:"#ff0000",borderWidth:1,borderColor:"red",borderRadius:10,padding:10,fontSize:20,color:"#fff",textAlign:"center"}} >Cancel</Text>
               </Pressable>
            </View>
         </View>
      </Modal>

      <ScrollView style={{zIndex:100,backgroundColor:"#222",height:"auto",width:"100%",marginBottom:60}}>
         
         <View style={{alignItems:"center",margin:20}}>
            <Image source={{uri:`${url}/${user.profile}.jpg`}} style={{width:200,height:200,backgroundColor:"#fff",borderWidth:1,borderColor:"#aaa",borderRadius:100}}/>
         </View>
         <Text style={{fontSize:22,paddingBottom:5,color:"#8C68DB",textAlign:"center"}}>{user.fname+" "+user.lname}</Text>
         <Text style={{fontSize:22,paddingBottom:10,color:"#aaa",textAlign:"center"}}>{user.email}</Text>
         <Text style={{fontSize:22,paddingTop:20,paddingBottom:10,color:"#8C68DB",textAlign:"center",textDecorationLine:"underline"}}>Credits Earned</Text>
         <Text style={{color:"#fff",fontSize:28,textAlign:"center"}}>{user.credit}</Text>

         <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"row",marginTop:20}}>
            <Text style={{fontSize:22,color:"#aaa",paddingRight:10}}>Dark Mode :</Text>
            <Switch
            trackColor={{false: '#767577', true: '#8C68DB'}}
            thumbColor={isEnabled ? '#8C68DB' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            />
         </View>

         <Pressable onPress={() => setModalVisible(true)} style={{padding:10,backgroundColor:"#aaa",margin:20,marginTop:40,marginBottom:0,borderRadius:10}}>
            <Text style={{fontSize:24,color:"#fff",textAlign:"center"}}>Edit Profile</Text>
         </Pressable>
         <Pressable onPress={logout} style={{padding:10,backgroundColor:"#8C68DB",margin:20,marginTop:20,borderRadius:10}}>
            <Text style={{fontSize:24,color:"#fff",textAlign:"center"}}>Logout</Text>
         </Pressable>
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
export default Profile