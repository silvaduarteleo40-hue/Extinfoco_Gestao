import { format, parseISO, isValid } from 'date-fns'

export function formatDate(value) {
    if (!value) return '-'
    try {
        const parsed = parseISO(value)
        if (!isValid(parsed)) return value
        return format(parsed, 'dd/MM/yyyy')
    } catch {
        return value
    }
}

export function formatDateTime(value) {
    if (!value) return '-'
    try {
        const parsed = parseISO(value)
        if (!isValid(parsed)) return value
        return format(parsed, 'dd/MM/yyyy HH:mm')
    } catch {
        return value
    }
}

export function getBadgeClass(status = '') {
    const normalized = String(status).toLowerCase()

    if (
        normalized.includes('ok') ||
        normalized.includes('válido') ||
        normalized.includes('ativo') ||
        normalized.includes('concluída')
    ) {
        return 'badge badge-green'
    }
    
    if (
        normalized.includes('30 dias') ||
        normalized.includes('vence') ||
        normalized.includes('agendado') ||
        normalized.includes('andamento')
    ) {
        return 'badge badge-yellow'
    }

    if (
        normalized.includes('vencido') ||
        normalized.includes('cancelado') ||
        normalized.includes('expirado') ||
        normalized.includes('inativo')
    ) {
        return 'badge badge-red'
    }
    
    return 'badge badge-gray'
}