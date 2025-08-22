import { Dimensions, View } from "react-native";
import { useSharedValue , configureReanimatedLogger, ReanimatedLogLevel, } from "react-native-reanimated";
import Media from './media';
import Carousel, { ICarouselInstance, Pagination, } from "react-native-reanimated-carousel";
import { useRef } from 'react';

import { ImagePickerAsset } from "expo-image-picker";

interface Props {
    data: ImagePickerAsset[];
}

const { width, height } = Dimensions.get("window");

export default function CarouselComponent({ data }: Props) {
    configureReanimatedLogger({
        level: ReanimatedLogLevel.warn,
        strict: false, // Reanimated runs in strict mode by default
    });

    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            count: index - progress.value,
            animated: true,
        });
    };


    return (
        <View style={{ flex: 1 }}>
            <Carousel
                ref={ref}
                width={width}
                height={height * 0.3}
                data={data}
                onProgressChange={progress}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: "#25252fff",
                            justifyContent: "center",
                            backgroundColor: "#0d0d10ff"
                        }}
                    >
                        {/* <CustomText style={{ textAlign: "center", fontSize: 30 }}>0</CustomText> */}
                        <Media source={item.uri} style={{ width: "100%", height: "100%" }} resizeMode="contain" />

                    </View>
                )}
            />

            <Pagination.Basic
                progress={progress}
                data={data}
                // dotStyle={{ backgroundColor: "rgba(132,146,166,0.2)", borderRadius: 50 }}
                // activeDotStyle={{ backgroundColor: "#8492a6", borderRadius: 50 }}
                dotStyle={{ backgroundColor: "rgba(132,146,166,0.2)", borderRadius: 50 }}
                activeDotStyle={{ backgroundColor: "#8492a6", borderRadius: 50 }}

                containerStyle={{ gap: 5, marginTop: 10 }}
                onPress={onPressPagination}
            />
        </View>
    );
}