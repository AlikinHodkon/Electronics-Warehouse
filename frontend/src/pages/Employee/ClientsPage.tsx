import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTableRefresh} from "../../slices/tableSlice.ts";
import {OrganizationsTable} from "../../components/Organizations/OrganizationsTable.tsx";
import {RootState} from "../../state/store.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchClients} from "../../api/clients.ts";
import {LoadingIndicator} from "../../components/Global/LoadingIndicator.tsx";
import {Pagination} from "../../components/Pagination/Pagination.tsx";
import {queryClient} from "../../api/queryClient.ts";
import {useTranslation} from "react-i18next";
import {AxiosError} from "axios";

export const ClientsPage = () => {
    const tableRefresh = useSelector((state: RootState) => state.table.tableRefresh);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const {t} = useTranslation();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryFn: fetchClients,
        queryKey: ['clients', page, itemsPerPage],

    });

    useEffect(() => {
        queryClient.removeQueries({queryKey: ['clients', page, itemsPerPage]});
        refetch()
        dispatch(setTableRefresh(false));
    }, [tableRefresh]);

    return (
        <div>
            <h1 className="text-3xl text-center p-4">{t('clients')}</h1>
            <div className="px-4 py-4 flex flex-col overflow-auto items-center">
                {isLoading &&
                    <LoadingIndicator/>
                }
                {!data && error && (error as AxiosError).status === 404 &&
                    <>
                        <div className="text-center text-xl">{t('no-clients')}</div>
                        <OrganizationsTable organizations={[]} organizations_type="clients" />
                    </>
                }
                {error && (error as AxiosError).status !== 404 &&
                    <div className="text-center text-xl">{error.message}</div>
                }
                {!isLoading && !isError &&
                    <>
                    {data &&
                        <>
                            <OrganizationsTable organizations={data.clients} organizations_type="clients" />
                            <Pagination
                                currentPage={page}
                                setCurrentPage={setPage}
                                pageCount={data.pagination}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
                            />
                        </>
                    }
                    </>
                }
            </div>
        </div>
    )
}