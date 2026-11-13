Vue.component('do-tracking', {
    template: '#tpl-tracking',
    props: ['trackingData', 'paketList', 'pengirimanList'],
    data() {
        return {
            searchQuery: '',
            searchResult: null,
            newProgress: '',
            newDO: this.getEmptyDO(),
            selectedPaketObj: null
        };
    },
    methods: {
        formatRp(value) { return `Rp ${value.toLocaleString('id-ID')}`; },
        formatDateLocal() {
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const d = new Date();
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        },
        getEmptyDO() {
            return { id: this.generateDONumber(), nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '', total: 0 };
        },
        generateDONumber() {
            const year = new Date().getFullYear();
            // menghitung data tracking. struktur tracking berupa array of object DO [cite: 1]
            const totalData = this.trackingData.length;
            const seq = (totalData + 1).toString().padStart(3, '0');
            return `DO${year}-${seq}`;
        },
        searchDO() {
            if(!this.searchQuery) return;
            let result = null;
            // loop ke dalam array tracking dari JSON [cite: 1]
            for(let item of this.trackingData) {
                const key = Object.keys(item)[0];
                const val = item[key];
                if (key === this.searchQuery || val.nim === this.searchQuery) {
                    result = { id: key, data: val };
                    break;
                }
            }
            this.searchResult = result;
            if(!result) alert("Data tidak ditemukan");
        },
        clearSearch() {
            this.searchQuery = '';
            this.searchResult = null;
        },
        updateTotalHarga() {
            const paket = this.paketList.find(p => p.kode === this.newDO.paket);
            this.selectedPaketObj = paket;
            this.newDO.total = paket ? paket.harga : 0;
        },
        addProgress() {
            if(!this.newProgress) return;
            const now = new Date();
            const timeString = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            this.searchResult.data.perjalanan.push({ waktu: timeString, keterangan: this.newProgress });
            this.newProgress = '';
            // emit perubahan ke parent
            this.$emit('update-tracking', this.trackingData);
        },
        submitDO() {
            if (!this.newDO.nim || !this.newDO.nama || !this.newDO.paket) return alert("Mohon lengkapi formulir DO!");
            
            // format input date "YYYY-MM-DD" menjadi "DD Bulan YYYY" jika diisi manual
            let formattedDate = this.newDO.tanggalKirim;
            if(!formattedDate) formattedDate = this.formatDateLocal();

            const newEntry = {};
            newEntry[this.newDO.id] = {
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                status: "Diproses",
                ekspedisi: this.newDO.ekspedisi,
                tanggalKirim: formattedDate,
                paket: this.newDO.paket,
                total: this.newDO.total,
                perjalanan: [ { waktu: new Date().toLocaleString('id-ID'), keterangan: "Pesanan Dibuat" } ]
            };

            const updatedData = [...this.trackingData, newEntry];
            this.$emit('update-tracking', updatedData);
            
            alert(`DO ${this.newDO.id} berhasil ditambahkan!`);
            this.newDO = this.getEmptyDO();
            this.selectedPaketObj = null;
        }
    },
    watch: {
        // regenerate nomor DO jika panjang data tracking berubah
        trackingData() { this.newDO.id = this.generateDONumber(); }
    }
});