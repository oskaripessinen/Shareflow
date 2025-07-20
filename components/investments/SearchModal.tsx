import { View, TextInput, Pressable, ActivityIndicator, Text, Animated } from "react-native"
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
    const [listOpacity] = useState(new Animated.Value(0));

    const handleSearch = async () => {
        const data = await investmentsApi.searchStock(searchText);
        return data;
    }

    useEffect(() => {
        setLoading(true);
        if (searchText.trim() === "") {
            setLoading(false);
            setSearchResult([]);
            return;
        }

        const timer = setTimeout(async() => {
            listOpacity.setValue(0);
            const res = await handleSearch();
            console.log(res.ResultSet.Result)
            setSearchResult(res.ResultSet.Result)
            setLoading(false);

            Animated.timing(listOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

        }, 500); 

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
                    <Animated.ScrollView style={{opacity: listOpacity}} showsVerticalScrollIndicator={false}>
                        {searchResult.map((stock, index) => (
                            <Pressable 
                                key={index} 
                                className="bg-surface border border-gray-300 rounded-xl px-4 py-3 mb-3 justify-center"
                                onPress={() => console.log('Selected stock:', stock.symbol)}
                            >
                                <View className="flex-col">
                                    <Text className="text-base font-semibold text-default">
                                        {stock.symbol}
                                    </Text>
                                    <Text className="text-default font-sans text-sm">
                                        {stock.name}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </Animated.ScrollView>
                )}
            </View>
        </View>
    )
}

export default SearchModal;