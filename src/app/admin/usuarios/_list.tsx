"use client";
import { useEffect, useState } from "react"
import Link from "next/link";
import { AppButton, AppLoader, AppModal } from "@/themes/components";
import { getFlashData } from "@/helpers/router";
import { getDescricaoNivel } from "@/helpers/usuario";
import UsuarioServices from "@/services/usuario";

export default function UsuarioList() {

    const [ usuarios, setUsuarios ] = useState<any[]>([]);
    const [ usuarioRemove, setUsuarioRemove ] = useState<any>(null);
    const [ success, setSuccess ] = useState<string|null>(null);
    const [ error, setError ] = useState<string|null>(null);
    const [ loading, setLoading ] = useState(true);
    
    // ======================================================================
    const getUsuarios = async () => {
        const { success , usuarios } = await UsuarioServices.getAll();
        if (success && usuarios) setUsuarios(usuarios);
        setLoading(false);
    }
    // -----------
    const handleRemove = async (usuario: any) => {
        setUsuarioRemove(usuario);
        setSuccess(null);
        setError(null);
    }
    // -----------
    const handleModalConfirm = async () => {
        setUsuarioRemove(null);
        setLoading(true);
        await UsuarioServices.delete(usuarioRemove.id);
        await getUsuarios();
        setSuccess('Usuário excluido com sucesso!');
    }
    // -----------
    const handleModalCancel = async () => {
        setUsuarioRemove(null);
    }
    // -----------
    useEffect(() => {
        //Recupera usuário
        getUsuarios();
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
            { success && <p className="bg-[#6eef01] px-5 text-center rounded-full color-[white] p-1">{success}</p> }
            { error && <p className="bg-[tomato] px-5 text-center rounded-full color-[white] p-1">{error}</p> }
            
            { loading && <div className="flex justify-center"><AppLoader size={50} className="self-center"/></div>}
            { !loading &&  <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    {/* HEADER  */}
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Nome</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Email</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Função</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Admin</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Ações</th>
                        </tr>
                    </thead>

                    {/* DADOS */}
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{usuario.nome}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{usuario.email}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{getDescricaoNivel(usuario.nivel_id)}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{usuario.admin ? 'SIM' : 'NÃO'}</td>
                                
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                    <Link href={`/admin/usuarios/editar/${usuario.id}`}>
                                        <i className="ion-edit text-[20px] text-[#1aab67] mx-[10px] cursor-pointer" />
                                    </Link>
                                    <i className="ion-ios-trash text-[20px] text-[#ed1b2d]  mx-[10px] cursor-pointer" onClick={() => handleRemove(usuario)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}

            {usuarioRemove && <AppModal title="Remover usuário">
                <p>Deseja realmente remover o usuário {usuarioRemove.name} ({usuarioRemove.email})?</p>
                <div className="flex justify-between p-[20px]">
                    <AppButton title="Sim" icon="checkmark" form="round" color="#428f01" onClick={handleModalConfirm}/>
                    <AppButton title="Cancelar" icon="close" color="tomato" form="round" onClick={handleModalCancel}/>
                </div>

            </AppModal>}  
        </>
    )
}