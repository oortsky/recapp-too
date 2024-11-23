// Import Supabase client dari konfigurasi yang telah kamu buat
import { supabase } from "./supabase";

/**
 * Function untuk fetch data dari tabel di Supabase.
 * Jika tabel adalah "recaps", data difilter sesuai bulan dan tahun.
 * Jika tabel adalah "types", data diambil semua tanpa filter.
 *
 * @param {string} tableName - Nama tabel di Supabase.
 * @param {number} [month] - Bulan yang diinginkan (1-12) (opsional untuk recaps).
 * @param {number} [year] - Tahun yang diinginkan (opsional untuk recaps).
 * @returns {Promise<any[]>} - Data yang difilter sesuai bulan dan tahun atau semua data untuk tabel tertentu.
 */
export const fetchData = async (tableName, month, year) => {
  try {
    let query = supabase.from(tableName).select("*");

    // Jika tabel adalah "recaps" dan bulan/tahun disediakan, tambahkan filter tanggal
    if (tableName === "recaps" && month && year) {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 1).toISOString();

      query = query.gte("date", startDate).lt("date", endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function untuk menambah data ke table di Supabase
export const createData = async (tableName, newData) => {
  try {
    const { data, error } = await supabase.from(tableName).insert(newData);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
};

// Function untuk memperbarui data di table di Supabase
export const updateData = async (tableName, id, updatedData) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updatedData)
      .eq("id", id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// Function untuk menghapus data dari table di Supabase
export const deleteData = async (tableName, id) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
