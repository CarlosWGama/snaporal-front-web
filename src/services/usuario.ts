import Cookies from 'js-cookie';
import api from './api';

/**
 * SERVICES DE GERENCIAMENTO DE USUÁRIOS
 */
const UsuarioServices = {

    /**
     * Autenticação de usuário
     */
    login: async (email: string, password: string): Promise<{ success: boolean, message?: string }> => {

        try {
            const response = await api.post('/usuarios/login', { email, password });
            const { token, usuario } = response.data;
            if (!usuario.admin) {
                await UsuarioServices.logout();
                return { success: false, message: 'Usuário não autorizado' };
            }
            Cookies.set('token', token);
            Cookies.set('usuario', JSON.stringify(usuario));
            return { success: true }
        } catch (erro: any) {
            console.log(erro);
            return { success: false, message: 'Login incorreto' };
        }
    },

    /**
     * Retorna o usuário autenticado
     * @returns 
     */
    getCurrentUser: () => {
        const usuario = Cookies.get('usuario');
        return usuario ? JSON.parse(usuario) : null;
    },

    /**
     * Solicita ao servidor uma nova senha  
     */
    resetPassword: async (email: string): Promise<{ success: boolean }> => {
        try {
            await api.post('/usuarios/reset-password', { email });
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Atualiza a senha do usuário
     * @returns 
     */
    updatePassword: async (token: string, password: string): Promise<{ success: boolean }> => {
        try {
            await api.put(`/usuarios/recuperar-senha/${token}`, { password });
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Remove todos os vinculos do usuário com o back-end
     */
    logout: async (): Promise<{ success: boolean }> => {
        //Simula um atrasado de 1seg
        try {
            await api.get('/usuarios/logout');
            Cookies.remove('usuario');
            return { success: true };
        } catch (erro) {
            return { success: false };
        }
    },

    /**
     * Retorna todos os usuários do sistema
     * @returns 
     */
    getAll: async (): Promise<{ success: boolean, usuarios?: any[] }> => {
        try {
            const response = await api.get('/usuarios');
            return { success: true, usuarios: response.data };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Retorna dados de um unico usuário
     * @returns 
     */
    getById: async (id: number): Promise<{ success: boolean, usuario: any }> => {
        try {
            const response = await api.get(`/usuarios/${id}`);
            return { success: true, usuario: response.data };
        } catch (erro) {
            return { success: false, usuario: null };
        }
    },

    /**
     * Cria um usuário
     * @param usuario 
     * @returns 
     */
    create: async (usuario: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.post(`/usuarios`, usuario);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Atualiza um usuário
     * @param usuario 
     * @returns 
     */
    update: async (usuario: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.put(`/usuarios/${usuario.id}`, usuario);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Remove um usuário
     * @param usuario 
     * @returns 
     */
    delete: async (id: number): Promise<{ success: boolean }> => {
        try {
            await api.delete(`/usuarios/${id}`);
            return { success: true };
        } catch (erro: any) {
            return { success: false };
        }
    }


}

export default UsuarioServices;