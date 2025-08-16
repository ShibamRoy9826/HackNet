import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Dimensions, Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from 'expo-blur';


interface Props {
  animation?: "slide" | "fade" | "none",
  isVisible: boolean,
  setIsVisible: (s: boolean) => void,
  text: string,
  subtext: string,
  onClose: () => void,
}

const { width, height } = Dimensions.get("window");
export default function ModalBox({ animation, isVisible, setIsVisible, onClose, text, subtext }: Props) {

  return (
    <Modal
      animationType={animation}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(!isVisible);
      }}
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <BlurView intensity={10} style={styles.centeredView} tint="dark" experimentalBlurMethod="dimezisBlurView">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{text}</Text>
          <Text style={styles.modalSubtext}>{subtext}</Text>
          <Pressable
            style={styles.button}
            onPress={() => { setIsVisible(!isVisible); onClose(); }}>
            <MaterialDesignIcons name="close" size={15} color={"white"} />
          </Pressable>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    width: width,
    backgroundColor: "rgba(0,0,0,0.3)"
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
