import { Metadata } from "next";
import { FormRecuperarSenha } from "./_form";

export const metadata: Metadata = {
    title: 'Recuperar Senha',
}
// ===============================================
export default function RecuperarSenhaPage({ params }: { params: { token: string } }) {
    const { token } = params;
    // ===============================================================
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Recuperar Senha
                </h2>

                <FormRecuperarSenha token={token} />
            </div>
        </div>
    );
}
