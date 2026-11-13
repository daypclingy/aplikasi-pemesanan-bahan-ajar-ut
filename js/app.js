new Vue({
    el: '#app',
    data: {
        currentTab: 'stok',
        appData: {},
        dataLoaded: false
    },
    async created() {
        
        const data = await ApiService.fetchBahanAjar();
        if (data) {
            this.appData = data;
            this.dataLoaded = true;
        }
    },
    methods: {
        
        handleUpdateStok(newData) {
            this.appData.stok = newData;
        },
        handleUpdateTracking(newData) {
            this.appData.tracking = newData;
        }
    }
});