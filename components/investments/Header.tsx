import React from "react";
import { View, Pressable, Text } from "react-native";
import { Plus, PieChart, ChartLine } from "lucide-react-native";


interface HeaderProps {
    chartActive: boolean;
    setChartActive: (show: boolean) => void;
    setShowAddInvestmentModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({chartActive, setShowAddInvestmentModal, setChartActive}) => {

    return (
        <View className="justify-between flex-row ">
            <View className="flex-row bg-white rounded-xl">
                <Pressable 
                    onPress={() => setChartActive(false)} 
                    className={`px-6 m-0 py-2.5 justify-center rounded-l-[10px] items-center border border-slate-300 active:bg-slate-100 ${!chartActive ? "bg-slate-100" : "bg-surface"}`}
                >
                    <PieChart size={18}/>
                </Pressable>
                <Pressable 
                    onPress={() => setChartActive(true)} 
                    className={`px-6 m-0 py-2.5 rounded-r-xl border-y border-r border-slate-300 justify-center items-center active:bg-slate-100 ${chartActive ? "bg-slate-100" : "bg-surface"}`}
                >
                    <ChartLine size={20}/>
                </Pressable>
            </View>

            <Pressable onPress={(() => setShowAddInvestmentModal(true))} className="flex-row items-center bg-primary pr-4 pl-2.5 py-2 rounded-xl active:bg-primaryDark gap-1">
                <Plus size={18} strokeWidth={2.2} color={'#fff'}/>
                <Text className="text-white font-sans text-base">
                    Investment
                </Text>
            </Pressable>

        </View>
    )
}
export { Header };