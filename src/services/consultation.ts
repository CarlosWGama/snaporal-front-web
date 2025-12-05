import api from './api';

/**
 * SERVICES DE GERENCIAMENTO DE USUÁRIOS
 */
const ConsultationServices = {

    /**
     * Retorna todos os usuários do sistema
     * @returns 
     */
    getAll: async (page: number = 1, filter: any = {}): Promise<{ success: boolean, consultations?: any[], extra?: any }> => {
        try {
            const params = new URLSearchParams(filter);
            params.set('page', page.toString());
            console.log(`/consultation?${params.toString()}`);
            const response = await api.get(`/consultation?${params.toString()}`);
            console.log(response);
            return { success: true, consultations: response.data.items, extra: response.data };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Retorna dados de um unico usuário
     * @returns 
     */
    getById: async (id: number): Promise<{ success: boolean, consultation: any }> => {
        try {
            const response = await api.get(`/consultation/${id}`);
            console.log(response);
            return { success: true, consultation: response.data };
        } catch (erro) {
            return { success: false, consultation: null };
        }
    },

    /**
     * Remove uma consulta
     * @param id 
     * @returns 
     */
    delete: async (id: number): Promise<{ success: boolean }> => {
        try {
            const response = await api.delete(`/consultation/${id}`);
            console.log(response);
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },
}

export default ConsultationServices;