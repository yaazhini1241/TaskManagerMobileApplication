import React from 'react'
import {View, Text ,Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = ({setPage}) => {
    React.useEffect(() => {
        async function data(){
            try {
                const jsonValue = JSON.parse(await AsyncStorage.getItem('user'))
                if(jsonValue[0]){
                    setPage("Home")
                }else{
                    setPage("Welcome")
                }
            }catch{

            }
        }
        data();
    }, []);
   return (
    <View style={{flex:1,justifyContent:"space-around",height:"100%",zIndex:100,padding:10}}>
        <View>
            <Text style={{fontSize:44,fontWeight:"600",color:"#8C68DB"}}>Welcome,</Text>
            <Text style={{fontSize:22,letterSpacing:1.2,paddingTop:15,textAlign:"justify",lineHeight:30,color:"#888"}}>
                &ensp;&ensp;This is a task manager mobile application.
            </Text>
        </View>
        <View style={{marginBottom:100,alignItems:"center"}}>
            <Pressable onPress={()=>{setPage("Login")}} style={{marginBottom:30,backgroundColor:"#5000ff",width:300,borderWidth:1,borderColor:"#ffffff",borderRadius:15}}>
                <Text style={{textAlign:"center",padding:10,fontSize:28,color:"#ffffff",fontWeight:"900"}}>Login</Text>
            </Pressable>
            <Pressable onPress={()=>{setPage("Signup")}} style={{backgroundColor:"#5000ff",width:300,borderWidth:1,borderColor:"#ffffff",borderRadius:15}}>
                <Text style={{textAlign:"center",padding:10,fontSize:28,color:"#ffffff",fontWeight:"900"}}>Signup</Text>
            </Pressable>
        </View>
    </View>
   )
}
export default Welcome
