import url from "../api"
import React from 'react'
import axios from 'axios';
const FormData = require('form-data');
import { Modal,ScrollView,View,Button, Text ,Image,Pressable,TextInput,ToastAndroid} from 'react-native';
import home from "../../assets/Navbar/homeactive.png"
import calendar from "../../assets/Navbar/calendar.png"
import network from "../../assets/Navbar/network.png"
import profile from "../../assets/Navbar/profile.png"
import check from "../../assets/Extra/check.png"
import edit from "../../assets/Extra/edit.png";
import drop from "../../assets/Extra/delete.png";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = ({setPage}) => {
   const [user,setUser] = React.useState({})
   const [task,setTask] = React.useState({})

   const [title,setTitle] = React.useState("")
   const [content,setContent] = React.useState("")
   const [color,setColor] = React.useState("")
   const [tid,setTid] = React.useState(0)

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
            axios.post(url+`/task?uid=${jsonValue[0].id}`, {})
            .then(function (res) {
               setTask(res.data)
            })
            .catch(function (error) {
               ToastAndroid.show('Network Error', ToastAndroid.LONG);
            });
         })
         .catch(function (error) {
            ToastAndroid.show('Network Error', ToastAndroid.LONG);
         });
         const udata = JSON.parse(await AsyncStorage.getItem('user'))
         setUser(udata[0]);
      }
      data();
   }, []);

   const [rem, setRem] = React.useState("0");
   const [modalVisible, setModalVisible] = React.useState(false);
   const [modalVisibleEdit, setModalVisibleEdit] = React.useState(false);
   const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
   const showDatePicker = () => {
      setDatePickerVisibility(true);
   };
   const hideDatePicker = () => {
      setDatePickerVisibility(false);
   };
   const handleConfirm = (date) => {
      setRem(moment(date).format("YYYY-MM-DD HH:mm:ss"))
      hideDatePicker();
   };

   const [image, setImage] = React.useState(null);

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });
      if (!result.canceled) {
         setImage(result.assets[0].uri);
      }
   };

   const droptask=(id)=>{
         axios.post(`${url}/task/drop?id=${id}`, 
         {}
         ).then(function (res) {
            ToastAndroid.show('Task Deleted Successfully!', ToastAndroid.LONG);
            axios.post(url+`/task?uid=${user.id}`, {})
            .then(function (res) {
               setTask(res.data)
            })
            .catch(function (error) {
               ToastAndroid.show('Network Error', ToastAndroid.LONG);
            });
         })
         .catch(function (error) {
            ToastAndroid.show("Network Error", ToastAndroid.LONG)
         });
   }

   const checktask=(id)=>{
      axios.post(`${url}/task/check?id=${id}&uid=${user.id}`, 
      {}
      ).then(function (res) {
         ToastAndroid.show('Task Completed Successfully!', ToastAndroid.LONG);
         axios.post(url+`/login?email=${user.email}&password=${user.password}`, {})
         .then(function (res) {
            storeData(res)
            setUser(res.data[0])
         })
         .catch(function (error) {
            ToastAndroid.show('Network Error', ToastAndroid.LONG);
         });
         axios.post(url+`/task?uid=${user.id}`, {})
         .then(function (res) {
            setTask(res.data)
         })
         .catch(function (error) {
            ToastAndroid.show('Network Error', ToastAndroid.LONG);
         });
      })
      .catch(function (error) {
         ToastAndroid.show("Network Error", ToastAndroid.LONG)
      });
      
   }

   const edittask = (id)=>{
      setModalVisibleEdit(true);
      task.map((i)=>{
         if(i.id==id){
            setTid(id)
            setTitle(i.title)
            setContent(i.content)
            setColor(i.color)
            setRem(i.rem)
            if(i.img!="no"){
               setImage(i.img)
            }
         }
      })
   }

   const updateTask =()=>{
      moment(rem).format("YYYY-MM-DD HH:mm:ss")
      if(title!="" && content!="" && color!="" && rem!="0" && image!=null){
         const formData = new FormData();
         formData.append('img',{
            uri : image.startsWith("file")?image:`${url}/${image}.jpg`,
            type : 'image/jpeg',
            name : 'image.jpg'
        });
         const unique =new Date().valueOf();
         axios.post(`${url}/task/edit?title=${title}&content=${content}&rem=${moment(rem).format("YYYY-MM-DD HH:mm:ss")}&color=${color}&unique=i${unique}&id=${tid}`, 
         formData,{
            headers: {"Content-Type":"multipart/form-data"}
         }
         ).then(function (res) {
            ToastAndroid.show('Task Updated!', ToastAndroid.LONG);
            setModalVisible(false)
            setTitle("")
            setContent("")
            setColor("")
            setRem("0")
            setImage(null)
            setModalVisibleEdit(false)
            axios.post(url+`/task?uid=${user.id}`, {})
            .then(function (res) {
               setTask(res.data)
            })
            .catch(function (error) {
               ToastAndroid.show('Network Error', ToastAndroid.LONG);
            });
         })
         .catch(function (error) {
            ToastAndroid.show("Network Error", ToastAndroid.LONG)
         });
      }else if(title!="" && content!="" && color!="" && rem!="0"){
         axios.post(`${url}/task/edit?title=${title}&content=${content}&rem=${moment(rem).format("YYYY-MM-DD HH:mm:ss")}&color=${color}&id=${tid}`, 
         {}
         ).then(function (res) {
            ToastAndroid.show('Task Updated!', ToastAndroid.LONG);
            setModalVisible(false)
            setTitle("")
            setContent("")
            setColor("")
            setRem("0")
            setImage(null)
            setModalVisibleEdit(false)
            axios.post(url+`/task?uid=${user.id}`, {})
            .then(function (res) {
               setTask(res.data)
            })
            .catch(function (error) {
               ToastAndroid.show('Network Error', ToastAndroid.LONG);
            });
         })
         .catch(function (error) {
            ToastAndroid.show("Network Error", ToastAndroid.LONG)
         });
      }else{
         ToastAndroid.show("Fill all Fields", ToastAndroid.LONG)
      }
   }

   const addTask =()=>{
      const formData = new FormData();
      formData.append('img',{
         uri : image,
         type : 'image/jpeg',
         name : 'image.jpg'
     });
      const unique =new Date().valueOf();
      if(title!="" && content!="" && color!="" && rem!="0" && image!=null){
         axios.post(`${url}/task/add?title=${title}&content=${content}&rem=${rem}&color=${color}&unique=i${unique}&uid=${user.id}&type=added`, 
         formData,{
            headers: {"Content-Type":"multipart/form-data"}
         }
         ).then(function (res) {
            ToastAndroid.show('Task Added!', ToastAndroid.LONG);
            setModalVisible(false)
            setTitle("")
            setContent("")
            setColor("")
            setRem("0")
            setImage(null)
            axios.post(url+`/task?uid=${user.id}`, {})
            .then(function (res) {
               setTask(res.data)
            })
            .catch(function (error) {
               ToastAndroid.show('Network Error', ToastAndroid.LONG);
            });
         })
         .catch(function (error) {
            ToastAndroid.show("Network Error", ToastAndroid.LONG)
         });
      }else if(title!="" && content!="" && color!="" && rem!="0"){
         axios.post(`${url}/task/add?title=${title}&content=${content}&rem=${rem}&color=${color}&uid=${user.id}`, 
         {}
         ).then(function (res) {
            ToastAndroid.show('Task Added!', ToastAndroid.LONG);
            setModalVisible(false)
            setTitle("")
            setContent("")
            setColor("")
            setRem("0")
            setImage(null)
            axios.post(url+`/task?uid=${user.id}`, {})
            .then(function (res) {
               setTask(res.data)
            })
            .catch(function (error) {
               ToastAndroid.show('Network Error', ToastAndroid.LONG);
            });
         })
         .catch(function (error) {
            ToastAndroid.show("Network Error", ToastAndroid.LONG)
         });
      }else{
         ToastAndroid.show("Fill all Fields", ToastAndroid.LONG)
      }

   }

   return (
      <View style={{zIndex:100,flex: 1,height:"100%"}}>
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
                  <Text style={{fontSize:28,fontWeight:"600",color:"#8C68DB",marginBottom:40,marginTop:20,textAlign:"center"}}>Add Task</Text>
                  <TextInput 
                     style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
                     onChangeText={setTitle}
                     placeholder="Title *"
                     keyboardType="text"
                  />
                  <TextInput 
                     editable
                     multiline
                     numberOfLines={2}
                     maxLength={500}
                     style={{marginBottom:10,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,fontSize:20,padding:10}}
                     onChangeText={setContent}
                     placeholder="Content *"
                     keyboardType="text"
                  />
                  <View style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,flex:1,flexDirection:"row",justifyContent:"center"}}>
                     <Pressable style={(color=="gray")?{backgroundColor:"gray",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"gray",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("gray")}></Pressable>
                     <Pressable style={(color=="yellow")?{backgroundColor:"yellow",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"yellow",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("yellow")}></Pressable>
                     <Pressable style={(color=="magenta")?{backgroundColor:"magenta",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"magenta",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("magenta")}></Pressable>
                     <Pressable style={(color=="orange")?{backgroundColor:"orange",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"orange",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("orange")}></Pressable>
                     <Pressable style={(color=="green")?{backgroundColor:"green",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"green",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("green")}></Pressable>
                     <Pressable style={(color=="red")?{backgroundColor:"red",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"red",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("red")}></Pressable>
                  </View>
                  <View>
                     <Pressable onPress={showDatePicker} >
                        <Text style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#000"}} >{(rem=="0"? <Text style={{color:"#aaa"}}>Set Remainder *</Text>:moment(rem).format("lll"))}</Text>
                     </Pressable>
                     <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                     />
                  </View>
                  <Pressable onPress={pickImage} style={{marginBottom:300}}>
                     <Text style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#aaa"}} >Set Image (Optional)</Text>
                     <View style={{alignItems:"center"}}>
                        {image && <Image source={{ uri: image }} style={{ width:200, height: 150 }} />}
                     </View>
                  </Pressable>

               </ScrollView>
               <View style={{position:"absolute",bottom:0,right:0,left:0,paddingLeft:20,paddingRight:20,backgroundColor:"#222"}}>
                  <Pressable style={{marginTop:20}} onPress={addTask}>
                     <Text style={{marginBottom:10,backgroundColor:"#8C68DB",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#fff",textAlign:"center"}} >Save</Text>
                  </Pressable>
                  <Pressable>
                     <Text onPress={() => setModalVisible(false)} style={{marginBottom:20,backgroundColor:"#ff0000",borderWidth:1,borderColor:"red",borderRadius:10,padding:10,fontSize:20,color:"#fff",textAlign:"center"}} >Cancel</Text>
                  </Pressable>
               </View>
            </View>
         </Modal>

         {/* Edit Task */}

         <Modal
            animationType="fade"
            transparent={false}
            visible={modalVisibleEdit}
            onRequestClose={() => {
               setModalVisibleEdit(!modalVisibleEdit);
            }}
         >
            <View style={{height:"100%"}}>
               <ScrollView style={{backgroundColor:"#222",borderRadius:10,borderWidth:1,borderColor:"#aaa",padding:10}}>
                  <Text style={{fontSize:28,fontWeight:"600",color:"#8C68DB",marginBottom:40,marginTop:20,textAlign:"center"}}>Edit Task</Text>
                  <TextInput 
                     style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20}}
                     onChangeText={setTitle}
                     placeholder="Title *"
                     keyboardType="text"
                     defaultValue={title}
                  />
                  <TextInput 
                     editable
                     multiline
                     numberOfLines={2}
                     maxLength={500}
                     style={{marginBottom:10,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,fontSize:20,padding:10}}
                     onChangeText={setContent}
                     placeholder="Content *"
                     keyboardType="text"
                     defaultValue={content}
                  />
                  <View style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,flex:1,flexDirection:"row",justifyContent:"center"}}>
                     <Pressable style={(color=="gray")?{backgroundColor:"gray",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"gray",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("gray")}></Pressable>
                     <Pressable style={(color=="yellow")?{backgroundColor:"yellow",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"yellow",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("yellow")}></Pressable>
                     <Pressable style={(color=="magenta")?{backgroundColor:"magenta",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"magenta",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("magenta")}></Pressable>
                     <Pressable style={(color=="orange")?{backgroundColor:"orange",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"orange",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("orange")}></Pressable>
                     <Pressable style={(color=="green")?{backgroundColor:"green",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"green",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("green")}></Pressable>
                     <Pressable style={(color=="red")?{backgroundColor:"red",height:20,width:40,margin:5,borderRadius:5,borderWidth:4,borderColor:"#8C68DB"}:{backgroundColor:"red",height:20,width:40,margin:5,borderRadius:5}} onPress={()=>setColor("red")}></Pressable>
                  </View>
                  <View>
                     <Pressable onPress={showDatePicker} >
                        <Text style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#000"}} >{(rem=="0"? <Text style={{color:"#aaa"}}>Set Remainder *</Text>:moment(rem).format("lll"))}</Text>
                     </Pressable>
                     <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                     />
                  </View>
                  <Pressable onPress={pickImage} style={{marginBottom:300}}>
                     <Text style={{marginBottom:20,backgroundColor:"#666",color:"#fff",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#aaa"}} >Set Image (Optional)</Text>
                     <View style={{alignItems:"center"}}>
                        {image && <Image source={(image.startsWith("file"))?{ uri: image}:{ uri: `${url}/${image}.jpg` }} style={{ width:200, height: 150 }} />}
                     </View>
                  </Pressable>

               </ScrollView>
               <View style={{position:"absolute",bottom:0,right:0,left:0,paddingLeft:20,paddingRight:20,backgroundColor:"#222"}}>
                  <Pressable style={{marginTop:20}} onPress={updateTask}>
                     <Text style={{marginBottom:10,backgroundColor:"#8C68DB",borderWidth:1,borderColor:"#8C68DB",borderRadius:10,padding:10,fontSize:20,color:"#fff",textAlign:"center"}} >Update</Text>
                  </Pressable>
                  <Pressable>
                     <Text onPress={() => setModalVisibleEdit(false)} style={{marginBottom:20,backgroundColor:"#ff0000",borderWidth:1,borderColor:"red",borderRadius:10,padding:10,fontSize:20,color:"#fff",textAlign:"center"}} >Cancel</Text>
                  </Pressable>
               </View>
            </View>
         </Modal>

         <ScrollView style={{height:"100%",marginBottom:60,backgroundColor:"#222"}}>
            <Pressable style={{backgroundColor:"#8C68DB",flex:1,flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:10}}>
               <Text style={{fontSize:32,color:"#fff"}}>Tasks</Text>
               <View>
                  <View style={{flex:1,alignItems:"center"}}>
                     <Text style={{fontSize:12,color:"#ccc"}}>Credits</Text>
                     <Text style={{fontSize:22,color:"#fff"}}>{user.credit}</Text>
                  </View>
               </View>
            </Pressable>

            <View style={{marginTop:10,marginBottom:100}}>
            {(task.length>0)?task.map((i)=>
               <Pressable  key={i.id} style={{borderWidth:1,borderColor:"#ccc",margin:10,borderRadius:5,backgroundColor:i.color,padding:10}}>
                  {
                     (i.type=="completed")?
                     <View>
                        <Text style={{fontSize:22,fontWeight:"600",color:"#fff",textDecorationLine:"line-through"}}>{i.title}</Text>
                        <Text style={{fontSize:16,color:"#fff",paddingTop:10,textDecorationLine:"line-through"}}>{i.content}</Text>
                        <Text style={{borderBottomWidth:1,borderBottomColor:"#fff"}}></Text>
                        <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end",alignItems:"center",marginTop:10}}>
                           <Pressable onPress={()=>{droptask(i.id)}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                              <Image source={drop} style={{width:25,height:25}}/>
                           </Pressable>
                        </View>
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
                        <Text style={{borderBottomWidth:1,borderBottomColor:"#fff"}}></Text>
                        <View style={{flex:1,flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",marginTop:10}}>
                           <Pressable onPress={()=>{checktask(i.id)}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                              <Image source={check} style={{width:25,height:25}}/>
                           </Pressable>
                           <Pressable onPress={()=>{edittask(i.id)}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                              <Image source={edit} style={{width:25,height:25}}/>
                           </Pressable>
                           <Pressable onPress={()=>{droptask(i.id)}} style={{width:"25%",borderRadius:5,alignItems:"center"}}>
                              <Image source={drop} style={{width:25,height:25}}/>
                           </Pressable>
                        </View>
                     </View>
                  }
               </Pressable>
            ):<Text style={{fontSize:22,color:"#aaa",textAlign:"center",paddingTop:50}}>Nothing Found!</Text>}
            </View>

         </ScrollView>

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
         
         <Pressable onPress={() => setModalVisible(true)} style={{zIndex:100,position:"absolute",right: 15, bottom:"10%",flex:1,justifyContent:"center",alignItems:"center",height:60,width:60,backgroundColor:"#8C68DB",borderRadius:60,}}>
            <Text style={{fontSize:50,color:"#ffffff",fontFamily:"sans-serif"}}>+</Text>
         </Pressable> 
      </View>
      

      
   )
}


export default Home