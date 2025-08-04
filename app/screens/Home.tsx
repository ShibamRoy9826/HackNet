import {StatusBar,Platform,View,Animated} from "react-native";
import HomeHeader from "../components/HomeHeader";
import Post from "../components/post";
import { useSafeAreaInsets} from 'react-native-safe-area-context';


export default function HomeScreen({navigation}){
    <StatusBar backgroundColor={"green"}/>
    const insets = useSafeAreaInsets();
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 64+insets.top);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 50+insets.top],
        outputRange: [0, -50-insets.top],
    });            

    return (
        <View style={{backgroundColor:"#17171d",paddingTop:insets.top,flex:1,overflow:"hidden"}}>

        <HomeHeader tY={translateY} h={50+insets.top}/>

        <Animated.ScrollView
            style={{backgroundColor:"#17171d",flex:1,height:"80%",paddingBottom:100,}}
            onScroll={e => {
                scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}>            
            <View style={{height:50+insets.top}}></View>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
           
        </Animated.ScrollView>
        </View>
    );
}

