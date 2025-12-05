import { AppButton, AppMainContainer } from "@/themes/components";
import ConsultationList from "./_list";

export const metadata = {
    title: 'Lista de Consultas'
}
// ==========================================================
export default function UsersPage() {

    // ==========================================================
    return (
        <AppMainContainer title="Teleconsultas">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-[20px]">Lista de teleconsultas</h1>
            </div>

            <ConsultationList />
        </AppMainContainer>
    )
}