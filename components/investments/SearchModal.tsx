import { View, TextInput, Pressable, ActivityIndicator, Text, Animated } from "react-native"
import { ArrowLeft, Search, Plus, Calendar, DollarSign, Euro, X } from "lucide-react-native";
import { useState, useEffect } from "react";
import { investmentsApi, StockResult } from "api/investments";
import { useGroupStore, useAuthStore } from "context/AppContext";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

interface SearchModalProps {
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({onClose}) => {

    const [loading, setLoading] = useState(false);
    const [onAddLoading, setOnAddLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState<StockResult[]>([]);
    const [listOpacity] = useState(new Animated.Value(0));
    const [selectedStock, setSelectedStock] = useState<StockResult | null>(null);
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loadingStockPrice, setLoadingStockPrice] = useState(false);
    const [stockPrice, setStockPrice] = useState<string>("")
    const [stockCurrency, setStockCurrency] = useState<string>("");
    const [quantity, setQuantity] = useState<string | undefined>()

    const currentGroup = useGroupStore((state) => state.currentGroup);
    const userId = useAuthStore((state) => state.googleId);

    const handleSearch = async () => {
        const data = await investmentsApi.searchStock(searchText);
        console.log(data.ResultSet.Result)
        return data;
    };

    const handleStockSelect = (stock: StockResult) => {
        setSelectedStock(stock);
        setShowInvestmentModal(true);
    };

    const handleAddInvestment = async () => {
        if(!currentGroup || !selectedStock?.symbol || !quantity || !selectedDate || !userId) {
            return
        }
        setOnAddLoading(true);
        const investment = await investmentsApi.AddInvestment(currentGroup?.id, selectedStock?.symbol, selectedStock?.name, selectedStock.type, parseFloat(quantity), parseFloat(stockPrice), selectedDate, userId);
        setOnAddLoading(false);
        console.log(investment);
        setShowInvestmentModal(false);
        setSelectedStock(null);
        setSelectedDate(null);
        setStockPrice("");
        setStockCurrency("");
        setQuantity(undefined);
    };

    const handleCloseInvestmentModal = () => {

        setShowInvestmentModal(false);
        setSelectedStock(null);
        setSelectedDate(null);
        setStockPrice("");
        setStockCurrency("");
        setQuantity(undefined);
    };

    const handleDateChange = async (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
        }
        if (!selectedStock || !date) {
            return;
        }
        setLoadingStockPrice(true);
        try {
            const stockPriceData = await investmentsApi.getStockPrice(selectedStock?.symbol, date);
            console.log("data",stockPriceData.price.toFixed(2));
            setStockPrice(stockPriceData.price.toFixed(2).toString());
            setStockCurrency(stockPriceData.currency);
        } catch (error) {
            console.error('Error fetching stock price:', error);
            setStockPrice("");
        }
        setLoadingStockPrice(false);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "Select date";
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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
                    {searchText !== "" && (
                    <Pressable className="p-1" onPress={() => setSearchText("")}>
                        <X size={16}/>
                    </Pressable>)}
                </View>
            </View>
            <View className="mt-5 flex-1 px-5">
                {loading ? (
                    <ActivityIndicator color={'#3B82F6'} className="mt-4"/>
                ) : (
                    <Animated.ScrollView style={{opacity: listOpacity}} showsVerticalScrollIndicator={false}>
                        {searchResult.map((stock, index) => (
                            <View key={index}>
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
                            </View>
                        ))}
                    </Animated.ScrollView>
                )}
            </View>

            <Modal
                isVisible={showInvestmentModal}
                animationIn='fadeIn'
                animationOut='fadeOut'
                backdropOpacity={0.5}
                statusBarTranslucent={true}
                swipeDirection={'down'}
                onSwipeComplete={handleCloseInvestmentModal}
                style={{ justifyContent: 'flex-end', alignItems: 'center', margin: 0 }}
            >
                <View className="bg-white rounded-t-2xl border border-slate-200 p-5 w-full justify-center">
                    <View className="w-20 mx-4 h-1 rounded-2xl mb-2 bg-slate-300 self-center"/>
                    <View className="flex-row items-center mb-4 gap-1.5">
                        <Text className="font-semibold text-default text-lg">
                            Add 
                        </Text>
                        <Text className="font-semibold text-default text-lg text-primary">
                            {selectedStock?.symbol}
                        </Text>

                    </View>
                    
                    <View className="gap-4">
                        <View>
                            <Text className="text-sm font-medium text-gray-600 mb-2 ml-0.5">Quantity</Text>
                            <TextInput 
                                className="border border-gray-300 rounded-xl px-3 py-1.5 text-default text-sm"
                                placeholder="Enter quantity"
                                placeholderTextColor={'#9CA3AF'}
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={setQuantity}
                                
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-gray-600 mb-2 ml-0.5">Purchase Date</Text>
                            <Pressable 
                                onPress={() => setShowDatePicker(true)}
                                className="border border-gray-300 rounded-xl px-3 py-3 flex-row items-center justify-between"
                            >
                                <Text className={`text-sm ${selectedDate ? 'text-default' : 'text-gray-400'}`}>
                                    {formatDate(selectedDate)}
                                </Text>
                                <Calendar size={16} color="#9CA3AF"/>
                            </Pressable>
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-gray-600 mb-2 ml-0.5">Purchase price</Text>
                            <View className={`flex-row items-center border border-slate-300 rounded-xl px-3 py-0 ${!loadingStockPrice && selectedDate !== null ? 'opacity-100' : 'opacity-40'}`}>
                                {stockCurrency == 'USD' && <DollarSign size={16} color="#000000CC"/> }
                                {stockCurrency == 'EUR' && <Euro size={16} color="#000000CC"/> }
                                <TextInput 
                                    className="flex-1 text-default py-1.5 text-sm"
                                    placeholder="Enter price"
                                    placeholderTextColor={'#9CA3AF'}
                                    keyboardType="numeric"
                                    editable={!loadingStockPrice && selectedDate !== null}
                                    value={stockPrice}
                                    onChangeText={setStockPrice}
                                />
                                {loadingStockPrice && (
                                    <ActivityIndicator size="small" color={'#3B82F6'} className="ml-2"/>
                                )}
                            </View>
                        </View>
                        
                        <View className="flex-row gap-3 mt-2">
                            <Pressable 
                                className={`flex-1 bg-primary py-3 rounded-xl flex-row gap-2 justify-center items-center ${
                                     !selectedDate || !stockPrice.trim() || !quantity
                                    ? 'bg-slate-400'
                                    : 'bg-primary active:bg-primaryDark'
                                }`}
                                onPress={handleAddInvestment}
                                disabled={!selectedDate || !stockPrice || !quantity}
                            >
                                {onAddLoading ? <ActivityIndicator color='white'/> 
                                    : <Text className="text-white text-center text-sm font-semibold">Add Investment</Text>
}
                    
                            </Pressable>
                        </View>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    )}
                </View>
            </Modal>
        </View>
    )
}

export default SearchModal;