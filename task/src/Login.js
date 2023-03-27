import url from "./api"
import React from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View,TextInput, Text ,Pressable,ToastAndroid} from 'react-native';

const Login = ({setPage}) => {
   const [email,setEmail] = React.useState("")
   const [password,setPassword] = React.useState("")
   const [err,setErr] = React.useState("")

   const storeData = async (res) => {
      try {
        const data = JSON.stringify(res.data)
        await AsyncStorage.setItem('user', data)
        setPage("Home")
      } catch (e) {
         setErr("Something went Wrong, try Again!")
      }
   }

   const storelogin = ()=>{
      if(email!="" && password!=""){
         const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         if (reg.test(email) === true){
            setErr("")
            axios.post(url+`/login?email=${email}&password=${password}`, {})
            .then(function (res) {
               if(res.data[0]){
                  ToastAndroid.show('Signed in Successfully', ToastAndroid.LONG);
                  storeData(res)
               }else{
                  setErr("Email or Password is Wrong")
               }
            })
            .catch(function (error) {
               setErr("Network Error")
            });
         }else{
            setErr("Invalid Email Address")
         }
      }else{
         setErr("Please Fill all Details")
      }
   }
   return (
   <View style={{flex:1,justifyContent:"center",height:"100%",zIndex:100,padding:10}}>
         <Text style={{fontSize:44,fontWeight:"600",color:"#8C68DB",marginBottom:25}}>Login,</Text>
         <TextInput 
            style={{marginBottom:20,backgroundColor:"#ffffff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
            onChangeText={setEmail}
            placeholder="email"
            keyboardType="text"
         />
         <TextInput 
            style={{marginBottom:20,backgroundColor:"#ffffff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
            onChangeText={setPassword}
            placeholder="Password"
            keyboardType="text"
            secureTextEntry={true}
         />
         <Text style={{color:"red",textAlign:"center",fontSize:18}}>{err}</Text>

         <View style={{alignItems:"center",marginTop:20}}>
            <Pressable onPress={storelogin} style={{marginBottom:30,backgroundColor:"#8C68DB",width:300,borderWidth:1,borderColor:"#ffffff",borderRadius:15}}>
               <Text style={{textAlign:"center",padding:10,fontSize:28,color:"#ffffff",fontWeight:"900"}}>Login</Text>
            </Pressable>
         </View>
         <Text style={{color:"#222",textAlign:"center",fontSize:20}}>
            Do you have an Account? <Text onPress={()=>{setPage("Signup")}} style={{color:"#fff"}}>Signup</Text>
         </Text>
   </View>
   )
}
export default Login