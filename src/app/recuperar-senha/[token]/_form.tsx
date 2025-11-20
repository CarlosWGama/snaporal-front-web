"use client";
import { Formik } from 'formik';
import { useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import { AppInput, AppLoader } from '@/themes/components';
import { AppButton } from '@/themes/components';
import UserServices from '@/services/usuario';
import { useState } from 'react';

export interface FormRecuperarSenhaProps {
    token: string;
}

export function FormRecuperarSenha({ token }: FormRecuperarSenhaProps) {

    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [loading, setLoading] = useState(false);
    const [msgUpdatePassword, setMsgUpdatePassword] = useState<{ success: boolean } | null>(null);

    const onSubmitResetPassword = async ({ password }: any) => {

        setLoading(true);
        setMsgUpdatePassword(null);
        const { success } = await UserServices.updatePassword(token, password);
        if (success)
            setMsgUpdatePassword({ success: true });
        else
            setMsgUpdatePassword({ success: false });
        setLoading(false);
    }

    return (
        <Formik
            initialValues={{ password: '' }}
            validationSchema={Yup.object({
                password: Yup.string().required('Campo obrigatório').min(6, 'Campo precisa ter pelo menos 6 caracteres')
            })}
            onSubmit={onSubmitResetPassword}
        >
            {({ handleChange, handleSubmit, isValid, errors }) => (
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <h2 className="ff-default text-center">Atualizar senha de {email}</h2>
                        <AppInput placeholder="Digite a senha" label="Nova senha" name="password" type="password" onChange={handleChange} icon="locked" openPassword error={errors.password} />

                        {loading && <AppLoader className='self-center' />}
                        {msgUpdatePassword && msgUpdatePassword.success && <p className="ff-default text-[20px] text-center mt-3 text-green-500">Senha atualizada com sucesso</p>}
                        {msgUpdatePassword && !msgUpdatePassword.success && <p className="ff-default text-[20px] text-center mt-3 text-red-500">Conta inválida ou token expirado</p>}


                        <AppButton title="Confirmar" onClick={handleSubmit} disabled={loading || !isValid} form="round" />

                    </div>
                </form>
            )}
        </Formik>
    );
}