/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect } from 'react';
import { Text, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const App = () => {
    const [timestamp, setTimestamp] = useState([]);
    const [temp, setTemp] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('http://ec2-52-10-248-119.us-west-2.compute.amazonaws.com:3000/getData')
                .then(response => {
                    const newTimestamps = response.data.map(entry => entry.timestamp);
                    const newTemps = response.data.map(entry => entry.temperature);
                    
                    console.log("temp", newTemps);
                    console.log("time", newTimestamps);

                    setTimestamp(prevTimestamps => {
                        const updatedTimestamps = [...prevTimestamps, ...newTimestamps];
                        if (updatedTimestamps.length >= 2) {
                            setLoading(false);
                        }
                        return updatedTimestamps;
                    });

                    setTemp(prevTemps => {
                        const updatedTemps = [...prevTemps, ...newTemps];
                        if (updatedTemps.length >= 2) {
                            setLoading(false);
                        }
                        return updatedTemps;
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(false); // Stop loading on error
                });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false ,// optional
    };

    const data = {
        labels: timestamp.map((ts, index) => (index + 1).toString()), // Converting index to string for labels
        datasets: [
          {
            data: temp,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        Legend:["Temperature"]
    };

    console.log("data.datasets = ", data.datasets[0].data);

    const screenWidth = Dimensions.get('window').width;

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <>
        <Text>Temperature-Time Chart (y-axis Temperature) </Text>
        <LineChart
            data={data}
            width={screenWidth-16}
            height={320}
            chartConfig={chartConfig}
        />
        <Text>                    x-axis Time</Text>
        </>
        
    );
};

export default App;




