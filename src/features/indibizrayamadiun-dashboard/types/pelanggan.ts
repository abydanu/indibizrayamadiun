export type PelangganStatus =
  | "PS"
  | "CANCEL"
  | "KENDALA"
  | "REVOKE"
  | "QC1"
  | "PI"
  | "FALLOUT"
  | "WFM_UNSC"
  | "PAPERLESS"
  | "DECLINE_FCC"
  | "PT3_WAITING_AKTIVASI"
  | "FOLLOWUP_TO_COMPLETE"
  | null;

export interface Pelanggan {
	id: string;
	nama: string;
	wilayah_id: string;
	paket_id: string;
	sales_id: string;
	no_hp_1: string;
	no_hp_2: string | null;
	kordinat: string;
	alamat: string;
	nama_pic: string;
	ttl_pic: string;
	no_ktp: string;
	email: string;
	nomer_ao: string | null;
	status: PelangganStatus;
	foto_ktp: string;
	foto_selfie: string;
    foto_lokasi: string;
	bukti_usaha: string;
	bukti_niwp: string;
	created_at: string;
	updated_at: string;

	datel_nama?: string;
	paket_nama?: string;
	sales_nama?: string;
	sales_kode?: string;
	sales_datel_nama?: string;
	sales_agency_nama?: string;
}

export interface PelangganValidationPayload {
	status?: PelangganStatus;
	nomer_ao?: string;
	keterangan?: string;
}

