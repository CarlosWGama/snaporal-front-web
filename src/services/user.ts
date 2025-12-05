import Cookies from 'js-cookie';
import api from './api';

/**
 * SERVICES DE GERENCIAMENTO DE USUÁRIOS
 */
const UserServices = {

    /**
     * Autenticação de usuário
     */
    login: async (email: string, password: string): Promise<{ success: boolean, message?: string }> => {

        try {
            const response = await api.post('/users/login', { email, password });
            const { token, user } = response.data;
            if (!user.admin) {
                await UserServices.logout();
                return { success: false, message: 'Usuário não autorizado' };
            }
            Cookies.set('token', token);
            Cookies.set('user', JSON.stringify(user));
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
        const user = Cookies.get('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Solicita ao servidor uma nova senha  
     */
    resetPassword: async (email: string): Promise<{ success: boolean }> => {
        try {
            await api.post('/users/recover-password', { email });
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
            await api.put(`/users/recover-password/${token}`, { password });
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
            await api.get('/users/logout');
            Cookies.remove('user');
            return { success: true };
        } catch (erro) {
            return { success: false };
        }
    },

    /**
     * Retorna todos os usuários do sistema
     * @returns 
     */
    getAll: async (page: number = 1, filter: any = {}): Promise<{ success: boolean, users?: any[], extra?: any }> => {
        try {
            const params = new URLSearchParams(filter);
            console.log(`/users?page=${page}&${params.toString()}`);
            const response = await api.get(`/users?page=${page}&${params.toString()}`);
            console.log(response);
            return { success: true, users: response.data.items, extra: response.data };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Retorna dados de um unico usuário
     * @returns 
     */
    getById: async (id: number): Promise<{ success: boolean, user: any }> => {
        try {
            const response = await api.get(`/users/${id}`);
            console.log(response);
            return { success: true, user: response.data };
        } catch (erro) {
            return { success: false, user: null };
        }
    },

    /**
     * Cria um usuário
     * @param user 
     * @returns 
     */
    create: async (user: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.post(`/users`, user);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Atualiza um usuário
     * @param user 
     * @returns 
     */
    update: async (user: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.put(`/users/${user.id}`, user);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Remove um usuário
     * @param user 
     * @returns 
     */
    delete: async (id: number): Promise<{ success: boolean }> => {
        try {
            await api.delete(`/users/${id}`);
            return { success: true };
        } catch (erro: any) {
            return { success: false };
        }
    }


}

export default UserServices;