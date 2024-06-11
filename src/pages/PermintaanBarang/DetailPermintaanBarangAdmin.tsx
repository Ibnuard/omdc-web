import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import useModal from '../../hooks/useModal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { colors } from '@material-tailwind/react/types/generic';
import useFetch from '../../hooks/useFetch';
import {
  BARANG_ADMIN_APPROVAL,
  DETAIL_REQUEST_BARANG,
  REIMBURSEMENT_DETAIL,
} from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import {
  Button as MButton,
  Card,
  Chip,
  List,
  ListItem,
} from '@material-tailwind/react';
import moment from 'moment';
import FileModal from '../../components/Modal/FileModal';
import Button from '../../components/Button';
import ModalSelector from '../../components/Modal/ModalSelctor';

const DetailPermintaanBarangAdmin: React.FC = () => {
  const {
    show,
    hide,
    toggle,
    visible,
    type,
    changeType,
    context,
    changeContext,
  } = useModal();

  // use nav
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // data state
  const [data, setData] = React.useState<any>([]);
  const [barang, setBarang] = React.useState<any>([]);
  const [adminResult, setAdminResult] = React.useState<any>();
  const [showFile, setShowFile] = React.useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState<any>();
  const [note, setNote] = React.useState('');

  const ID_PB = data?.id_pb;

  console.log(adminResult);
  console.log('DATA', data);

  const state = location.state;

  React.useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    } else {
      setData(state);
      setAdminResult({
        approval_admin_status: state.approval_admin_status,
        approval_admin_date: state.approval_admin_date,
        keterangan: state.keterangan,
        status_pb: state.status_pb,
      });
      getDetails(id);
    }
  }, []);

  async function getDetails(id: any) {
    show();
    const { state, data, error } = await useFetch({
      url: DETAIL_REQUEST_BARANG(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setBarang(data);
    } else {
      hide();
    }
  }

  // [Start Approval]
  async function onAdminApproval() {
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: BARANG_ADMIN_APPROVAL(ID_PB, context),
      method: 'POST',
      data: {
        note: note,
      },
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      setAdminResult(data);
    } else {
      changeType('FAILED');
    }
  }
  // [End Approval]

  function statusWording(): { text: string; color: colors } {
    switch (data?.status_approve?.toLowerCase()) {
      case 'ditolak':
        return { text: 'Ditolak', color: 'red' };
        break;
      case 'disetujui sebagian':
        return { text: 'Disetujui Sebagian', color: 'light-blue' };
        break;
      case 'disetujui':
        return { text: 'Disetujui', color: 'green' };
        break;
      default:
        return { text: 'Menunggu', color: 'amber' };
        break;
    }
  }

  function statusPengajuanWording(): { text: string; color: string } {
    switch (adminResult?.approval_admin_status) {
      case 'REJECTED':
        return { text: 'Ditolak', color: 'text-red-500' };
        break;
      case 'APPROVED':
        return { text: 'Disetujui', color: 'text-green-500' };
        break;
      default:
        return { text: 'Menunggu Disetujui', color: 'text-amber-500' };
        break;
    }
  }

  function renderChip() {
    if (adminResult?.status_pb == 'Disetujui') {
      return <Chip variant={'outlined'} color="green" value={'Diterima'} />;
    }

    if (adminResult?.status_pb == 'Ditolak') {
      return <Chip variant={'outlined'} color="red" value={'Ditolak'} />;
    }

    return (
      <Chip variant={'outlined'} color="amber" value={adminResult?.status_pb} />
    );
  }

  function renderStatusApproval(smHidden: boolean) {
    const visibility = smHidden ? 'sm:hidden' : 'hidden sm:block';
    return (
      <div>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Status Permintaan Barang
            </h3>
            {renderChip()}
          </div>
          <div className=" px-6.5 py-4.5  flex flex-col">
            <div className=" w-full flex justify-between">
              <label className="mb-3 block text-black dark:text-white">
                Approval oleh
              </label>
              <span className=" text-black font-bold">
                {data?.approval_admin_name || '-'}
              </span>
            </div>
          </div>
          <div className=" px-6.5 mb-4.5 flex flex-col">
            <div className=" w-full flex justify-between">
              <label className="mb-3 block text-black dark:text-white">
                Status Approval
              </label>
              <span className={statusPengajuanWording().color}>
                {statusPengajuanWording().text}
              </span>
            </div>
          </div>
          <div className=" px-6.5 mb-4.5 flex flex-col">
            <div className=" w-full flex justify-between">
              <label className="mb-3 block text-black dark:text-white">
                Tanggal Persetujuan
              </label>
              <span className=" text-black font-bold">
                {adminResult?.approval_admin_date || '-'}
              </span>
            </div>
          </div>
          <div className=" px-6.5 mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Catatan ( Opsional )
            </label>
            <textarea
              rows={3}
              disabled={adminResult?.approval_admin_status !== 'WAITING'}
              placeholder="Masukan Catatan"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={
                adminResult?.approval_admin_status !== 'WAITING'
                  ? adminResult?.keterangan
                  : note
              }
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          {adminResult?.approval_admin_status == 'WAITING' && (
            <div className="w-full px-6.5 mb-4.5 flex flex-col gap-y-2">
              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                  changeType('CONFIRM');
                  changeContext('ACC');
                  show();
                }}
              >
                Setujui
              </Button>
              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                  changeType('CONFIRM');
                  changeContext('REJ');
                  show();
                }}
                className=" bg-red-400 border-red-400"
              >
                Tolak
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderStatusPengajuan(smHidden: boolean) {
    const visibility = smHidden ? 'sm:hidden' : 'hidden sm:block';
    return (
      <div>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Status Permintaan
            </h3>
            <Chip
              variant={'outlined'}
              color={statusWording().color}
              value={statusWording().text}
            />
          </div>
          <div className=" p-6.5 flex flex-col gap-y-6">
            <div className=" w-full flex justify-between">
              <label className="mb-3 block text-black dark:text-white">
                Tanggal Persetujuan
              </label>
              <span className=" text-black font-bold">
                {data?.tgl_approve || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {renderStatusApproval(false)}
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Data Permintaan
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6">
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      ID Permintaan Barang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.id_pb}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Cabang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.nm_induk}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Kirim Ke
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.nm_cabang}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Alamat Pengiriman
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.alamat}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Waktu Pengajuan
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {moment(data?.tgl_trans).format('ll')} {data?.jam_trans}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* {renderStatusApproval(false)}
          {renderStatusPengajuan(false)} */}

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Detail Barang
              </h3>
            </div>
            <div className=" p-6.5 flex flex-col gap-y-6">
              <div className=" w-full">
                <List>
                  {barang?.map((item: any, index: number) => {
                    // status pb
                    const statusPB = item?.status_pb?.toLowerCase();
                    let statusTextColor = '';

                    if (statusPB == 'dibatalkan') {
                      statusTextColor = 'text-red-500';
                    } else if (statusPB == 'diproses') {
                      statusTextColor = 'text-blue-500';
                    } else if (statusPB == 'diterima') {
                      statusTextColor = 'text-green-500';
                    }

                    return (
                      <ListItem
                        key={item + index}
                        ripple={false}
                        className="py-2 pr-1 pl-4 "
                      >
                        <div className=" flex flex-col">
                          <span className=" text-base font-bold text-black mb-2">
                            {item?.nm_barang}
                          </span>
                          <span className=" text-xs text-blue-gray-300">
                            Stock: {item?.jml_kemasan} {item?.nm_kemasan}
                          </span>
                          <span className=" text-xs text-blue-gray-300">
                            Permintaan: {item?.qty_stock} {item?.nm_kemasan}
                          </span>
                          <span className=" text-xs text-blue-gray-300">
                            Keterangan: {item?.requestData?.keterangan || '-'}
                          </span>
                          <span className=" mt-4 text-xs text-blue-gray-300">
                            Status Approve:{' '}
                            <span className={statusTextColor}>
                              {item?.status_pb || '-'}
                            </span>
                          </span>
                          <MButton
                            className=" mt-4"
                            size={'sm'}
                            variant={'outlined'}
                            fullWidth
                            color={'blue'}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFile(item);
                              setShowFile(!showFile);
                            }}
                          >
                            Lihat lampiran
                          </MButton>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FileModal
        data={selectedFile?.attachment}
        visible={showFile}
        toggle={() => setShowFile(!showFile)}
      />
      <ModalSelector
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={() => onAdminApproval()}
        onDone={() => {
          hide();
        }}
      />
    </DefaultLayout>
  );
};

export default DetailPermintaanBarangAdmin;