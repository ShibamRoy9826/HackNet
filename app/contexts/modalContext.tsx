import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import ModalBox from "../components/modal";
import ActivityBox from "../components/activity";

type modalContextType = {
    alert: (text: string, subtext: string, onClose?: () => void) => void;
    updateActivity: (progress: number, activityInfo: string) => void;
    setActivityVisible: (a: boolean) => void;
}
const ModalContext = createContext<modalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modalText, setModalText] = useState("");
    const [modalSubtext, setmodalSubtext] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const modalFnRef = useRef<() => void>(() => { });


    const activityText = useRef("Signing up");
    const activitySubtext = useRef("Finding user");
    const [activityVisible, setActivityVisible] = useState(false);
    const activityProgress = useRef(0);

    function alert(text: string, subtext: string, onClose?: () => void) {
        setModalVisible(true);
        setModalText(text);
        setmodalSubtext(subtext);
        modalFnRef.current = onClose || (() => { });
    }
    function updateActivity(progress: number, activityInfo: string) {
        activityProgress.current = progress;
        activitySubtext.current = activityInfo;
    }
    return (
        <ModalContext.Provider
            value={{
                alert,
                updateActivity,
                setActivityVisible
            }}
        >
            {children}
            <ModalBox
                onClose={() => modalFnRef.current()}
                animation="slide"
                isVisible={modalVisible}
                setIsVisible={setModalVisible}
                text={modalText}
                subtext={modalSubtext}
            />

            <ActivityBox
                progress={activityProgress.current}
                animation="fade"
                isVisible={activityVisible}
                setIsVisible={setActivityVisible}
                subtext={activitySubtext.current}
                text={activityText.current}
            />
        </ModalContext.Provider>
    )
}

export function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useUser must be used within a ModalContext");
    }
    return context;
}