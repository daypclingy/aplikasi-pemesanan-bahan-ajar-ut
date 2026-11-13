Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    props: ['stokData', 'upbjjList', 'kategoriList'],
    data() {
        return {
            filterUpbjj: '',
            filterKategori: '',
            filterWarning: false,
            sortBy: '',
            isEditing: false,
            formData: this.getEmptyForm()
        };
    },
    computed: {
        filteredAndSortedStok() {
            let result = this.stokData;

            // dependent Filter
            if (this.filterUpbjj) {
                result = result.filter(s => s.upbjj === this.filterUpbjj);
                if (this.filterKategori) {
                    result = result.filter(s => s.kategori === this.filterKategori);
                }
            }

            // filter warning (< safety OR == 0)
            if (this.filterWarning) {
                result = result.filter(s => s.qty < s.safety || s.qty === 0);
            }

            // sort
            if (this.sortBy) {
                result = [...result].sort((a, b) => {
                    let valA = a[this.sortBy];
                    let valB = b[this.sortBy];
                    if (valA < valB) return -1;
                    if (valA > valB) return 1;
                    return 0;
                });
            }
            return result;
        }
    },
    watch: {
        filterUpbjj(newVal) {
            if (!newVal) this.filterKategori = '';
        }
    },
    methods: {
        formatRp(value) { return `Rp ${value.toLocaleString('id-ID')}`; },
        statusClass(qty, safety) {
            if (qty == 0) return 'status-kosong';
            if (qty < safety) return 'status-menipis';
            return 'status-aman';
        },
        statusText(qty, safety) {
            if (qty == 0) return '🟥 Kosong';
            if (qty < safety) return '🟧 Menipis';
            return '🟩 Aman';
        },
        stripHtml(html) {
            let doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || "";
        },
        resetFilter() {
            this.filterUpbjj = ''; this.filterKategori = '';
            this.filterWarning = false; this.sortBy = '';
        },
        getEmptyForm() {
            return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: null, qty: null, safety: null, catatanHTML: '' };
        },
        editItem(item) {
            this.isEditing = true;
            this.formData = { ...item };
        },
        deleteItem(kode) {
            if(confirm("Apakah Anda yakin ingin menghapus data stok ini?")) {
                this.$emit('update-stok', this.stokData.filter(s => s.kode !== kode));
            }
        },
        saveData() {
            
            if (!this.formData.kode || !this.formData.judul) return alert("Mohon lengkapi kode dan judul!");
            
            let updatedStok = [...this.stokData];
            if (this.isEditing) {
                const index = updatedStok.findIndex(s => s.kode === this.formData.kode);
                if (index !== -1) updatedStok[index] = { ...this.formData };
            } else {
                updatedStok.push({ ...this.formData });
            }
            this.$emit('update-stok', updatedStok);
            this.isEditing = false;
            this.formData = this.getEmptyForm();
        }
    }
});