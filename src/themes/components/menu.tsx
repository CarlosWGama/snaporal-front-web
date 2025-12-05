"use client";
import { useRouter } from "next/navigation";
import AppMenuItem from "./menu-item";
import UserServices from "@/services/user";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AppMenu() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    // ==============================================================================
    const handleLogout = async () => {
        UserServices.logout();
        router.replace('/');
    }
    // --------------------------
    useEffect(() => {
        setUser(UserServices.getCurrentUser());
    }, []);
    // ==============================================================================
    return (
        <div className="w-[60px] md:w-[300px] bg-(--background-primary) flex flex-col pt-[50px]">
            <div className="hidden md:flex flex-col">
                <h1 className="text-[20px] font-bold text-center">GERENCIADOR WEB</h1>
                <h2 className="text-center">Bem vindo!</h2>
                <h2 className="text-center font-bold">{user?.nome} ({user?.email})</h2>
                <Link href={`/admin/usuarios/editar/${user?.id}`}>
                    <p className="text-center">Editar perfil</p>
                </Link>

                <div className="bg-(--background-secondary) h-[6px] my-5" />
            </div>

            {/* OPÇÕES */}
            <div className="pl-[30px] mt-[30px] flex-1">
                <AppMenuItem title="Dashboard" icon="grid" url="/admin/dashboard" />
                <AppMenuItem title="Usuários" icon="ios-people" url="/admin/usuarios" />
                <AppMenuItem title="Consultas" icon="calendar" url="/admin/consultas" />
            </div>

            {/* LOGOUT */}
            <div>
                <h1 className="mb-[50px] text-[18px] text-center text-[red] cursor-pointer font-bold flex-row" onClick={handleLogout}>
                    <i className="ion-log-out mr-[5px]" />
                    <span className="hidden md:flex justify-center">Sair</span>
                </h1>
            </div>
        </div>
    )
}