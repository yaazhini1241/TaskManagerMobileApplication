import url from "./api"
import axios from 'axios';
import React from 'react'
import {View,TextInput, Text ,Pressable,ToastAndroid} from 'react-native';

const Signup = ({setPage}) => {
   const [fname,setFname] = React.useState("")
   const [lname,setLname] = React.useState("")
   const [email,setEmail] = React.useState("")
   const [password,setPassword] = React.useState("")
   const [err,setErr] = React.useState("")
   const storesign = ()=>{
      if(fname!="" && lname!="" && email!="" && password!=""){
         const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         if (reg.test(email) === true){
            const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (re.test(password) === true){
               setErr("")
               axios.post(url+`/signup?fname=${fname}&lname=${lname}&email=${email}&password=${password}`, {})
               .then(function (res) {
                  if(res.data.errno==1062){
                     setErr("Email already Registered, Try Login!")
                  }else{
                     ToastAndroid.show('Signup Successfully', ToastAndroid.LONG);
                     setPage("Login")
                  }
               })
               .catch(function (error) {
                  setErr("Network Error")
                  console.log(error);
               });
            }else{
               setErr("Password should be min 8 letter, with at least a symbol, upper and lower case letters and a number")
            }
         }else{
            setErr("Invalid Email Address")
         }
      }else{
         setErr("Please Fill all Details")
      }
   }
   return (
   <View style={{flex:1,justifyContent:"center",height:"100%",zIndex:100,padding:10}}>
      <Text style={{fontSize:44,fontWeight:"600",color:"#8C68DB",marginBottom:25}}>Signup,</Text>
      <TextInput 
         style={{marginBottom:20,backgroundColor:"#ffffff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
         onChangeText={setFname}
         placeholder="First Name"
         keyboardType="text"
      />
      <TextInput 
         style={{marginBottom:20,backgroundColor:"#ffffff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
         onChangeText={setLname}
         placeholder="Last Name"
         keyboardType="text"
      />
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
         <Pressable onPress={storesign} style={{marginBottom:30,backgroundColor:"#8C68DB",width:300,borderWidth:1,borderColor:"#ffffff",borderRadius:15}}>
            <Text style={{textAlign:"center",padding:10,fontSize:28,color:"#ffffff",fontWeight:"900"}}>Create Account</Text>
         </Pressable>
      </View>
      <Text style={{color:"#222",textAlign:"center",fontSize:20}}>
         Do you have an Account? <Text onPress={()=>{setPage("Login")}} style={{color:"#fff"}}>Login</Text>
      </Text>
   </View>
   )
}

export default Signup