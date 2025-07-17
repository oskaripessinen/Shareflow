import { View, TextInput, Pressable, ActivityIndicator } from "react-native"
import { ArrowLeft, Search } from "lucide-react-native";
import { useState, useEffect } from "react";

interface SearchModalProps {
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({onClose}) => {

    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");


    useEffect(() => {
        if (searchText.trim() === "") {
            setLoading(false);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(true);
            console.log("Hakutermi:", searchText);
        }, 600); 

        return () => {
            clearTimeout(timer);
        };
    }, [searchText]);

    return (
        <View className="bg-background flex-1">
            <View className="items-center pt-20 pl-5 flex-row">
                <Pressable onPress={onClose}>
                    <ArrowLeft color="black"/>
                </Pressable>
                <View className="flex-row items-center flex-1 bg-slate-surface border border-slate-300 rounded-xl py-1 px-3 mr-5 ml-4">
                    <Search size={20} />
                    <TextInput 
                        placeholderTextColor={'black'} 
                        placeholder="search" 
                        className="flex-1 text-default py-1 text-base ml-2"
                        textAlignVertical="center"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>
            <View className="mt-10">
                {loading ? <ActivityIndicator color={'#3B82F6'}/> : <View />}
                
            </View>
        </View>
    )
}

export default SearchModal;