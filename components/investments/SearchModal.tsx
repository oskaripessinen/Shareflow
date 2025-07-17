import { View, TextInput, Pressable, ActivityIndicator, ScrollView, Text } from "react-native"
import { ArrowLeft, Search } from "lucide-react-native";
import { useState, useEffect } from "react";
import { investmentsApi, StockResult } from "api/investments";

interface SearchModalProps {
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({onClose}) => {

    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState<StockResult[]>([]);

    const handleSearch = async () => {
        const data = await investmentsApi.searchStock(searchText);
        return data;
    }

    useEffect(() => {
        if (searchText.trim() === "") {
            setLoading(false);
            return;
        }

        const timer = setTimeout(async() => {
            setLoading(true);
            const res = await handleSearch();
            console.log(res.ResultSet.Result)
            setSearchResult(res.ResultSet.Result)
            setLoading(false);
        }, 400); 

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
            <View className="mt-5 flex-1 px-5">
                {loading ? (
                    <ActivityIndicator color={'#3B82F6'} className="mt-4"/>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {searchResult.map((stock, index) => (
                            <Pressable 
                                key={index} 
                                className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
                                onPress={() => console.log('Selected stock:', stock.symbol)}
                            >
                                <Text className="text-lg font-semibold text-gray-800 mb-2">
                                    {stock.symbol}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    )
}

export default SearchModal;