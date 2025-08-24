import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Modal, View, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { BlurView } from 'expo-blur';
import CustomText from "@/components/display/customText";


interface Props {
  animation?: "slide" | "fade" | "none",
  isVisible: boolean,
  setIsVisible: (s: boolean) => void,
  text: string,
  subtext: string,
  onClose: () => void,
}

export default function ModalBox({ animation, isVisible, setIsVisible, onClose, text, subtext }: Props) {

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType={animation}
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}
      >
        <BlurView intensity={10} style={styles.rootView} tint="dark" experimentalBlurMethod="dimezisBlurView">
          <View style={styles.modalView}>
            <CustomText style={styles.modalText}>{text}</CustomText>
            <CustomText style={styles.modalSubtext}>{subtext}</CustomText>
            <Pressable
              style={styles.button}
              onPress={() => { setIsVisible(!isVisible); onClose(); }}>
              <MaterialDesignIcons name="close" size={15} color={"white"} />
            </Pressable>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.3)",
    height: 'auto',
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.3)",
    position: 'absolute'
  },
  modalView: {
    margin: 20,
    backgroundColor: '#17171d',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#25252fff",
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    backgroundColor: "#ec3750",
    position: "absolute",
    top: 0,
    right: 0,
    margin: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  modalSubtext: {
    marginBottom: 15,
    textAlign: 'center',
    color: "#8492a6",
    fontSize: 15
  },
});
