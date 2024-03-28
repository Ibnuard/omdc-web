import * as React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Chip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { FINANCE_PENGAJUAN, PENGAJUAN } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';

const TABLE_HEAD = [
  'Pengajuan',
  'Tanggal',
  'Induk Cabang',
  'Diajukan Oleh',
  'Nama Client / Vendor',
  'COA',
  'Nominal',
  'Tanggal Disetujui',
  'Tanggal Pengajuan',
  'Status',
  '',
];

const TABLE_HEAD_FINANCE = [
  'Pengajuan',
  'Tanggal',
  'Induk Cabang',
  'Diajukan Oleh',
  'Nama Client / Vendor',
  'COA',
  'Nominal',
  'Tanggal Disetujui',
  'Tanggal Pengajuan',
  'Keterangan Status',
  'Status',
  'Status Finance',
  '',
];

function RiwayatDiajukan() {
  const [rList, setRList] = React.useState([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);

  const { user } = useAuth();

  const ADMIN_TYPE = user?.type;

  const URL = ADMIN_TYPE == 'ADMIN' ? PENGAJUAN : FINANCE_PENGAJUAN;

  const TABLE = ADMIN_TYPE == 'ADMIN' ? TABLE_HEAD : TABLE_HEAD_FINANCE;

  const navigate = useNavigate();

  React.useEffect(() => {
    getReimbursementList();
  }, [page]);

  async function getReimbursementList() {
    const { state, data, error } = await useFetch({
      url: URL + `?limit=${limit}&page=${page}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setRList(data?.rows);
      setPageInfo(data?.pageInfo);
      console.log(data?.pageInfo);
    } else {
      setRList([]);
      console.log(error);
    }
  }

  function statusChip(status: string, finance: string) {
    switch (status) {
      case 'WAITING':
        return <Chip variant={'outlined'} color="amber" value={'Menunggu'} />;
        break;
      case 'APPROVED':
        return (
          <Chip
            variant={'outlined'}
            color="green"
            value={finance == 'DONE' ? 'Selesai' : 'Disetujui'}
          />
        );
        break;
      case 'REJECTED':
        return <Chip variant={'outlined'} color="red" value={'Ditolak'} />;
        break;
      case 'DONE':
        return <Chip variant={'outlined'} color="green" value={'Selesai'} />;
        break;
      default:
        return <Chip variant={'outlined'} color="amber" value={'Menunggu'} />;
        break;
    }
  }

  function keteranganStatus(item: any) {
    if (
      item.jenis_reimbursement !== 'Cash Advance' ||
      item.status_finance !== 'DONE' ||
      item.status !== 'APPROVED'
    ) {
      return '-';
    }

    if (
      item.realisasi?.length > 1 &&
      item.childId &&
      item.status_finance_child == 'DONE'
    ) {
      return 'Sudah Dikembalikan';
    } else {
      return item.childId ? 'Belum dikembalikan' : 'Perlu laporan realisasi';
    }
  }

  return (
    <DefaultLayout>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8 ">
            <div>
              <Typography variant="h5" color="black">
                Diajukan ke Saya
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua riwayat pengajuan oleh user.
              </Typography>
            </div>
          </div>
        </CardHeader>
        {!rList?.length ? (
          <CardBody>
            <div className=" h-96 flex justify-center items-center text-black font-semibold text-sm">
              Belum ada pengajuan
            </div>
          </CardBody>
        ) : (
          <>
            <CardBody className="overflow-scroll px-0">
              <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rList.map((item: any, index) => {
                    const isLast = index === rList?.length - 1;
                    const classes = isLast
                      ? 'p-4'
                      : 'p-4 border-b border-blue-gray-50';

                    return (
                      <tr key={item?.id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.jenis_reimbursement}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" className="font-normal">
                              {item?.tanggal_reimbursement}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.kode_cabang}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.requester?.nm_user}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.name}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.coa}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.nominal}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.accepted_date || '-'}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {moment(item?.createdAt).format('lll') || '-'}
                          </Typography>
                        </td>
                        {ADMIN_TYPE == 'FINANCE' ? (
                          <td className={classes}>
                            {/* <Typography variant="small" className="font-normal">
                              {item?.status_finance}
                            </Typography> */}
                            {keteranganStatus(item)}
                          </td>
                        ) : null}
                        <td className={classes}>
                          {/* <Typography variant="small" className="font-normal">
                            {item?.status}
                          </Typography> */}
                          {statusChip(item?.status, item?.status_finance)}
                        </td>
                        {ADMIN_TYPE == 'FINANCE' ? (
                          <td className={classes}>
                            {/* <Typography variant="small" className="font-normal">
                              {item?.status_finance}
                            </Typography> */}
                            {statusChip(item?.status_finance, '')}
                          </td>
                        ) : null}
                        <td className={classes}>
                          <Tooltip content="Detail">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/reimbursement/admin/${item?.id}`, {
                                  replace: false,
                                  state: item,
                                });
                              }}
                            >
                              <DocumentTextIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Typography variant="small" color="black" className="font-normal">
                Page {page} of {pageInfo?.pageCount}
              </Typography>
              <div className="flex gap-2">
                <Button
                  disabled={page < 2 || loading}
                  variant="outlined"
                  size="sm"
                  color="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                >
                  Previous
                </Button>
                <Button
                  disabled={page == pageInfo?.pageCount || loading}
                  variant="outlined"
                  color="blue"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </DefaultLayout>
  );
}

export default RiwayatDiajukan;
