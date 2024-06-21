import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import ItemModal from '../../components/Modal/ItemModal';
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemSuffix,
} from '@material-tailwind/react';
import formatRupiah from '../../common/formatRupiah';
import { hitungTotalNominal } from '../../common/utils';
import BankModal from '../../components/Modal/BankModal';
import useFetch from '../../hooks/useFetch';
import { GET_BANK_NAME, REIMBURSEMENT } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import COAModal from '../../components/Modal/COAModal';
import CabangModal from '../../components/Modal/CabangModal';
import { useAuth } from '../../hooks/useAuth';
import AdminModal from '../../components/Modal/AdminModal';
import Modal from '../../components/Modal/Modal';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalSelector from '../../components/Modal/ModalSelctor';
import PaymentGroup from '../../components/SelectGroup/PaymentGroup';
import TipePembayaranGroup from '../../components/SelectGroup/TipePembayaranGroup';

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const BuatReport: React.FC = () => {
  const { show, hide, toggle, visible, type, changeType } = useModal();
  const { user } = useAuth();
  const { state } = useLocation();
  // use nav
  const navigate = useNavigate();

  if (!state) {
    navigate('/', { replace: true });
  }

  // state
  const [stateData, setStateData] = React.useState<any>(state);
  const [jenis, setJenis] = React.useState<string>('CAR');
  const [coa, setCoa] = React.useState<string>();
  const [cabang, setCabang] = React.useState<string | any>();
  const [nominal, setNominal] = React.useState<string | number>();
  const [nomorWA, setNomorWA] = React.useState<string>(user?.nomorwa);
  const [desc, setDesc] = React.useState<string>();
  const [name, setName] = React.useState<string>();
  const [result, setResult] = React.useState<any>();
  const [fileInfo, setFileInfo] = React.useState<any>();
  const [selectDate, setSelectDate] = React.useState<Date>();
  const [item, setItem] = React.useState<any>([]);
  const [admin, setAdmin] = React.useState<any>();
  const [payment, setPayment] = React.useState<any>();
  const [tipePembayaran, setTipePembayaran] = React.useState<any>();

  // Bank Modal State
  const [needBank, setNeedBank] = React.useState(false);
  const [showBank, setShowBank] = React.useState<boolean>(false);
  const [selectedBank, setSelectedBank] = React.useState<any>();
  const [bankRek, setBankRek] = React.useState<string>('');
  const [bankDetail, setBankDetail] = React.useState<any>();

  // Data Modal Satte
  const [showCoa, setShowCoa] = React.useState<boolean>(false);
  const [showCabang, setShowCabang] = React.useState<boolean>(false);
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false);
  const [showItem, setShowItem] = React.useState<boolean>(false);

  // Const
  const isNeedName = jenis == 'PR' || jenis == 'CAR' || jenis == 'PC';

  // dsabled n=button
  const disabledByType = () => {
    if (isNeedName) {
      return !name;
    }
  };

  const disabledByBank = () => {
    if (jenis == 'CAR' && !needBank) {
      return false;
    }

    if (payment == 'TRANSFER') {
      return !bankDetail;
    }

    return !payment;
  };

  const buttonDisabled =
    !jenis ||
    !coa ||
    !cabang ||
    !nominal ||
    !nomorWA ||
    !desc ||
    !result ||
    !selectDate ||
    !admin ||
    !item.length ||
    !tipePembayaran ||
    disabledByBank() ||
    disabledByType();

  console.log('BUTTON DISABLED ' + buttonDisabled);
  console.log('DISABLED BY BANNK', disabledByBank());

  // handle attachment
  function handleAttachment(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const maxSize = 1048576;

    // handle file type
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    // Memeriksa apakah ukuran file melebihi batas maksimum (1 MB)
    if (file.size > maxSize) {
      alert(
        'Ukuran file terlalu besar! Harap pilih file yang lebih kecil dari 1 MB.',
      );
      event.target.value = null; // Mengosongkan input file
      return; // Menghentikan eksekusi lebih lanjut
    }

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64string: any = reader.result;

      const splitted = base64string?.split(';base64,');

      setResult(splitted[1]);
    };

    setFileInfo(fileInfo);
  }

  // handle nominal
  React.useEffect(() => {
    const nominal = hitungTotalNominal(item);

    setNominal(formatRupiah(nominal, true));
  }, [item]);

  // handle is need bank
  React.useEffect(() => {
    const _frel = String(nominal)?.replace('Rp. ', '').replace(/\./g, '');
    const _fnom = stateData?.nominal?.replace('Rp. ', '').replace(/\./g, '');

    const _sal = parseInt(_fnom) - parseInt(_frel);

    if (_sal > 0) {
      setNeedBank(false);
      console.log('No Need Bank');
    } else {
      setNeedBank(true);
      console.log('Need Bank');
    }

    setPayment(null);
    setSelectedBank(null);
  }, [nominal]);

  // on Cek REKENING
  async function onCekRek(e: any) {
    e.preventDefault();

    const regex = /^[0-9]+$/;

    if (!regex.test(bankRek)) {
      alert('Nomor rekening tidak valid!');
      return;
    }

    const { state, data, error } = await useFetch({
      url: GET_BANK_NAME(selectedBank?.kodeBank, bankRek),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setBankDetail(data);
      console.log(data);
    } else {
      alert('Ada kesalahan, mohon coba lagi!');
    }
  }

  // delete item by ID
  function hapusDataById(id: number) {
    let data = item;
    data = data.filter((item: any) => item.id !== id);

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.id = index;
    }

    setItem(data);
  }

  // Pengajuan
  async function pengajuanReimbursement() {
    changeType('LOADING');
    // formated date
    const formattedDate = moment(selectDate).format('YYYY-MM-DD');

    const body = {
      type: jenis,
      date: formattedDate,
      cabang: cabang,
      description: desc,
      attachment: result,
      bank_detail: bankDetail || {},
      nominal: nominal,
      name: name,
      item: item,
      coa: coa,
      file: fileInfo,
      approved_by: admin?.iduser,
      parentId: stateData?.id || '',
      payment_type: payment || stateData.payment_type,
      tipePembayaran: tipePembayaran,
    };

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  React.useEffect(() => {
    if (state) {
      setCabang(state?.kode_cabang.split('-')[0].trim());
      setCoa(state?.coa);
    }
  }, [state]);

  console.log(payment);

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Form Report Cash Advance
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6">
                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Jenis Request of Payment
                      </label>
                      <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        {'Cash Advance Report'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <TipePembayaranGroup
                      value={(val) => setTipePembayaran(val)}
                    />
                  </div>

                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        No. Doc Cash Advance
                      </label>
                      <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        {stateData?.no_doc}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        COA / Grup Biaya
                      </label>
                      <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        {stateData?.coa}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <DatePicker onChange={(date) => setSelectDate(date)} />
                  </div>

                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Cabang
                      </label>
                      <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        {stateData?.kode_cabang}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Approval ke
                      </label>
                      <div
                        onClick={() => setShowAdmin(!showAdmin)}
                        className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      >
                        {admin?.nm_user || 'Pilih Admin'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="Masukan Nomor WA"
                      className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={nomorWA}
                      onChange={(e) => setNomorWA(e.target.value)}
                    />
                  </div>

                  {isNeedName ? (
                    <div className="w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Nama Reimbursement
                      </label>
                      <input
                        type="text"
                        placeholder="Masukan Nama Client / Vendor"
                        className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  ) : null}
                </div>

                <div className="mb-4.5">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Lampirkan File ( Maks. 1MB )
                    </label>
                    <input
                      type="file"
                      className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      accept=".pdf,image/*"
                      onChange={handleAttachment}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Deskripsi
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Masukan Deskripsi"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Sign In Form --> */}
          {needBank && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Data Pembayaran
                </h3>
              </div>
              <form action="#">
                <div className="p-6.5">
                  <div className="w-full mb-4.5">
                    <PaymentGroup value={(val) => setPayment(val)} />
                  </div>
                  {payment && payment == 'TRANSFER' ? (
                    <>
                      <div className="mb-4.5">
                        <div>
                          <label className="mb-3 block text-black dark:text-white">
                            Bank
                          </label>
                          <div
                            onClick={() =>
                              bankDetail?.accountname?.length
                                ? null
                                : setShowBank(!showBank)
                            }
                            className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                          >
                            {selectedBank?.namaBank || 'Pilih Bank'}
                          </div>
                        </div>
                      </div>

                      <div className="w-full mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Nomor Rekening
                        </label>
                        <div className=" flex gap-x-4">
                          <input
                            type="text"
                            disabled={bankDetail?.accountname?.length}
                            placeholder="Masukan Nomor Rekening"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            value={bankRek}
                            onChange={(e) => setBankRek(e.target.value)}
                          />
                          <Button
                            disabled={bankDetail?.accountname?.length}
                            onClick={onCekRek}
                          >
                            Cek Nomor
                          </Button>
                        </div>
                      </div>

                      {bankDetail?.accountname ? (
                        <div className="w-full">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Nama Pemilik Rekening
                          </label>
                          <input
                            type="text"
                            disabled
                            placeholder="Nama Pemilik Rekening"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            value={bankDetail?.accountname}
                          />
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </form>
            </div>
          )}

          {/* <!-- Sign Up Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Item</h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                {item?.length ? (
                  <div className="mb-4">
                    <Card>
                      <List>
                        {item.map((item: any, index: number) => {
                          return (
                            <ListItem
                              key={item + index}
                              ripple={false}
                              className="py-1 pr-1 pl-4"
                            >
                              {item?.name}
                              <ListItemSuffix className="flex gap-x-4">
                                {formatRupiah(item.nominal, true)}
                                <IconButton
                                  variant="text"
                                  color="blue-gray"
                                  onClick={() => hapusDataById(item?.id)}
                                >
                                  <TrashIcon />
                                </IconButton>
                              </ListItemSuffix>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Card>
                  </div>
                ) : null}

                <div className="mb-4">
                  <Button
                    mode="outlined"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setShowItem(!showItem);
                    }}
                  >
                    Tambah Item
                  </Button>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nominal
                  </label>
                  <input
                    disabled
                    type="text"
                    defaultValue={'Rp. 0'}
                    placeholder="Enter your full name"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={nominal}
                  />
                </div>
                <div className="mb-8">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nominal Cash Advance
                  </label>
                  <input
                    disabled
                    type="text"
                    defaultValue={'Rp. 0'}
                    placeholder="Enter your full name"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={stateData?.nominal}
                  />
                </div>
                <Button
                  onClick={(e: any) => {
                    e.preventDefault();
                    changeType('CONFIRM');
                    show();
                  }}
                  isLoading
                  disabled={buttonDisabled}
                >
                  Buat Pengajuan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* MODAL CONTAINER */}
      <Modal visible={visible} toggle={toggle} />
      <ItemModal
        visible={showItem}
        toggle={() => setShowItem(!showItem)}
        value={(cb: any) => setItem([...item, { ...cb, id: item.length + 1 }])}
        includeData={item}
      />
      <BankModal
        visible={showBank}
        toggle={() => setShowBank(!showBank)}
        value={(val: any) => {
          setSelectedBank(val);
          setBankRek('');
          setBankDetail({});
        }}
      />
      <COAModal
        visible={showCoa}
        toggle={() => setShowCoa(!showCoa)}
        value={(val: any) => setCoa(val)}
      />
      <CabangModal
        visible={showCabang}
        toggle={() => setShowCabang(!showCabang)}
        value={(val: any) => setCabang(val)}
      />
      <AdminModal
        visible={showAdmin}
        toggle={() => setShowAdmin(!showAdmin)}
        value={(val: any) => setAdmin(val)}
      />
      <ModalSelector
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={() => pengajuanReimbursement()}
        onDone={() => {
          hide();
          type == 'SUCCESS' ? navigate('/', { replace: true }) : null;
        }}
      />
    </DefaultLayout>
  );
};

export default BuatReport;
