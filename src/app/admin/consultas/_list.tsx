"use client";
import { useEffect, useState } from "react"
import Link from "next/link";
import { AppButton, AppInput, AppLoader, AppModal, AppSelect } from "@/themes/components";
import { getFlashData } from "@/helpers/router";
import ConsultationServices from "@/services/consultation";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import moment from 'moment';
import { getStatusConsultation } from "@/helpers/consultation";

export default function ConsultationList() {

    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [filter, setFilter] = useState({
        date_start: '',
        date_end: '',
        status: ''
    });
    const [page, setPage] = useState(Number(params.get('page') ?? 1));
    const [consultations, setConsultations] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [consultationRemove, setConsultationRemove] = useState<any>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // ======================================================================
    const getConsultations = async (page: number) => {
        setLoading(true);
        const { success, consultations, extra } = await ConsultationServices.getAll(page, filter);
        if (success && consultations) setConsultations(consultations);
        setPagination(extra);
        setLoading(false);
    }
    // -----------
    const handlePage = (type: 'prev' | 'next') => {
        const newPage = type === 'prev' ? page - 1 : page + 1;
        const newParams = new URLSearchParams(params);
        newParams.set('page', newPage.toString());

        router.replace(`${pathname}?${newParams.toString()}`);
        router.refresh();

        setPage(newPage);
        getConsultations(newPage);
    }
    // -----------
    const handleRemove = async (consultation: any) => {
        setConsultationRemove(consultation);
        setSuccess(null);
        setError(null);
    }
    // -----------
    const handleModalConfirmDelete = async () => {
        setConsultationRemove(null);
        setLoading(true);
        await ConsultationServices.delete(consultationRemove.id);
        await getConsultations(1);
        setSuccess('Usuário excluido com sucesso!');
    }
    // -----------
    const handleModalCancelDelete = async () => {
        setConsultationRemove(null);
    }
    // -----------
    useEffect(() => {
        //Recupera usuário
        getConsultations(page);
        //Recupera mensagem 
        (() => {
            const data = getFlashData();
            if (data?.success) setSuccess(data.success);
            if (data?.error) setError(data.error);
        })()

    }, []);
    // ======================================================================
    return (
        <>
            <h3 className="text-[18px] font-bold">Filtros</h3>
            <div className="flex flex-col border-b-[2px] border-[#dedede] p-2">
                <div className="flex gap-2">
                    <AppInput type="date" label="Data início" value={filter.date_start} onChange={(e) => setFilter({ ...filter, date_start: e.target.value })} />
                    <AppInput type="date" label="Data fim" value={filter.date_end} onChange={(e) => setFilter({ ...filter, date_end: e.target.value })} />
                    <AppSelect label="Status" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                        <option value="">Todos</option>
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled">Cancelado</option>
                        <option value="closed">Finalizado</option>
                    </AppSelect>

                </div>
                <AppButton title="Filtrar" className="w-[100px]" type="outline" onClick={() => getConsultations(page)} />
            </div>


            {success && <p className="bg-[#6eef01] px-5 text-center rounded-full color-[white] p-1">{success}</p>}
            {error && <p className="bg-[tomato] px-5 text-center rounded-full color-[white] p-1">{error}</p>}

            {loading && <div className="flex justify-center"><AppLoader size={50} className="self-center" /></div>}
            {!loading && <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    {/* HEADER  */}
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Especialista</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Profissional</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Data</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Ações</th>
                        </tr>
                    </thead>

                    {/* DADOS */}
                    <tbody>
                        {consultations.map(consultation => (
                            <tr key={consultation.id}>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{consultation.specialist.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{consultation.professional.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{moment(consultation.date).format('DD/MM/YYYY')} - {consultation.hour}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{getStatusConsultation(consultation.status)}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                    <i className="ion-ios-trash text-[20px] text-[#ed1b2d]  mx-[10px] cursor-pointer" onClick={() => handleRemove(consultation)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pagination && <div className="flex justify-end mt-[20px]">
                    {!pagination.firstPage && <AppButton title="Anterior" className="mr-[10px]" icon="arrow-left-a" form="round" onClick={() => handlePage('prev')} />}
                    {!pagination.lastPage && <AppButton title="Proximo" className="ml-[10px]" icon="arrow-right-a" form="round" onClick={() => handlePage('next')} />}
                </div>}
            </div>}

            {consultationRemove && <AppModal title="Remover usuário">
                <p>Deseja realmente remover a consulta do dia <b>{moment(consultationRemove.date).format('DD/MM/YYYY')}</b> às <b>{consultationRemove.hour}</b> de <b>{consultationRemove.professional.name}</b> com <b>{consultationRemove.specialist.name}</b>?</p>
                <div className="flex justify-between p-[20px]">
                    <AppButton title="Sim" icon="checkmark" form="round" color="#428f01" onClick={handleModalConfirmDelete} />
                    <AppButton title="Cancelar" icon="close" color="tomato" form="round" onClick={handleModalCancelDelete} />
                </div>

            </AppModal>}
        </>
    )
}