"use client";
import { AppButton, AppInput, AppLoader, AppModal } from "@/themes/components";
import { Formik } from "formik";
import Image from "next/image";
import { useState } from "react";
import * as Yup from 'yup';
import UserServices from "@/services/usuario";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [email, setEmail] = useState('');
    const [errorLogin, setErrorLogin] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [messageResetPassword, setMessageResetPassword] = useState<{ success: boolean, message: string } | null>(null);
    const router = useRouter();
    // ======================================================
    const onSubmitLogin = async ({ email, password }: any) => {

        setErrorLogin(null);
        const { success } = await UserServices.login(email, password);
        if (success)
            router.push('/admin/dashboard');
        else
            setErrorLogin('Login ou senha incorreta');
    }
    // -------
    const onSubmitResetPassword = async () => {

        setErrorLogin(null);
        setMessageResetPassword(null);
        setLoading(true);
        const { success } = await UserServices.resetPassword(email);
        if (success)
            setMessageResetPassword({ success: true, message: 'Olhe a sua caixa de email para reseta a senha' });
        else
            setMessageResetPassword({ success: false, message: 'Não foi possível resetar a senha. Verifique se o email está correto!' });
        setLoading(false);
    }
    // --------
    const closeModal = () => {
        setEmail('');
        setShowResetPasswordModal(false);
    }
    // ======================================================
    return (
        <>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string().required('Campo obrigatório').email('Campo precisa ser um email'),
                    password: Yup.string().required('Campo obrigatório').min(6, 'Campo precisa ter pelo menos 6 caracteres')
                })}
                onSubmit={onSubmitLogin}
            >
                {({ handleChange, handleSubmit, isSubmitting, isValid, errors }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="w-[336px] flex flex-col">

                            <h1 className="ff-default text-[37px] text-center">Entrar</h1>
                            <AppInput placeholder="EMAIL" name="email" onChange={handleChange} icon="ios-email" error={errors.email} />
                            <AppInput placeholder="SENHA" name="password" type="password" onChange={handleChange} icon="locked" openPassword error={errors.password} />

                            <p className="cursor-pointer text-[11px] ff-default text-[#4703D0]" onClick={() => setShowResetPasswordModal(true)}>Esqueci minha senha</p>

                            {errorLogin && <p className="text-[tomato] ff-default text-[20px] text-center mt-3">{errorLogin}</p>}


                            <AppButton title="Entrar" onClick={handleSubmit} disabled={isSubmitting || !isValid} form="round" />

                            <p className="ff-default text-center"> Não tem conta? Entre em contato com o desenvolvedor</p>
                        </div>
                    </form>
                )}
            </Formik>

            {/* MODAL - RESETAR SENHA */}
            {showResetPasswordModal && <AppModal title="Esqueci a senha" onClose={() => closeModal()}>
                <div className="flex-col flex items-stretch">

                    <Image className="self-center my-10" src="/assets/img/icons/reset-password.png" alt="ícone resetar senha" width={120} height={120} />

                    <p className="text-center ff-default text-[16px]">Digite seu E-mail e clique em "Enviar" para receber um email para redefinir sua senha.</p>

                    <AppInput placeholder="Digite seu email" icon="android-mail" value={email} onChange={(e) => setEmail(e.target.value)} />

                    {messageResetPassword?.success == false && <p className="text-[tomato] ff-default text-[20px] text-center mt-3">{messageResetPassword.message}</p>}
                    {messageResetPassword?.success == true && <p className="text-[green] ff-default text-[20px] text-center mt-3">{messageResetPassword.message}</p>}

                    {loading && <AppLoader className="self-center" />}
                    <div className="flex justify-between">
                        <AppButton title="Cancelar" onClick={closeModal} type="outline" color="tomato" form="round" className="w-[170px]" />
                        <AppButton title="Enviar" onClick={onSubmitResetPassword} form="round" className="w-[170px]" />
                    </div>
                </div>
            </AppModal>}
        </>
    )
}