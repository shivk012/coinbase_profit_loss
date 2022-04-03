import React, { useEffect, useState } from "react";
import { ChakraProvider, Box, Text, Link, VStack, Code, Grid, theme } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import DynamicTable from "./DynamicTable";
import ErrorBoundary from "./ErrorBoundary";

async function getTransactions() {
    if (typeof transactions === "undefined") {
        const url = "/summary";
        const response = await fetch(url);
        return await response.json();
    } else {
        return transactions;
    }
}

function App() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransactions(transactions).then(setTransactions);
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <Box textAlign="center" fontSize="xl">
                <Grid minH="100vh" p={3}>
                    <ColorModeSwitcher justifySelf="flex-end" />
                    <VStack spacing={8}>
                        <ErrorBoundary>
                            <DynamicTable data={transactions} />
                        </ErrorBoundary>
                    </VStack>
                </Grid>
            </Box>
        </ChakraProvider>
    );
}

export default App;
