import { View, TextInput, Pressable, ActivityIndicator, Text, Animated } from "react-native"
import { ArrowLeft, Search, Plus, X } from "lucide-react-native";
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
    const [selectedStock, setSelectedStock] = useState<StockResult | null>(null);
    const [dropdownOpacity] = useState(new Animated.Value(0));

    const handleSearch = async () => {
        const data = await investmentsApi.searchStock(searchText);
        return data;
    }

    const handleStockSelect = (stock: StockResult) => {
        setSelectedStock(stock);
        Animated.timing(dropdownOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }

    const handleCloseDropdown = () => {
        Animated.timing(dropdownOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setSelectedStock(null);
        });
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
                <Pressable className="py-2 px-1 active:opacity-50" onPress={onClose}>
                    <ArrowLeft color="black"/>
                </Pressable>
                <View className="flex-row items-center flex-1 bg-surface/80 border border-slate-300 rounded-xl py-1 px-3 mr-5 ml-4">
                    <Search size={20} />
                    <TextInput 
                        placeholderTextColor={'black'} 
                        placeholder="search" 
                        className="flex-1 text-default py-1 text-base ml-2"
                        textAlignVertical="center"
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus={true}
                    />
                </View>
            </View>
            <View className="mt-5 flex-1 px-5">
                {loading ? (
                    <ActivityIndicator color={'#3B82F6'} className="mt-4"/>
                ) : (
                    <Animated.ScrollView style={{opacity: listOpacity}} showsVerticalScrollIndicator={false}>
                        {searchResult.map((stock, index) => (
                            <View key={index} className="relative">
                                <Pressable 
                                    className="bg-surface border border-gray-300 rounded-xl px-4 py-3 mb-3 justify-center"
                                    onPress={() => console.log('Selected stock:', stock.symbol)}
                                >
                                    <View className="flex-row justify-between">
                                        <View className="flex-col px-1">
                                            <Text className="text-base font-semibold text-default">
                                                {stock.symbol}
                                            </Text>
                                            <Text numberOfLines={1} className="text-default font-sans text-sm max-w-60">
                                                {stock.name}
                                            </Text>
                                        </View>
                                        <Pressable 
                                            className="px-2 my-1 rounded-full justify-center items-center flex-row active:opacity-50"
                                            onPress={() => handleStockSelect(stock)}
                                        >
                                            <Plus color={'#3B82F6'} size={22} strokeWidth={2.2}/>
                                        </Pressable>
                                    </View>
                                </Pressable>

                                {selectedStock?.symbol === stock.symbol && (
                                    <Pressable onPress={handleCloseDropdown} className="w-full h-full z-10">
                                        <Animated.View 
                                            style={{opacity: dropdownOpacity}}
                                            className="absolute top-full right-4 -mt-2 bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-10 w-80"
                                        >
                                            <View className="flex-row justify-between items-center mb-3">
                                                <Text className="font-semibold text-default">Add {stock.symbol}</Text>
                                                <Pressable onPress={handleCloseDropdown}>
                                                    <X size={18} color="#666"/>
                                                </Pressable>
                                            </View>
                                            
                                            <View className="gap-2">
                                                <View>
                                                    <Text className="text-xs font-sans text-gray-600 mb-1">Quantity</Text>
                                                    <TextInput 
                                                        className="border border-gray-300 rounded-lg px-3 py-0 text-default text-xs"
                                                        placeholder="Enter quantity"
                                                        placeholderTextColor={'grey'}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                                
                                                <View>
                                                    <Text className="text-xs font-sans text-gray-600 mb-1">Price per share</Text>
                                                    <TextInput 
                                                        className="border border-gray-300 rounded-lg px-3 py-0 text-default text-xs"
                                                        placeholder="Enter price"
                                                        placeholderTextColor={'grey'}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                                
                                                <View className="flex-row space-x-2 mt-4">
                                                    <Pressable 
                                                        className="flex-1 bg-primary py-2 rounded-lg justify-center items-center text-xs"
                                                        onPress={() => {
                                                            console.log('Add investment for', stock.symbol);
                                                            handleCloseDropdown();
                                                        }}
                                                    >
                                                        <Text className="text-white text-center text-sm font-semibold">Add Investment</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </Animated.View>
                                    </Pressable>
                                )}
                            </View>
                        ))}
                    </Animated.ScrollView>
                )}
            </View>
        </View>
    )
}

export default SearchModal;