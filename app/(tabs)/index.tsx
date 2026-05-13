import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaksi {
  id: string;
  ket: string;
  nominal: number;
  tipe: "masuk" | "keluar";
}

export default function ExpenseTrackerScreen() {
  // --- LOGIKA STATE ---
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]); // Definisikan tipe array Transaksi
  const [deskripsi, setDeskripsi] = useState(""); // State untuk input teks
  const [nominal, setNominal] = useState(""); // State untuk input angka

  // --- LOGIKA HITUNG SALDO ---
  const totalSaldo = transaksi.reduce((acc, curr) => {
    return curr.tipe === "masuk" ? acc + curr.nominal : acc - curr.nominal;
  }, 0);

  // --- FUNGSI TAMBAH DATA ---
  const tambahTransaksi = (tipe: "masuk" | "keluar") => {
    if (deskripsi.trim() === "" || nominal.trim() === "") {
      Alert.alert("Peringatan", "Harap isi deskripsi dan nominal!");
      return;
    }

    const itemBaru: Transaksi = {
      id: Date.now().toString(),
      ket: deskripsi,
      nominal: parseInt(nominal) || 0,
      tipe: tipe,
    };

    setTransaksi([...transaksi, itemBaru]);
    setDeskripsi("");
    setNominal("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1. HEADER SALDO */}
        <View style={styles.headerCard}>
          <Text style={styles.headerLabel}>Total Saldo Saat Ini</Text>
          <Text style={styles.saldoValue}>
            Rp {totalSaldo.toLocaleString()}
          </Text>
        </View>

        {/* 2. FORM INPUT */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.sectionTitle}>Tambah Transaksi</Text>
          <TextInput
            style={styles.input}
            placeholder="Deskripsi (ex: Uang Saku)"
            value={deskripsi}
            onChangeText={setDeskripsi}
          />
          <TextInput
            style={styles.input}
            placeholder="Nominal (ex: 50000)"
            keyboardType="numeric"
            value={nominal}
            onChangeText={setNominal}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.btnMasuk]}
              onPress={() => tambahTransaksi("masuk")}
            >
              <Text style={styles.btnText}>Pemasukan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnKeluar]}
              onPress={() => tambahTransaksi("keluar")}
            >
              <Text style={styles.btnText}>Pengeluaran</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* 3. LIST HISTORY */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Riwayat</Text>
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyCard}>
              <Text style={styles.txtKet}>{item.ket}</Text>
              {/* CONDITIONAL STYLING: Hijau jika masuk, Merah jika keluar */}
              <Text
                style={[
                  styles.txtNominal,
                  { color: item.tipe === "masuk" ? "#27ae60" : "#e74c3c" },
                ]}
              >
                {item.tipe === "masuk" ? "+" : "-"} Rp{" "}
                {item.nominal.toLocaleString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyTxt}>Belum ada riwayat transaksi.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  headerCard: {
    backgroundColor: "#34495e",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 25,
    elevation: 5,
  },
  headerLabel: { color: "#bdc3c7", fontSize: 14, marginBottom: 5 },
  saldoValue: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  input: {
    backgroundColor: "#ecf0f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: "center" },
  btnMasuk: { backgroundColor: "#27ae60" },
  btnKeluar: { backgroundColor: "#e74c3c" },
  btnText: { color: "#fff", fontWeight: "bold" },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f1f2f6",
  },
  txtKet: { fontSize: 16, color: "#2c3e50" },
  txtNominal: { fontSize: 16, fontWeight: "bold" },
  emptyTxt: { textAlign: "center", marginTop: 20, color: "#95a5a6" },
});
