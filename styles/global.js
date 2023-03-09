import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: '#99b898',
        justifyContent: 'center',
        alignItems: 'center'
    },

    linearBG: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    title: {
        color: '#daf0e0',
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        fontSize: 32
    },

    logo: {
        width: '90%',
        height: '50%'
    },

    textInput: {
        borderWidth: 2,
        borderColor: '#2a363b',
        borderRadius: 10,
        marginBottom: '5%',
        padding: '4%',
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontStyle: 'italic'
    },

    failText: {
        color: '#b52f2f',
        fontFamily: 'Helvetica',
        fontWeight: 'bold'
    },

    pressableRegisterGoBackButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: '#2a363b'
    },

    registerGoBackText: {
        color: '#ffffff',
        fontWeight: '500'
    },

    bold: {
        fontWeight: 'bold'
    },

    italic: {
        fontStyle: 'italic'
    },
    
    underline: {
        textDecorationLine: 'underline'
    },

    helvetica: {
        fontFamily: 'Helvetica'
    }
});

export default styles;