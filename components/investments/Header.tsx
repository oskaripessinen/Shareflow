import React from "react";
import { View, Pressable, Text } from "react-native";
import { Plus } from "lucide-react-native";


interface HeaderProps {
    chartActive: boolean;
    setShowAddInvestmentModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({chartActive, setShowAddInvestmentModal}) => {

    return (
        <View className="justify-between flex-row">
            <View className="flex-row" style={{width: '55%'}}>
                <Pressable className={`flex-1 p-2 py-2.5 rounded-l-xl border border-slate-300 justify-center items-center active:bg-slate-100 ${!chartActive ? "bg-slate-100" : "bg-surface"}`}>
                    <Text className="font-semibold text-default text-sm">Distribution</Text>
                </Pressable>
                <Pressable className={`flex-1 p-2 py-2.5 rounded-r-xl border-r items-center border-y border-slate-300 justify-center active:bg-slate-100 ${chartActive ? "bg-slate-200" : "bg-surface"}`}>
                    <Text className="font-semibold text-default text-sm">Chart</Text>
                </Pressable>
            </View>

            <Pressable onPress={(() => setShowAddInvestmentModal(true))} className="flex-row items-center bg-primary pr-4 pl-2.5 py-2 rounded-xl active:bg-primaryDark shadow gap-1">
                <Plus size={18} strokeWidth={2.2} color={'#fff'}/>
                <Text className="text-white font-sans text-base">
                    Investment
                </Text>
            </Pressable>

        </View>
    )
}
export { Header };