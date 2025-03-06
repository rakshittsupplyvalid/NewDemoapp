import { StyleSheet } from 'react-native';

export const tableStyles = StyleSheet.create({
    container: {
        
        padding: 20,
        backgroundColor: '#ffffff',
        
    },
    searchInput: {
        marginBottom: 20,
        padding: 12,
        borderWidth: 1,
        borderColor: '#455048',
        borderRadius: 8,
        fontSize: 16,
    
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#6b7b8f',
        paddingVertical: 12,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        paddingHorizontal : 14
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16,
        color: '#ffffff',
        letterSpacing : 1
     
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 16,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 2,
        borderBottomColor: '#e9ecef',
        paddingHorizontal : 14,
        borderLeftWidth : 1,
        borderLeftColor :'#e9ecef',
        borderRightWidth : 1,
        borderRightColor :'#e9ecef',
        
    },
    cell: {
        flex: 1,
       
        fontSize: 15,
        fontWeight: '400',
        color: '#2e2e2e',
        
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6c757d',
        marginTop: 20,
    },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: 500, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  closeButton: { marginTop: 15, backgroundColor: 'red', padding: 10, borderRadius: 5 },
});
