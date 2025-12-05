export function getStatusConsultation(status: string) {
    switch (status) {
        case 'pending':
            return 'Pendente';
        case 'confirmed':
            return 'Confirmada';
        case 'cancelled':
            return 'Cancelada';
        case 'closed':
            return 'Encerrada';
        default:
            return 'Status inválido';
    }
}